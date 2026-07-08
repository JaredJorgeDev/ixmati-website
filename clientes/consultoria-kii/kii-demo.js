(function () {
  const page = document.body.dataset.page || "";
  const topbar = document.querySelector('.topbar');
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.nav-links');
  const toast = document.getElementById('toast');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function setActiveNav() {
    const file = (window.location.pathname.split('/').pop() || 'demo-corporativa.html').toLowerCase();
    document.querySelectorAll('.nav-links a').forEach((a) => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href === file) a.classList.add('active');
    });
  }

  function initNavbar() {
    setActiveNav();
    if (burger && menu) burger.addEventListener('click', () => menu.classList.toggle('open'));
    const syncScroll = () => {
      if (!topbar) return;
      topbar.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', syncScroll);
    syncScroll();
  }

  function initReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 35, 200)}ms`;
      io.observe(el);
    });
  }

  function initDiagnostico() {
    if (page !== 'diagnostico') return;
    const form = document.getElementById('diagForm');
    const steps = Array.from(document.querySelectorAll('.diag-step'));
    const prev = document.getElementById('prevStep');
    const next = document.getElementById('nextStep');
    const result = document.getElementById('diagResult');
    let current = 0;

    const scores = {
      tamano: { a: 1, b: 2, c: 3, d: 4 },
      preocupacion: { a: 1, b: 3, c: 2, d: 2, e: 4 },
      estres: { a: 1, b: 2, c: 3, d: 4 },
      comunicacion: { a: 1, b: 2, c: 3, d: 4 },
      rotacion: { a: 1, b: 2, c: 3, d: 4 }
    };

    function renderStep() {
      steps.forEach((s, idx) => s.style.display = idx === current ? 'block' : 'none');
      prev.style.visibility = current === 0 ? 'hidden' : 'visible';
      next.textContent = current === steps.length - 1 ? 'Ver resultado' : 'Siguiente';
    }

    function getValue(name) {
      const chosen = form.querySelector(`input[name="${name}"]:checked`);
      return chosen ? chosen.value : null;
    }

    function calculate() {
      const values = {
        tamano: getValue('tamano'),
        preocupacion: getValue('preocupacion'),
        estres: getValue('estres'),
        comunicacion: getValue('comunicacion'),
        rotacion: getValue('rotacion')
      };
      const valid = Object.values(values).every(Boolean);
      if (!valid) return null;
      const total = Object.entries(values).reduce((acc, [k, v]) => acc + (scores[k][v] || 0), 0);
      let level = 'Bajo riesgo organizacional';
      let rec = 'Mantener hábitos actuales, fortalecer seguimiento y prevenir desgaste en áreas críticas.';
      if (total >= 11 && total <= 15) {
        level = 'Riesgo medio organizacional';
        rec = 'Conviene iniciar diagnóstico por área y reforzar comunicación de liderazgo y bienestar.';
      } else if (total >= 16) {
        level = 'Alto riesgo organizacional';
        rec = 'Se recomienda intervención prioritaria con plan de acción para estrés, rotación y clima interno.';
      }
      return { total, level, rec, values, createdAt: new Date().toISOString() };
    }

    next.addEventListener('click', () => {
      const stepName = steps[current].dataset.name;
      if (!getValue(stepName)) {
        showToast('Selecciona una opción para continuar.');
        return;
      }
      if (current < steps.length - 1) {
        current += 1;
        renderStep();
        return;
      }
      const diag = calculate();
      if (!diag) return;
      localStorage.setItem('kii_diagnostico', JSON.stringify(diag));
      result.innerHTML = `<h3>${diag.level}</h3><p>Puntaje: <strong>${diag.total}</strong></p><p>${diag.rec}</p>`;
      result.style.display = 'block';
      showToast('Resultado guardado.');
      result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    prev.addEventListener('click', () => {
      if (current > 0) { current -= 1; renderStep(); }
    });

    renderStep();
  }

  function initAgenda() {
    if (page !== 'agenda') return;
    const form = document.getElementById('agendaForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      data.createdAt = new Date().toISOString();
      localStorage.setItem('kii_last_lead', JSON.stringify(data));
      showToast('Solicitud enviada.');
      setTimeout(() => { window.location.href = 'gracias.html'; }, 350);
    });
  }

  function initGracias() {
    if (page !== 'gracias') return;
    const target = document.getElementById('leadResume');
    const raw = localStorage.getItem('kii_last_lead');
    if (!raw) {
      target.innerHTML = '<p>No se encontró una solicitud reciente. Puedes iniciar una desde Agenda.</p>';
      return;
    }
    const lead = JSON.parse(raw);
    target.innerHTML = `
      <div class="table-wrap"><table><tbody>
        <tr><th>Nombre</th><td>${lead.nombre || '-'}</td></tr>
        <tr><th>Empresa</th><td>${lead.empresa || '-'}</td></tr>
        <tr><th>Servicio solicitado</th><td>${lead.servicio || '-'}</td></tr>
        <tr><th>Horario preferido</th><td>${lead.horario || '-'}</td></tr>
      </tbody></table></div>
      <p style="margin-top:.8rem;">Solicitud recibida. El siguiente paso es revisar el contexto de la empresa y preparar una propuesta de asesoría.</p>
    `;
  }

  function initRecursos() {
    if (page !== 'recursos') return;
    const modal = document.getElementById('resourceModal');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.getElementById('closeModal');
    const map = {
      burnout: '<h3>Cómo detectar burnout en un equipo</h3><p>Observa aumento de errores, baja concentración y desgaste sostenido. Medir carga y pausas ayuda a decidir intervenciones.</p>',
      clima: '<h3>Señales de mal clima laboral</h3><p>Conflictos frecuentes, comunicación reactiva y desconfianza entre áreas son señales tempranas de deterioro.</p>',
      comunicacion: '<h3>Por qué la comunicación interna afecta resultados</h3><p>Cuando los objetivos no bajan con claridad, suben los retrabajos y cae la coordinación operativa.</p>',
      liderazgo: '<h3>Liderazgo emocional: qué es y por qué importa</h3><p>No es motivación vacía: es dirigir con claridad, contención y seguimiento para sostener desempeño.</p>',
      preparacion: '<h3>Cómo preparar a una empresa para una intervención psicológica</h3><p>Define objetivos, responsables y métricas base para que la intervención tenga impacto visible.</p>',
      bienestar: '<h3>Bienestar laboral más allá de la motivación</h3><p>Bienestar efectivo significa procesos, liderazgo y decisiones que reducen desgaste y mejoran clima.</p>'
    };
    document.querySelectorAll('[data-article]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.article;
        modalBody.innerHTML = map[key] || '<p>Contenido no disponible.</p>';
        modal.classList.add('open');
      });
    });
    closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
  }

  initNavbar();
  initReveal();
  initDiagnostico();
  initAgenda();
  initGracias();
  initRecursos();
})();
