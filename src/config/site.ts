export const site = {
  name: "Sanlam",
  descriptor: "Votre agence à Casablanca",
  director: "Karim El Amrani",
  address: "145, boulevard Zerktouni, Casablanca",
  phone: "+212 5 22 47 18 30",
  phoneHref: "+212522471830",
  whatsapp: "+212 6 61 47 18 30",
  whatsappDigits: "212661471830",
  email: "contact@sanlam-casablanca.ma",
  hours: "Lun–Ven 9h–18h, Sam 9h–13h",
  partner: "Site réalisé par IZEMX",
};

export const whatsappLink = (message = "Bonjour, je souhaite échanger au sujet d'une assurance.") =>
  `https://wa.me/${site.whatsappDigits}?text=${encodeURIComponent(message)}`;