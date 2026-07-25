import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/forms/contact-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CONTACT, OPENING_HOURS } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez BD Automobile à Eghezée : formulaire de contact, adresse, téléphone, horaires et itinéraire.",
};

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col py-16">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium uppercase tracking-widest text-accent">
            Contact
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Une question ? Parlons-en.
          </h1>
          <p className="max-w-xl text-base text-anthracite-light/80">
            Remplissez le formulaire ci-dessous ou contactez-nous directement
            par téléphone — nous répondons rapidement à toute demande.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <Card className="p-6 sm:p-8 lg:col-span-3">
            <ContactForm />
          </Card>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <Card className="flex flex-col gap-4 p-6">
              <a
                href={CONTACT.phoneHref}
                className="flex items-center gap-3 text-sm text-ink transition-colors hover:text-accent"
              >
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                {CONTACT.phone}
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-3 text-sm text-ink transition-colors hover:text-accent"
              >
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                {CONTACT.email}
              </a>
              <span className="flex items-start gap-3 text-sm text-ink">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {CONTACT.address}
              </span>

              <div className="flex flex-col gap-2 border-t border-line pt-4">
                {OPENING_HOURS.map((slot) => (
                  <div key={slot.label} className="flex items-start gap-3 text-sm">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span className="text-ink">
                      {slot.label}
                      <span className="ml-2 text-anthracite-light/70">{slot.hours}</span>
                    </span>
                  </div>
                ))}
              </div>

              <Button
                href={CONTACT.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="dark"
                className="mt-2"
              >
                <Navigation className="h-4 w-4" />
                Itinéraire
              </Button>
            </Card>

            <Card className="overflow-hidden p-0">
              <iframe
                title="Localisation de BD Automobile"
                src={CONTACT.mapEmbedUrl}
                width="100%"
                height="280"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Card>
          </div>
        </div>
      </Container>
    </main>
  );
}
