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

  // 9) QR + compartir (apunta a la URL donde esté desplegado el sitio)
  const shareUrl = window.location.origin;
  const shareText =
    "Te comparto Salento a la Mano: la plataforma que pone tu negocio frente a los turistas de Salento — mapa impreso + web en 6 idiomas + app interactiva. Mira los planes 👇";

  const urlEl = document.getElementById("shareUrl");
  if (urlEl) urlEl.textContent = shareUrl;

  // QR del sitio actual (apunta a donde esté desplegado)
  let qrSvg = null;
  const qrBox = document.getElementById("qrCode");
  if (qrBox && window.qrcode) {
    const qr = qrcode(0, "M");
    qr.addData(shareUrl);
    qr.make();
    qrSvg = qr.createSvgTag({ cellSize: 4, margin: 0 });
    qrBox.innerHTML = qrSvg;
  }

  // Enviar por WhatsApp
  const waShare = document.getElementById("shareWhatsApp");
  if (waShare) {
    waShare.addEventListener("click", () => {
      const msg = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
      window.open(
        `https://wa.me/?text=${msg}`,
        "_blank",
        "noopener"
      );
    });
  }

  // Copiar enlace
  const copyBtn = document.getElementById("copyLink");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        copyBtn.textContent = "✓ Enlace copiado";
        setTimeout(() => (copyBtn.textContent = "🔗 Copiar enlace"), 2000);
      } catch {
        prompt("Copia este enlace:", shareUrl);
      }
    });
  }

  // Compartir nativo (móviles)
  const nativeBtn = document.getElementById("shareNative");
  if (nativeBtn) {
    if (navigator.share) {
      nativeBtn.addEventListener("click", () =>
        navigator.share({ title: "Salento a la Mano", text: shareText, url: shareUrl })
      );
    } else {
      nativeBtn.style.display = "none";
    }
  }

  // Descargar QR como PNG (SVG -> canvas)
  const dlBtn = document.getElementById("downloadQr");
  if (dlBtn && qrBox) {
    dlBtn.addEventListener("click", () => {
      const svgEl = qrBox.querySelector("svg");
      if (!svgEl) return;
      const svgStr = new XMLSerializer().serializeToString(svgEl);
      const img = new Image();
      img.onload = () => {
        const size = 600;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        const a = document.createElement("a");
        a.download = "salento-a-la-mano-qr.png";
        a.href = canvas.toDataURL("image/png");
        a.click();
      };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr);
    });
  }
});
