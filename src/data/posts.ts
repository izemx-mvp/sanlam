import { images, type SiteImage } from "@/data/images";

export type PostBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "tip"; title: string; text: string };

export type PostCategory = "Auto" | "Habitation" | "Santé" | "Voyage" | "Professionnels" | "Sinistres";

export type Post = {
  slug: string;
  title: string;
  category: PostCategory;
  excerpt: string;
  cover: SiteImage;
  /** ISO date */
  date: string;
  readingTime: number;
  author: string;
  relatedOffer: string;
  content: PostBlock[];
};

export const posts: Post[] = [
  {
    slug: "choisir-formule-auto",
    title: "Tiers, intermédiaire ou tous risques : quelle formule auto choisir ?",
    category: "Auto",
    excerpt: "La bonne formule dépend de la valeur de votre voiture, de votre usage et de votre budget. Notre méthode en quatre questions pour choisir sans vous tromper.",
    cover: images.blog.choisirFormuleAuto,
    date: "2026-10-21",
    readingTime: 6,
    author: "Salma Bennani",
    relatedOffer: "auto",
    content: [
      { type: "p", text: "Au Maroc, seule la responsabilité civile est obligatoire. Elle couvre les dommages que vous causez aux autres, mais rien pour votre propre véhicule. Entre ce minimum légal et la formule tous risques, il existe toute une gamme de garanties à combiner intelligemment." },
      { type: "h2", text: "1. Quelle est la valeur réelle de votre voiture ?" },
      { type: "p", text: "C'est le premier critère. Une voiture neuve ou récente, surtout si elle est financée par un crédit, mérite une protection complète. À l'inverse, pour un véhicule de plus de dix ans, payer une tous risques revient souvent à assurer une valeur que l'assureur ne vous remboursera jamais." },
      { type: "list", items: ["Moins de 4 ans ou sous crédit : tous risques recommandée", "Entre 4 et 10 ans : formule intermédiaire avec vol, incendie et bris de glace", "Plus de 10 ans : responsabilité civile renforcée par l'assistance"] },
      { type: "h2", text: "2. Comment et où roulez-vous ?" },
      { type: "p", text: "Un trajet quotidien entre Boukhalef et le centre-ville n'expose pas aux mêmes risques qu'une voiture qui dort au garage et sort le week-end. Le stationnement de nuit dans la rue augmente le risque de vol et de vandalisme : la garantie vol prend alors tout son sens." },
      { type: "tip", title: "Le conseil de l'agence", text: "Si vous partez chaque été en Espagne ou en France, pensez à l'extension carte verte et à l'assistance à l'étranger. Elles se demandent avant le départ, pas à la frontière." },
      { type: "h2", text: "3. Pourriez-vous faire face à une grosse réparation ?" },
      { type: "p", text: "La garantie dommages tous accidents vous protège même lorsque vous êtes responsable ou que l'autre conducteur n'est pas identifié. Si une réparation de carrosserie importante mettrait votre budget en difficulté, cette garantie est votre filet de sécurité." },
      { type: "h2", text: "4. Avez-vous besoin de votre voiture au quotidien ?" },
      { type: "p", text: "Pour les personnes qui travaillent avec leur véhicule, l'option véhicule de remplacement évite de se retrouver immobilisé pendant les réparations. C'est souvent l'option la plus appréciée après un sinistre." },
      { type: "tip", title: "À retenir", text: "Comparez les garanties et les franchises, pas seulement le prix. Une formule moins chère avec une franchise élevée peut coûter plus cher au premier accrochage." },
    ],
  },
  {
    slug: "proprietaire-ou-locataire",
    title: "Propriétaire ou locataire : que doit couvrir votre assurance habitation ?",
    category: "Habitation",
    excerpt: "Les obligations et les besoins ne sont pas les mêmes selon que vous possédez ou louez votre logement. On fait le point, garantie par garantie.",
    cover: images.blog.proprietaireOuLocataire,
    date: "2026-10-07",
    readingTime: 5,
    author: "Karim Cherradi",
    relatedOffer: "habitation",
    content: [
      { type: "p", text: "Un dégât des eaux qui traverse le plafond, un incendie parti de la cuisine, un cambriolage : qui paie quoi ? Tout dépend de votre statut et de ce que prévoit votre contrat." },
      { type: "h2", text: "Vous êtes locataire" },
      { type: "p", text: "Le locataire est responsable des dommages qu'il cause au logement. La plupart des propriétaires exigent donc une assurance couvrant les risques locatifs : incendie, explosion et dégâts des eaux." },
      { type: "list", items: ["Risques locatifs envers le propriétaire", "Recours des voisins si un sinistre se propage", "Vos biens personnels : meubles, électroménager, vêtements", "Responsabilité civile vie privée pour toute la famille"] },
      { type: "h2", text: "Vous êtes propriétaire occupant" },
      { type: "p", text: "Vous devez protéger à la fois le bâtiment et son contenu. En copropriété, l'assurance de l'immeuble couvre les parties communes, mais pas l'intérieur de votre appartement ni vos aménagements." },
      { type: "tip", title: "Le bon réflexe", text: "Photographiez chaque pièce et conservez les factures de vos achats importants dans un dossier en ligne. En cas de sinistre, vous gagnerez un temps précieux pour l'indemnisation." },
      { type: "h2", text: "Vous louez votre bien" },
      { type: "p", text: "Le propriétaire bailleur a tout intérêt à souscrire une assurance propriétaire non occupant. Elle prend le relais si le locataire n'est pas assuré ou si le logement est vide entre deux locations, et peut inclure la perte de loyers." },
      { type: "h2", text: "Les options qui font la différence" },
      { type: "list", items: ["Rééquipement à neuf, sans déduction de vétusté", "Objets de valeur et bijoux déclarés", "Assistance serrurerie et relogement", "Dommages électriques pour l'électroménager"] },
    ],
  },
  {
    slug: "apres-un-accident",
    title: "Accident de voiture : les bons réflexes dans les premières 48 heures",
    category: "Sinistres",
    excerpt: "Sécurité, constat amiable, photos, déclaration : la marche à suivre pas à pas pour être indemnisé rapidement et sans stress.",
    cover: images.blog.apresUnAccident,
    date: "2026-09-23",
    readingTime: 5,
    author: "Youssef El Idrissi",
    relatedOffer: "auto",
    content: [
      { type: "p", text: "Même un simple accrochage est un moment stressant. Les décisions prises dans les minutes qui suivent ont pourtant un impact direct sur la suite du dossier. Voici ce que nous conseillons à nos assurés." },
      { type: "h2", text: "Sur place : sécuriser et constater" },
      { type: "list", items: ["Allumez vos feux de détresse et mettez votre gilet", "En cas de blessé, appelez le 15 ou le 19 avant toute chose", "Remplissez un constat amiable avec l'autre conducteur", "Prenez des photos des véhicules, des plaques et de la scène"] },
      { type: "tip", title: "Le constat amiable", text: "Ne signez jamais un constat avec lequel vous n'êtes pas d'accord. Cochez les cases avec soin, faites un croquis clair et notez le nom de l'assureur adverse." },
      { type: "h2", text: "Dans les 5 jours : déclarer" },
      { type: "p", text: "Transmettez le constat à l'agence dans les cinq jours ouvrés. Nous vérifions qu'il est complet, vous indiquons les pièces manquantes et transmettons le dossier." },
      { type: "list", items: ["Constat amiable signé des deux parties", "Carte grise et permis de conduire", "Attestation d'assurance", "Photos des dégâts"] },
      { type: "h2", text: "Ensuite : expertise et réparation" },
      { type: "p", text: "Selon les dommages, un expert est mandaté pour évaluer les réparations. Attendez son passage avant de lancer les travaux, sauf réparation urgente pour pouvoir circuler en sécurité." },
      { type: "tip", title: "Notre engagement", text: "À l'agence, chaque dossier est suivi par un interlocuteur unique. Vous savez toujours où en est votre indemnisation." },
    ],
  },
  {
    slug: "complementaire-sante-amo",
    title: "AMO et complémentaire santé : comment bien les articuler ?",
    category: "Santé",
    excerpt: "L'Assurance Maladie Obligatoire rembourse une partie de vos soins. Ce qu'elle ne couvre pas, et comment une complémentaire comble l'écart.",
    cover: images.blog.complementaireSanteAmo,
    date: "2026-09-09",
    readingTime: 6,
    author: "Salma Bennani",
    relatedOffer: "sante",
    content: [
      { type: "p", text: "Avec la généralisation de l'AMO, une grande partie des Marocains bénéficie désormais d'une couverture de base. Mais entre les tarifs de référence et les frais réellement payés en clinique, le reste à charge peut être important." },
      { type: "h2", text: "Ce que rembourse l'AMO" },
      { type: "p", text: "L'AMO prend en charge une partie des consultations, des médicaments, des analyses et de l'hospitalisation, sur la base d'une tarification nationale de référence. L'écart avec les honoraires réellement pratiqués reste à votre charge." },
      { type: "h2", text: "Ce qu'apporte une complémentaire" },
      { type: "list", items: ["Le remboursement du ticket modérateur", "Les dépassements d'honoraires en clinique", "Des forfaits optique et dentaire plus élevés", "Des services : tiers payant, assistance, deuxième avis médical"] },
      { type: "tip", title: "Bien choisir son niveau", text: "Regardez vos dépenses de santé de l'année passée. Lunettes, soins dentaires ou suivi d'une maladie chronique orientent naturellement vers certaines garanties." },
      { type: "h2", text: "Pour les familles" },
      { type: "p", text: "Inscrire conjoint et enfants sur le même contrat simplifie les démarches. Vérifiez l'âge limite de couverture des enfants, surtout s'ils poursuivent des études." },
      { type: "h2", text: "Pour les indépendants" },
      { type: "p", text: "Commerçants, artisans et professions libérales relèvent désormais de l'AMO des travailleurs non salariés. Une complémentaire individuelle reste le meilleur moyen de retrouver un niveau de remboursement comparable à celui d'un salarié." },
    ],
  },
  {
    slug: "assurance-voyage-visa",
    title: "Visa Schengen : tout savoir sur l'assurance voyage obligatoire",
    category: "Voyage",
    excerpt: "Plafond minimum, durée, zone couverte : ce que les consulats exigent vraiment et comment obtenir votre attestation le jour même.",
    cover: images.blog.assuranceVoyageVisa,
    date: "2026-08-26",
    readingTime: 4,
    author: "Imane Tazi",
    relatedOffer: "voyage",
    content: [
      { type: "p", text: "Toute demande de visa Schengen doit être accompagnée d'une assurance voyage. Une attestation non conforme est l'une des causes les plus fréquentes de dossier incomplet." },
      { type: "h2", text: "Les exigences des consulats" },
      { type: "list", items: ["Un plafond de frais médicaux d'au moins 30 000 €", "La prise en charge du rapatriement", "Une validité sur l'ensemble de l'espace Schengen", "Des dates qui couvrent toute la durée du séjour demandé"] },
      { type: "tip", title: "Attention aux dates", text: "Les dates de l'attestation doivent correspondre exactement à celles de votre demande de visa et de votre réservation. Ajoutez un ou deux jours de marge en cas de retard de vol." },
      { type: "h2", text: "Étudiants et longs séjours" },
      { type: "p", text: "Pour un visa long séjour études, la couverture doit souvent courir jusqu'à l'affiliation à la sécurité sociale du pays d'accueil. Nous adaptons la durée à votre situation." },
      { type: "h2", text: "Obtenir votre attestation" },
      { type: "p", text: "Envoyez-nous une photo de votre passeport et vos dates par WhatsApp ou passez à l'agence. L'attestation vous est remise dans la journée, prête à joindre à votre dossier." },
      { type: "tip", title: "Vous voyagez souvent ?", text: "La formule multi-voyages annuelle couvre tous vos séjours de courte durée sur douze mois, idéale pour les visas à entrées multiples." },
    ],
  },
  {
    slug: "assurances-tpe",
    title: "TPE : les cinq assurances indispensables pour protéger votre activité",
    category: "Professionnels",
    excerpt: "Obligatoires ou fortement recommandées, voici les couvertures qui permettent à une petite entreprise de traverser un coup dur.",
    cover: images.blog.assurancesTpe,
    date: "2026-08-12",
    readingTime: 7,
    author: "Karim Cherradi",
    relatedOffer: "multirisque-pro",
    content: [
      { type: "p", text: "Un incendie, un salarié blessé, la réclamation d'un client : pour une petite entreprise, un seul sinistre non couvert peut mettre en péril des années de travail. Voici les cinq garanties que nous étudions en priorité avec chaque dirigeant." },
      { type: "h2", text: "1. L'assurance accidents du travail" },
      { type: "p", text: "Elle est obligatoire dès le premier salarié. Elle prend en charge les soins et les indemnités en cas d'accident survenu au travail ou sur le trajet." },
      { type: "h2", text: "2. La multirisque professionnelle" },
      { type: "p", text: "Elle protège vos locaux, votre matériel et votre stock contre l'incendie, le dégât des eaux ou le vol. C'est le socle de la protection d'un commerce ou d'un atelier." },
      { type: "h2", text: "3. La responsabilité civile" },
      { type: "p", text: "Elle couvre les dommages causés à vos clients ou à des tiers. Pour les métiers de conseil et du bâtiment, la RC professionnelle est souvent exigée par les donneurs d'ordre." },
      { type: "tip", title: "Souvent oubliée", text: "La perte d'exploitation compense votre marge si l'activité s'arrête après un sinistre. Sans elle, loyers et salaires continuent de tomber alors que le chiffre d'affaires s'arrête." },
      { type: "h2", text: "4. L'assurance des véhicules" },
      { type: "p", text: "Dès trois véhicules, un contrat flotte simplifie la gestion et facilite l'ajout d'un nouvel utilitaire en cours d'année." },
      { type: "h2", text: "5. La santé collective" },
      { type: "p", text: "Moins urgente qu'une garantie obligatoire, elle est pourtant un levier puissant pour recruter et fidéliser vos collaborateurs." },
      { type: "list", items: ["Faites le point une fois par an sur vos contrats", "Déclarez tout nouveau local, véhicule ou salarié", "Réévaluez votre stock avant les périodes de forte activité"] },
    ],
  },
];

export const findPost = (slug: string) => posts.find((post) => post.slug === slug);
export const postCategories = Array.from(new Set(posts.map((post) => post.category)));
export const formatPostDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
