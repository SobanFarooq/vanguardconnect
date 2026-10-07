let list = getLS("announcements", null);
if (!list) { list = [{ id: 1, title: "Training Exercise", type: "Official", rank: "General", content: "Annual exercise begins Monday.", pinned: true, authorId: 2 }]; setLS("announcements", list); }
const lvl = currentUser.rankLevel;
let filter = "All";

// Rank rules: 7+ = official/emergency/pin, 5-6 = unit announcements only, below 5 = read only
const canCreate = lvl >= 5, canPin = lvl >= 7;
const typeOptions = lvl >= 7 ? ["Official", "Emergency", "Friendly Alert"] : ["Unit"];

const typeSel = document.getElementById("a_type");
typeSel.innerHTML = typeOptions.map(t => `<option>${t}</option>`).join("");
if (!canCreate) document.getElementById("createBox").innerHTML = '<p class="small text-muted mb-0">Only Captain rank and above can post announcements.</p>';

function save() { setLS("announcements", list); render(); }
function pin(id) { const a = list.find(x => x.id === id); a.pinned = !a.pinned; save(); }
function del(id) { list = list.filter(x => x.id !== id); save(); }

function render() {
  const shown = list.filter(a => filter === "All" || (filter === "Pinned" ? a.pinned : a.type === filter))
    .sort((a, b) => b.pinned - a.pinned || b.id - a.id);
  document.getElementById("annList").innerHTML = shown.map(a => `
    <div class="v-card ann ${a.pinned ? "pinned" : ""} ${a.type === "Emergency" ? "emergency" : ""}">
      <div class="d-flex align-items-center gap-2 mb-1"><span class="rank-chip ${a.type === "Emergency" ? "high" : ""}">${esc(a.type)}</span>
        ${a.pinned ? "📌" : ""}<span class="small text-muted ms-auto">by ${esc(a.rank)}</span></div>
      <div class="fw-bold">${esc(a.title)}</div><p class="mb-2">${esc(a.content)}</p>
      <div>${canPin ? `<button class="btn btn-soft btn-sm" onclick="pin(${a.id})">${a.pinned ? "Unpin" : "Pin"}</button>` : ""}
      ${(canPin || a.authorId === currentUser.id) ? `<button class="btn btn-soft btn-sm" onclick="del(${a.id})">Delete</button>` : ""}</div>
    </div>`).join("") || '<p class="text-muted text-center">Nothing here.</p>';
}
document.querySelectorAll(".filter-row .btn").forEach(b => b.addEventListener("click", () => {
  document.querySelectorAll(".filter-row .btn").forEach(x => x.classList.remove("active"));
  b.classList.add("active"); filter = b.dataset.f; render();
}));
const form = document.getElementById("annForm");
if (form) form.addEventListener("submit", e => {
  e.preventDefault();
  list.push({ id: Date.now(), title: a_title.value.trim(), type: typeSel.value, rank: currentUser.rank, content: a_content.value.trim(), pinned: false, authorId: currentUser.id });
  form.reset(); save();
});
render();
