-- =====================================================================
-- 2-seed.sql  |  DATA CONTOH (lorem ipsum)  |  OPSIONAL
-- Jalankan SETELAH 1-schema.sql, hanya pada database yang masih kosong.
-- Kalau artis/produk/narasi sudah berisi, file ini berhenti dengan pesan
-- galat supaya data tidak dobel. Struktur organisasi tidak diisi di sini
-- (sudah ada templatnya dari 1-schema.sql).
-- =====================================================================
do $$ begin
  if exists (select 1 from artis) or exists (select 1 from produk) or exists (select 1 from narasi) then
    raise exception 'Data sudah ada. 2-seed.sql hanya untuk database kosong, supaya data tidak dobel.';
  end if;

  insert into artis(nama,nama_panjang,kegemaran,tanggal_lahir,kondisi,peran,foto,alt_foto,publikasi,urutan) values
  ('Nama Artis 01','Nama Panjang Artis 01','Lorem ipsum dolor sit amet.','1986-02-02','Disabilitas sensorik',null,'#E69F00','Foto contoh Nama Artis 01','lengkap',1),
  ('Nama Artis 02','Nama Panjang Artis 02','Lorem ipsum dolor sit amet.','1987-03-03','Disabilitas intelektual',null,'#009E73','Foto contoh Nama Artis 02','lengkap',2),
  ('Nama Artis 03','Nama Panjang Artis 03','Lorem ipsum dolor sit amet.','1988-04-04','Disabilitas mental',null,'#D55E00','Foto contoh Nama Artis 03','lengkap',3),
  ('Nama Artis 04','Nama Panjang Artis 04','Lorem ipsum dolor sit amet.','1989-05-05','Memilih untuk tidak memberi tahu',null,'#CC79A7','Foto contoh Nama Artis 04','lengkap',4),
  ('Nama Artis 05','Nama Panjang Artis 05','Lorem ipsum dolor sit amet.','1990-06-06','Disabilitas fisik',null,'#56B4E9','Foto contoh Nama Artis 05','nama',5),
  ('Nama Artis 06','Nama Panjang Artis 06','Lorem ipsum dolor sit amet.','1991-07-07','Disabilitas sensorik',null,'#4D4D4D','Foto contoh Nama Artis 06','lengkap',6),
  ('Nama Artis 07','Nama Panjang Artis 07','Lorem ipsum dolor sit amet.','1992-08-08','Disabilitas intelektual',null,'#8C6D1F','Foto contoh Nama Artis 07','anonim',7),
  ('Nama Artis 08','Nama Panjang Artis 08','Lorem ipsum dolor sit amet.','1993-09-09','Disabilitas mental',null,'#0072B2','Foto contoh Nama Artis 08','lengkap',8),
  ('Nama Artis 09','Nama Panjang Artis 09','Lorem ipsum dolor sit amet.','1994-10-10','Memilih untuk tidak memberi tahu',null,'#E69F00','Foto contoh Nama Artis 09','lengkap',9),
  ('Nama Artis 10','Nama Panjang Artis 10','Lorem ipsum dolor sit amet.','1995-11-11','Disabilitas fisik',null,'#009E73','Foto contoh Nama Artis 10','nama',10),
  ('Nama Artis 11','Nama Panjang Artis 11','Lorem ipsum dolor sit amet.','1996-12-12','Disabilitas sensorik',null,'#D55E00','Foto contoh Nama Artis 11','lengkap',11),
  ('Nama Artis 12','Nama Panjang Artis 12','Lorem ipsum dolor sit amet.','1997-01-13','Disabilitas intelektual',null,'#CC79A7','Foto contoh Nama Artis 12','lengkap',12),
  ('Nama Artis 13','Nama Panjang Artis 13','Lorem ipsum dolor sit amet.','1998-02-14','Disabilitas mental',null,'#56B4E9','Foto contoh Nama Artis 13','lengkap',13),
  ('Nama Artis 14','Nama Panjang Artis 14','Lorem ipsum dolor sit amet.','1999-03-15','Memilih untuk tidak memberi tahu',null,'#4D4D4D','Foto contoh Nama Artis 14','anonim',14),
  ('Nama Artis 15','Nama Panjang Artis 15','Lorem ipsum dolor sit amet.','2000-04-16','Disabilitas fisik',null,'#8C6D1F','Foto contoh Nama Artis 15','nama',15),
  ('Nama Artis 16','Nama Panjang Artis 16','Lorem ipsum dolor sit amet.','2001-05-17','Disabilitas sensorik',null,'#0072B2','Foto contoh Nama Artis 16','lengkap',16),
  ('Nama Artis 17','Nama Panjang Artis 17','Lorem ipsum dolor sit amet.','2002-06-18','Disabilitas intelektual',null,'#E69F00','Foto contoh Nama Artis 17','lengkap',17),
  ('Nama Artis 18','Nama Panjang Artis 18','Lorem ipsum dolor sit amet.','2003-07-19','Disabilitas mental',null,'#009E73','Foto contoh Nama Artis 18','lengkap',18),
  ('Nama Artis 19','Nama Panjang Artis 19','Lorem ipsum dolor sit amet.','2004-08-20','Memilih untuk tidak memberi tahu',null,'#D55E00','Foto contoh Nama Artis 19','lengkap',19),
  ('Nama Artis 20','Nama Panjang Artis 20','Lorem ipsum dolor sit amet.','1985-09-21','Disabilitas fisik',null,'#CC79A7','Foto contoh Nama Artis 20','nama',20),
  ('Nama Artis 21','Nama Panjang Artis 21','Lorem ipsum dolor sit amet.','1986-10-22','Disabilitas sensorik',null,'#56B4E9','Foto contoh Nama Artis 21','anonim',21),
  ('Nama Artis 22','Nama Panjang Artis 22','Lorem ipsum dolor sit amet.','1987-11-23','Disabilitas intelektual',null,'#4D4D4D','Foto contoh Nama Artis 22','lengkap',22),
  ('Nama Artis 23','Nama Panjang Artis 23','Lorem ipsum dolor sit amet.','1988-12-24','Disabilitas mental',null,'#8C6D1F','Foto contoh Nama Artis 23','lengkap',23);

  insert into produk(nama,harga,deskripsi,foto,alt,tampil,habis,link_shopee) values
  ('Produk Lorem 01',65000,'Ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore.','{"#E69F00"}','{"Foto contoh produk 01, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 02',80000,'Dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et.','{"#009E73"}','{"Foto contoh produk 02, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 03',95000,'Sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore.','{"#D55E00"}','{"Foto contoh produk 03, 1"}',true,false,null),
  ('Produk Lorem 04',110000,'Amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna.','{"#CC79A7","#56B4E9"}','{"Foto contoh produk 04, 1","Foto contoh produk 04, 2"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 05',125000,'Consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua.','{"#56B4E9"}','{"Foto contoh produk 05, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 06',140000,'Adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem.','{"#4D4D4D"}','{"Foto contoh produk 06, 1"}',true,true,null),
  ('Produk Lorem 07',50000,'Elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum.','{"#8C6D1F"}','{"Foto contoh produk 07, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 08',65000,'Sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor.','{"#0072B2","#E69F00"}','{"Foto contoh produk 08, 1","Foto contoh produk 08, 2"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 09',null,'Do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit.','{"#E69F00"}','{"Foto contoh produk 09, 1"}',true,false,null),
  ('Produk Lorem 10',95000,'Eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet.','{"#009E73"}','{"Foto contoh produk 10, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 11',110000,'Tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur.','{"#D55E00"}','{"Foto contoh produk 11, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 12',125000,'Incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing.','{"#CC79A7","#56B4E9"}','{"Foto contoh produk 12, 1","Foto contoh produk 12, 2"}',true,true,null),
  ('Produk Lorem 13',140000,'Ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet elit.','{"#56B4E9"}','{"Foto contoh produk 13, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 14',50000,'Labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed.','{"#4D4D4D"}','{"Foto contoh produk 14, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 15',65000,'Et aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do.','{"#8C6D1F"}','{"Foto contoh produk 15, 1"}',true,false,null),
  ('Produk Lorem 16',80000,'Dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod.','{"#0072B2","#E69F00"}','{"Foto contoh produk 16, 1","Foto contoh produk 16, 2"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 17',95000,'Magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor.','{"#E69F00"}','{"Foto contoh produk 17, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 18',null,'Aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt.','{"#009E73"}','{"Foto contoh produk 18, 1"}',true,true,null),
  ('Produk Lorem 19',125000,'Lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut.','{"#D55E00"}','{"Foto contoh produk 19, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 20',140000,'Ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore.','{"#CC79A7","#56B4E9"}','{"Foto contoh produk 20, 1","Foto contoh produk 20, 2"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 21',50000,'Dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et.','{"#56B4E9"}','{"Foto contoh produk 21, 1"}',true,false,null),
  ('Produk Lorem 22',65000,'Sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore.','{"#4D4D4D"}','{"Foto contoh produk 22, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 23',80000,'Amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna.','{"#8C6D1F"}','{"Foto contoh produk 23, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 24',95000,'Consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua.','{"#0072B2","#E69F00"}','{"Foto contoh produk 24, 1","Foto contoh produk 24, 2"}',true,true,null),
  ('Produk Lorem 25',110000,'Adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem.','{"#E69F00"}','{"Foto contoh produk 25, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 26',125000,'Elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum.','{"#009E73"}','{"Foto contoh produk 26, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 27',null,'Sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor.','{"#D55E00"}','{"Foto contoh produk 27, 1"}',true,false,null),
  ('Produk Lorem 28',50000,'Do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit.','{"#CC79A7","#56B4E9"}','{"Foto contoh produk 28, 1","Foto contoh produk 28, 2"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 29',65000,'Eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet.','{"#56B4E9"}','{"Foto contoh produk 29, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 30',80000,'Tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur.','{"#4D4D4D"}','{"Foto contoh produk 30, 1"}',true,true,null),
  ('Produk Lorem 31',95000,'Incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing.','{"#8C6D1F"}','{"Foto contoh produk 31, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 32',110000,'Ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet elit.','{"#0072B2","#E69F00"}','{"Foto contoh produk 32, 1","Foto contoh produk 32, 2"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 33',125000,'Labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed.','{"#E69F00"}','{"Foto contoh produk 33, 1"}',true,false,null),
  ('Produk Lorem 34',140000,'Et aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do.','{"#009E73"}','{"Foto contoh produk 34, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 35',50000,'Dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod.','{"#D55E00"}','{"Foto contoh produk 35, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 36',null,'Magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor.','{"#CC79A7","#56B4E9"}','{"Foto contoh produk 36, 1","Foto contoh produk 36, 2"}',true,true,null),
  ('Produk Lorem 37',80000,'Aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt.','{"#56B4E9"}','{"Foto contoh produk 37, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 38',95000,'Lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut.','{"#4D4D4D"}','{"Foto contoh produk 38, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 39',110000,'Ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore.','{"#8C6D1F"}','{"Foto contoh produk 39, 1"}',true,false,null),
  ('Produk Lorem 40',125000,'Dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et.','{"#0072B2","#E69F00"}','{"Foto contoh produk 40, 1","Foto contoh produk 40, 2"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 41',140000,'Sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore.','{"#E69F00"}','{"Foto contoh produk 41, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 42',50000,'Amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna.','{"#009E73"}','{"Foto contoh produk 42, 1"}',true,true,null),
  ('Produk Lorem 43',65000,'Consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua.','{"#D55E00"}','{"Foto contoh produk 43, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 44',80000,'Adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem.','{"#CC79A7","#56B4E9"}','{"Foto contoh produk 44, 1","Foto contoh produk 44, 2"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 45',null,'Elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum.','{"#56B4E9"}','{"Foto contoh produk 45, 1"}',true,false,null),
  ('Produk Lorem 46',110000,'Sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor.','{"#4D4D4D"}','{"Foto contoh produk 46, 1"}',true,false,'https://shopee.co.id/'),
  ('Produk Lorem 47',125000,'Do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit.','{"#8C6D1F"}','{"Foto contoh produk 47, 1"}',true,false,'https://shopee.co.id/');

  insert into narasi(judul,isi,urutan) values
  ('Awal berdiri','Ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet.',1),
  ('Motivasi pendiri','Dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur.',2),
  ('Tentang batik ciprat','Sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing do incididunt et aliqua dolor consectetur sed tempor labore magna ipsum amet elit eiusmod ut dolore lorem sit adipiscing.',3);

  insert into pengaturan(kunci,nilai) values ('wa_pengelola','62800000099')
    on conflict (kunci) do update set nilai = excluded.nilai;
end $$;
