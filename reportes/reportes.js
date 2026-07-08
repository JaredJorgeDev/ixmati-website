(function () {
  var SESSION_KEY = "ixmati_reportes_session";
  var USERNAME = "jad";
  var PASSWORD = "jad";

  var loginScreen = document.getElementById("loginScreen");
  var dashboard = document.getElementById("dashboard");
  var loginForm = document.getElementById("loginForm");
  var formError = document.getElementById("formError");
  var logoutButton = document.getElementById("logoutButton");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".sidebar nav a"));

  function showDashboard() {
    loginScreen.classList.add("is-hidden");
    dashboard.classList.remove("is-hidden");
  }

  function showLogin() {
    dashboard.classList.add("is-hidden");
    loginScreen.classList.remove("is-hidden");
  }

  function isLoggedIn() {
    return localStorage.getItem(SESSION_KEY) === "active";
  }

  if (isLoggedIn()) {
    showDashboard();
  }

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    formError.textContent = "";

    var username = document.getElementById("username").value.trim().toLowerCase();
    var password = document.getElementById("password").value;

    if (username === USERNAME && password === PASSWORD) {
      localStorage.setItem(SESSION_KEY, "active");
      showDashboard();
      return;
    }

    formError.textContent = "Usuario o contraseña incorrectos.";
  });

  logoutButton.addEventListener("click", function () {
    localStorage.removeItem(SESSION_KEY);
    showLogin();
  });

  function updateActiveNav() {
    var current = "";
    var offset = window.scrollY + 160;

    navLinks.forEach(function (link) {
      var section = document.querySelector(link.getAttribute("href"));
      if (section && section.offsetTop <= offset) {
        current = link.getAttribute("href");
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === current);
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();
})();
