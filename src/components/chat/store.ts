/** Tiny event bus so any page can open the chatbot with a context (kept out of the lazy chat bundle). */
export type ChatRequest = { offer?: string; nonce: number };
type Listener = (request: ChatRequest) => void;

const listeners = new Set<Listener>();

export function openChat(request: { offer?: string } = {}) {
  const payload: ChatRequest = { nonce: Date.now() };
  if (request.offer) payload.offer = request.offer;
  listeners.forEach((listener) => listener(payload));
}

export function onChatRequest(listener: Listener) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
