// ============ CONFIGURACIÓN ============
// Para cambiar el número de WhatsApp/teléfono en TODO el sitio,
// edita aquí y vuelve a desplegar. Formato internacional sin "+" ni espacios.
const WHATSAPP_NUMBER = "573174426044";
const PHONE_DISPLAY = "+57 317 442 6044";
// ======================================

// Todos los enlaces wa.me del HTML usan el número quemado en el href.
// Lo reemplazamos dinámicamente por si cambias el número en CONFIG.
document.addEventListener("DOMContentLoaded", () => {
  // 1) Reemplazar números de WhatsApp en todos los enlaces
  const waLinks = document.querySelectorAll('a[href*="wa.me/"]');
  waLinks.forEach((a) => {
    const url = new URL(a.href);
    url.pathname = `/${WHATSAPP_NUMBER}`;
    a.href = url.toString();
  });

  // 2. Mostrar teléfono desde config en los enlaces tel:
  document.querySelectorAll('a[href^="tel:"]').forEach((a) => {
    a.href = `tel:+${WHATSAPP_NUMBER}`;
    a.textContent = PHONE_DISPLAY;
  });

  // 3) Año actual en footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 4) Navbar con sombra al hacer scroll
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // 5) Menú móvil
  const burger = document.getElementById("navBurger");
  const links = document.getElementById("navLinks");
  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    links.classList.toggle("open");
    document.body.style.overflow = links.classList.contains("open") ? "hidden" : "";
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      burger.classList.remove("open");
      links.classList.remove("open");
      document.body.style.overflow = "";
    })
  );

  // 6) Animación reveal on scroll
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));

  // 7) Contadores animados
  const counters = document.querySelectorAll("[data-count]");
  const cio = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.count;
        const dur = 1800;
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString("es-CO");
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => cio.observe(el));

  // 8) Marquee de logos: duplicar track para loop infinito
  const track = document.getElementById("marqueeTrack");
  if (track) track.innerHTML += track.innerHTML;
});
