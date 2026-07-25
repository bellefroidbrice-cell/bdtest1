"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { CONTACT, NAV_LINKS } from "@/lib/nav";
import { cn } from "@/lib/utils";

import { Container } from "./container";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-ink/90 backdrop-blur transition-shadow duration-300",
        scrolled ? "border-white/10 shadow-lg shadow-black/20" : "border-transparent",
      )}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-white"
          onClick={() => setOpen(false)}
        >
          BD <span className="text-accent">Automobile</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-sm font-medium text-white/70 transition-colors duration-200 hover:text-white"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 ease-out group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            href={CONTACT.phoneHref}
            variant="ghost"
            size="icon"
            aria-label="Appeler BD Automobile"
            className="text-white/80 hover:bg-white/10 hover:text-white"
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button href="/contact" variant="primary">
            Nous contacter
          </Button>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-white/10 bg-ink lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-white hover:bg-white/5"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-3 flex flex-col gap-3 border-t border-white/10 pt-4">
                <Button
                  href={CONTACT.phoneHref}
                  variant="outline"
                  className="border-white/15 text-white hover:border-white/30 hover:bg-white/5"
                >
                  <Phone className="h-4 w-4" /> Appeler
                </Button>
                <Button href="/contact" variant="primary" onClick={() => setOpen(false)}>
                  Nous contacter
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
