import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, FileText, Phone, ShieldAlert } from "lucide-react";
import { SiteShell, PageIntro, Breadcrumb, FormField, StepsBar, SuccessPanel } from "@/components/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const claimSchema = z.object({ fullName: z.string().trim().min(2, "Indiquez votre nom."), phone: z.string().trim().min(8, "Indiquez un numéro de téléphone valide."), policy: z.string().trim().min(3, "Indiquez votre numéro de contrat."), incidentDate: z.string().min(1, "Indiquez la date du sinistre."), details: z.string().trim().min(10, "Décrivez le sinistre en quelques mots.") });
type ClaimValues = z.infer<typeof claimSchema>;

export const Route = createFileRoute("/sinistres")({
  head: () => ({ meta: [
    { title: "Sinistre : préparer votre déclaration | Sanlam Casablanca" },
    { name: "description", content: "Retrouvez les premiers repères et préparez les informations utiles pour échanger avec l'agence Sanlam à Casablanca." },
    { property: "og:title", content: "Préparer une déclaration de sinistre | Sanlam Casablanca" },
    { property: "og:description", content: "Votre agent vous accompagne pour comprendre les étapes après un sinistre." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ClaimsPage,
});

function ClaimsPage() {
  const [step, setStep] = useState(0);
  const [reference, setReference] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm<ClaimValues>({ resolver: zodResolver(claimSchema), mode: "onTouched" });
  function submit(values: ClaimValues) {
    const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
    setReference(`SIN-${new Date().getFullYear()}-${suffix}`);
    void values;
  }
  return <SiteShell><PageIntro eyebrow="Après un imprévu" title="Nous sommes à vos côtés." description="Retrouvez les premiers repères et préparez les informations à partager avec votre agent." /><section className="mx-auto max-w-7xl px-6 py-10 sm:py-14 lg:px-8"><Breadcrumb current="Sinistres" />{reference ? <SuccessPanel title="Votre déclaration est préparée." description="Votre récapitulatif reste dans votre navigateur. Contactez l'agence pour échanger sur les prochaines étapes." reference={reference} whatsappMessage="Bonjour, je souhaite être accompagné(e) à la suite d'un sinistre." /> : <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]"><div><div className="flex items-center gap-3"><span className="grid size-12 place-items-center bg-brand-ice text-primary"><ShieldAlert className="size-6" /></span><h2 className="display-font text-2xl font-semibold">Les premiers réflexes</h2></div><ol className="mt-7 space-y-6"><li className="flex gap-4"><span className="grid size-8 shrink-0 place-items-center border border-primary text-sm font-semibold text-primary">1</span><div><h3 className="font-semibold">Mettez-vous en sécurité</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">En cas d'urgence, contactez les services compétents avant toute démarche d'assurance.</p></div></li><li className="flex gap-4"><span className="grid size-8 shrink-0 place-items-center border border-primary text-sm font-semibold text-primary">2</span><div><h3 className="font-semibold">Conservez les éléments utiles</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">Notez la date et les circonstances, et gardez les documents ou photos qui peuvent aider votre conseiller.</p></div></li><li className="flex gap-4"><span className="grid size-8 shrink-0 place-items-center border border-primary text-sm font-semibold text-primary">3</span><div><h3 className="font-semibold">Échangez avec votre agent</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">Les délais et démarches dépendent du contrat et de la nature du sinistre. Votre agent vous oriente.</p></div></li></ol><div className="mt-8 flex flex-wrap gap-3"><Button variant="outline" asChild className="rounded-full"><a href="tel:+212522471830"><Phone className="size-4" />Appeler l'agence</a></Button><Button variant="outline" asChild className="rounded-full"><a href="mailto:contact@sanlam-casablanca.ma"><FileText className="size-4" />Écrire à l'agence</a></Button></div></div><div className="border border-border bg-background p-6 sm:p-8"><StepsBar active={step} labels={["Le sinistre", "Vos coordonnées", "Confirmation"]} /><form noValidate onSubmit={handleSubmit(submit)}><h2 className="display-font text-2xl font-semibold">Préparer ma déclaration</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Ces informations restent dans votre navigateur. Le formulaire ne transmet rien.</p><div className="mt-7 grid gap-5 sm:grid-cols-2"><FormField label="Nom complet" error={errors.fullName?.message}><Input autoComplete="name" {...register("fullName")} /></FormField><FormField label="Téléphone" error={errors.phone?.message}><Input type="tel" autoComplete="tel" {...register("phone")} /></FormField><FormField label="Numéro de contrat" error={errors.policy?.message}><Input {...register("policy")} /></FormField><FormField label="Date du sinistre" error={errors.incidentDate?.message}><Input type="date" {...register("incidentDate")} /></FormField><div className="sm:col-span-2"><FormField label="Décrivez brièvement les circonstances" error={errors.details?.message}><Textarea rows={4} {...register("details")} /></FormField></div></div><div className="mt-7 flex flex-wrap justify-between gap-3">{step === 0 ? <Button type="button" className="rounded-full" onClick={() => setStep(1)}>Continuer <ArrowRight className="size-4" /></Button> : <><Button type="button" variant="outline" className="rounded-full" onClick={() => setStep(0)}><ArrowLeft className="size-4" />Retour</Button><Button type="submit" className="rounded-full">Préparer la confirmation <ArrowRight className="size-4" /></Button></>}</div></form></div></div>}<p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-5 text-muted-foreground">Ce formulaire ne constitue pas une déclaration officielle et n'est pas transmis. Les délais applicables dépendent des garanties et des règles de votre contrat.</p></section></SiteShell>;
}