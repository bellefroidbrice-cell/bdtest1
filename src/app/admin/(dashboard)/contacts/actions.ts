"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function markContactHandled(id: string, handled: boolean) {
  await prisma.contactRequest.update({
    where: { id },
    data: { handledAt: handled ? new Date() : null },
  });
  revalidatePath("/admin/contacts");
}
