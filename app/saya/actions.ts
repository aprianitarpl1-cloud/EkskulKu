"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { batalkanPendaftar } from "@/data/ekskul";

export async function handleBatalkan(formData: FormData) {
  const ekskulIdStr = formData.get("ekskulId") as string;
  const ekskulId = Number(ekskulIdStr);

  const cookieStore = await cookies();
  const nama = cookieStore.get("nama")?.value || "";
  const kelas = cookieStore.get("kelas")?.value || "";

  if (!nama || !kelas) return;

  // Gunakan 'await' jika fungsi batalkanPendaftar terhubung ke database (Async)
  await batalkanPendaftar(ekskulId, nama, kelas);

  revalidatePath("/saya");
  revalidatePath(`/ekskul/${ekskulId}`);
  revalidatePath("/ekskul");
}