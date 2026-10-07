const users = getLS("users", []);
let msgs = getLS("messages", null);
if (!msgs) { msgs = [{ senderId: 2, receiverId: 1, message: "Meeting at 0900 hours.", time: "10:00 AM" }]; setLS("messages", msgs); }
const myId = currentUser.id;
const mine = users.find(u => u.id === myId);
const contacts = users.filter(u => (mine.friends || []).includes(u.id));
let active = null;

function renderContacts() {
  document.getElementById("contacts").innerHTML = contacts.map(c => `
    <div class="contact ${active === c.id ? "active" : ""}" onclick="openChat(${c.id})">
      <div class="avatar">${initials(c.name)}</div><div><div class="fw-semibold">${esc(c.name)}</div><div class="small text-muted">${esc(c.rank)}</div></div></div>`).join("")
    || '<p class="small text-muted p-2">Add friends to start chatting.</p>';
}
function openChat(id) {
  active = id;
  const c = contacts.find(x => x.id === id);
  document.getElementById("chatTitle").textContent = c.name;
  document.getElementById("chatInput").classList.remove("d-none");
  renderContacts(); renderMessages();
}
function renderMessages() {
  const list = msgs.filter(m => (m.senderId === myId && m.receiverId === active) || (m.senderId === active && m.receiverId === myId));
  const box = document.getElementById("msgList");
  box.innerHTML = list.map(m => `<div class="bubble ${m.senderId === myId ? "mine" : ""}">${esc(m.message)}<small>${esc(m.time)}</small></div>`).join("") || '<p class="text-muted small m-auto">No messages yet. Say hello.</p>';
  box.scrollTop = box.scrollHeight;
}
document.getElementById("sendForm").addEventListener("submit", e => {
  e.preventDefault();
  const input = document.getElementById("msgText");
  if (!input.value.trim() || !active) return;
  msgs.push({ senderId: myId, receiverId: active, message: input.value.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
  setLS("messages", msgs);
  input.value = ""; renderMessages();
});
renderContacts();
