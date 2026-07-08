(function () {
  const KEYS = {
    quotes: "lt_quotes",
    advisories: "lt_advisories",
    lastQuote: "lt_last_quote",
    lastDestination: "lt_last_destination",
    favorites: "lt_favorites"
  };

  const DESTINATIONS = [
    { id: "cancun", name: "Cancún Premium", region: "Playa", budget: "12-18k", duration: "5-7 días", type: "Pareja", price: 12990, icon: "🏖️", tags: ["Popular", "Todo incluido"], ideal: "Pareja y familia", hotels: ["Resort Marina Bay", "Suites Costa Azul"] },
    { id: "cabos", name: "Los Cabos Escape", region: "Playa", budget: "18-28k", duration: "5-7 días", type: "Lujo", price: 18990, icon: "🌊", tags: ["Premium", "Atardeceres"], ideal: "Pareja", hotels: ["Cabo Signature", "Pacific Grand"] },
    { id: "vallarta", name: "Puerto Vallarta Familiar", region: "Playa", budget: "8-12k", duration: "3-4 días", type: "Familia", price: 9490, icon: "🌴", tags: ["Familiar", "Corto"], ideal: "Familias", hotels: ["Bahía Viva", "Costa Family Resort"] },
    { id: "cdmx", name: "CDMX Cultural", region: "Ciudad", budget: "8-12k", duration: "3-4 días", type: "Escapada", price: 8990, icon: "🏙️", tags: ["Cultural", "Ciudad"], ideal: "Pareja y grupos", hotels: ["Centro Histórico Hotel", "Skyline Reforma"] },
    { id: "ny", name: "Nueva York Express", region: "Internacional", budget: "28k+", duration: "5-7 días", type: "Internacional", price: 32990, icon: "🗽", tags: ["Internacional", "Urbano"], ideal: "Pareja y corporativo", hotels: ["Midtown Prime", "Hudson Central"] },
    { id: "colombia", name: "Colombia Caribe", region: "Internacional", budget: "18-28k", duration: "5-7 días", type: "Internacional", price: 21990, icon: "✈️", tags: ["Caribe", "Cultura"], ideal: "Pareja y amigos", hotels: ["Cartagena Colonial", "Isla Coral Resort"] },
    { id: "chiapas", name: "Chiapas Naturaleza", region: "Naturaleza", budget: "8-12k", duration: "5-7 días", type: "Aventura", price: 10990, icon: "🌿", tags: ["Aventura", "Naturaleza"], ideal: "Aventura", hotels: ["Selva Lodge", "Maya Eco Suites"] },
    { id: "europa", name: "Europa Esencial", region: "Internacional", budget: "28k+", duration: "8+ días", type: "Internacional", price: 46990, icon: "🏰", tags: ["Circuito", "Europa"], ideal: "Primera vez en Europa", hotels: ["EuroCity Select", "Classic Continental"] },
    { id: "oaxaca", name: "Oaxaca Gastronómico", region: "Ciudad", budget: "12-18k", duration: "5-7 días", type: "Escapada", price: 13990, icon: "🍽️", tags: ["Gastronomía", "Cultural"], ideal: "Pareja y grupos", hotels: ["Casa Mezcal", "Centro Gourmet Inn"] },
    { id: "riviera", name: "Riviera Maya Relax", region: "Playa", budget: "12-18k", duration: "5-7 días", type: "Familia", price: 14990, icon: "🌺", tags: ["Relax", "Playa"], ideal: "Familias", hotels: ["Maya Breeze Resort", "Beachline Suites"] },
    { id: "japon", name: "Japón Intro", region: "Internacional", budget: "28k+", duration: "8+ días", type: "Internacional", price: 55990, icon: "🗾", tags: ["Asia", "Cultural"], ideal: "Internacional", hotels: ["Tokyo Urban Select", "Kyoto Zen Hotel"] },
    { id: "peru", name: "Perú Histórico", region: "Internacional", budget: "18-28k", duration: "8+ días", type: "Aventura", price: 26990, icon: "⛰️", tags: ["Historia", "Aventura"], ideal: "Aventura y cultura", hotels: ["Cusco Imperial", "Andes Valley Lodge"] }
  ];

  const EXPERIENCES = [
    { id: "pareja", title: "Viaje en pareja", desc: "Rutas románticas y experiencias premium con itinerario flexible.", picks: ["cancun", "cabos", "colombia"] },
    { id: "familia", title: "Familias", desc: "Paquetes con logística cómoda, traslados y tiempos pensados para todos.", picks: ["vallarta", "riviera", "cancun"] },
    { id: "aventura", title: "Aventura", desc: "Actividades de naturaleza, rutas activas y exploración guiada.", picks: ["chiapas", "peru", "colombia"] },
    { id: "lujo", title: "Lujo", desc: "Experiencias exclusivas con hospedaje premium y servicios personalizados.", picks: ["cabos", "europa", "japon"] },
    { id: "internacional", title: "Internacional", desc: "Planeación de viajes al extranjero con acompañamiento completo.", picks: ["ny", "europa", "japon"] },
    { id: "corporativo", title: "Corporativo", desc: "Viajes de negocio con agenda ordenada y tiempos optimizados.", picks: ["ny", "cdmx", "europa"] },
    { id: "escapadas", title: "Escapadas de fin de semana", desc: "Opciones rápidas para desconectar sin logística compleja.", picks: ["cdmx", "vallarta", "oaxaca"] },
    { id: "grupos", title: "XV años / grupos", desc: "Planeación para grupos con coordinación de itinerario y presupuesto.", picks: ["riviera", "cancun", "europa"] }
  ];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const readJSON = (k, fallback) => {
    try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
  };
  const writeJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const currency = (n) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(n || 0));
  const toast = (msg) => {
    const node = $("#ltToast");
    if (!node) return;
    node.textContent = msg;
    node.classList.add("show");
    setTimeout(() => node.classList.remove("show"), 1900);
  };

  function navSetup() {
    const navWrap = $(".lt-nav-wrap");
    if (!navWrap) return;
    const nav = $(".lt-nav", navWrap);
    const burger = $(".lt-burger", navWrap);

    const page = document.body.dataset.page;
    $$(".lt-menu a", navWrap).forEach((a) => {
      if (a.dataset.page === page) a.classList.add("active");
    });

    if (burger && nav) {
      burger.addEventListener("click", () => nav.classList.toggle("open"));
    }

    window.addEventListener("scroll", () => {
      navWrap.classList.toggle("scrolled", window.scrollY > 18);
    });

    const logoutBtn = $("#logoutBtn");
    if (logoutBtn && window.ClientPortalAuth) logoutBtn.addEventListener("click", () => window.ClientPortalAuth.logout());
  }

  function revealSetup() {
    const items = $$(".lt-reveal");
    if (!items.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); });
    }, { threshold: 0.1 });
    items.forEach((el) => io.observe(el));
  }

  function destinationCard(item, opts = {}) {
    const favs = readJSON(KEYS.favorites, []);
    const isFav = favs.includes(item.id);
    return `
      <article class="lt-travel-card">
        <div class="lt-travel-thumb">${item.icon}</div>
        <div class="lt-travel-body">
          <div class="lt-tags">${item.tags.map((t) => `<span class="lt-tag">${t}</span>`).join("")}</div>
          <h3>${item.name}</h3>
          <div class="lt-meta"><span>${item.region} · ${item.duration}</span><span class="lt-price">Desde ${currency(item.price)}</span></div>
          <div class="lt-actions">
            <a class="lt-btn lt-btn-outline" href="destino-detalle.html?id=${item.id}">Ver paquete</a>
            <a class="lt-btn lt-btn-primary" href="cotizador.html?destino=${item.id}">Cotizar</a>
          </div>
          ${opts.showFav ? `<div style="margin-top:8px"><button class="lt-btn lt-btn-gold" data-fav="${item.id}" type="button">${isFav ? "Quitar favorito" : "Guardar favorito"}</button></div>` : ""}
        </div>
      </article>`;
  }

  function initHome() {
    const wrap = $("#featuredDestinations");
    if (wrap) {
      const ids = ["cancun", "cabos", "europa", "chiapas"];
      wrap.innerHTML = ids.map((id) => destinationCard(DESTINATIONS.find((d) => d.id === id))).join("");
    }

    const expWrap = $("#experienceGrid");
    if (expWrap) {
      expWrap.innerHTML = EXPERIENCES.slice(0, 5).map((e) => `<article class="lt-card"><h3>${e.title}</h3><p>${e.desc}</p><a class="lt-btn lt-btn-outline" href="experiencias.html#${e.id}">Ver experiencia</a></article>`).join("");
    }
  }

  function parseQuery() {
    return new URLSearchParams(window.location.search);
  }

  function filterDestinations() {
    const query = $("#search")?.value.toLowerCase().trim() || "";
    const region = $("#region")?.value || "Todas";
    const budget = $("#budget")?.value || "Todos";
    const duration = $("#duration")?.value || "Todas";
    const type = $("#type")?.value || "Todos";
    const sort = $("#sort")?.value || "recommended";

    let list = DESTINATIONS.filter((d) => {
      return (!query || d.name.toLowerCase().includes(query)) &&
        (region === "Todas" || d.region === region) &&
        (budget === "Todos" || d.budget === budget) &&
        (duration === "Todas" || d.duration === duration) &&
        (type === "Todos" || d.type === type);
    });

    if (sort === "price_low") list.sort((a, b) => a.price - b.price);
    if (sort === "price_high") list.sort((a, b) => b.price - a.price);
    if (sort === "recommended") list.sort((a, b) => b.tags.length - a.tags.length);

    return list;
  }

  function initDestinos() {
    const grid = $("#destGrid");
    if (!grid) return;

    const render = () => {
      const list = filterDestinations();
      grid.innerHTML = list.length ? list.map((d) => destinationCard(d, { showFav: true })).join("") : `<article class="lt-card"><p>Sin resultados para esos filtros.</p></article>`;
    };

    ["search", "region", "budget", "duration", "type", "sort"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const evt = el.tagName === "SELECT" ? "change" : "input";
      el.addEventListener(evt, render);
    });

    document.body.addEventListener("click", (e) => {
      const fav = e.target.closest("[data-fav]");
      if (!fav) return;
      const id = fav.dataset.fav;
      let current = readJSON(KEYS.favorites, []);
      if (current.includes(id)) current = current.filter((x) => x !== id);
      else current.push(id);
      writeJSON(KEYS.favorites, current);
      toast("Favoritos actualizados");
      render();
    });

    const params = parseQuery();
    if (params.get("tipo")) {
      const type = $("#type");
      if (type) type.value = params.get("tipo");
    }

    render();
  }

  function initDetalle() {
    const root = $("#detailRoot");
    if (!root) return;
    const id = parseQuery().get("id") || "cancun";
    const item = DESTINATIONS.find((d) => d.id === id) || DESTINATIONS[0];
    writeJSON(KEYS.lastDestination, item.id);

    root.innerHTML = `
      <section class="lt-section lt-reveal">
        <div class="lt-card" style="padding:0;overflow:hidden">
          <div style="min-height:280px;background:linear-gradient(145deg,#d7e9ff,#f9eddc);display:grid;place-items:center;font-size:3.2rem">${item.icon}</div>
          <div style="padding:18px">
            <h1>${item.name}</h1>
            <p><strong>Desde ${currency(item.price)} por persona</strong> · ${item.duration} · ${item.region}</p>
            <p><strong>Ideal para:</strong> ${item.ideal}</p>
          </div>
        </div>
      </section>
      <section class="lt-layout lt-section lt-reveal">
        <div>
          <article class="lt-card">
            <h2>Itinerario demo</h2>
            <ul>
              <li>Día 1: llegada, traslado y check-in</li>
              <li>Día 2: experiencia principal del destino</li>
              <li>Día 3: actividad libre + recomendación gastronómica</li>
              <li>Día 4: cierre de experiencia y regreso</li>
            </ul>
          </article>
          <article class="lt-card" style="margin-top:12px">
            <h2>Incluye / No incluye</h2>
            <div class="lt-grid-2" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              <div><h3>Incluye</h3><ul><li>Hospedaje</li><li>Asesoría personalizada</li><li>Ruta sugerida</li><li>Seguimiento comercial</li></ul></div>
              <div><h3>No incluye</h3><ul><li>Gastos personales</li><li>Servicios no contratados</li><li>Actividades fuera del paquete</li></ul></div>
            </div>
          </article>
          <article class="lt-card" style="margin-top:12px">
            <h2>Hoteles sugeridos</h2>
            <ul>${item.hotels.map((h) => `<li>${h}</li>`).join("")}</ul>
          </article>
          <article class="lt-card" style="margin-top:12px">
            <h2>Galería visual</h2>
            <div class="lt-grid-3">${[1,2,3].map((n) => `<div class="lt-mini" style="height:120px;display:grid;place-items:center">Vista ${n}</div>`).join("")}</div>
          </article>
        </div>
        <aside class="lt-sidebar">
          <h3>Cotización rápida</h3>
          <p>Este paquete puede ajustarse por fechas, personas y presupuesto.</p>
          <a class="lt-btn lt-btn-primary" href="cotizador.html?destino=${item.id}">Cotizar este viaje</a>
        </aside>
      </section>`;
  }

  function initExperiencias() {
    const grid = $("#expGrid");
    if (!grid) return;
    grid.innerHTML = EXPERIENCES.map((e) => {
      const picks = e.picks.map((id) => DESTINATIONS.find((d) => d.id === id)?.name).filter(Boolean);
      return `<article class="lt-card" id="${e.id}"><h2>${e.title}</h2><p>${e.desc}</p><p><strong>Destinos recomendados:</strong> ${picks.join(", ")}</p><div style="display:flex;gap:8px;flex-wrap:wrap"><a class="lt-btn lt-btn-outline" href="destinos.html?tipo=${encodeURIComponent(e.title)}">Ver destinos relacionados</a><a class="lt-btn lt-btn-primary" href="cotizador.html">Ir al cotizador</a></div></article>`;
    }).join("");
  }

  function initCotizador() {
    const wizard = $("#quoteWizard");
    if (!wizard) return;

    const steps = $$(".lt-step", wizard);
    const progress = $("#progressBar", wizard);
    const summary = $("#quoteSummary", wizard);

    const model = {
      destination: parseQuery().get("destino") || readJSON(KEYS.lastDestination, ""),
      travelType: "",
      date: "",
      people: "",
      budget: "",
      name: "",
      phone: "",
      email: "",
      notes: ""
    };

    if ($("#wDestination")) {
      $("#wDestination").innerHTML = '<option value="" disabled selected>Selecciona destino</option>' + DESTINATIONS.map((d) => `<option value="${d.id}">${d.name}</option>`).join("");
      if (model.destination) $("#wDestination").value = model.destination;
    }

    let current = 0;

    const readStepData = () => {
      model.destination = $("#wDestination")?.value || model.destination;
      model.travelType = $("#wType")?.value || model.travelType;
      model.date = $("#wDate")?.value || model.date;
      model.people = $("#wPeople")?.value || model.people;
      model.budget = $("#wBudget")?.value || model.budget;
      model.name = $("#wName")?.value || model.name;
      model.phone = $("#wPhone")?.value || model.phone;
      model.email = $("#wEmail")?.value || model.email;
      model.notes = $("#wNotes")?.value || model.notes;
    };

    const validateCurrent = () => {
      readStepData();
      if (current === 0) return !!(model.destination || model.travelType);
      if (current === 1) return !!model.date;
      if (current === 2) return !!model.people;
      if (current === 3) return !!model.budget;
      if (current === 4) return !!(model.name && model.phone && model.email);
      return true;
    };

    const render = () => {
      steps.forEach((s, i) => s.classList.toggle("active", i === current));
      const pct = ((current + 1) / steps.length) * 100;
      if (progress) progress.style.width = pct + "%";
      if (summary) {
        const destName = DESTINATIONS.find((d) => d.id === model.destination)?.name || model.travelType || "Pendiente";
        summary.innerHTML = `
          <div class="lt-list-item"><strong>Destino/tipo:</strong> ${destName}</div>
          <div class="lt-list-item"><strong>Fecha:</strong> ${model.date || "Pendiente"}</div>
          <div class="lt-list-item"><strong>Personas:</strong> ${model.people || "Pendiente"}</div>
          <div class="lt-list-item"><strong>Presupuesto:</strong> ${model.budget || "Pendiente"}</div>
          <div class="lt-list-item"><strong>Contacto:</strong> ${model.name || "Pendiente"}</div>`;
      }
      const estimate = $("#quoteEstimate");
      if (estimate) {
        const base = DESTINATIONS.find((d) => d.id === model.destination)?.price || 12000;
        estimate.textContent = currency(base);
      }
    };

    $("#nextStep")?.addEventListener("click", () => {
      if (!validateCurrent()) { toast("Completa este paso para continuar"); return; }
      if (current < steps.length - 1) current += 1;
      render();
    });

    $("#prevStep")?.addEventListener("click", () => {
      if (current > 0) current -= 1;
      render();
    });

    $("#confirmQuote")?.addEventListener("click", () => {
      current = steps.length - 1;
      if (!validateCurrent()) { toast("Completa tus datos antes de confirmar"); return; }
      const quotes = readJSON(KEYS.quotes, []);
      const id = "LT-" + Date.now().toString().slice(-6);
      const record = { id, ...model, createdAt: new Date().toISOString() };
      quotes.unshift(record);
      writeJSON(KEYS.quotes, quotes);
      writeJSON(KEYS.lastQuote, record);
      writeJSON(KEYS.lastDestination, model.destination || "");
      window.location.href = "gracias.html";
    });

    $$("input,select,textarea", wizard).forEach((el) => el.addEventListener("input", () => { readStepData(); render(); }));
    render();
  }

  function initAsesoria() {
    const form = $("#advisoryForm");
    const list = $("#advisoryList");
    const stats = $("#advisoryStats");
    const quotesList = $("#quotesList");

    const render = () => {
      const advisories = readJSON(KEYS.advisories, []);
      const quotes = readJSON(KEYS.quotes, []);

      if (list) {
        list.innerHTML = advisories.length ? advisories.slice(0, 8).map((a) => `<div class="lt-list-item"><strong>${a.name}</strong> · ${a.slot}<br><small>${a.destination || "Sin destino"}</small></div>`).join("") : `<div class="lt-list-item">Sin asesorías agendadas aún.</div>`;
      }

      if (quotesList) {
        quotesList.innerHTML = quotes.length ? quotes.slice(0, 8).map((q) => `<div class="lt-list-item">${q.name} · ${q.destination || q.travelType} · ${q.budget}</div>`).join("") : `<div class="lt-list-item">Sin solicitudes de cotización.</div>`;
      }

      if (stats) {
        const leadsBudget = quotes.filter((q) => q.budget).length;
        const destinations = {};
        quotes.forEach((q) => { const key = q.destination || q.travelType || "Sin definir"; destinations[key] = (destinations[key] || 0) + 1; });
        const top = Object.entries(destinations).sort((a, b) => b[1] - a[1])[0]?.[0] || "Sin datos";
        stats.innerHTML = `
          <div class="lt-mini"><strong>Leads con presupuesto:</strong> ${leadsBudget}</div>
          <div class="lt-mini"><strong>Citas agendadas:</strong> ${advisories.length}</div>
          <div class="lt-mini"><strong>Destino más solicitado:</strong> ${top}</div>`;
      }
    };

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        name: $("#aName")?.value.trim(),
        phone: $("#aPhone")?.value.trim(),
        destination: $("#aDestination")?.value,
        slot: $("#aSlot")?.value,
        createdAt: new Date().toISOString()
      };
      if (!data.name || !data.phone || !data.slot) { toast("Completa los datos para agendar"); return; }
      const advisories = readJSON(KEYS.advisories, []);
      advisories.unshift(data);
      writeJSON(KEYS.advisories, advisories);
      form.reset();
      toast("Asesoría agendada correctamente");
      render();
    });

    if ($("#aDestination")) {
      $("#aDestination").innerHTML = '<option value="">Destino de interés</option>' + DESTINATIONS.map((d) => `<option value="${d.name}">${d.name}</option>`).join("");
    }

    render();
  }

  function initGracias() {
    const root = $("#thanksRoot");
    if (!root) return;
    const last = readJSON(KEYS.lastQuote, null);
    if (!last) {
      root.innerHTML = `<div class="lt-card"><h2>No hay solicitud reciente</h2><p>Primero completa una cotización para ver esta confirmación.</p><a class="lt-btn lt-btn-primary" href="cotizador.html">Ir al cotizador</a></div>`;
      return;
    }
    const destName = DESTINATIONS.find((d) => d.id === last.destination)?.name || last.travelType || "Destino por definir";
    root.innerHTML = `
      <div class="lt-card lt-reveal">
        <h1>Solicitud recibida correctamente</h1>
        <p>Tu solicitud quedó registrada y el siguiente paso es confirmar asesoría comercial.</p>
        <div class="lt-list">
          <div class="lt-list-item"><strong>Número de solicitud demo:</strong> ${last.id}</div>
          <div class="lt-list-item"><strong>Destino:</strong> ${destName}</div>
          <div class="lt-list-item"><strong>Personas:</strong> ${last.people}</div>
          <div class="lt-list-item"><strong>Presupuesto:</strong> ${last.budget}</div>
          <div class="lt-list-item"><strong>Fecha tentativa:</strong> ${last.date}</div>
        </div>
        <p style="margin-top:12px"><strong>Siguiente paso:</strong> un asesor revisa disponibilidad y te comparte propuesta ajustada.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><a class="lt-btn lt-btn-outline" href="destinos.html">Volver a destinos</a><a class="lt-btn lt-btn-primary" href="asesoria.html">Agendar asesoría</a><a class="lt-btn lt-btn-gold" href="index.html">Volver al inicio</a></div>
      </div>`;
  }

  function initFloating() {
    const floating = $("#floatingQuote");
    if (!floating) return;
    if (window.innerWidth < 780) floating.style.display = "inline-block";
  }

  window.LiveTravelData = { DESTINATIONS, EXPERIENCES };

  document.addEventListener("DOMContentLoaded", () => {
    navSetup();
    revealSetup();
    initFloating();

    const page = document.body.dataset.page;
    if (page === "home") initHome();
    if (page === "destinos") initDestinos();
    if (page === "detalle") initDetalle();
    if (page === "experiencias") initExperiencias();
    if (page === "cotizador") initCotizador();
    if (page === "asesoria") initAsesoria();
    if (page === "gracias") initGracias();
  });
})();
