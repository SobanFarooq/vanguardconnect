// Shared by all pages: login guard, theme toggle, logout
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) window.location.href = "index.html";

// Theme (remembered between visits)
document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "light");
function toggleTheme() {
  const root = document.documentElement;
  root.classList.add("theme-fade");          // turns on the fade
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  setTimeout(() => root.classList.remove("theme-fade"), 1650);
}
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}
function initials(name) { return name.split(" ").map(w => w[0]).join("").slice(0, 2); }
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".v-nav");
  if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

function runCountUp() {
  document.querySelectorAll("[data-count]").forEach(el => {
    const target = +el.dataset.count, start = performance.now(), dur = 900;
    function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));  // eases out
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}
