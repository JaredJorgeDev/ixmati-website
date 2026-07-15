(function () {
    "use strict";

    const spinner = document.getElementById("spinner");
    if (spinner) {
        window.requestAnimationFrame(function () {
            spinner.classList.remove("show");
        });
    }

    if (window.WOW && document.querySelector(".wow")) {
        new window.WOW().init();
    }

    const buildWhatsAppUi = function () {
        if (document.querySelector(".wa-floating")) return;

        const wa = document.createElement("a");
        wa.className = "wa-floating";
        wa.href = "https://wa.me/527751064629?text=Hola%20Ixmati,%20quiero%20cotizar";
        wa.target = "_blank";
        wa.setAttribute("aria-label", "WhatsApp");
        wa.innerHTML = '<i class="bi bi-whatsapp fs-3"></i>';
        document.body.appendChild(wa);

        const hint = document.createElement("span");
        hint.className = "wa-hint";
        hint.textContent = "Ey, ¿necesitas ayuda?";
        document.body.appendChild(hint);

        const positionHint = function () {
            const rect = wa.getBoundingClientRect();
            const gap = 12;
            const hintWidth = hint.offsetWidth;
            const left = Math.max(8, rect.left - hintWidth - gap);

            hint.style.left = left + "px";
            hint.style.top = rect.top + (rect.height / 2) + "px";
        };

        positionHint();
        window.addEventListener("resize", positionHint, { passive: true });

        window.setTimeout(function () {
            positionHint();
            wa.classList.add("wa-nudge");
            hint.classList.add("is-visible");

            window.setTimeout(function () {
                wa.classList.remove("wa-nudge");
                hint.classList.remove("is-visible");
            }, 3500);
        }, 4000);
    };
    buildWhatsAppUi();

    const sendButton = document.getElementById("wa-send");
    if (sendButton) {
        sendButton.addEventListener("click", function () {
            const val = function (id) {
                const el = document.getElementById(id);
                return el ? el.value || "" : "";
            };

            const name = val("wa-name");
            const email = val("wa-email");
            const detail = val("wa-detail");
            const msg = val("wa-msg");
            const text = encodeURIComponent(
                "Hola Ixmati, soy " + name + ". Correo: " + email + ". Detalle: " + detail + ". Mensaje: " + msg
            );
            window.open("https://wa.me/527751064629?text=" + text, "_blank");
        });
    }

    const backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
        const toggleBackToTop = function () {
            backToTop.classList.toggle("is-visible", window.scrollY > 300);
        };

        toggleBackToTop();
        window.addEventListener("scroll", toggleBackToTop, { passive: true });
        backToTop.addEventListener("click", function (event) {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    const counterElements = document.querySelectorAll(".counter-value");
    if (counterElements.length) {
        const animateCounter = function (element) {
            const target = Number(element.dataset.target || element.textContent || 0);
            const prefix = element.dataset.prefix || "";
            const suffix = element.dataset.suffix || "";
            const duration = 1600;
            const start = performance.now();
            const initial = 0;

            const step = function (now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = initial + (target - initial) * eased;
                element.textContent = prefix + Math.ceil(value) + suffix;

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };

            window.requestAnimationFrame(step);
        };

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(function (entries, obs) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                });
            }, { threshold: 0.35 });

            counterElements.forEach(function (element) {
                observer.observe(element);
            });
        } else {
            counterElements.forEach(animateCounter);
        }
    }

    if (window.jQuery && window.jQuery.fn && window.jQuery.fn.owlCarousel) {
        const $ = window.jQuery;

        if (document.querySelector(".team-carousel")) {
            $(".team-carousel").owlCarousel({
                autoplay: true,
                smartSpeed: 1000,
                center: false,
                dots: false,
                loop: true,
                margin: 50,
                nav: true,
                navText: [
                    '<i class="bi bi-arrow-left"></i>',
                    '<i class="bi bi-arrow-right"></i>'
                ],
                responsiveClass: true,
                responsive: {
                    0: { items: 1 },
                    768: { items: 2 },
                    992: { items: 3 }
                }
            });
        }

        if (document.querySelector(".testimonial-carousel")) {
            $(".testimonial-carousel").owlCarousel({
                autoplay: true,
                smartSpeed: 1500,
                center: true,
                dots: true,
                loop: true,
                margin: 0,
                nav: true,
                navText: false,
                responsiveClass: true,
                responsive: {
                    0: { items: 1 },
                    576: { items: 1 },
                    768: { items: 2 },
                    992: { items: 3 }
                }
            });
        }
    }
})();
