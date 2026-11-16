import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { ambilEkskul, ambilAnggota } from "@/data/ambil";
import { JAM_SESI } from "@/data/ekskul";
import FormPendaftaran from "./FormPendaftaran";

export const instant = false;

type PageProps = {
  params: Promise<{ id: string }>;
};

async function DaftarAnggota({ ekskulId, kuota }: { ekskulId: number; kuota: number }) {
  const cookieStore = await cookies();
  const namaCookie = cookieStore.get("nama")?.value || "";

  const anggotaList = await ambilAnggota(ekskulId);
  const jumlahTerisi = anggotaList.length;

  return (
    <div className="mt-6 border-t pt-4">
      <h2 className="text-xl font-bold mb-2">Anggota terdaftar</h2>
      <p className="text-sm text-gray-600 mb-4">
        {jumlahTerisi} dari {kuota} tempat terisi
      </p>

      {anggotaList.length === 0 ? (
        <p className="text-gray-500 italic">Belum ada anggota.</p>
      ) : (
        <ul className="space-y-2">
          {anggotaList.map((p) => {
            const isKamu = namaCookie && p.nama.toLowerCase() === namaCookie.toLowerCase();
            return (
              <li key={p.nomor} className="border p-2 rounded flex justify-between items-center">
                <span>
                  {p.nama} · {p.kelas}
                </span>
                {isKamu && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                    Kamu
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  const ekskul = await ambilEkskul(id);
  if (!ekskul) return { title: "Ekskul tidak ditemukan" };
  return { title: ekskul.nama };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  const ekskul = await ambilEkskul(id);

  if (!ekskul) {
    notFound();
  }

  const cookieStore = await cookies();
  const defaultNama = cookieStore.get("nama")?.value || "";
  const defaultKelas = cookieStore.get("kelas")?.value || "";

  return (
    <main className="p-6 max-w-2xl mx-auto font-sans">
      <span className="text-sm font-semibold bg-blue-50 text-blue-600 px-2 py-1 rounded">{ekskul.kategori}</span>
      <h1 className="text-3xl font-bold mt-2 mb-1">{ekskul.nama}</h1>
      <p className="text-gray-700 mb-1">
        Jadwal: {ekskul.hari}, Sesi {ekskul.sesi} ({JAM_SESI[ekskul.sesi]})
      </p>
      <p className="text-gray-700 mb-6">Pembina: {ekskul.pembina}</p>

      <div className="border p-4 rounded-lg bg-white shadow-sm mb-6">
        <h2 className="font-bold mb-4">Daftar ekskul ini</h2>
        <FormPendaftaran ekskulId={ekskul.id} defaultNama={defaultNama} defaultKelas={defaultKelas} />
      </div>

      <Suspense fallback={<p className="text-gray-500 italic mt-6">Memuat anggota...</p>}>
        <DaftarAnggota ekskulId={ekskul.id} kuota={ekskul.kuota} />
      </Suspense>
    </main>
  );
}