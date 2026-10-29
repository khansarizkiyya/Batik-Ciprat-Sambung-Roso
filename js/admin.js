import { SUPABASE_URL as U, SUPABASE_ANON_KEY as K } from "./config.js";

const db = supabase.createClient(U, K);
const $ = id => document.getElementById(id);
const el = (t, p, ...k) => { const e = document.createElement(t); Object.assign(e, p || {}); e.append(...k); return e; };
const tombol = (teks, fn) => el("button", {type:"button", className:"btn alt", textContent:teks, onclick:fn});
let view = "produk";

/* ---------- pengaturan tampilan admin ---------- */
const JUDUL = {produk:"Kelola produk", artis:"Kelola profil artis", struktur:"Kelola struktur organisasi", narasi:"Kelola narasi", pengaturan:"Pengaturan"};
const LABEL = {produk:"produk", artis:"artis", struktur:"jabatan", narasi:"narasi"};
const URUT = {produk:[["id", false]], artis:[["urutan"], ["id"]], struktur:[["tingkat"], ["urutan"], ["id"]], narasi:[["urutan"], ["id"]]};
const KONDISI = ["Disabilitas fisik", "Disabilitas sensorik", "Disabilitas intelektual", "Disabilitas mental", "Memilih untuk tidak memberi tahu"];
const PIL = {                                    // pilihan untuk kolom bertipe "pilih salah satu": [nilai, teks]
  kondisi: [["", "(belum dipilih)"], ...KONDISI.map(k => [k, k])],
  publikasi: ["lengkap", "nama", "anonim"].map(o => [o, o]),
  tingkat: [["1", "Pimpinan (paling atas)"], ["2", "Bagian (di bawah pimpinan)"]]
};
const opsi = (pasang, nilai) => pasang.map(([v, t]) => el("option", {value:v, textContent:t, selected:String(nilai ?? "") === v}));
const namaBaris = r => r.jabatan || r.judul || r.nama || String(r.id);   // nama baris untuk pembaca layar & konfirmasi hapus
const galat = e => e?.code === "23505" && /struktur/.test(e.message || "")
  ? "Hanya boleh ada satu pimpinan. Ubah dulu pimpinan yang sekarang menjadi Bagian."
  : (e?.message || String(e));

const info = (t, bad) => { $("msg").textContent = t; $("msg").className = bad ? "err" : ""; };
function tampilLogin(t){ $("login").hidden = false; $("panel").hidden = true; $("adm-nav").hidden = true; $("msg-login").textContent = t || ""; }

/* ---------- masuk / keluar ---------- */
async function mulai(){
  const galatLogin = new URLSearchParams(location.hash.slice(1) || location.search.slice(1)).get("error_description");
  const { data:{ session } } = await db.auth.getSession();
  const { data:ok } = await db.rpc("is_admin");        // dicek di database, bukan di browser
  if(!ok){ await db.auth.signOut(); return tampilLogin("Akun ini belum terdaftar sebagai pengelola."); }
  $("login").hidden = true; $("panel").hidden = false; $("adm-nav").hidden = false;
  buka(view);
}
$("f-login").onsubmit = async e => {
  e.preventDefault();
  const { error } = await db.auth.signInWithPassword({email:$("email").value.trim(), password:$("sandi").value});
  if(error) return tampilLogin("Email atau kata sandi salah.");
  $("sandi").value = ""; mulai();
};
$("keluar").onclick = async () => { await db.auth.signOut(); tampilLogin(); };

$("lihat-sandi").onchange = e => { $("sandi").type = e.target.checked ? "text" : "password"; };
document.querySelectorAll("[data-v]").forEach(b => b.onclick = () => buka(b.dataset.v));
$("tambah").onclick = () => dialog(view, null);

/* ---------- daftar ---------- */
const baca = tbl => URUT[tbl].reduce((q, [kol, naik = true]) => q.order(kol, {ascending:naik}), db.from(tbl).select("*"));
async function buka(v){
  view = v; info("Memuat…");
  document.querySelectorAll("[data-v]").forEach(b => b.setAttribute("aria-current", b.dataset.v === v ? "page" : "false"));
  $("adm-h").textContent = JUDUL[v];
  $("tambah").hidden = v === "pengaturan";
  if(v === "pengaturan") formSet((await db.from("pengaturan").select("*")).data || []);
  else {
    const { data, error } = await baca(v);
    if(error){ $("tbl").replaceChildren(); return info("Gagal memuat data: " + error.message, true); }
    ({produk:tabelProduk, artis:tabelArtis, struktur:tabelStruktur, narasi:tabelNarasi})[v](data || []);
  }
  info(""); $("adm-h").focus();
}
async function simpan(tbl, id, patch){
  const { error } = await db.from(tbl).update(patch).eq("id", id);
  info(error ? "Gagal menyimpan: " + galat(error) : "Tersimpan.", !!error);
  return !error;
}
function kotak(tbl, row, kol){                           // kotak centang: satu klik langsung tersimpan
  const c = el("input", {type:"checkbox", checked:!!row[kol]});
  c.setAttribute("aria-label", `${kol}: ${namaBaris(row)}`);
  c.onchange = async () => { if(await simpan(tbl, row.id, {[kol]:c.checked})) row[kol] = c.checked; else c.checked = !c.checked; };
  return c;
}
// Kolom yang diisi langsung di tabel: berubah = tersimpan otomatis; gagal = kembali ke nilai semula.
// "ambil" boleh mengembalikan undefined untuk menolak nilai (mis. kolom wajib dikosongkan).
function sel(tbl, row, kol, node, ambil = x => x.value.trim() || null){
  node.setAttribute("aria-label", `${kol.replace(/_/g, " ")} ${namaBaris(row)}`);
  node.onchange = async () => {
    const v = ambil(node);
    if(v === undefined){ node.value = row[kol] ?? ""; return info("Kolom ini tidak boleh kosong.", true); }
    if(await simpan(tbl, row.id, {[kol]:v})) row[kol] = v; else node.value = row[kol] ?? "";
  };
  return el("td", {}, node);
}
const kepala = xs => el("thead", {}, el("tr", {}, ...xs.map(x => el("th", {scope:"col", textContent:x}))));
const ringkas = (t, n = 90) => t.length > n ? t.slice(0, n).trimEnd() + "…" : t;

function tabelProduk(rows){
  $("tbl").className = "";
  $("tbl").replaceChildren(kepala(["Produk","Harga (Rp)","Tautan Shopee","Tampil","Habis","Aksi"]), el("tbody", {}, ...rows.map(p => {
    const hg = el("input", {type:"number", min:0, value:p.harga ?? ""});
    hg.setAttribute("aria-label", "Harga " + p.nama);
    hg.onchange = async () => {
      const v = hg.value === "" ? null : Number(hg.value);
      if(v !== null && (!Number.isInteger(v) || v < 0)){ hg.value = p.harga ?? ""; return info("Harga harus bilangan bulat 0 atau lebih.", true); }
      if(await simpan("produk", p.id, {harga:v})) p.harga = v; else hg.value = p.harga ?? "";
    };
    return el("tr", {}, el("td", {textContent:p.nama}), el("td", {}, hg),
      el("td", {textContent:p.link_shopee ? "Ada" : "Belum ada"}),
      el("td", {}, kotak("produk", p, "tampil")), el("td", {}, kotak("produk", p, "habis")),
      el("td", {}, tombol("Ubah", () => dialog("produk", p)), tombol("Hapus", () => hapus("produk", p))));
  })));
}
function tabelArtis(rows){
  $("tbl").className = "tbl-edit";
  $("tbl").replaceChildren(kepala(["Nama","Nama panjang","Kegemaran","Tanggal lahir","Kondisi","Publikasi","Aksi"]), el("tbody", {}, ...rows.map(a =>
    el("tr", {}, el("td", {textContent:a.nama || "(kosong)"}),
      sel("artis", a, "nama_panjang", el("input", {type:"text", value:a.nama_panjang || ""})),
      sel("artis", a, "kegemaran", el("input", {type:"text", value:a.kegemaran || ""})),
      sel("artis", a, "tanggal_lahir", el("input", {type:"date", value:a.tanggal_lahir || ""})),
      sel("artis", a, "kondisi", el("select", {}, ...opsi(PIL.kondisi, a.kondisi))),
      sel("artis", a, "publikasi", el("select", {}, ...opsi(PIL.publikasi, a.publikasi || "lengkap")), x => x.value),
      el("td", {}, tombol("Ubah", () => dialog("artis", a)), tombol("Hapus", () => hapus("artis", a)))))));
}
function tabelStruktur(rows){
  $("tbl").className = "tbl-edit";
  $("tbl").replaceChildren(kepala(["Jabatan","Nama","Posisi","Urutan","Foto","Aksi"]), el("tbody", {}, ...rows.map(r =>
    el("tr", {}, el("td", {textContent:r.jabatan}),
      sel("struktur", r, "nama", el("input", {type:"text", value:r.nama || ""})),
      sel("struktur", r, "tingkat", el("select", {}, ...opsi(PIL.tingkat, r.tingkat)), x => Number(x.value)),
      sel("struktur", r, "urutan", el("input", {type:"number", value:r.urutan ?? 0}), x => Number(x.value) || 0),
      el("td", {textContent:r.foto ? "Ada" : "Belum ada"}),
      el("td", {}, tombol("Ubah", () => dialog("struktur", r)), tombol("Hapus", () => hapus("struktur", r)))))));
}
function tabelNarasi(rows){
  $("tbl").className = "tbl-edit";
  $("tbl").replaceChildren(kepala(["Judul","Isi","Urutan","Aksi"]), el("tbody", {}, ...rows.map(n =>
    el("tr", {},
      sel("narasi", n, "judul", el("input", {type:"text", value:n.judul || ""}), x => x.value.trim() || undefined),
      el("td", {className:"ringkas", textContent:ringkas(n.isi || "")}),
      sel("narasi", n, "urutan", el("input", {type:"number", value:n.urutan ?? 0}), x => Number(x.value) || 0),
      el("td", {}, tombol("Ubah", () => dialog("narasi", n)), tombol("Hapus", () => hapus("narasi", n)))))));
}
function formSet(rows){
  $("tbl").className = "";
  const i = el("input", {type:"text", id:"wa", inputMode:"numeric", value:rows.find(r => r.kunci === "wa_pengelola")?.nilai || ""});
  const b = tombol("Simpan nomor", async () => {
    const v = i.value.trim();
    if(!/^62\d{8,13}$/.test(v)) return info("Nomor harus berformat 62…, tanpa 0 di depan atau tanda plus.", true);
    const { error } = await db.from("pengaturan").upsert({kunci:"wa_pengelola", nilai:v});
    info(error ? "Gagal: " + error.message : "Tersimpan.", !!error);
  });
  $("tbl").replaceChildren(el("tbody", {}, el("tr", {}, el("th", {scope:"row"}, el("label", {htmlFor:"wa", textContent:"Nomor WhatsApp pengelola (semua pesanan)"})), el("td", {}, i), el("td", {}, b))));
}
async function hapus(tbl, row){
  if(!confirm(`Hapus "${namaBaris(row)}"? Tindakan ini tidak bisa dibatalkan.`)) return;
  const { error } = await db.from(tbl).delete().eq("id", row.id);
  if(error) return info("Gagal menghapus: " + galat(error), true);
  await buka(view); info("Terhapus.");
}

/* ---------- foto: kecilkan dulu ke WebP, lalu unggah ---------- */
async function unggah(file){
  if(!file.type.startsWith("image/") || file.size > 15e6) throw new Error("Berkas harus berupa gambar di bawah 15 MB.");
  const bmp = await createImageBitmap(file), s = Math.min(1, 800 / bmp.width);
  const c = el("canvas", {width:Math.round(bmp.width * s), height:Math.round(bmp.height * s)});
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  const blob = await new Promise(ok => c.toBlob(ok, "image/webp", .8));
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const { error } = await db.storage.from("foto").upload(path, blob, {contentType:"image/webp"});
  if(error) throw error;
  return db.storage.from("foto").getPublicUrl(path).data.publicUrl;
}

/* ---------- formulir tambah / ubah ---------- */
function dialog(tbl, row){
  const r = row || {}, f = $("f-edit"), x = {};
  f.replaceChildren(el("h2", {textContent:(row ? "Ubah " : "Tambah ") + LABEL[tbl]}));
  const F = (id, label, node) => { x[id] = node; node.id = "f-" + id; f.append(el("p", {}, el("label", {htmlFor:"f-" + id, textContent:label}), node)); return node; };
  const teks = (id, label, nilai, wajib) => F(id, label, el("input", {type:"text", required:!!wajib, value:nilai || ""}));
  const angka = (id, label, nilai) => F(id, label, el("input", {type:"number", value:nilai ?? 0}));
  const pilih = (id, label, pasang, nilai) => F(id, label, el("select", {}, ...opsi(pasang, nilai)));
  const fotoSatu = () => {                         // satu foto + deskripsinya (artis dan struktur)
    F("fotoA", "Foto" + (r.foto ? " (sudah ada, pilih lagi untuk mengganti)" : ""), el("input", {type:"file", accept:"image/*"}));
    teks("alt_foto", "Deskripsi foto untuk pembaca layar", r.alt_foto);
  };

  if(tbl === "produk"){
    teks("nama", "Nama", r.nama, true);
    F("harga", "Harga (Rp), kosongkan jika tanpa harga", el("input", {type:"number", min:0, value:r.harga ?? ""}));
    F("deskripsi", "Deskripsi", el("textarea", {rows:3, value:r.deskripsi || ""}));
    F("link_shopee", "Tautan produk di Shopee (opsional; salin dari Shopee, harus berawalan https://). Kosongkan jika tidak dijual di Shopee.", el("input", {type:"text", inputMode:"url", autocomplete:"off", placeholder:"https://shopee.co.id/...", value:r.link_shopee || ""}));
    for(let i = 0; i < 3; i++){
      F("foto" + i, `Foto ${i+1}` + (r.foto?.[i] ? " (sudah ada, pilih lagi untuk mengganti)" : i ? " (opsional)" : ""), el("input", {type:"file", accept:"image/*"}));
      teks("alt" + i, `Deskripsi foto ${i+1} untuk pembaca layar`, r.alt?.[i]);
    }
    F("tampil", "Tampil di web", el("input", {type:"checkbox", checked:r.tampil ?? true}));
    F("habis", "Habis / terjual", el("input", {type:"checkbox", checked:!!r.habis}));
  } else if(tbl === "artis"){
    teks("nama", "Nama", r.nama, true);
    teks("nama_panjang", "Nama panjang", r.nama_panjang);
    teks("kegemaran", "Kegemaran", r.kegemaran);
    F("tanggal_lahir", "Tanggal lahir", el("input", {type:"date", value:r.tanggal_lahir || ""}));
    pilih("kondisi", "Kondisi (pilih salah satu)", PIL.kondisi, r.kondisi);
    fotoSatu();
    pilih("publikasi", "Publikasi (lengkap = semua data tampil; nama = hanya nama; anonim = tidak ada yang tampil)", PIL.publikasi, r.publikasi || "lengkap");
    angka("urutan", "Urutan tampil", r.urutan);
  } else if(tbl === "struktur"){
    teks("jabatan", "Jabatan", r.jabatan, true);
    teks("nama", "Nama", r.nama);
    fotoSatu();
    pilih("tingkat", "Posisi dalam bagan (pimpinan hanya boleh satu)", PIL.tingkat, r.tingkat ?? 2);
    angka("urutan", "Urutan tampil (dari kiri ke kanan)", r.urutan);
  } else {
    teks("judul", "Judul", r.judul, true);
    F("isi", "Isi narasi (baris baru ikut tampil di web)", el("textarea", {rows:8, required:true, value:r.isi || ""}));
    angka("urutan", "Urutan tampil", r.urutan);
  }

  const pesan = el("p", {className:"err", role:"alert"});
  const simp = el("button", {type:"submit", className:"btn", textContent:"Simpan"});
  f.append(pesan, el("p", {className:"bar"}, simp, tombol("Batal", () => $("dlg").close())));

  f.onsubmit = async e => {
    e.preventDefault(); simp.disabled = true; pesan.textContent = "Menyimpan…";
    try{
      const v = k => x[k].value.trim();
      let data;
      if(tbl === "produk"){
        const foto = [], alt = [];
        for(let i = 0; i < 3; i++){
          let u = r.foto?.[i] || "";
          if(x["foto" + i].files[0]) u = await unggah(x["foto" + i].files[0]);
          if(u){ foto.push(u); alt.push(v("alt" + i)); }
        }
        const harga = v("harga") === "" ? null : Number(v("harga"));
        if(harga !== null && (!Number.isInteger(harga) || harga < 0)) throw new Error("Harga harus bilangan bulat 0 atau lebih.");
        const shopee = v("link_shopee");
        if(shopee && !/^https:\/\/[^\s]+$/i.test(shopee)) throw new Error("Tautan Shopee harus diawali https:// dan tidak boleh berisi spasi.");
        data = {nama:v("nama"), harga, deskripsi:v("deskripsi"), link_shopee:shopee || null, foto, alt, tampil:x.tampil.checked, habis:x.habis.checked};
        if(!data.nama) throw new Error("Nama wajib diisi.");
      } else if(tbl === "artis"){
        let u = r.foto || "";
        if(x.fotoA.files[0]) u = await unggah(x.fotoA.files[0]);
        data = {nama:v("nama"), nama_panjang:v("nama_panjang") || null, kegemaran:v("kegemaran") || null, tanggal_lahir:v("tanggal_lahir") || null, kondisi:v("kondisi") || null, foto:u, alt_foto:v("alt_foto"), publikasi:v("publikasi"), urutan:Number(v("urutan")) || 0};
        if(!data.nama) throw new Error("Nama wajib diisi.");
      } else if(tbl === "struktur"){
        let u = r.foto || "";
        if(x.fotoA.files[0]) u = await unggah(x.fotoA.files[0]);
        data = {jabatan:v("jabatan"), nama:v("nama") || null, foto:u || null, alt_foto:v("alt_foto") || null, tingkat:Number(v("tingkat")), urutan:Number(v("urutan")) || 0};
        if(!data.jabatan) throw new Error("Jabatan wajib diisi.");
      } else {
        data = {judul:v("judul"), isi:v("isi"), urutan:Number(v("urutan")) || 0};
        if(!data.judul || !data.isi) throw new Error("Judul dan isi wajib diisi.");
      }
      if(row){ const { error } = await db.from(tbl).update(data).eq("id", row.id); if(error) throw error; }
      else { const { error } = await db.from(tbl).insert(data); if(error) throw error; }
      $("dlg").close(); await buka(view); info("Tersimpan.");
    }catch(err){ pesan.textContent = "Gagal: " + galat(err); }
    finally{ simp.disabled = false; }
  };
  $("dlg").showModal();
}

mulai();
