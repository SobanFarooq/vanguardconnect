// Home feed: posting, delete, like/dislike, share, pin, filters, rank-based sorting
// Replaces the old feed.js completely. Needs app.js (currentUser, initials) loaded first.

const CATS = ["Friendly Alert", "Achievement", "Announcement", "Training", "Team Activity", "General Post", "Discussion", "Moments"];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const getLS = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
const setLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const toast = m => (typeof showToast === "function" ? showToast(m) : alert(m));

let users = getLS("users", []);
let posts = getLS("posts", []);
const meId = currentUser.id;
const me = () => users.find(u => u.id === meId) || currentUser;
const byId = id => users.find(u => u.id === id);
let filter = "All";

// Demo data may be missing timestamps / votes, so fill them in once
users.forEach(u => { if (!u.lastLoginTs) u.lastLoginTs = Date.now() - u.id * 3600000; });
posts.forEach(p => {
  if (!p.timestamp) p.timestamp = Date.now() - p.id * 3600000;
  if (!p.votes) p.votes = {};
  if (!p.visibility) p.visibility = "Everyone";
});
function save() { setLS("users", users); setLS("posts", posts); }
save();

function timeAgo(ts) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
}

// Feed score = (rankLevel * 10) + engagement. Pinned first, ties go to most recent login.
const score = p => byId(p.userId).rankLevel * 10 + (p.likes - p.dislikes);
const visible = p => p.userId === meId || p.visibility === "Everyone" || me().friends.includes(p.userId);

function render() {
  const feed = document.getElementById("feed");
  const list = posts
      .filter(p => byId(p.userId) && visible(p) && (filter === "All" || p.category === filter))
      .sort((a, b) =>
          (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) ||
          score(b) - score(a) ||
          byId(b.userId).lastLoginTs - byId(a.userId).lastLoginTs ||
          b.timestamp - a.timestamp);

  const canPin = me().rankLevel >= 7;
  feed.innerHTML = list.map(p => {
    const u = byId(p.userId);
    const mine = p.votes[meId] || 0;
    return `
      <article class="v-card post">
        <div class="d-flex align-items-center gap-2">
          <div class="avatar">${initials(u.name)}</div>
          <div class="flex-grow-1">
            <div class="fw-bold">${esc(u.name)} <span class="rank-chip ${u.rankLevel >= 7 ? "high" : ""}">${esc(u.rank)}</span></div>
            <div class="small text-muted">${esc(u.unit)} · ${timeAgo(p.timestamp)} · Last login ${timeAgo(u.lastLoginTs)}</div>
          </div>
          <span class="cat-tag">${p.pinned ? "📌 " : ""}${esc(p.category)}</span>
        </div>
        ${p.sharedFrom ? `<div class="small text-muted mt-2">↻ Shared from ${esc(p.sharedFrom)}</div>` : ""}
        <p class="post-text">${esc(p.content)}</p>
        <div class="d-flex align-items-center gap-1 flex-wrap">
          <div class="vote-pill">
            <button class="${mine === 1 ? "on" : ""}" onclick="vote(${p.id},1)">▲ ${p.likes}</button>
            <button class="${mine === -1 ? "on" : ""}" onclick="vote(${p.id},-1)">▼ ${p.dislikes}</button>
          </div>
          <button class="btn btn-soft btn-sm" onclick="share(${p.id})">↗ Share</button>
          ${canPin ? `<button class="btn btn-soft btn-sm" onclick="pin(${p.id})">${p.pinned ? "Unpin" : "Pin"}</button>` : ""}
          ${p.userId === meId ? `<button class="btn btn-soft btn-sm ms-auto" onclick="del(${p.id})">Delete</button>` : ""}
        </div>
      </article>`;
  }).join("") || '<p class="text-muted text-center py-5">No posts here yet.</p>';
}

function vote(id, dir) {
  const p = posts.find(x => x.id === id);
  const cur = p.votes[meId] || 0;
  if (cur === 1) p.likes--;
  if (cur === -1) p.dislikes--;
  const next = cur === dir ? 0 : dir;           // clicking the same button again removes the vote
  if (next === 1) p.likes++;
  if (next === -1) p.dislikes++;
  if (next) p.votes[meId] = next; else delete p.votes[meId];
  save(); render();
}
function share(id) {
  const p = posts.find(x => x.id === id);
  posts.unshift({ id: Date.now(), userId: meId, category: p.category, content: p.content, sharedFrom: byId(p.userId).name,
    visibility: "Friends", likes: 0, dislikes: 0, votes: {}, timestamp: Date.now() });
  save(); render(); toast("Post shared to your feed");
}
function del(id) { posts = posts.filter(p => p.id !== id); save(); render(); toast("Post deleted"); }
function pin(id) { const p = posts.find(x => x.id === id); p.pinned = !p.pinned; save(); render(); toast(p.pinned ? "Post pinned" : "Post unpinned"); }

// ----- Create post card (found by structure, so home.html needs no changes) -----
const ta = document.querySelector("main textarea");
const sels = document.querySelectorAll("main .v-card select");
const postBtn = document.querySelector("main .v-card .btn-primary");
postBtn.addEventListener("click", () => {
  const text = ta.value.trim();
  if (!text) return toast("Write something first");
  const cat = sels[0].value;
  if (cat === "Announcement" && me().rankLevel < 5) return toast("Only Captain rank and above can post announcements");
  posts.unshift({ id: Date.now(), userId: meId, category: cat, content: text, visibility: sels[1].value,
    likes: 0, dislikes: 0, votes: {}, timestamp: Date.now() });
  ta.value = ""; save(); render(); toast("Posted");
});

// ----- Category filter buttons (rebuilt so all 8 categories exist) -----
const row = document.querySelector(".filter-row");
row.innerHTML = ["All", ...CATS].map(c => `<button class="btn ${c === "All" ? "active" : ""}" data-cat="${c}">${c}</button>`).join("");
row.querySelectorAll(".btn").forEach(b => b.addEventListener("click", () => {
  row.querySelectorAll(".btn").forEach(x => x.classList.remove("active"));
  b.classList.add("active"); filter = b.dataset.cat; render();
}));

// ----- Right sidebar: show pinned announcements if any exist -----
const asides = document.querySelectorAll("aside");
const rightCard = asides.length ? asides[asides.length - 1].querySelector(".v-card") : null;
const pinned = getLS("announcements", []).filter(a => a.pinned);
if (rightCard && pinned.length) {
  rightCard.innerHTML = '<div class="small text-muted fw-bold mb-2">📌 PINNED</div>' +
      pinned.map(a => `<div class="mb-2"><div class="fw-semibold">${esc(a.title)}</div><div class="small text-muted">${esc(a.content)}</div></div>`).join("");
}

render();