import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, ArrowUpRight, Clock3, Mail, MessageCircle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { pageHead } from "@/lib/seo";
import { isMoroccanPhone, mailLink, makeReference, mapsUrl, site, telLink, whatsappLink } from "@/config/site";
import { images } from "@/data/images";
import { CTABand, ConsentCheckbox, FloatInput, FloatSelect, FloatTextarea, MapEmbed, PageHero, SuccessScreen } from "@/components/brand/blocks";
import { ArrowSlide, Container, Eyebrow, IconTile, ImageWithFallback, PhotoReveal, Reveal, Stagger, StaggerItem, pill } from "@/components/brand/primitives";

export const Route = createFileRoute("/contact")({
  head: () => pageHead({
    title: `Contact | ${site.name}, assurance à Tanger`,
    description: `Contactez ${site.name} : téléphone et WhatsApp ${site.phone}, e-mail ${site.email}, ${site.address}. Ouvert ${site.hoursShort.toLowerCase()}.`,
    path: "/contact",
    image: images.contact.agencyFront,
    breadcrumbs: [{ name: "Contact", path: "/contact" }],
  }),
  component: ContactPage,
});

const SUBJECTS = ["Demande de devis", "Question sur un contrat", "Sinistre en cours", "Attestation", "Autre demande"];

const schema = z.object({
  name: z.string().trim().min(2, "Indiquez votre nom."),
  phone: z.string().trim().refine(isMoroccanPhone, "Indiquez un numéro marocain valide, au format 06 12 34 56 78."),
  email: z.string().trim().email("Indiquez une adresse e-mail valide."),
  subject: z.string().min(1, "Choisissez un sujet."),
  message: z.string().trim().min(10, "Votre message doit faire au moins 10 caractères.").max(1200, "1 200 caractères maximum."),
  consent: z.boolean().refine((v) => v, "Votre accord est nécessaire pour traiter la demande."),
});
type Values = z.infer<typeof schema>;

function ContactPage() {
  const [result, setResult] = useState<{ reference: string; values: Values } | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { name: "", phone: "", email: "", subject: "", message: "", consent: false },
  });
  const cards = [
    { icon: Phone, title: "Téléphone", value: site.phone, text: "Lun–Sam 9h–20h", href: telLink },
    { icon: MessageCircle, title: "WhatsApp", value: site.whatsapp, text: "Réponse rapide aux heures d'ouverture", href: whatsappLink() },
    { icon: Mail, title: "E-mail", value: site.email, text: "Réponse sous 24 h ouvrées", href: mailLink },
  ];
  return (
    <>
      <PageHero
        variant="compact"
        breadcrumbs={[{ name: "Contact", path: "/contact" }]}
        eyebrow="Contact"
        title={<>Parlons-en, tout <span className="text-primary">simplement.</span></>}
        description="Par téléphone, sur WhatsApp, par e-mail ou directement à l'agence : choisissez ce qui vous convient."
      />
      <section className="bg-white pt-16 sm:pt-20">
        <Container>
          <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {cards.map((card) => (
              <StaggerItem key={card.title}>
                <a href={card.href} {...(card.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group card-surface card-hover flex h-full items-start gap-5 p-7 text-brand-navy no-underline">
                  <IconTile icon={card.icon} />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">{card.title}</span>
                    <span className="display-font mt-1 block break-words text-lg font-semibold group-hover:text-primary">{card.value}</span>
                    <span className="mt-1 block text-sm text-ink">{card.text}</span>
                  </span>
                  <ArrowUpRight className="ml-auto size-5 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
      <section className="bg-white py-16 sm:py-24">
        <Container className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
          <Reveal className="card-surface p-6 sm:p-10">
            {result ? (
              <SuccessScreen
                title="Message prêt à être envoyé"
                description={`Merci ${result.values.name.split(" ")[0]}. Un conseiller vous répond sous 24 h ouvrées.`}
                reference={result.reference}
                summary={[{ label: "Sujet", value: result.values.subject }, { label: "Nom", value: result.values.name }, { label: "Téléphone", value: result.values.phone }]}
                whatsappMessage={`Bonjour ${site.name}, ${result.values.subject.toLowerCase()} :\n${result.values.message}\n— ${result.values.name}, ${result.values.phone}`}
                confetti={false}
              />
            ) : (
              <form noValidate onSubmit={handleSubmit((values) => setResult({ reference: makeReference("CT"), values }))}>
                <Eyebrow>Écrivez-nous</Eyebrow>
                <h2 className="display-font text-3xl font-semibold text-brand-navy">Envoyer un message</h2>
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FloatInput id="ct-name" label="Nom complet" autoComplete="name" error={errors.name?.message} {...register("name")} />
                  <FloatInput id="ct-phone" label="Téléphone" type="tel" inputMode="tel" autoComplete="tel" error={errors.phone?.message} {...register("phone")} />
                  <FloatInput id="ct-email" label="Adresse e-mail" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
                  <FloatSelect id="ct-subject" label="Sujet" options={SUBJECTS} error={errors.subject?.message} {...register("subject")} />
                  <FloatTextarea id="ct-message" label="Votre message" className="sm:col-span-2" error={errors.message?.message} {...register("message")} />
                  <div className="sm:col-span-2"><ConsentCheckbox id="ct-consent" error={errors.consent?.message} {...register("consent")} /></div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button type="submit" disabled={isSubmitting} className={pill()}>Envoyer <ArrowSlide icon={ArrowRight} /></button>
                </div>
              </form>
            )}
          </Reveal>
          <div className="space-y-6">
            <PhotoReveal className="overflow-hidden radius-organic">
              <ImageWithFallback image={images.contact.agencyFront} className="aspect-[4/5] max-h-[32rem] w-full" sizes="(min-width: 1024px) 40vw, 100vw" />
            </PhotoReveal>
            <Reveal className="card-surface p-7">
              <h2 className="display-font flex items-center gap-2 text-xl font-semibold text-brand-navy"><Clock3 className="size-5 text-primary" aria-hidden="true" />Horaires d'ouverture</h2>
              <table className="mt-5 w-full text-[0.97rem]">
                <tbody>
                  {site.hoursTable.map((row) => (
                    <tr key={row.day} className="border-b border-brand-navy/6 last:border-0">
                      <th scope="row" className="py-2.5 text-left font-medium text-ink">{row.day}</th>
                      <td className={cn("py-2.5 text-right font-semibold", row.hours === "Fermé" ? "text-muted-foreground" : "text-brand-navy")}>{row.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </div>
        </Container>
      </section>
      <section className="bg-white pb-4">
        <Container>
          <Reveal className="relative">
            <MapEmbed className="h-[26rem]" />
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={cn(pill({ size: "sm" }), "absolute bottom-5 left-5")}>Itinéraire <ArrowSlide icon={ArrowUpRight} /></a>
          </Reveal>
        </Container>
      </section>
      <CTABand />
    </>
  );
}
