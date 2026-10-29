-- =====================================================================
-- 1-schema.sql  |  SETUP LENGKAP SUPABASE  (WAJIB, jalankan lebih dulu)
--
-- Cara pakai: Supabase > SQL Editor > New query > tempel seluruh isi
-- file ini > Run.
--
-- File ini AMAN DIJALANKAN BERULANG KALI. Di proyek baru ia membuat
-- semuanya; di proyek lama ia memperbarui yang kurang (tanpa menghapus
-- data artis, produk, dan narasi yang sudah ada).
--
-- Urutan lengkap:
--   1) 1-schema.sql                 (file ini, wajib)
--   2) 2-seed.sql                   (opsional, hanya data contoh)
--   3) daftarkan akun admin         (lihat bagian paling bawah file ini)
-- =====================================================================


-- ---------------------------------------------------------------------
-- A. Bersihkan sisa versi lama
--    (produk tidak lagi dikaitkan ke artis; kolom bio diganti 4 kolom baru)
-- ---------------------------------------------------------------------
drop view  if exists artis_publik;      -- dibuat ulang di bagian E
drop table if exists produk_artis;


-- ---------------------------------------------------------------------
-- B. Tabel
-- ---------------------------------------------------------------------
create table if not exists artis(
  id bigint generated always as identity primary key,
  nama text,                 -- nama panggilan, tampil di kartu
  nama_panjang text,         -- nama lengkap
  kegemaran text,
  tanggal_lahir date,
  kondisi text check (kondisi in (
    'Disabilitas fisik', 'Disabilitas sensorik', 'Disabilitas intelektual',
    'Disabilitas mental', 'Memilih untuk tidak memberi tahu')),
  peran text,
  foto text,
  alt_foto text,             -- deskripsi foto untuk pembaca layar
  publikasi text not null default 'lengkap' check (publikasi in ('lengkap', 'nama', 'anonim')),
  urutan int not null default 0);

-- Proyek lama: tambahkan kolom yang belum ada, buang kolom bio
alter table artis add column if not exists nama_panjang text;
alter table artis add column if not exists kegemaran text;
alter table artis add column if not exists tanggal_lahir date;
alter table artis add column if not exists kondisi text check (kondisi in (
  'Disabilitas fisik', 'Disabilitas sensorik', 'Disabilitas intelektual',
  'Disabilitas mental', 'Memilih untuk tidak memberi tahu'));
alter table artis drop column if exists bio;

create table if not exists produk(
  id bigint generated always as identity primary key,
  nama text not null,
  harga int check (harga >= 0),
  deskripsi text,
  foto text[] not null default '{}',
  alt text[] not null default '{}',
  tampil boolean not null default true,
  habis boolean not null default false,
  link_shopee text);          -- tautan produk di Shopee (opsional)

-- Proyek lama: tautan produk di Shopee (opsional). Hanya tautan berawalan https:// yang diterima.
alter table produk add column if not exists link_shopee text;
alter table produk drop constraint if exists produk_link_shopee_https;
alter table produk add constraint produk_link_shopee_https
  check (link_shopee is null or link_shopee ~* '^https://[^[:space:]]+$');

-- Struktur organisasi: foto dan nama bisa diganti admin.
-- tingkat 1 = pimpinan (paling atas, hanya boleh satu); tingkat 2 = bagian di bawahnya.
create table if not exists struktur(
  id bigint generated always as identity primary key,
  jabatan text not null,
  nama text,
  foto text,
  alt_foto text,             -- deskripsi foto untuk pembaca layar
  tingkat int not null default 2 check (tingkat in (1, 2)),
  urutan int not null default 0);
create unique index if not exists struktur_satu_pimpinan on struktur(tingkat) where tingkat = 1;

-- Narasi (Awal berdiri, Motivasi pendiri, dst.): judul dan isi bisa diganti admin.
create table if not exists narasi(
  id bigint generated always as identity primary key,
  judul text not null,
  isi text not null,
  urutan int not null default 0);

create table if not exists pengaturan(kunci text primary key, nilai text);
create table if not exists admins(user_id uuid primary key references auth.users(id) on delete cascade);


-- ---------------------------------------------------------------------
-- C. Pemeriksa admin (dicek di database, bukan di browser)
-- ---------------------------------------------------------------------
create or replace function is_admin() returns boolean
  language sql security definer set search_path = public stable
as $$ select exists(select 1 from admins where user_id = auth.uid()) $$;


-- ---------------------------------------------------------------------
-- D. Keamanan baris (RLS): publik hanya boleh MEMBACA, admin boleh semuanya
-- ---------------------------------------------------------------------
alter table artis      enable row level security;
alter table produk     enable row level security;
alter table struktur   enable row level security;
alter table narasi     enable row level security;
alter table pengaturan enable row level security;
alter table admins     enable row level security;   -- tanpa policy = tidak bisa diakses lewat API

-- Publik: baca saja
drop policy if exists baca_produk   on produk;
drop policy if exists baca_struktur on struktur;
drop policy if exists baca_narasi   on narasi;
drop policy if exists baca_set      on pengaturan;
create policy baca_produk   on produk     for select to anon, authenticated using (tampil);
create policy baca_struktur on struktur   for select to anon, authenticated using (true);
create policy baca_narasi   on narasi     for select to anon, authenticated using (true);
create policy baca_set      on pengaturan for select to anon, authenticated using (true);

-- Pengelola terdaftar: boleh semuanya
drop policy if exists admin_produk   on produk;
drop policy if exists admin_artis    on artis;
drop policy if exists admin_struktur on struktur;
drop policy if exists admin_narasi   on narasi;
drop policy if exists admin_set      on pengaturan;
create policy admin_produk   on produk     for all to authenticated using (is_admin()) with check (is_admin());
create policy admin_artis    on artis      for all to authenticated using (is_admin()) with check (is_admin());
create policy admin_struktur on struktur   for all to authenticated using (is_admin()) with check (is_admin());
create policy admin_narasi   on narasi     for all to authenticated using (is_admin()) with check (is_admin());
create policy admin_set      on pengaturan for all to authenticated using (is_admin()) with check (is_admin());


-- ---------------------------------------------------------------------
-- E. Privasi artis: tabel asli TIDAK bisa dibaca publik.
--    Publik memakai view yang mengosongkan data pribadi/foto sesuai
--    pilihan 'publikasi' (lengkap / nama / anonim).
-- ---------------------------------------------------------------------
revoke all on artis  from anon;
revoke all on admins from anon, authenticated;

create view artis_publik as select id,
  case when publikasi <> 'anonim'  then nama end         as nama,
  case when publikasi = 'lengkap'  then nama_panjang end as nama_panjang,
  case when publikasi = 'lengkap'  then kegemaran end    as kegemaran,
  case when publikasi = 'lengkap'  then tanggal_lahir end as tanggal_lahir,
  case when publikasi = 'lengkap'  then kondisi end      as kondisi,
  case when publikasi = 'lengkap'  then peran end        as peran,
  case when publikasi = 'lengkap'  then foto end         as foto,
  case when publikasi = 'lengkap'  then alt_foto end     as alt_foto,
  publikasi, urutan from artis;
grant select on artis_publik to anon, authenticated;


-- ---------------------------------------------------------------------
-- F. Penyimpanan foto (bucket publik; hanya admin yang boleh mengubah)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public) values ('foto', 'foto', true)
  on conflict (id) do nothing;
drop policy if exists foto_admin on storage.objects;
create policy foto_admin on storage.objects for all to authenticated
  using (bucket_id = 'foto' and is_admin()) with check (bucket_id = 'foto' and is_admin());


-- ---------------------------------------------------------------------
-- G. Templat struktur organisasi: 5 jabatan sudah ada, admin tinggal
--    mengisi nama dan foto. Hanya dibuat kalau tabelnya masih kosong.
-- ---------------------------------------------------------------------
insert into struktur(jabatan, tingkat, urutan)
select * from (values
  ('Ketua Shelter Sambung Roso', 1, 1),
  ('Bagian Keuangan',            2, 2),
  ('Bagian Administrasi',        2, 3),
  ('Bagian Produksi',            2, 4),
  ('Bagian Pemasaran',           2, 5)
) as t(jabatan, tingkat, urutan)
where not exists (select 1 from struktur);


-- ---------------------------------------------------------------------
-- H. MENDAFTARKAN ADMIN (wajib, kalau tidak halaman admin menolak masuk)
--    1. Buat/ login dulu akunnya: Authentication > Users > Add user,
--       atau masuk sekali lewat tombol Google di admin.html.
--    2. Hapus tanda "--" di depan dua baris di bawah, ganti emailnya,
--       lalu jalankan.
-- ---------------------------------------------------------------------
-- insert into admins(user_id) select id from auth.users where email = 'emailmu@contoh.com'
--   on conflict do nothing;
