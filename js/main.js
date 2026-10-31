const wizard = document.getElementById("wizard");
const steps = [...document.querySelectorAll(".step")];
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const stepName = document.getElementById("stepName");
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
  spawnPetals(8);
  setTimeout(() => incoming.classList.remove("back"), 400);
}

function render() {
  const isFirst = current === 0;
  const isLast = current === total - 1;
  stepName.textContent = steps[current].dataset.title || "";
  prevBtn.disabled = isFirst;
  nextBtn.textContent = isLast ? "फिर से" : steps[current].dataset.next || "आगे";
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
document.addEventListener("touchstart", (event) => {
  touchX = event.changedTouches[0].screenX;
  touchY = event.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener("touchend", (event) => {
  if (touchX === null) return;
  const dx = event.changedTouches[0].screenX - touchX;
  const dy = event.changedTouches[0].screenY - touchY;
  touchX = null;
  touchY = null;
  if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy)) return;
  if (dx < 0) go(current + 1);
  else go(current - 1, true);
}, { passive: true });

const PETAL_KINDS = ["rose", "gold", "leaf", "marigold"];

function spawnOne(delay = 0) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const petal = document.createElement("span");
  petal.className = `petal ${PETAL_KINDS[Math.floor(Math.random() * PETAL_KINDS.length)]}`;
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.animationDuration = `${7 + Math.random() * 6}s`;
  petal.style.animationDelay = `${delay}s`;
  petal.style.setProperty("--drift", `${Math.random() * 80 - 40}px`);
  petal.style.setProperty("--spin", `${180 + Math.random() * 280}deg`);
  petals.appendChild(petal);
  setTimeout(() => petal.remove(), 14000);
}

function spawnPetals(count = 10) {
  for (let i = 0; i < count; i += 1) spawnOne(Math.random() * 1.6);
}

spawnPetals(12);
setInterval(() => spawnOne(0), 700);
render();
