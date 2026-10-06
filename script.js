/* ============================================
   NEXO WEB - LÓGICA PRINCIPAL v4
   Modo claro/oscuro · Cupones · Calculadora
   ============================================ */

/* ============================================
   1. SISTEMA DE TEMA CLARO/OSCURO
   ============================================ */
(function inicializarTema() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  // Recuperar tema guardado o usar oscuro por defecto
  const temaGuardado = localStorage.getItem('nexo_tema') || 'dark';
  document.body.setAttribute('data-theme', temaGuardado);

  // Detectar preferencia del sistema si no hay nada guardado
  if (!localStorage.getItem('nexo_tema')) {
    const prefiereClaro = window.matchMedia('(prefers-color-scheme: light)').matches;
    document.body.setAttribute('data-theme', prefiereClaro ? 'light' : 'dark');
  }

  // Toggle al hacer clic
  themeToggle.addEventListener('click', () => {
    const temaActual = document.body.getAttribute('data-theme');
    const nuevoTema = temaActual === 'dark' ? 'light' : 'dark';

    document.body.setAttribute('data-theme', nuevoTema);
    localStorage.setItem('nexo_tema', nuevoTema);

    mostrarToast(
      nuevoTema === 'dark' ? '🌙 Modo oscuro activado' : '☀️ Modo claro activado',
      'info'
    );
  });
})();

/* ============================================
   2. SISTEMA DE PESTAÑAS
   ============================================ */
function switchTab(tabId) {
  const targetTab = document.getElementById(tabId);
  if (!targetTab) return;

  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  document.querySelectorAll('.nav__link').forEach(link => {
    link.classList.remove('active');
  });

  targetTab.classList.add('active');

  document.querySelectorAll('.nav__link').forEach(link => {
    if (link.dataset.tab === tabId) link.classList.add('active');
  });

  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  if (nav) nav.classList.remove('open');
  if (hamburger) {
    const icon = hamburger.querySelector('i');
    if (icon) {
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-xmark');
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });

  setTimeout(() => {
    iniciarContadores();
    iniciarReveal();
  }, 100);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-tab]').forEach(el => {
    el.addEventListener('click', (e) => {
      if (el.tagName === 'A' && el.getAttribute('href') === '#') {
        e.preventDefault();
      }
      switchTab(el.dataset.tab);
    });
  });
});

/* ============================================
   3. MENÚ HAMBURGUESA
   ============================================ */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    const icon = hamburger.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-xmark');
    }
  });
}

/* ============================================
   4. HEADER + BACK TO TOP
   ============================================ */
const header = document.getElementById('header');
const backTop = document.getElementById('back-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    if (header) header.classList.add('scrolled');
  } else {
    if (header) header.classList.remove('scrolled');
  }

  if (window.scrollY > 400) {
    if (backTop) backTop.classList.add('visible');
  } else {
    if (backTop) backTop.classList.remove('visible');
  }
});

if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================
   5. CONTADORES ANIMADOS
   ============================================ */
function iniciarContadores() {
  const contadores = document.querySelectorAll('.contador');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animado) {
        animarContador(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  contadores.forEach(c => {
    if (!c.dataset.animado) observer.observe(c);
  });
}

function animarContador(elemento) {
  elemento.dataset.animado = 'true';

  const objetivo = parseInt(elemento.dataset.target);
  const duracion = 1800;
  const paso = objetivo / (duracion / 16);
  let actual = 0;

  const actualizar = () => {
    actual += paso;
    if (actual < objetivo) {
      elemento.textContent = Math.floor(actual).toLocaleString();
      requestAnimationFrame(actualizar);
    } else {
      elemento.textContent = objetivo.toLocaleString();
    }
  };

  actualizar();
}

/* ============================================
   6. SCROLL REVEAL
   ============================================ */
function iniciarReveal() {
  const elementos = document.querySelectorAll(
    '.duo-card, .beneficio-card, .info-card, .precio-card, .plan-mantenimiento, .servicio-card, .zona-card, .combo-card, .portafolio-item, .contacto-card, .faq-item, .cta-band, .combo-hero, .cupon-card, .testimonio, .calc-cupon, .proceso-bloque, .timeline__item'
  );

  elementos.forEach(el => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  elementos.forEach(el => {
    if (!el.classList.contains('visible')) observer.observe(el);
  });
}

/* ============================================
   7. FAQ ACORDEÓN
   ============================================ */
(function inicializarFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const pregunta = item.querySelector('.faq-item__q');
    if (!pregunta) return;

    pregunta.addEventListener('click', () => {
      const estabaAbierto = item.classList.contains('abierto');
      items.forEach(i => i.classList.remove('abierto'));
      if (!estabaAbierto) item.classList.add('abierto');
    });
  });

  if (items[0]) items[0].classList.add('abierto');
})();

/* ============================================
   8. SISTEMA DE CUPONES
   ============================================ */
const CUPONES = {
  'NEXO25':    { descuento: 25, tipo: 'todo',    descripcion: '25% de descuento general' },
  'WEB20':     { descuento: 20, tipo: 'web',     descripcion: '20% en planes web' },
  'COMBO15':   { descuento: 15, tipo: 'combo',   descripcion: '15% en combos' },
  'SOPORTE10': { descuento: 10, tipo: 'soporte', descripcion: '10% en soporte técnico' }
};

/* ============================================
   9. CALCULADORA CON CUPONES
   ============================================ */
(function inicializarCalculadora() {
  const select = document.getElementById('calc-servicio');
  const inputCupon = document.getElementById('calc-cupon-input');
  const btnAplicar = document.getElementById('calc-aplicar');
  const subtotalEl = document.getElementById('calc-subtotal');
  const descuentoRow = document.getElementById('calc-descuento-row');
  const descuentoEl = document.getElementById('calc-descuento');
  const totalEl = document.getElementById('calc-total');
  const btnEnviar = document.getElementById('calc-enviar');

  if (!select || !btnAplicar) return;

  let cuponAplicado = null;
  let servicioActual = { nombre: '', precio: 0 };

  // Formatear moneda
  function formatear(valor) {
    return '$' + valor.toFixed(2);
  }

  // Actualizar totales
  function actualizarTotal() {
    const subtotal = servicioActual.precio;
    let descuento = 0;

    if (cuponAplicado && subtotal > 0) {
      descuento = subtotal * (cuponAplicado.descuento / 100);
    }

    const total = subtotal - descuento;

    subtotalEl.textContent = formatear(subtotal);

    if (descuento > 0) {
      descuentoRow.style.display = 'flex';
      descuentoEl.textContent = '-' + formatear(descuento);
    } else {
      descuentoRow.style.display = 'none';
    }

    totalEl.textContent = formatear(total);
  }

  // Cambio de servicio
  select.addEventListener('change', () => {
    const valor = select.value;
    if (!valor) {
      servicioActual = { nombre: '', precio: 0 };
    } else {
      const [nombre, precio] = valor.split('|');
      servicioActual = { nombre, precio: parseFloat(precio) };
    }
    actualizarTotal();
  });

  // Aplicar cupón
  btnAplicar.addEventListener('click', () => {
    const codigo = inputCupon.value.trim().toUpperCase();

    if (!codigo) {
      mostrarToast('Escribe un código de cupón', 'error');
      inputCupon.focus();
      return;
    }

    if (CUPONES[codigo]) {
      cuponAplicado = { codigo, ...CUPONES[codigo] };
      mostrarToast(`🎟️ Cupón ${codigo} aplicado: ${cuponAplicado.descuento}% OFF`, 'ok');
      inputCupon.style.borderColor = 'var(--verde)';
      btnAplicar.innerHTML = '<i class="fa-solid fa-check"></i> Aplicado';
      btnAplicar.style.background = 'var(--verde)';
      actualizarTotal();
    } else {
      cuponAplicado = null;
      mostrarToast('❌ Cupón no válido o expirado', 'error');
      inputCupon.style.borderColor = '#ef4444';
      actualizarTotal();

      setTimeout(() => {
        inputCupon.style.borderColor = '';
      }, 2000);
    }
  });

  // Enviar cotización por WhatsApp
  btnEnviar.addEventListener('click', () => {
    if (!servicioActual.nombre) {
      mostrarToast('Selecciona un servicio primero', 'error');
      select.focus();
      return;
    }

    const subtotal = servicioActual.precio;
    let descuento = 0;
    if (cuponAplicado) {
      descuento = subtotal * (cuponAplicado.descuento / 100);
    }
    const total = subtotal - descuento;

    let msg = `*COTIZACIÓN - Nexo Web* 💼%0A%0A`;
    msg += `🛠️ *Servicio:* ${servicioActual.nombre}%0A`;
    msg += `💰 *Subtotal:* $${subtotal.toFixed(2)}%0A`;

    if (cuponAplicado) {
      msg += `🎟️ *Cupón aplicado:* ${cuponAplicado.codigo} (-${cuponAplicado.descuento}%)%0A`;
      msg += `📉 *Descuento:* -$${descuento.toFixed(2)}%0A`;
    }

    msg += `%0A✅ *Total a pagar:* $${total.toFixed(2)}%0A%0A`;
    msg += `_Enviado desde la calculadora de Nexo Web_`;

    window.open(`https://wa.me/50375605466?text=${msg}`, '_blank');
    mostrarToast('¡Cotización enviada! 🚀', 'ok');
  });

  actualizarTotal();
})();

/* ============================================
   10. COPIAR CUPONES AL PORTAPAPELES
   ============================================ */
(function inicializarCopiarCupones() {
  document.querySelectorAll('[data-codigo]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const codigo = btn.dataset.codigo;

      try {
        await navigator.clipboard.writeText(codigo);

        const textoOriginal = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> ¡Copiado!';
        btn.classList.add('copiado');

        mostrarToast(`📋 Cupón ${codigo} copiado al portapapeles`, 'ok');

        // Auto-llenar el input de la calculadora si existe
        const inputCalculadora = document.getElementById('calc-cupon-input');
        if (inputCalculadora) {
          inputCalculadora.value = codigo;
        }

        setTimeout(() => {
          btn.innerHTML = textoOriginal;
          btn.classList.remove('copiado');
        }, 2000);
      } catch (err) {
        // Fallback para navegadores sin clipboard API
        const textarea = document.createElement('textarea');
        textarea.value = codigo;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();

        mostrarToast(`📋 Cupón ${codigo} copiado`, 'ok');

        const inputCalculadora = document.getElementById('calc-cupon-input');
        if (inputCalculadora) inputCalculadora.value = codigo;
      }
    });
  });
})();

/* ============================================
   11. FORMULARIO DE CONTACTO
   ============================================ */
(function inicializarFormContacto() {
  const form = document.getElementById('form-contacto');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('cf-nombre').value.trim();
    const telefono = document.getElementById('cf-telefono').value.trim();
    const servicio = document.getElementById('cf-servicio').value;
    const mensaje = document.getElementById('cf-mensaje').value.trim();

    if (!nombre || !telefono || !servicio || !mensaje) {
      mostrarToast('Completa todos los campos obligatorios', 'error');
      return;
    }

    let msg = `*NUEVO MENSAJE - Nexo Web* 🚀%0A%0A`;
    msg += `👤 *Nombre:* ${encodeURIComponent(nombre)}%0A`;
    msg += `📞 *Teléfono:* ${encodeURIComponent(telefono)}%0A`;
    msg += `🛠️ *Servicio de interés:* ${encodeURIComponent(servicio)}%0A%0A`;
    msg += `📝 *Mensaje:*%0A${encodeURIComponent(mensaje)}%0A%0A`;
    msg += `_Enviado desde la web de Nexo Web_`;

    window.open(`https://wa.me/50375605466?text=${msg}`, '_blank');

    mostrarToast('¡Mensaje enviado! Te contactamos pronto 🚀', 'ok');

    setTimeout(() => form.reset(), 800);
  });
})();

/* ============================================
   12. TOAST DE NOTIFICACIÓN
   ============================================ */
function mostrarToast(mensaje, tipo = 'ok') {
  const colores = {
    ok:    '#10b981',
    error: '#ef4444',
    info:  '#8b5cf6'
  };

  const iconos = {
    ok:    'fa-circle-check',
    error: 'fa-circle-exclamation',
    info:  'fa-circle-info'
  };

  document.querySelectorAll('.nexo-toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = 'nexo-toast';
  toast.innerHTML = `<i class="fa-solid ${iconos[tipo]}"></i> <span>${mensaje}</span>`;
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%) translateY(30px);
    background: ${colores[tipo]};
    color: #ffffff;
    padding: 15px 28px;
    border-radius: 999px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.92rem;
    font-weight: 600;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
    z-index: 3000;
    opacity: 0;
    transition: opacity 0.35s ease, transform 0.35s ease;
    pointer-events: none;
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 90vw;
    text-align: center;
    letter-spacing: 0.3px;
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(30px)';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

/* ============================================
   13. INICIALIZACIÓN
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  const inicioTab = document.getElementById('inicio');
  if (inicioTab && !inicioTab.classList.contains('active')) {
    const hayActiva = document.querySelector('.tab-content.active');
    if (!hayActiva) {
      inicioTab.classList.add('active');
      const inicioLink = document.querySelector('.nav__link[data-tab="inicio"]');
      if (inicioLink) inicioLink.classList.add('active');
    }
  }

  iniciarContadores();
  iniciarReveal();
});

/* ============================================
   14. ATAJOS DE TECLADO
   ============================================ */
document.addEventListener('keydown', (e) => {
  // Escape: cerrar menú móvil
  if (e.key === 'Escape') {
    if (nav && nav.classList.contains('open')) {
      nav.classList.remove('open');
      if (hamburger) {
        const icon = hamburger.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      }
    }
  }

  // Ctrl+K → WhatsApp
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    window.open('https://wa.me/50375605466', '_blank');
    mostrarToast('Abriendo WhatsApp...', 'info');
  }

  // Ctrl+Shift+D → Cambiar tema
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
    e.preventDefault();
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) themeToggle.click();
  }

  // Ctrl+1-7 → Cambiar pestaña
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
    const tabs = ['inicio', 'web', 'soporte', 'combo', 'proceso', 'portafolio', 'contacto'];
    const num = parseInt(e.key);
    if (num >= 1 && num <= 7) {
      e.preventDefault();
      switchTab(tabs[num - 1]);
      mostrarToast(`Pestaña: ${tabs[num - 1].toUpperCase()}`, 'info');
    }
  }
});

/* ============================================
   15. SCROLL SUAVE EN ANCLAS
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      if (link.dataset.tab) return;

      const destino = document.querySelector(href);
      if (destino) {
        e.preventDefault();
        const offset = 100;
        const top = destino.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
});

/* ============================================
   16. PARALLAX EN HERO CARDS
   ============================================ */
(function inicializarParallax() {
  const cards = document.querySelectorAll('.hero__card');
  if (!cards.length || window.innerWidth < 960) return;

  const heroVisual = document.querySelector('.hero__visual');
  if (!heroVisual) return;

  heroVisual.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    cards.forEach((card, i) => {
      const factor = (i + 1) * 8;
      card.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });

  heroVisual.addEventListener('mouseleave', () => {
    cards.forEach(card => { card.style.transform = ''; });
  });
})();

/* ============================================
   17. PORTAFOLIO - BOTONES PRÓXIMAMENTE
   ============================================ */
(function inicializarPortafolio() {
  document.querySelectorAll('[data-portafolio]').forEach(btn => {
    btn.addEventListener('click', () => {
      const proyecto = btn.dataset.portafolio;
      const nombres = {
        flash: 'Flash Express',
        tech: 'TechNova',
        nexo: 'Nexo Web'
      };
      mostrarToast(`🚀 El link de ${nombres[proyecto] || 'este proyecto'} estará disponible próximamente`, 'info');
    });
  });
})();

/* ============================================
   18. AÑO AUTOMÁTICO EN FOOTER
   ============================================ */
(function actualizarAnio() {
  const yearElements = document.querySelectorAll('.footer__bottom p');
  const anioActual = new Date().getFullYear();
  yearElements.forEach(el => {
    el.innerHTML = el.innerHTML.replace('2026', anioActual);
  });
})();

/* ============================================
   19. SIN TRANSICIÓN AL CARGAR
   ============================================ */
(function evitarFlashTema() {
  document.documentElement.classList.add('no-transition');
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.documentElement.classList.remove('no-transition');
    }, 100);
  });
})();