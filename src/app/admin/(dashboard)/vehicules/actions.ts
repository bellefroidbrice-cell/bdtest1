"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { deleteCloudinaryAsset, uploadVehiclePhoto } from "@/lib/cloudinary";
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

function getNewPhotoFiles(formData: FormData): File[] {
  return formData
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

async function attachPhotos(vehicleId: string, files: File[], startPosition: number) {
  for (const [index, file] of files.entries()) {
    try {
      const url = await uploadVehiclePhoto(file);
      await prisma.vehiclePhoto.create({
        data: { vehicleId, url, position: startPosition + index },
      });
    } catch (error) {
      console.error("uploadVehiclePhoto failed", error);
    }
  }
}

export async function createVehicle(
  _prevState: VehicleFormState,
  formData: FormData,
): Promise<VehicleFormState> {
  const parsed = parseVehicleForm(formData);
  if (!parsed.success) {
    return { success: false, error: "Merci de vérifier les champs du formulaire." };
  }

  let vehicleId: string;
  try {
    const { brand, model, year, ...rest } = parsed.data;
    const vehicle = await prisma.vehicle.create({
      data: {
        brand,
        model,
        year,
        slug: slugify(brand, model, year),
        ...rest,
      },
    });
    vehicleId = vehicle.id;
  } catch (error) {
    console.error("createVehicle failed", error);
    return {
      success: false,
      error: "Impossible d'enregistrer le véhicule (base de données non connectée ?).",
    };
  }

  await attachPhotos(vehicleId, getNewPhotoFiles(formData), 0);

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

  const existingPhotoCount = await prisma.vehiclePhoto.count({
    where: { vehicleId: id },
  });
  await attachPhotos(id, getNewPhotoFiles(formData), existingPhotoCount);

  revalidatePath("/admin/vehicules");
  redirect(`/admin/vehicules/${id}`);
}

export async function deleteVehicle(id: string) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: { photos: true },
  });

  await Promise.all(
    (vehicle?.photos ?? []).map((photo) => deleteCloudinaryAsset(photo.url)),
  );

  await prisma.vehicle.delete({ where: { id } });
  revalidatePath("/admin/vehicules");
}

export async function deleteVehiclePhoto(photoId: string, vehicleId: string) {
  const photo = await prisma.vehiclePhoto.findUnique({ where: { id: photoId } });
  if (photo) {
    await deleteCloudinaryAsset(photo.url);
    await prisma.vehiclePhoto.delete({ where: { id: photoId } });
  }
  revalidatePath(`/admin/vehicules/${vehicleId}`);
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
