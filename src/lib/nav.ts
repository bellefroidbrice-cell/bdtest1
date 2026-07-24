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

// Numéro et adresse provisoires, à remplacer par les coordonnées réelles du garage.
export const CONTACT = {
  phone: "+32 81 00 00 00",
  phoneHref: "tel:+3281000000",
  email: "info@bdautomobile.be",
  address: "Chaussée de Namur, 5310 Eghezée",
};
