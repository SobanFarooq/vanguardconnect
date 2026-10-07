const BADGES = ["Leadership Excellence","Outstanding Service","Training Expert","Community Contributor","Team Builder"];
let users = getLS("users", []);
const myId = currentUser.id;
const meU = () => users.find(u => u.id === myId);

function renderProfile() {
  const u = meU();
  const posts = getLS("posts", []).filter(p => p.userId === myId);
  const ach = posts.filter(p => p.category === "Achievement");
  const got = getLS("ratings", []).filter(r => r.toUser === myId);
  const count = n => got.filter(r => r.rating === n).length;
  const friends = users.filter(x => u.friends.includes(x.id));
  const badges = BADGES.slice(0, Math.min(5, Math.ceil(u.rankLevel / 2)));

  document.getElementById("profileBox").innerHTML = `
    <div class="v-card mb-3"><div class="profile-cover"></div>
      <div class="p-3 pt-0">
        <div class="d-flex align-items-end justify-content-between">
          <div class="avatar profile-avatar">${initials(u.name)}</div>
          <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editModal">Edit profile</button>
        </div>
        <h2 class="h4 mt-2 mb-1">${esc(u.name)} <span class="rank-chip high">${esc(u.rank)}</span></h2>
        <div class="text-muted small">${esc(u.branch)} · ${esc(u.unit)} · ${u.years ?? "—"} years of service</div>
        <div class="mt-3">${badges.map(b => `<span class="badge-pill">🎖️ ${b}</span>`).join("")}</div>
      </div></div>
    <div class="v-card p-3 mb-3 d-flex">
      <div class="stat"><b data-count="${posts.length}">0</b><span class="small text-muted">Posts</span></div>
      <div class="stat"><b data-count="${friends.length}">0</b><span class="small text-muted">Friends</span></div>
      <div class="stat"><b>😑 <span data-count="${count(1)}">0</span></b><span class="small text-muted">Rated</span></div>
      <div class="stat"><b>👍 <span data-count="${count(2)}">0</span></b><span class="small text-muted">Rated</span></div>
      <div class="stat"><b>🛡️ <span data-count="${count(3)}">0</span></b><span class="small text-muted">Rated</span></div>
    </div>
    <div class="row g-3">
      <div class="col-md-6"><div class="v-card p-3"><p class="section-title">Achievements</p>
        ${ach.map(p => `<div class="py-1">🏅 ${esc(p.content)}</div>`).join("") || '<span class="text-muted small">No achievements posted yet.</span>'}</div></div>
      <div class="col-md-6"><div class="v-card p-3"><p class="section-title">Friends</p>
        ${friends.map(f => `<div class="person"><div class="avatar">${initials(f.name)}</div><div><div class="fw-semibold">${esc(f.name)}</div><div class="small text-muted">${esc(f.rank)}</div></div></div>`).join("") || '<span class="text-muted small">No friends yet.</span>'}</div></div>
    </div>`;
  ["name", "branch", "unit", "years"].forEach(k => document.getElementById("e_" + k).value = u[k] ?? "");
  runCountUp();
}

document.getElementById("editForm").addEventListener("submit", e => {
  e.preventDefault();
  const u = meU();
  u.name = e_name.value.trim() || u.name;
  u.branch = e_branch.value.trim() || u.branch;
  u.unit = e_unit.value.trim() || u.unit;
  u.years = e_years.value;
  setLS("users", users); setLS("currentUser", u);
  bootstrap.Modal.getOrCreateInstance(document.getElementById("editModal")).hide();
  renderProfile();
});
renderProfile();
