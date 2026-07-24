import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import type { SVGProps } from "react";

import { CONTACT, NAV_LINKS } from "@/lib/nav";

import { Container } from "./container";

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-7.6h2.55l.38-2.96h-2.93V8.55c0-.86.24-1.44 1.47-1.44h1.57V4.46c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9v2.18H7.98v2.96h2.48V21z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17.1" cy="6.9" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

const LEGAL_LINKS = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/confidentialite" },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
];

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <Container className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <span className="text-lg font-bold tracking-tight">
            BD <span className="text-accent">Automobile</span>
          </span>
          <p className="max-w-xs text-sm leading-relaxed text-white/60">
            Garage automobile indépendant à Eghezée. Vente de véhicules
            d&apos;occasion et récents, reprise et accompagnement personnalisé.
          </p>
          <div className="flex gap-3 pt-2">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
            Navigation
          </h3>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
            Contact
          </h3>
          <a
            href={CONTACT.phoneHref}
            className="flex items-center gap-2 text-sm text-white/70 transition-colors duration-200 hover:text-white"
          >
            <Phone className="h-4 w-4 shrink-0 text-accent" />
            {CONTACT.phone}
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-2 text-sm text-white/70 transition-colors duration-200 hover:text-white"
          >
            <Mail className="h-4 w-4 shrink-0 text-accent" />
            {CONTACT.email}
          </a>
          <span className="flex items-start gap-2 text-sm text-white/70">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            {CONTACT.address}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
            Informations
          </h3>
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/50 sm:flex-row">
          <span>
            © {new Date().getFullYear()} BD Automobile. Tous droits réservés.
          </span>
          <span>Eghezée, Belgique</span>
        </Container>
      </div>
    </footer>
  );
}
