import { z } from "zod";

export const CONTACT_REQUEST_TYPES = [
  { value: "INFO", label: "Demande d'information" },
  { value: "APPOINTMENT", label: "Prendre rendez-vous" },
  { value: "TRADE_IN_ESTIMATE", label: "Estimation de reprise" },
] as const;

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Merci d'indiquer votre nom."),
  email: z.string().trim().email("Adresse email invalide."),
  phone: z.string().trim().optional().or(z.literal("")),
  type: z.enum(["INFO", "APPOINTMENT", "TRADE_IN_ESTIMATE"]),
  message: z
    .string()
    .trim()
    .min(10, "Votre message doit contenir au moins 10 caractères."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
