import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteShell, PageIntro, Breadcrumb, FormField, formSelectClass, StepsBar, SuccessPanel } from "@/components/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { quoteFieldsByOffer } from "@/data/quoteForms";
import { findOffer, offers } from "@/data/offers";

const contactSchema = z.object({ fullName: z.string().trim().min(2, "Indiquez votre nom."), phone: z.string().trim().min(8, "Indiquez un numéro de téléphone valide."), email: z.string().trim().email("Indiquez une adresse e-mail valide.") });
type ContactValues = z.infer<typeof contactSchema>;

export const Route = createFileRoute("/devis")({
  validateSearch: (search: Record<string, unknown>) => typeof search.produit === "string" ? { produit: search.produit } : {},
  head: () => ({ meta: [
    { title: "Demander un devis d'assurance | Sanlam Casablanca" },
    { name: "description", content: "Préparez une demande de devis d'assurance avec votre agence Sanlam à Casablanca." },
    { property: "og:title", content: "Demander un devis d'assurance | Sanlam Casablanca" },
    { property: "og:description", content: "Quelques informations pour préparer votre échange avec l'agence Sanlam de Casablanca." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: QuotePage,
});

function QuotePage() {
  const { produit } = Route.useSearch();
  const [offerSlug, setOfferSlug] = useState(findOffer(produit ?? "")?.slug ?? offers[0]?.slug ?? "auto");
  const [step, setStep] = useState(0);
  const [detailValues, setDetailValues] = useState<Record<string, string>>({});
  const [detailError, setDetailError] = useState("");
  const [reference, setReference] = useState("");
  const offer = findOffer(offerSlug) ?? offers[0];
  const fields = quoteFieldsByOffer[offer.slug] ?? [];
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactValues>({ resolver: zodResolver(contactSchema), mode: "onTouched" });

  function continueToContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const missing = fields.find((field) => !detailValues[field.name]?.trim());
    if (missing) { setDetailError(`Merci de renseigner « ${missing.label} » pour continuer.`); return; }
    setDetailError("");
    setStep(1);
  }

  function submitRequest(values: ContactValues) {
    const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
    setReference(`DEV-${new Date().getFullYear()}-${suffix}`);
    void values;
  }

  return <SiteShell><PageIntro eyebrow="Votre projet" title="Préparons votre devis." description="Partagez quelques informations. Votre demande reste dans ce navigateur et n'est pas transmise à l'agence." /><section className="mx-auto max-w-3xl px-6 py-10 sm:py-14"><Breadcrumb current="Demander un devis" />{reference ? <SuccessPanel title="Votre demande est prête." description={`Votre demande de ${offer.title.toLowerCase()} est préparée. Vous pouvez poursuivre l'échange avec l'agence sur WhatsApp.`} reference={reference} whatsappMessage={`Bonjour, je souhaite échanger au sujet d'une demande de devis ${offer.title.toLowerCase()}.`} /> : <div className="border border-border bg-background p-6 sm:p-9"><StepsBar active={step} labels={["Votre besoin", "Vos coordonnées", "Confirmation"]} />{step === 0 ? <form onSubmit={continueToContact} noValidate><h2 className="display-font text-2xl font-semibold">Parlons de votre besoin</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Choisissez une assurance et renseignez les détails utiles à votre demande.</p><div className="mt-7 grid gap-5 sm:grid-cols-2"><FormField label="Assurance souhaitée"><select className={formSelectClass} value={offerSlug} onChange={(event) => { setOfferSlug(event.target.value); setDetailValues({}); setDetailError(""); }} aria-label="Assurance souhaitée">{offers.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}</select></FormField>{fields.map((field) => <FormField key={`${offer.slug}-${field.name}`} label={field.label}><>{field.type === "select" ? <select className={formSelectClass} required value={detailValues[field.name] ?? ""} onChange={(event) => setDetailValues({ ...detailValues, [field.name]: event.target.value })}><option value="">Sélectionner</option>{field.options?.map((option) => <option key={option}>{option}</option>)}</select> : <Input type={field.type} placeholder={field.placeholder} required value={detailValues[field.name] ?? ""} onChange={(event) => setDetailValues({ ...detailValues, [field.name]: event.target.value })} />}</></FormField>)}</div>{detailError && <p className="mt-4 text-sm text-destructive" role="alert">{detailError}</p>}<div className="mt-8 flex justify-end"><Button type="submit" className="rounded-full">Continuer <ArrowRight className="size-4" /></Button></div></form> : <form onSubmit={handleSubmit(submitRequest)} noValidate><h2 className="display-font text-2xl font-semibold">Comment vous joindre ?</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Vos coordonnées servent uniquement à préparer votre confirmation locale. Rien n'est envoyé ni conservé.</p><div className="mt-7 grid gap-5 sm:grid-cols-2"><FormField label="Nom complet" error={errors.fullName?.message}><Input autoComplete="name" {...register("fullName")} /></FormField><FormField label="Téléphone" error={errors.phone?.message}><Input type="tel" autoComplete="tel" {...register("phone")} /></FormField><div className="sm:col-span-2"><FormField label="Adresse e-mail" error={errors.email?.message}><Input type="email" autoComplete="email" {...register("email")} /></FormField></div></div><div className="mt-8 flex flex-wrap justify-between gap-3"><Button type="button" variant="outline" className="rounded-full" onClick={() => setStep(0)}><ArrowLeft className="size-4" />Modifier mon besoin</Button><Button type="submit" disabled={isSubmitting} className="rounded-full">Préparer ma demande <ArrowRight className="size-4" /></Button></div></form>}</div>}<p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-5 text-muted-foreground">Aucune donnée n'est transmise ou enregistrée par ce formulaire. Pour contacter l'agence, utilisez le bouton WhatsApp après confirmation ou appelez directement.</p><div className="mt-5 text-center"><Link to="/sinistres" className="text-sm font-medium text-primary">Vous souhaitez déclarer un sinistre ?</Link></div></section></SiteShell>;
}