// Builds the navbar + sidebar so every page shares one copy
const NAV = [["home.html","🏠","Home"],["profile.html","👤","Profile"],["friends.html","🤝","Friends"],["messages.html","💬","Messages"],["announcements.html","📢","Announcements"]];
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const getLS = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
const setLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));

function buildLayout(active) {
  const links = NAV.map(([h, i, t]) => `<a class="side-link ${h === active ? "active" : ""}" href="${h}">${i} ${t}</a>`).join("");
  document.getElementById("navbar").innerHTML = `
    <nav class="v-nav py-2"><div class="container-xl d-flex align-items-center gap-3">
      <button class="btn btn-soft d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#menu">☰</button>
      <a class="navbar-brand d-flex align-items-center brand-title m-0" href="home.html"><img src="assets/images/logo/vglogo.png" alt="" class="brand-logo">VanguardConnect</a>
      <div class="ms-auto d-flex align-items-center gap-2">
        <button class="btn btn-soft" onclick="toggleTheme()">🌓</button>
        <div class="dropdown"><button class="btn p-0" data-bs-toggle="dropdown"><div class="avatar">${initials(currentUser.name)}</div></button>
          <ul class="dropdown-menu dropdown-menu-end"><li><a class="dropdown-item" href="profile.html">Profile</a></li><li><button class="dropdown-item" onclick="logout()">Logout</button></li></ul></div>
      </div></div></nav>
    <div class="offcanvas offcanvas-start" id="menu"><div class="offcanvas-header"><h5 class="brand-title">VanguardConnect</h5><button class="btn-close" data-bs-dismiss="offcanvas"></button></div><div class="offcanvas-body">${links}</div></div>`;
  document.getElementById("sidebar").innerHTML = `<div class="v-card p-2">${links}</div>`;
}
