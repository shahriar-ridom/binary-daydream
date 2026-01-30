"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

// We extend the schema because the form sends 'priceInDollars', but DB wants 'cents'
const productFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  priceInDollars: z.coerce.number().min(1),
  fileKey: z.string().min(1),
  imageKey: z.string().min(1),
});

export async function addProduct(
  prevState: { error?: string } | null,
  formData: FormData,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  // 1. Validate Form Data
  const result = productFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    priceInDollars: formData.get("priceInDollars"),
    fileKey: formData.get("fileKey"),
    imageKey: formData.get("imageKey"),
  });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const data = result.data;

  // Insert into DB
  try {
    await db.insert(products).values({
      name: data.name,
      description: data.description,
      priceInCents: Math.floor(data.priceInDollars * 100),
      filePath: data.fileKey,
      imagePath: data.imageKey,
      isAvailable: true,
    });
  } catch (err) {
    console.error(err);
    return { error: "Database Failed" };
  }

  // Revalidate & Redirect
  redirect("/admin/products");
}

export async function toggleProductAvailability(
  id: number,
  isAvailable: boolean,
) {
  // Auth Check
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.role !== "admin") return { error: "Unauthorized" };

  await db.update(products).set({ isAvailable }).where(eq(products.id, id));

  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function deleteProduct(id: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.role !== "admin") return { error: "Unauthorized" };

  try {
    await db.delete(products).where(eq(products.id, id));
    revalidatePath("/admin/products");
    revalidatePath("/");
  } catch (error) {
    return {
      error: "Cannot delete product with active orders. Archive it instead.",
    };
  }
}
