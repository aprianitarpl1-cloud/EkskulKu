import { cookies } from "next/headers";
import Link from "next/link";
import { pendaftar, JAM_SESI } from "@/data/ekskul";
import { ambilSemuaEkskul } from "@/data/ambil";
import { handleBatalkan } from "./actions";

export default async function PageSaya() {
  const cookieStore = await cookies();
  const nama = cookieStore.get("nama")?.value || "";
  const kelas = cookieStore.get("kelas")?.value || "";

  // 1. Kondisi Tanpa Cookie (Belum pernah mendaftar sama sekali)
  if (!nama || !kelas) {
    return (
      <main className="p-6 max-w-2xl mx-auto font-sans">
        <h1 className="text-3xl font-bold mb-4">Ekskul saya</h1>
        <p className="text-gray-700">
          Kamu belum mendaftar apa pun.{" "}
          <Link href="/ekskul" className="text-blue-600 underline font-semibold">
            Daftar ekskul di sini
          </Link>
        </p>
      </main>
    );
  }

  // Mengambil daftar ekskul yang diikuti murid berdasarkan cookie
  const semuaEkskul = await ambilSemuaEkskul();
  const pendaftaranMurid = pendaftar.filter(
    (p) => p.nama.toLowerCase() === nama.toLowerCase() && p.kelas.toLowerCase() === kelas.toLowerCase()
  );

  const ekskulDiikuti = pendaftaranMurid
    .map((p) => {
      const detail = semuaEkskul.find((e) => e.id === p.ekskulId);
      return detail ? { ...detail, nomorPendaftaran: p.nomor } : null;
    })
    .filter(Boolean);

  return (
    <main className="p-6 max-w-2xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-2">Ekskul saya</h1>
      
      {/* Ringkasan identitas dan jumlah ekskul yang diikuti */}
      <p className="text-gray-700 font-medium mb-4">
        {nama} · {kelas} · {ekskulDiikuti.length} ekskul diikuti
      </p>

      {/* 2. Kondisi Cookie Ada tetapi Belum Ada Pendaftaran */}
      {ekskulDiikuti.length === 0 ? (
        <p className="text-gray-500 italic">Belum ada ekskul yang diikuti.</p>
      ) : (
        <ul className="space-y-4">
          {ekskulDiikuti.map((item) => {
            if (!item) return null;
            return (
              <li key={item.id} className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-center">
                <div>
                  {/* Nama ekskul sebagai tautan ke detail ekskul */}
                  <Link href={`/ekskul/${item.id}`} className="text-xl font-bold text-blue-600 hover:underline">
                    {item.nama}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.hari}, Sesi {item.sesi} ({JAM_SESI[item.sesi]})
                  </p>
                </div>

                {/* Tombol Batalkan untuk menghapus pendaftaran */}
                <form action={handleBatalkan}>
                  <input type="hidden" name="ekskulId" value={item.id} />
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded transition cursor-pointer"
                  >
                    Batalkan
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-6">
        <Link href="/ekskul" className="text-blue-600 hover:underline text-sm font-semibold">
          ← Kembali ke Daftar Ekskul
        </Link>
      </div>
    </main>
  );
}