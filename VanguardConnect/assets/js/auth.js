// Login logic

const loginForm = document.getElementById("loginForm");
const messageBox = document.getElementById("message");

// If already logged in, skip the login page
if (localStorage.getItem("currentUser")) {
  window.location.href = "home.html";
}

function showError(text) {
  messageBox.textContent = text;
  messageBox.classList.remove("d-none");
}

loginForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  // 1. Empty check
  if (username === "" || password === "") {
    showError("Please enter both username and password.");
    return;
  }

  // 2. Find the user
  const users = JSON.parse(localStorage.getItem("users"));
  const user = users.find(u => u.username === username);

  if (!user) {
    showError("User not found.");
    return;
  }

  // 3. Check password
  if (user.password !== password) {
    showError("Incorrect password.");
    return;
  }

  // 4. Success: save who is logged in, then go to home
  localStorage.setItem("currentUser", JSON.stringify(user));
  window.location.href = "home.html";
});
