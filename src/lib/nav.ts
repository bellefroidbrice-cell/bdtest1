export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Accueil", href: "/" },
  { label: "Véhicules", href: "/vehicules" },
  { label: "Services", href: "/services" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];

export const CONTACT = {
  phone: "+32 475 25 98 28",
  phoneHref: "tel:+32475259828",
  email: "didier.bdautomobiles@gmail.com",
  address: "Chaussée de Louvain 76, 5310 Eghezée",
};

export const OPENING_HOURS = [
  { label: "Lundi - Vendredi", hours: "9h30 - 18h00" },
  { label: "Samedi", hours: "9h30 - 13h00" },
  { label: "Dimanche", hours: "Fermé" },
];
