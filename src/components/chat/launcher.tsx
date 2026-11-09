import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MessageSquareText, X } from "lucide-react";
import { chatbot } from "@/data/chatbot";
import { onChatRequest, type ChatRequest } from "@/components/chat/store";

const ChatPanel = lazy(() => import("@/components/chat/panel"));

const TIP_KEY = "cherradi-chat-tip-dismissed";
const readTip = () => { try { return window.sessionStorage.getItem(TIP_KEY) === "1"; } catch { return false; } };
const writeTip = () => { try { window.sessionStorage.setItem(TIP_KEY, "1"); } catch { /* storage unavailable */ } };

export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [request, setRequest] = useState<ChatRequest | null>(null);
  const [tip, setTip] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => onChatRequest((req) => { setRequest(req); setLoaded(true); setOpen(true); setTip(false); writeTip(); }), []);

  useEffect(() => {
    if (readTip()) return;
    const timer = setTimeout(() => setTip(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  const dismissTip = () => { setTip(false); writeTip(); };
  const toggle = () => { setLoaded(true); setOpen((v) => !v); dismissTip(); };
  const close = () => { setOpen(false); requestAnimationFrame(() => buttonRef.current?.focus()); };

  return (
    <>
      <div className="relative">
        {tip && !open && (
          <div role="status" className="rise-in absolute bottom-3 right-[4.5rem] flex w-max max-w-[15rem] items-center gap-2 rounded-2xl rounded-br-md bg-white py-2.5 pl-4 pr-2 text-sm font-medium text-brand-navy shadow-[0_18px_40px_-18px_rgba(11,42,69,0.5)]">
            <button type="button" onClick={toggle} className="text-left">{chatbot.tooltip}</button>
            <button type="button" onClick={dismissTip} aria-label="Masquer le message" className="grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-brand-ice"><X className="size-3.5" /></button>
          </div>
        )}
        <button
          ref={buttonRef}
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls="chat-panel"
          aria-label={open ? `Fermer ${chatbot.name}` : `Ouvrir ${chatbot.name}`}
          data-analytics="chatbot_open"
          className="relative grid size-[60px] place-items-center rounded-full bg-primary text-white shadow-[0_16px_34px_-12px_rgba(10,117,187,0.75)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
        >
          <span aria-hidden="true" className="ring-pulse absolute inset-0 rounded-full border-2 border-brand-sky" />
          <span aria-hidden="true" className="absolute inset-[5px] rounded-full border border-white/25" />
          {open ? <X className="size-6" aria-hidden="true" /> : <MessageSquareText className="size-6" aria-hidden="true" />}
        </button>
      </div>
      {loaded && createPortal(
        <Suspense fallback={null}>
          <ChatPanel open={open} onClose={close} request={request} />
        </Suspense>,
        document.body,
      )}
    </>
  );
}
