# Membuat data contoh (lorem ipsum): data/sample.json dan supabase/2-seed.sql
# Jalankan dari folder utama proyek:  python3 tools/gen.py
import json

L = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua".split()
def kal(n, s): return " ".join(L[(s + i * 3) % len(L)] for i in range(n)).capitalize() + "."

K = ["Disabilitas fisik", "Disabilitas sensorik", "Disabilitas intelektual", "Disabilitas mental", "Memilih untuk tidak memberi tahu"]
# Warna foto contoh: palet Okabe-Ito (aman untuk buta warna merah-hijau)
W = ["#0072B2", "#E69F00", "#009E73", "#D55E00", "#CC79A7", "#56B4E9", "#4D4D4D", "#8C6D1F"]

artis, produk = [], []
for i in range(1, 24):
    pub = "anonim" if i % 7 == 0 else "nama" if i % 5 == 0 else "lengkap"
    artis.append(dict(id=i, nama=f"Nama Artis {i:02d}", nama_panjang=f"Nama Panjang Artis {i:02d}", kegemaran="Lorem ipsum dolor sit amet.",
                      tanggal_lahir=f"{1985 + i % 20}-{i % 12 + 1:02d}-{i % 28 + 1:02d}", kondisi=K[i % 5], peran=None, foto=W[i % 8],
                      alt_foto=f"Foto contoh Nama Artis {i:02d}", publikasi=pub, urutan=i))
pid = 0
for a in artis:
    for _ in range(a["id"] % 3 + 1):
        pid += 1; n = 2 if pid % 4 == 0 else 1
        produk.append(dict(id=pid, nama=f"Produk Lorem {pid:02d}",
            harga=None if pid % 9 == 0 else 50000 + (pid % 7) * 15000, deskripsi=kal(18, pid),
            foto=[W[(pid + j) % 8] for j in range(n)], alt=[f"Foto contoh produk {pid:02d}, {j+1}" for j in range(n)],
            tampil=True, habis=pid % 6 == 0,
            link_shopee="https://shopee.co.id/" if pid % 3 != 0 else None))   # contoh: sebagian produk punya tautan Shopee

narasi = [dict(judul=t, isi=kal(40, s), urutan=s) for s, t in enumerate(["Awal berdiri", "Motivasi pendiri", "Tentang batik ciprat"], 1)]

# Struktur organisasi contoh (hanya untuk mode contoh di sample.json).
# Di Supabase, 5 jabatan ini sudah dibuat otomatis oleh 1-schema.sql (tanpa nama/foto).
JABATAN = [("Ketua Shelter Sambung Roso", 1), ("Bagian Keuangan", 2), ("Bagian Administrasi", 2), ("Bagian Produksi", 2), ("Bagian Pemasaran", 2)]
struktur = [dict(id=i, jabatan=j, nama=f"Nama Pengurus {i:02d}", foto=W[i % 8], alt_foto=f"Foto contoh Nama Pengurus {i:02d}", tingkat=t, urutan=i)
            for i, (j, t) in enumerate(JABATAN, 1)]

def publik(a):
    b = dict(a)
    if a["publikasi"] == "anonim": b.update(nama=None, nama_panjang=None, kegemaran=None, tanggal_lahir=None, kondisi=None, peran=None, foto=None, alt_foto=None)
    elif a["publikasi"] == "nama": b.update(nama_panjang=None, kegemaran=None, tanggal_lahir=None, kondisi=None, peran=None, foto=None, alt_foto=None)
    return b

json.dump(dict(pengaturan=dict(wa_pengelola="62800000099"), narasi=narasi, struktur=struktur, artis=[publik(a) for a in artis], produk=produk),
          open("data/sample.json", "w"), ensure_ascii=False, indent=1)

q = lambda s: "null" if s is None else "'" + str(s).replace("'", "''") + "'"
arr = lambda xs: "'{" + ",".join('"' + x.replace('"', '') + '"' for x in xs) + "}'"

o = ["-- =====================================================================",
     "-- 2-seed.sql  |  DATA CONTOH (lorem ipsum)  |  OPSIONAL",
     "-- Jalankan SETELAH 1-schema.sql, hanya pada database yang masih kosong.",
     "-- Kalau artis/produk/narasi sudah berisi, file ini berhenti dengan pesan",
     "-- galat supaya data tidak dobel. Struktur organisasi tidak diisi di sini",
     "-- (sudah ada templatnya dari 1-schema.sql).",
     "-- =====================================================================",
     "do $$ begin",
     "  if exists (select 1 from artis) or exists (select 1 from produk) or exists (select 1 from narasi) then",
     "    raise exception 'Data sudah ada. 2-seed.sql hanya untuk database kosong, supaya data tidak dobel.';",
     "  end if;",
     "",
     "  insert into artis(nama,nama_panjang,kegemaran,tanggal_lahir,kondisi,peran,foto,alt_foto,publikasi,urutan) values"]
o.append(",\n".join(f"  ({q(a['nama'])},{q(a['nama_panjang'])},{q(a['kegemaran'])},{q(a['tanggal_lahir'])},{q(a['kondisi'])},{q(a['peran'])},{q(a['foto'])},{q(a['alt_foto'])},{q(a['publikasi'])},{a['urutan']})" for a in artis) + ";")
o.append("\n  insert into produk(nama,harga,deskripsi,foto,alt,tampil,habis,link_shopee) values")
o.append(",\n".join(f"  ({q(p['nama'])},{'null' if p['harga'] is None else p['harga']},{q(p['deskripsi'])},{arr(p['foto'])},{arr(p['alt'])},true,{str(p['habis']).lower()},{q(p['link_shopee'])})" for p in produk) + ";")
o.append("\n  insert into narasi(judul,isi,urutan) values")
o.append(",\n".join(f"  ({q(n['judul'])},{q(n['isi'])},{n['urutan']})" for n in narasi) + ";")
o.append("\n  insert into pengaturan(kunci,nilai) values ('wa_pengelola','62800000099')")
o.append("    on conflict (kunci) do update set nilai = excluded.nilai;")
o.append("end $$;")
open("supabase/2-seed.sql", "w").write("\n".join(o) + "\n")
print(len(artis), "artis,", len(produk), "produk,", len(struktur), "struktur,", len(narasi), "narasi")
