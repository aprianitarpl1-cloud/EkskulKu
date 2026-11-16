
import Link from "next/link";
import { ambilSemuaEkskul } from "@/data/ambil";
import {
  pendaftar,
  DAFTAR_KATEGORI,
  DAFTAR_HARI,
  JAM_SESI,
} from "@/data/ekskul";

export const instant = false;

export const metadata = {
  title: "Daftar Ekskul",
};

type SearchParams = Promise<{
  kategori?: string;
  hari?: string;
}>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedParams = await searchParams;
  const selectedKategori = resolvedParams.kategori || "";
  const selectedHari = resolvedParams.hari || "";

  const semuaEkskul = await ambilSemuaEkskul();

  const filteredEkskul = semuaEkskul.filter((e) => {
    const matchKategori = selectedKategori
      ? e.kategori === selectedKategori
      : true;

    const matchHari = selectedHari
      ? e.hari === selectedHari
      : true;

    return matchKategori && matchHari;
  });

  return (
    <main className="p-6 max-w-4xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">Daftar Ekskul</h1>

      <div className="border p-4 rounded-lg mb-6 bg-white shadow-sm">
        <form
          method="GET"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
        >
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Kategori
            </label>
            <select
              name="kategori"
              defaultValue={selectedKategori}
              className="w-full border p-2 rounded bg-white"
            >
              <option value="">Semua Kategori</option>
              {DAFTAR_KATEGORI.map((kat) => (
                <option key={kat} value={kat}>
                  {kat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Hari
            </label>
            <select
              name="hari"
              defaultValue={selectedHari}
              className="w-full border p-2 rounded bg-white"
            >
              <option value="">Semua Hari</option>
              {DAFTAR_HARI.map((hari) => (
                <option key={hari} value={hari}>
                  {hari}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end gap-2 mt-2">
            <Link
              href="/ekskul"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium border text-center"
            >
              Reset
            </Link>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-medium"
            >
              Saring
            </button>
          </div>
        </form>
      </div>

      <p className="mb-4 text-gray-700 text-sm">
        {filteredEkskul.length} ekskul ditemukan.
      </p>

      {filteredEkskul.length === 0 ? (
        <p className="text-red-500 font-semibold">
          Tidak ada ekskul yang cocok.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEkskul.map((ekskul) => {
            const jumlahPendaftar = pendaftar.filter(
              (p) => p.ekskulId === ekskul.id
            ).length;

            const sisaTempat = ekskul.kuota - jumlahPendaftar;
            const isPenuh = sisaTempat <= 0;

            return (
              <div
                key={ekskul.id}
                className="border p-5 rounded-lg shadow-sm bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-1 rounded">
                      {ekskul.kategori}
                    </span>

                    {isPenuh ? (
                      <span className="text-xs font-semibold bg-red-50 text-red-600 px-2 py-1 rounded">
                        Penuh
                      </span>
                    ) : (
                      <span className="text-xs font-semibold bg-green-50 text-green-600 px-2 py-1 rounded">
                        Sisa {sisaTempat} dari {ekskul.kuota} tempat
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold mb-2">
                    {ekskul.nama}
                  </h2>

                  <p className="text-sm text-gray-700 mb-1">
                    Jadwal: {ekskul.hari}, Sesi {ekskul.sesi} (
                    {JAM_SESI[ekskul.sesi]})
                  </p>

                  <p className="text-sm text-gray-700 mb-4">
                    Pembina: {ekskul.pembina}
                  </p>
                </div>

                <Link
                  href={`/ekskul/${ekskul.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-center text-sm font-medium py-2 px-4 rounded block"
                >
                  Lihat Detail & Daftar
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
