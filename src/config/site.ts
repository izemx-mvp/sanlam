/**
 * Agency identity. Every page, form, JSON-LD block and the chatbot read from here,
 * so the agency (or the insurer it represents) can be changed in one place.
 */
export const INSURER_NAME = "Sanlam";

export const site = {
  name: "Assurances Cherradi",
  insurer: INSURER_NAME,
  descriptor: `Agent général ${INSURER_NAME} · Tanger`,
  city: "Tanger",
  director: "Karim Cherradi",
  directorRole: "Directeur d'agence",
  street: "Avenue Moulay Rachid",
  postalCode: "90060",
  address: "Avenue Moulay Rachid, 90060 Tanger",
  phone: "06 00 37 03 00",
  phoneHref: "+212600370300",
  whatsapp: "06 00 37 03 00",
  whatsappDigits: "212600370300",
  email: "contact@assurances-cherradi.ma",
  hours: "Lun–Sam 9h00–20h00 (jeudi dès 8h00), dimanche fermé",
  hoursShort: "Lun–Sam 9h–20h · Dimanche fermé",
  hoursTable: [
    { day: "Lundi", hours: "9h00 – 20h00" },
    { day: "Mardi", hours: "9h00 – 20h00" },
    { day: "Mercredi", hours: "9h00 – 20h00" },
    { day: "Jeudi", hours: "8h00 – 20h00" },
    { day: "Vendredi", hours: "9h00 – 20h00" },
    { day: "Samedi", hours: "9h00 – 20h00" },
    { day: "Dimanche", hours: "Fermé" },
  ],
  /** schema.org openingHours strings */
  openingHours: ["Mo-We 09:00-20:00", "Th 08:00-20:00", "Fr-Sa 09:00-20:00"],
  rating: { value: 4.5, count: 17, label: "4,5/5 · 17 avis Google" },
  foundedYear: 2008,
  domain: "https://assurances-cherradi.ma",
  partner: "Site réalisé par IZEMX",
  mapsQuery: "Assurances Cherradi, Av. Moulay Rachid, Tanger",
};

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapsQuery)}`;
export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&output=embed`;
export const telLink = `tel:${site.phoneHref}`;
export const mailLink = `mailto:${site.email}`;

export const whatsappLink = (message = `Bonjour ${site.name}, je souhaite échanger au sujet d'une assurance.`) =>
  `https://wa.me/${site.whatsappDigits}?text=${encodeURIComponent(message)}`;

/** Random reference such as DV-2026-4K7Q2M */
export const makeReference = (prefix: "DV" | "SIN" | "CT") => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i += 1) suffix += chars[Math.floor(Math.random() * chars.length)] ?? "X";
  return `${prefix}-2026-${suffix}`;
};

/** Moroccan mobile or landline: 06/07/05 + 8 digits, optionally +212 / 00212 */
export const moroccanPhone = /^(?:(?:\+|00)212|0)[5-7]\d{8}$/;
export const normalizePhone = (value: string) => value.replace(/[\s.\-()]/g, "");
export const isMoroccanPhone = (value: string) => moroccanPhone.test(normalizePhone(value));
