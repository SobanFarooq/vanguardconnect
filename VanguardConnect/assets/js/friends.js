let users = getLS("users", []);
let reqs = getLS("friendRequests", []);
let ratings = getLS("ratings", []);
const meId = currentUser.id;
const me = () => users.find(u => u.id === meId);
const byId = id => users.find(u => u.id === id);
const ICONS = { 1: "😑", 2: "👍", 3: "🛡️" };

function save() { setLS("users", users); setLS("friendRequests", reqs); setLS("ratings", ratings); setLS("currentUser", me()); }
const person = (u, actions) => `<div class="person"><div class="avatar">${initials(u.name)}</div>
  <div class="flex-grow-1"><div class="fw-semibold">${esc(u.name)} <span class="rank-chip">${esc(u.rank)}</span></div><div class="small text-muted">${esc(u.unit)}</div></div>${actions}</div>`;

function sendRequest(id) {
  if ((byId(id).ignored || []).includes(meId)) { alert("Friend request blocked"); return; }
  reqs.push({ senderId: meId, receiverId: id, status: "pending" });
  save(); render();
}
function respond(senderId, status) {
  const r = reqs.find(r => r.senderId === senderId && r.receiverId === meId && r.status === "pending");
  r.status = status;
  if (status === "accepted") {
    me().friends = [...new Set([...me().friends, senderId])];
    byId(senderId).friends = [...new Set([...byId(senderId).friends, meId])];
  }
  if (status === "ignored") me().ignored = [...(me().ignored || []), senderId];
  save(); render();
}
function rate(id, val) {
  ratings = ratings.filter(r => !(r.fromUser === meId && r.toUser === id));
  ratings.push({ fromUser: meId, toUser: id, rating: val });
  save(); render();
}
function unignore(id) { me().ignored = me().ignored.filter(x => x !== id); save(); render(); }

function render() {
  const q = document.getElementById("search").value.toLowerCase();
  const m = me();
  const status = id => m.friends.includes(id) ? "Friends"
    : reqs.some(r => r.status === "pending" && ((r.senderId === meId && r.receiverId === id) || (r.senderId === id && r.receiverId === meId))) ? "Pending" : null;

  document.getElementById("results").innerHTML = q ? users.filter(u => u.id !== meId && (u.name + u.username).toLowerCase().includes(q))
    .map(u => person(u, status(u.id) ? `<span class="small text-muted">${status(u.id)}</span>` : `<button class="btn btn-primary btn-sm" onclick="sendRequest(${u.id})">Add</button>`)).join("") || '<span class="text-muted small">No users found.</span>' : "";

  const pending = reqs.filter(r => r.receiverId === meId && r.status === "pending");
  document.getElementById("pending").innerHTML = pending.map(r => person(byId(r.senderId),
    `<button class="btn btn-primary btn-sm" onclick="respond(${r.senderId},'accepted')">Accept</button>
     <button class="btn btn-soft btn-sm" onclick="respond(${r.senderId},'rejected')">Reject</button>
     <button class="btn btn-soft btn-sm" onclick="respond(${r.senderId},'ignored')">Ignore</button>`)).join("") || '<span class="text-muted small">No pending requests.</span>';

  document.getElementById("friendsList").innerHTML = m.friends.map(id => {
    const cur = (ratings.find(r => r.fromUser === meId && r.toUser === id) || {}).rating;
    return person(byId(id), [1, 2, 3].map(n => `<button class="rate-btn ${cur === n ? "on" : ""}" onclick="rate(${id},${n})">${ICONS[n]}</button>`).join(" "));
  }).join("") || '<span class="text-muted small">No friends yet.</span>';

  document.getElementById("ignoredList").innerHTML = (m.ignored || []).map(id => person(byId(id), `<button class="btn btn-soft btn-sm" onclick="unignore(${id})">Unignore</button>`)).join("") || '<span class="text-muted small">Nobody ignored.</span>';
}
document.getElementById("search").addEventListener("input", render);
render();
