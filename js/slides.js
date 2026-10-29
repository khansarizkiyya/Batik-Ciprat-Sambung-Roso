const imgs = [...document.querySelectorAll("#hero-bg img")];
const tombol = document.getElementById("s-jeda");
let i = 0, timer = null, jeda = matchMedia("(prefers-reduced-motion: reduce)").matches;
function tampil(n){ i = (n + imgs.length) % imgs.length; imgs.forEach((g, k) => g.classList.toggle("aktif", k === i)); }
function atur(){
  clearInterval(timer);
  if(!jeda && imgs.length > 1) timer = setInterval(() => tampil(i + 1), 6000);
  tombol.textContent = jeda ? "Putar foto latar" : "Jeda foto latar";
}
tombol.hidden = imgs.length < 2;
tombol.onclick = () => { jeda = !jeda; atur(); };
atur();
