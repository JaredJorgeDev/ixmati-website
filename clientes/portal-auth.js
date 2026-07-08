(function () {
  var AUTH_KEY = "ixmati_client_portal_auth";
  var CLIENTS = {
    pancomido: { user: "clientes", client: "pan-comido" },
    livetravel: { user: "clientes", client: "live-travel" },
    gustavonissan: { user: "clientes", client: "gustavo-nissan" },
    nutrivida: { user: "clientes", client: "nutrivida" }
  };
  var ADMIN_USER = "admin";
  var ADMIN_PASS = "ixmati2026";

  function readSession() {
    try {
      var raw = sessionStorage.getItem(AUTH_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.client) return null;
      return parsed;
    } catch (err) {
      return null;
    }
  }

  function isAuthenticated() {
    return !!readSession();
  }

  function baseClientesPath(pathname) {
    var marker = "/clientes/";
    var idx = pathname.toLowerCase().indexOf(marker);
    if (idx === -1) return "/";
    return pathname.slice(0, idx + marker.length);
  }

  function homeFor(client) {
    return client + "/index.html";
  }

  function knownClient(slug) {
    return slug === "pan-comido" || slug === "live-travel" || slug === "gustavo-nissan" || slug === "nutrivida";
  }

  function relativeInsideClientes(pathname, search, hash) {
    var marker = "/clientes/";
    var lower = pathname.toLowerCase();
    var idx = lower.indexOf(marker);
    var rel = "";

    if (idx >= 0) {
      rel = pathname.slice(idx + marker.length);
    } else {
      rel = pathname.replace(/^\/+/, "");
    }

    return rel + (search || "") + (hash || "");
  }

  function getPathClient(pathname) {
    var parts = (pathname || "").toLowerCase().split("/").filter(Boolean);
    if (!parts.length) return null;

    if (parts[0] === "clientes" && parts[1] && knownClient(parts[1])) {
      return parts[1];
    }

    if (knownClient(parts[0])) {
      return parts[0];
    }

    return null;
  }

  function safeNext(next, allowedClient) {
    if (allowedClient === "*") {
      if (!next) return "index.html";
      var anyValue = decodeURIComponent(next);
      if (anyValue.indexOf("http://") === 0 || anyValue.indexOf("https://") === 0 || anyValue.indexOf("//") === 0) {
        return "index.html";
      }
      if (anyValue.charAt(0) === "/") {
        anyValue = relativeInsideClientes(anyValue, "", "");
      }
      return anyValue || "index.html";
    }

    var fallback = homeFor(allowedClient);
    if (!next) return fallback;

    var value = decodeURIComponent(next);
    if (value.indexOf("http://") === 0 || value.indexOf("https://") === 0 || value.indexOf("//") === 0) {
      return fallback;
    }

    if (value.charAt(0) === "/") {
      value = relativeInsideClientes(value, "", "");
    }

    var lower = value.toLowerCase().replace(/^\/+/, "");
    var allowedRel = allowedClient + "/";

    if (lower.indexOf(allowedRel) === 0) return lower;

    return fallback;
  }

  function login(user, pass) {
    if ((user || "").toLowerCase() === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem(AUTH_KEY, JSON.stringify({ user: ADMIN_USER, client: "*" }));
      return true;
    }

    var account = CLIENTS[(pass || "").toLowerCase()];
    if (!account) return false;
    if ((user || "").toLowerCase() !== account.user) return false;

    sessionStorage.setItem(AUTH_KEY, JSON.stringify({ user: account.user, client: account.client }));
    return true;
  }

  function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    var base = baseClientesPath(window.location.pathname);
    window.location.href = base + "login.html";
  }

  var pathname = window.location.pathname;
  var lowerPath = pathname.toLowerCase();
  var base = baseClientesPath(pathname);
  var isLogin = lowerPath.endsWith("/clientes/login.html") || lowerPath.endsWith("/login.html");

  window.ClientPortalAuth = {
    login: login,
    logout: logout,
    isAuthenticated: isAuthenticated,
    safeNext: safeNext,
    getSession: readSession
  };

  var session = readSession();

  if (isLogin) {
    if (session && session.client) {
      var q = new URLSearchParams(window.location.search);
      window.location.replace(safeNext(q.get("next"), session.client));
    }
    return;
  }

  if (!session || !session.client) {
    var next = relativeInsideClientes(window.location.pathname, window.location.search, window.location.hash);
    window.location.replace(base + "login.html?next=" + encodeURIComponent(next));
    return;
  }

  if (session.client === "*") {
    return;
  }

  var requestedClient = getPathClient(pathname);
  if (!requestedClient || requestedClient !== session.client) {
    window.location.replace(base + homeFor(session.client));
  }
})();
