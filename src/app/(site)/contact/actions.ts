"use server";

import { prisma } from "@/lib/prisma";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations/contact";

type SubmitResult = { success: true } | { success: false; error: string };

export async function submitContactRequest(
  values: ContactFormValues,
): Promise<SubmitResult> {
  const parsed = contactFormSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, error: "Merci de vérifier les informations saisies." };
  }

  try {
    await prisma.contactRequest.create({
      data: {
        type: parsed.data.type,
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || undefined,
        message: parsed.data.message,
        vehicleId: parsed.data.vehicleId || undefined,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("submitContactRequest failed", error);
    return {
      success: false,
      error:
        "Une erreur est survenue lors de l'envoi. Merci de réessayer ou de nous appeler directement.",
    };
  }
}
