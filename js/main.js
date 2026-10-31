const WEDDING_AT = new Date("2026-11-20T12:15:00+05:30").getTime();

const wizard = document.getElementById("wizard");
const steps = [...document.querySelectorAll(".step")];
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const stepCount = document.getElementById("stepCount");
const stepName = document.getElementById("stepName");
const progressBar = document.getElementById("progressBar");
const dotsWrap = document.getElementById("dots");
const petals = document.getElementById("petals");
const total = steps.length;

let current = 0;

dotsWrap.innerHTML = steps
  .map((_, i) => `<button class="dot" type="button" aria-label="पृष्ठ ${i + 1}"></button>`)
  .join("");

const dots = [...dotsWrap.querySelectorAll(".dot")];

function go(index, fromBack = false) {
  if (index < 0 || index >= total || index === current) return;

  const outgoing = steps[current];
  const incoming = steps[index];
  outgoing.classList.remove("active");
  incoming.classList.toggle("back", fromBack);
  incoming.classList.add("active");

  current = index;
  render();
  incoming.scrollTop = 0;
  spawnPetals(10);
  setTimeout(() => incoming.classList.remove("back"), 380);
}

function render() {
  const isCover = current === 0;
  const isLast = current === total - 1;
  wizard.classList.toggle("cover-mode", isCover);
  stepCount.textContent = `${current + 1} / ${total}`;
  stepName.textContent = steps[current].dataset.title || "";
  progressBar.style.width = `${((current + 1) / total) * 100}%`;
  prevBtn.disabled = isCover;
  nextBtn.textContent = isLast
    ? "फिर से देखें"
    : steps[current].dataset.next || "आगे";
  dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
}

prevBtn.addEventListener("click", () => go(current - 1, true));
nextBtn.addEventListener("click", () => {
  if (current === total - 1) go(0, true);
  else go(current + 1);
});
dots.forEach((dot, i) => dot.addEventListener("click", () => go(i, i < current)));

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") go(current + 1);
  if (event.key === "ArrowLeft") go(current - 1, true);
});

let touchX = null;
let touchY = null;
document.addEventListener(
  "touchstart",
  (event) => {
    touchX = event.changedTouches[0].screenX;
    touchY = event.changedTouches[0].screenY;
  },
  { passive: true }
);

document.addEventListener(
  "touchend",
  (event) => {
    if (touchX === null) return;
    const dx = event.changedTouches[0].screenX - touchX;
    const dy = event.changedTouches[0].screenY - touchY;
    touchX = null;
    touchY = null;
    if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) go(current + 1);
    else go(current - 1, true);
  },
  { passive: true }
);

function pad(value) {
  return String(value).padStart(2, "0");
}

function tick() {
  let diff = Math.max(0, WEDDING_AT - Date.now());
  const days = Math.floor(diff / 86400000);
  diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000);
  diff -= hours * 3600000;
  const mins = Math.floor(diff / 60000);
  diff -= mins * 60000;
  const secs = Math.floor(diff / 1000);
  document.getElementById("d").textContent = pad(days);
  document.getElementById("h").textContent = pad(hours);
  document.getElementById("m").textContent = pad(mins);
  document.getElementById("s").textContent = pad(secs);
}

tick();
setInterval(tick, 1000);
render();

const PETAL_KINDS = ["rose", "gold", "leaf", "marigold"];

function spawnOne(delay = 0) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const petal = document.createElement("span");
  const kind = PETAL_KINDS[Math.floor(Math.random() * PETAL_KINDS.length)];
  petal.className = `petal ${kind}`;
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.animationDuration = `${7 + Math.random() * 6}s`;
  petal.style.animationDelay = `${delay}s`;
  petal.style.setProperty("--drift", `${Math.random() * 80 - 40}px`);
  petal.style.setProperty("--spin", `${180 + Math.random() * 280}deg`);
  petal.style.width = `${10 + Math.random() * 10}px`;
  petals.appendChild(petal);
  setTimeout(() => petal.remove(), 14000);
}

function spawnPetals(count = 12) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < count; i += 1) spawnOne(Math.random() * 1.8);
}

spawnPetals(14);
setInterval(() => spawnOne(0), 650);
