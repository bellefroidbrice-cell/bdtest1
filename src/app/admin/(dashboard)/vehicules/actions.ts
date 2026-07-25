"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { vehicleFormSchema } from "@/lib/validations/vehicle";

export type VehicleFormState = { success: false; error: string } | undefined;

function parseVehicleForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return vehicleFormSchema.safeParse({
    ...raw,
    isFeatured: formData.get("isFeatured") === "on",
  });
}

export async function createVehicle(
  _prevState: VehicleFormState,
  formData: FormData,
): Promise<VehicleFormState> {
  const parsed = parseVehicleForm(formData);
  if (!parsed.success) {
    return { success: false, error: "Merci de vérifier les champs du formulaire." };
  }

  try {
    const { brand, model, year, ...rest } = parsed.data;
    await prisma.vehicle.create({
      data: {
        brand,
        model,
        year,
        slug: slugify(brand, model, year),
        ...rest,
      },
    });
  } catch (error) {
    console.error("createVehicle failed", error);
    return {
      success: false,
      error: "Impossible d'enregistrer le véhicule (base de données non connectée ?).",
    };
  }

  revalidatePath("/admin/vehicules");
  redirect("/admin/vehicules");
}

export async function updateVehicle(
  id: string,
  _prevState: VehicleFormState,
  formData: FormData,
): Promise<VehicleFormState> {
  const parsed = parseVehicleForm(formData);
  if (!parsed.success) {
    return { success: false, error: "Merci de vérifier les champs du formulaire." };
  }

  try {
    await prisma.vehicle.update({
      where: { id },
      data: parsed.data,
    });
  } catch (error) {
    console.error("updateVehicle failed", error);
    return {
      success: false,
      error: "Impossible de mettre à jour le véhicule (base de données non connectée ?).",
    };
  }

  revalidatePath("/admin/vehicules");
  redirect("/admin/vehicules");
}

export async function deleteVehicle(id: string) {
  await prisma.vehicle.delete({ where: { id } });
  revalidatePath("/admin/vehicules");
}

export async function updateVehicleStatus(
  id: string,
  status: "AVAILABLE" | "RESERVED" | "SOLD",
) {
  await prisma.vehicle.update({
    where: { id },
    data: { status, soldAt: status === "SOLD" ? new Date() : null },
  });
  revalidatePath("/admin/vehicules");
}
