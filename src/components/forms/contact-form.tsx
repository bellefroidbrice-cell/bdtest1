"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { submitContactRequest } from "@/app/(site)/contact/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CONTACT_REQUEST_TYPES, contactFormSchema, type ContactFormValues } from "@/lib/validations/contact";

const inputClasses =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-anthracite-light/50 focus:border-ink focus:outline-none";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { type: "INFO", phone: "" },
  });

  const onSubmit = (values: ContactFormValues) => {
    setStatus(null);
    startTransition(async () => {
      const result = await submitContactRequest(values);
      if (result.success) {
        setStatus({
          type: "success",
          message: "Votre message a bien été envoyé. Nous vous répondrons rapidement.",
        });
        reset();
      } else {
        setStatus({ type: "error", message: result.error });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-ink">
            Nom
          </label>
          <input id="name" type="text" className={inputClasses} {...register("name")} />
          {errors.name && (
            <span className="text-xs text-accent">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-ink">
            Email
          </label>
          <input id="email" type="email" className={inputClasses} {...register("email")} />
          {errors.email && (
            <span className="text-xs text-accent">{errors.email.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-ink">
            Téléphone <span className="text-anthracite-light/50">(optionnel)</span>
          </label>
          <input id="phone" type="tel" className={inputClasses} {...register("phone")} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="type" className="text-sm font-medium text-ink">
            Type de demande
          </label>
          <select id="type" className={inputClasses} {...register("type")}>
            {CONTACT_REQUEST_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-ink">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          className={cn(inputClasses, "resize-none rounded-xl")}
          {...register("message")}
        />
        {errors.message && (
          <span className="text-xs text-accent">{errors.message.message}</span>
        )}
      </div>

      <Button type="submit" variant="primary" size="lg" disabled={isPending} className="self-start">
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Envoyer le message
      </Button>

      {status && (
        <div
          className={cn(
            "flex items-start gap-2 rounded-xl border p-4 text-sm",
            status.type === "success"
              ? "border-success/30 bg-success-soft text-success"
              : "border-accent/30 bg-accent-soft text-accent-dark",
          )}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{status.message}</span>
        </div>
      )}
    </form>
  );
}
