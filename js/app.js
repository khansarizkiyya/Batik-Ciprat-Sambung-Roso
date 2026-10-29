import { SUPABASE_URL as U, SUPABASE_ANON_KEY as K } from "./config.js";

const HERO = "";   // isi dengan "images/lokasi.webp" bila foto lokasi sudah ada
const $ = id => document.getElementById(id);
const el = (t, p, ...k) => { const e = document.createElement(t); Object.assign(e, p || {}); e.append(...k); return e; };
const rp = new Intl.NumberFormat("id-ID", {style:"currency", currency:"IDR", maximumFractionDigits:0});
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
let D = {artis:[], produk:[], narasi:[], struktur:[], set:{}};

/* ---------- data ---------- */
const get = async p => {
  const r = await fetch(`${U}/rest/v1/${p}`, {headers:{apikey:K}});
  if(!r.ok) throw new Error(r.status);
  return r.json();
};
async function muat(){
  try{
    if(U.includes("PROJECT_ID")) throw new Error("belum dikonfigurasi");
    const [artis, produk, narasi, struktur, set] = await Promise.all([
      get("artis_publik?select=*&order=urutan,id"),
      get("produk?select=*&tampil=eq.true&order=habis,id"),
      get("narasi?select=*&order=urutan,id"),
      get("struktur?select=*&order=tingkat,urutan,id"),
      get("pengaturan?select=*")]);
    D = {artis, produk, narasi, struktur, set:Object.fromEntries(set.map(r => [r.kunci, r.nilai]))};
  }catch(e){
    const s = await (await fetch("data/sample.json")).json();   // cadangan / mode contoh
    D = {artis:s.artis, produk:s.produk, narasi:s.narasi, struktur:s.struktur || [], set:s.pengaturan};
    $("catatan").textContent = "Menampilkan data contoh (Supabase belum tersambung atau sedang tidak bisa dijangkau).";
  }
}

/* ---------- util ---------- */
function warna(c, seed, lebar){
  if(!/^#[0-9a-f]{6}$/i.test(c || "")) c = "#777777";
  let d = "";
  for(let i = 0; i < 18; i++) d += `<circle cx="${((i+seed)*37%100)*(lebar?8:2)}" cy="${((i+seed)*53%100)*(lebar?4.5:1.5)}" r="${(lebar?10:3)+((i+seed)*7)%(lebar?40:9)}" fill="#fff" opacity="${lebar?.18:.75}"/>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lebar?800:200} ${lebar?450:150}"><rect width="100%" height="100%" fill="${c}"/>${d}</svg>`);
}
// foto: "#warna" (contoh), URL https (Supabase Storage), atau nama file di folder images/
const src = (f, seed = 0) => !f ? warna("#777777", seed) : f.startsWith("#") ? warna(f, seed) : /^https:\/\//.test(f) ? f : "images/" + encodeURIComponent(f);
const hargaTeks = p => Number.isFinite(p.harga) ? rp.format(p.harga) : "Hubungi kami untuk harga";
const mode = a => a.publikasi || "lengkap";
// Tautan marketplace hanya diterima jika berawalan https:// (mencegah tautan berbahaya seperti javascript:)
const linkToko = u => /^https:\/\/[^\s]+$/i.test((u || "").trim()) ? u.trim() : null;
function linkWA(pesan){
  const n = (D.set.wa_pengelola || "").trim();
  return /^62\d{8,13}$/.test(n) ? `https://wa.me/${n}?text=${encodeURIComponent(pesan)}` : null;
}

/* ---------- tampilan ---------- */
function kartu(p){
  const h = p.habis;
  const gbr = el("span", {className:"gbr"}, el("img", {src:src(p.foto?.[0], p.id), alt:p.alt?.[0] || p.nama, loading:"lazy"}));
  if(h) gbr.append(el("span", {className:"badge", textContent:"Habis"}));
  const b = el("button", {className:"kartu" + (h ? " habis" : ""), type:"button"}, gbr,
    el("span", {className:"ket"}, el("b", {textContent:p.nama}), hargaTeks(p)));
  b.onclick = () => bukaDetail(p);
  return el("li", {}, b);
}
function renderNarasi(){
  $("narasi").replaceChildren(...D.narasi.map(n => el("article", {}, el("h2", {textContent:n.judul}), el("p", {textContent:n.isi}))));
}
/* Struktur organisasi: satu pimpinan (tingkat 1) di atas, bagian-bagian (tingkat 2) di bawahnya.
   Foto memakai <img> beralt agar terbaca pembaca layar; tanpa foto = lingkaran kosong (disembunyikan). */
function simpul(s){
  const gbr = s.foto
    ? el("img", {className:"foto-bulat", src:src(s.foto, s.id), alt:s.alt_foto || "Foto " + (s.nama || s.jabatan), loading:"lazy"})
    : el("span", {className:"foto-bulat kosong"});
  if(!s.foto) gbr.setAttribute("aria-hidden", "true");
  return el("div", {className:"simpul"}, gbr, el("span", {className:"jabatan", textContent:s.jabatan}),
    ...(s.nama ? [el("span", {className:"sr", textContent:": "}), el("span", {className:"nama", textContent:s.nama})] : []));
}
function renderStruktur(){
  $("struktur").hidden = !D.struktur.length;
  if(!D.struktur.length) return;
  const atas = D.struktur.find(s => s.tingkat === 1), bawah = D.struktur.filter(s => s !== atas);
  $("org").replaceChildren(el("li", {className: atas ? "" : "tanpa-atas"}, ...(atas ? [simpul(atas)] : []),
    ...(bawah.length ? [el("ul", {role:"list"}, ...bawah.map(b => el("li", {}, simpul(b))))] : [])));
}
const tglLahir = s => { const d = new Date(s + "T00:00:00"); return isNaN(d) ? "" : new Intl.DateTimeFormat("id-ID", {day:"numeric", month:"long", year:"numeric"}).format(d); };
function renderHome(){
  $("artis-grid").replaceChildren(...D.artis.map(a => {
    const m = mode(a);
    const gbr = m === "lengkap" ? el("img", {src:src(a.foto, a.id), alt:"", loading:"lazy"}) : el("span", {className:"avatar"});
    if(m !== "lengkap") gbr.setAttribute("aria-hidden", "true");
    const b = el("button", {type:"button", className:"artis-kartu"}, gbr, el("b", {textContent: m === "anonim" ? "Memilih untuk anonim" : a.nama}));
    b.dataset.id = a.id;
    b.onclick = () => navigate("artis-" + a.id);
    return el("li", {}, b);
  }));
}
function tampilArtis(id){
  const a = D.artis.find(x => x.id === id), box = $("artis-panel"); box.replaceChildren();
  document.querySelectorAll(".artis-kartu").forEach(b => b.classList.toggle("terpilih", !!a && Number(b.dataset.id) === a.id));
  if(!a) return;
  const m = mode(a), sec = el("article", {className:"artis box", id:"artis-" + a.id});
  if(m === "lengkap") sec.append(el("img", {className:"profil-foto", src:src(a.foto, a.id), alt:a.alt_foto || "Foto " + a.nama, loading:"lazy"}));
  sec.append(el("h3", {id:"artis-" + a.id + "-h", className:"profil-nama", tabIndex:-1, textContent: m === "anonim" ? "Memilih untuk anonim" : a.nama}));
  if(m === "lengkap"){
    const baris = [["Nama panjang", a.nama_panjang], ["Kegemaran", a.kegemaran], ["Tanggal lahir", a.tanggal_lahir && tglLahir(a.tanggal_lahir)], ["Kondisi", a.kondisi]].filter(r => r[1]);
    if(baris.length) sec.append(el("dl", {className:"data-profil"}, ...baris.flatMap(([k, v]) => [el("dt", {textContent:k}), el("dd", {textContent:v})])));
  }
  box.append(sec);
}
function renderProduk(){ $("produk-list").replaceChildren(...D.produk.map(kartu)); }

function bukaDetail(p){
  const fs = (p.foto && p.foto.length) ? p.foto : [""];
  const track = $("d-track"); track.replaceChildren();
  fs.forEach((f, i) => track.append(el("img", {src:src(f, p.id + i), alt:p.alt?.[i] || `${p.nama}, foto ${i+1}`})));
  let idx = 0;
  const info = () => $("d-info").textContent = `Foto ${idx+1} dari ${fs.length}`;
  const go = n => { idx = (n + fs.length) % fs.length; track.scrollTo({left:idx * track.clientWidth, behavior:reduce ? "auto" : "smooth"}); info(); };
  $("d-ctl").hidden = fs.length < 2;
  $("d-prev").onclick = () => go(idx - 1);
  $("d-next").onclick = () => go(idx + 1);
  track.onscroll = () => { idx = Math.round(track.scrollLeft / track.clientWidth); info(); };
  info();
  $("d-judul").textContent = p.nama;
  $("d-harga").textContent = hargaTeks(p);
  $("d-desk").textContent = p.deskripsi || "";
  $("d-stok").hidden = !p.habis;
  const url = p.habis ? linkWA(`Halo, produk ${p.nama} sudah habis. Apakah ada karya serupa?`)
                      : linkWA(`Halo, saya tertarik memesan produk ${p.nama} (${hargaTeks(p)}). Apakah masih tersedia?`);
  const wa = $("d-wa");
  wa.hidden = !url;
  if(url){ wa.href = url; wa.className = "wa" + (p.habis ? " alt" : "");
    wa.textContent = p.habis ? "Tanya karya serupa lewat WhatsApp" : "Hubungi untuk pesan lewat WhatsApp"; }
  const sh = $("d-shopee"), us = p.habis ? null : linkToko(p.link_shopee);   // produk habis: tombol Shopee disembunyikan
  sh.hidden = !us;
  if(us){ sh.href = us; sh.textContent = "Pesan lewat Shopee"; }
  $("detail").showModal();
  track.scrollLeft = 0;
}
$("d-tutup").onclick = () => $("detail").close();

/* ---------- navigasi (token hash: #beranda, #artis, #produk, #artis-12) ---------- */
let cur = null;
function navigate(tok, push = true, awal = false){
  if(!/^(beranda|artis|produk|artis-\d+)$/.test(tok || "")) tok = "beranda";
  cur = tok;
  const p = tok === "produk", aktif = p ? "produk" : tok.startsWith("artis") ? "artis" : "beranda";
  $("v-home").hidden = p; $("v-produk").hidden = !p;
  ["beranda","artis","produk"].forEach(k => k === aktif ? $("n-" + k).setAttribute("aria-current","page") : $("n-" + k).removeAttribute("aria-current"));
  document.title = (p ? "Semua Produk | " : "") + "Batik Ciprat Langitan";
  if(push){ try{ if(location.hash !== "#" + tok) location.hash = tok; }catch(e){} }
  if(awal && tok === "beranda") return;
  if(tok.startsWith("artis-")) tampilArtis(Number(tok.slice(6)));
  const t = p ? $("h-produk") : tok === "beranda" ? $("h1") : tok === "artis" ? $("h-artis") : ($("artis-" + tok.slice(6) + "-h") || $("h-artis"));
  if(tok === "beranda" || p) window.scrollTo(0, 0); else (tok.startsWith("artis-") && $("artis-" + tok.slice(6)) || t).scrollIntoView({behavior:reduce ? "auto" : "smooth", block:"start"});
  t.focus({preventScroll:true});
}
document.querySelectorAll("[data-t]").forEach(a => a.addEventListener("click", e => { e.preventDefault(); navigate(a.dataset.t); }));
addEventListener("hashchange", () => { const t = location.hash.slice(1); if(t && t !== cur) navigate(t, false); });

/* ---------- mulai ---------- */
document.documentElement.style.setProperty("--herobg", HERO ? `url("${HERO}")` : `url("${warna("#3b2a1c", 5, true)}")`);
await muat();
renderStruktur(); renderNarasi(); renderHome(); renderProduk();
navigate(location.hash.slice(1) || "beranda", false, true);
