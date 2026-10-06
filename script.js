/* ============================================
   NEXO WEB - LÓGICA PRINCIPAL v5
   Con deep linking y mensajes personalizados
   ============================================ */

/* ============================================
   1. CONFIGURACIÓN GLOBAL
   ============================================ */
const CONFIG = {
  urlBase: 'https://grandeyeison65-sudo.github.io/nexo-web',
  whatsapp: '50375605466',
  saludo: 'Buen día. 👋'
};
/* ============================================
   1.5 SISTEMA DE TEMA CLARO / OSCURO
   ============================================ */
(function inicializarTema() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  // Recuperar tema guardado o usar oscuro por defecto
  const temaGuardado = localStorage.getItem('nexo_tema') || 'dark';
  document.body.setAttribute('data-theme', temaGuardado);

  // Toggle al hacer clic
  themeToggle.addEventListener('click', () => {
    const temaActual = document.body.getAttribute('data-theme');
    const nuevoTema = temaActual === 'dark' ? 'light' : 'dark';

    document.body.setAttribute('data-theme', nuevoTema);
    localStorage.setItem('nexo_tema', nuevoTema);
  });
})();
/* ============================================
   2. DEEP LINKING
   ============================================ */
function procesarDeepLink() {
  const hash = window.location.hash.replace('#', '');
  if (!hash) return;

  const tabsValidas = ['inicio', 'web', 'soporte', 'combo', 'proceso', 'portafolio', 'contacto'];

  if (tabsValidas.includes(hash)) {
    const targetTab = document.getElementById(hash);
    if (targetTab) {
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
      });

      document.querySelectorAll('.nav__link').forEach(link => {
        link.classList.remove('active');
      });

      targetTab.classList.add('active');

      document.querySelectorAll('.nav__link').forEach(link => {
        if (link.dataset.tab === hash) link.classList.add('active');
      });

      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        iniciarContadores();
        iniciarReveal();
      }, 200);
    }
  }
}

window.addEventListener('hashchange', procesarDeepLink);

/* ============================================
   3. SISTEMA DE PESTAÑAS
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

  history.replaceState(null, null, '#' + tabId);

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
   4. MENÚ HAMBURGUESA
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
   5. HEADER CON SOMBRA + BACK TO TOP
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
   6. CONTADORES ANIMADOS
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
      elemento.textContent = '+' + Math.floor(actual).toLocaleString();
      requestAnimationFrame(actualizar);
    } else {
      elemento.textContent = '+' + objetivo.toLocaleString();
    }
  };

  actualizar();
}

/* ============================================
   7. SCROLL REVEAL
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
   8. FAQ ACORDEÓN
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
   9. SISTEMA DE WHATSAPP PERSONALIZADO
   ============================================ */
function enviarMensajeWhatsApp(servicio, tab) {
  const servicioLimpio = (servicio || '').trim();
  const tabLimpio = (tab || '').trim();

  let linkRef = CONFIG.urlBase;
  if (tabLimpio) {
    linkRef += '/#' + tabLimpio;
  }

  let mensaje = CONFIG.saludo + '\n\n';

  if (servicioLimpio && servicioLimpio !== 'Información general') {
    mensaje += 'Vi en su web el servicio de "' + servicioLimpio + '" y me interesa.\n\n';
  } else {
    mensaje += 'Vengo desde su web Nexo Web.\n\n';
  }

  mensaje += 'Link de referencia:\n' + linkRef + '\n\n';
  mensaje += '¿Me puede dar más información?';

  const mensajeCodificado = encodeURIComponent(mensaje);
  const url = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + mensajeCodificado;
  window.open(url, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-servicio]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const servicio = btn.dataset.servicio;
      const tab = btn.dataset.tabWhatsapp || '';
      enviarMensajeWhatsApp(servicio, tab);
    });
  });
});

/* CONTINÚA EN PARTE 2 */
/* ============================================
   10. SISTEMA DE RESEÑAS
   ============================================ */
const CLAVE_RESENAS = 'nexoweb_resenas';
let resenas = JSON.parse(localStorage.getItem(CLAVE_RESENAS)) || [];

const formResena = document.getElementById('form-resena');
const listaResenas = document.getElementById('resenas-lista');
const promedioNumero = document.getElementById('promedio-numero');
const promedioEstrellas = document.getElementById('promedio-estrellas');
const promedioTotal = document.getElementById('promedio-total');
const barrasEstrellas = document.getElementById('barras-estrellas');
const estrellasInput = document.getElementById('estrellas-input');
const inputPuntuacion = document.getElementById('puntuacion');

/* ---------- 10.1 INPUT DE ESTRELLAS ---------- */
let puntuacionSeleccionada = 0;

if (estrellasInput) {
  estrellasInput.querySelectorAll('i').forEach(estrella => {
    estrella.addEventListener('mouseenter', () => {
      pintarEstrellasInput(parseInt(estrella.dataset.valor));
    });

    estrella.addEventListener('click', () => {
      puntuacionSeleccionada = parseInt(estrella.dataset.valor);
      inputPuntuacion.value = puntuacionSeleccionada;
      pintarEstrellasInput(puntuacionSeleccionada);
    });
  });

  estrellasInput.addEventListener('mouseleave', () => {
    pintarEstrellasInput(puntuacionSeleccionada);
  });
}

function pintarEstrellasInput(valor) {
  if (!estrellasInput) return;
  estrellasInput.querySelectorAll('i').forEach((el, i) => {
    if (i < valor) {
      el.classList.remove('fa-regular');
      el.classList.add('fa-solid');
    } else {
      el.classList.remove('fa-solid');
      el.classList.add('fa-regular');
    }
  });
}

/* ---------- 10.2 GUARDAR RESEÑA ---------- */
if (formResena) {
  formResena.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const comentario = document.getElementById('comentario').value.trim();
    const puntuacion = parseInt(inputPuntuacion.value);

    if (!nombre) {
      mostrarToast('Por favor escribe tu nombre', 'error');
      return;
    }
    if (puntuacion < 1 || puntuacion > 5) {
      mostrarToast('Selecciona una puntuación de 1 a 5 estrellas', 'error');
      return;
    }
    if (comentario.length < 5) {
      mostrarToast('El comentario debe tener al menos 5 caracteres', 'error');
      return;
    }

    const nuevaResena = {
      id: Date.now(),
      nombre: nombre,
      puntuacion: puntuacion,
      comentario: comentario,
      fecha: new Date().toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric'
      })
    };

    resenas.unshift(nuevaResena);
    localStorage.setItem(CLAVE_RESENAS, JSON.stringify(resenas));

    formResena.reset();
    puntuacionSeleccionada = 0;
    inputPuntuacion.value = 0;
    pintarEstrellasInput(0);

    renderizarResenas();
    calcularPromedio();

    mostrarToast('Gracias por tu reseña.', 'ok');
  });
}

/* ---------- 10.3 MOSTRAR RESEÑAS ---------- */
function renderizarResenas() {
  if (!listaResenas) return;

  listaResenas.innerHTML = '';

  if (resenas.length === 0) {
    listaResenas.innerHTML = '<p class="resenas-vacio"><i class="fa-regular fa-comment-dots"></i><br>Aún no hay reseñas. ¡Sé el primero en opinar!</p>';
    return;
  }

  resenas.forEach(resena => {
    const inicial = resena.nombre.charAt(0).toUpperCase();
    const estrellasHTML = generarEstrellasHTML(resena.puntuacion);

    const div = document.createElement('div');
    div.className = 'resena';
    div.innerHTML = '<div class="resena__head"><div class="resena__avatar">' + inicial + '</div><div class="resena__info"><h5>' + escapeHTML(resena.nombre) + '</h5><div class="estrellas">' + estrellasHTML + '</div></div></div><p class="resena__texto">' + escapeHTML(resena.comentario) + '</p><span class="resena__fecha">' + resena.fecha + '</span>';
    listaResenas.appendChild(div);
  });
}

/* ---------- 10.4 ESTRELLAS HTML ---------- */
function generarEstrellasHTML(puntuacion) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= puntuacion) html += '<i class="fa-solid fa-star"></i>';
    else html += '<i class="fa-regular fa-star"></i>';
  }
  return html;
}

/* ---------- 10.5 PROMEDIO PONDERADO ---------- */
function calcularPromedio() {
  if (!promedioNumero) return;

  const total = resenas.length;

  if (total === 0) {
    promedioNumero.textContent = '0.0';
    promedioTotal.textContent = 'Basado en 0 reseñas';
    promedioEstrellas.innerHTML = generarEstrellasHTML(0);
    barrasEstrellas.innerHTML = '';
    for (let i = 5; i >= 1; i--) {
      barrasEstrellas.appendChild(crearBarra(i, 0));
    }
    return;
  }

  const suma = resenas.reduce((acc, r) => acc + r.puntuacion, 0);
  const promedio = suma / total;
  const promedioRedondeado = promedio.toFixed(1);

  promedioNumero.textContent = promedioRedondeado;
  promedioTotal.textContent = 'Basado en ' + total + ' reseña' + (total !== 1 ? 's' : '');
  promedioEstrellas.innerHTML = generarEstrellasHTML(Math.round(promedio));

  const conteo = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  resenas.forEach(r => conteo[r.puntuacion]++);

  barrasEstrellas.innerHTML = '';
  for (let i = 5; i >= 1; i--) {
    const cantidad = conteo[i];
    const porcentaje = (cantidad / total) * 100;
    barrasEstrellas.appendChild(crearBarra(i, porcentaje, cantidad));
  }
}

/* ---------- 10.6 BARRA PORCENTAJE ---------- */
function crearBarra(estrellas, porcentaje, cantidad = 0) {
  const div = document.createElement('div');
  div.className = 'barra';
  div.innerHTML = '<span>' + estrellas + ' <i class="fa-solid fa-star" style="color:#facc15;font-size:0.75rem"></i></span><div class="barra__track"><div class="barra__fill" style="width: 0%"></div></div><span>' + Math.round(porcentaje) + '%</span>';

  setTimeout(() => {
    const fill = div.querySelector('.barra__fill');
    if (fill) fill.style.width = porcentaje + '%';
  }, 60);

  return div;
}

/* ---------- 10.7 SEGURIDAD ---------- */
function escapeHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

/* ============================================
   11. RESEÑAS DE EJEMPLO
   ============================================ */
(function cargarResenasEjemplo() {
  const yaCargado = localStorage.getItem('nexoweb_ejemplo_v5');

  if (!yaCargado && resenas.length === 0) {
    const ejemplos = [
      { id: 1, nombre: 'María Fernández', puntuacion: 5, comentario: 'Excelente servicio, mi catálogo web quedó increíble. Muy recomendados.', fecha: '12 oct 2025' },
      { id: 2, nombre: 'Roberto Castillo', puntuacion: 5, comentario: 'Me hicieron la página de mi negocio y también le dieron mantenimiento a mis computadoras.', fecha: '10 oct 2025' },
      { id: 3, nombre: 'Estudio Creativo SV', puntuacion: 4, comentario: 'Buen trabajo con la página. Solo tardaron un día más de lo previsto pero valió la pena.', fecha: '08 oct 2025' },
      { id: 4, nombre: 'Carlos Mendoza', puntuacion: 5, comentario: 'El combo de web + soporte fue la mejor decisión. Ahorré bastante.', fecha: '05 oct 2025' },
      { id: 5, nombre: 'Lucía Ramírez', puntuacion: 4, comentario: 'Muy profesionales. Me instalaron la red completa de la oficina sin problemas.', fecha: '02 oct 2025' }
    ];

    resenas = ejemplos;
    localStorage.setItem(CLAVE_RESENAS, JSON.stringify(resenas));
    localStorage.setItem('nexoweb_ejemplo_v5', 'true');
  }
})();

/* ============================================
   12. CALCULADORA CON CUPONES
   ============================================ */
const CUPONES = {
  'NEXO25':    { descuento: 25, tipo: 'todo' },
  'WEB20':     { descuento: 20, tipo: 'web' },
  'COMBO15':   { descuento: 15, tipo: 'combo' },
  'SOPORTE10': { descuento: 10, tipo: 'soporte' }
};

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

  function formatear(valor) {
    return '$' + valor.toFixed(2);
  }

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

  btnAplicar.addEventListener('click', () => {
    const codigo = inputCupon.value.trim().toUpperCase();

    if (!codigo) {
      mostrarToast('Escribe un código de cupón', 'error');
      inputCupon.focus();
      return;
    }

    if (CUPONES[codigo]) {
      cuponAplicado = { codigo, ...CUPONES[codigo] };
      mostrarToast('Cupón ' + codigo + ' aplicado: ' + cuponAplicado.descuento + '% de descuento', 'ok');
      inputCupon.style.borderColor = 'var(--verde)';
      btnAplicar.innerHTML = '<i class="fa-solid fa-check"></i> Aplicado';
      btnAplicar.style.background = 'var(--verde)';
      actualizarTotal();
    } else {
      cuponAplicado = null;
      mostrarToast('Cupón no válido o expirado', 'error');
      inputCupon.style.borderColor = '#ef4444';
      actualizarTotal();

      setTimeout(() => {
        inputCupon.style.borderColor = '';
      }, 2000);
    }
  });

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

    let msg = CONFIG.saludo + '\n\n';
    msg += 'Hice una cotización en su calculadora de la web.\n\n';
    msg += 'Servicio: ' + servicioActual.nombre + '\n';
    msg += 'Subtotal: $' + subtotal.toFixed(2) + '\n';

    if (cuponAplicado) {
      msg += 'Cupón aplicado: ' + cuponAplicado.codigo + ' (-' + cuponAplicado.descuento + '%)\n';
      msg += 'Descuento: -$' + descuento.toFixed(2) + '\n';
    }

    msg += '\nTotal estimado: $' + total.toFixed(2) + '\n\n';
    msg += 'Link de referencia:\n' + CONFIG.urlBase + '/#combo\n\n';
    msg += '¿Me puede confirmar?';

    const mensajeCodificado = encodeURIComponent(msg);
    window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + mensajeCodificado, '_blank');
    mostrarToast('Abriendo WhatsApp...', 'ok');
  });

  actualizarTotal();
})();

/* ============================================
   13. COPIAR CUPONES
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

        mostrarToast('Cupón ' + codigo + ' copiado al portapapeles', 'ok');

        const inputCalculadora = document.getElementById('calc-cupon-input');
        if (inputCalculadora) {
          inputCalculadora.value = codigo;
        }

        setTimeout(() => {
          btn.innerHTML = textoOriginal;
          btn.classList.remove('copiado');
        }, 2000);
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = codigo;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();

        mostrarToast('Cupón ' + codigo + ' copiado', 'ok');

        const inputCalculadora = document.getElementById('calc-cupon-input');
        if (inputCalculadora) inputCalculadora.value = codigo;
      }
    });
  });
})();

/* ============================================
   14. FORMULARIO DE CONTACTO
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

    let msg = CONFIG.saludo + '\n\n';
    msg += 'Nuevo mensaje desde el formulario de la web.\n\n';
    msg += 'Nombre: ' + nombre + '\n';
    msg += 'Teléfono: ' + telefono + '\n';
    msg += 'Servicio de interés: ' + servicio + '\n\n';
    msg += 'Mensaje:\n' + mensaje + '\n\n';
    msg += 'Link:\n' + CONFIG.urlBase + '/#contacto';

    const mensajeCodificado = encodeURIComponent(msg);
    window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + mensajeCodificado, '_blank');

    mostrarToast('Mensaje enviado. Le contactaremos pronto.', 'ok');

    setTimeout(() => form.reset(), 800);
  });
})();

/* ============================================
   15. TOAST DE NOTIFICACIÓN
   ============================================ */
function mostrarToast(mensaje, tipo = 'ok') {
  const colores = {
    ok:    '#b91c1c',
    error: '#ef4444',
    info:  '#06d6f5'
  };

  const textos = {
    ok:    '#ffffff',
    error: '#ffffff',
    info:  '#0f172a'
  };

  const iconos = {
    ok:    'fa-circle-check',
    error: 'fa-circle-exclamation',
    info:  'fa-circle-info'
  };

  document.querySelectorAll('.nexo-toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = 'nexo-toast';
  toast.innerHTML = '<i class="fa-solid ' + iconos[tipo] + '"></i> <span>' + mensaje + '</span>';
  toast.style.cssText = 'position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%) translateY(30px); background: ' + colores[tipo] + '; color: ' + textos[tipo] + '; padding: 15px 28px; border-radius: 999px; font-family: Outfit, sans-serif; font-size: 0.92rem; font-weight: 600; box-shadow: 0 15px 40px rgba(0,0,0,0.4); z-index: 3000; opacity: 0; transition: opacity 0.35s ease, transform 0.35s ease; pointer-events: none; display: flex; align-items: center; gap: 10px; max-width: 90vw; text-align: center; letter-spacing: 0.3px;';

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
   16. INICIALIZACIÓN
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

  renderizarResenas();
  calcularPromedio();
  iniciarContadores();
  iniciarReveal();

  setTimeout(procesarDeepLink, 100);
});

/* ============================================
   17. ATAJOS DE TECLADO
   ============================================ */
document.addEventListener('keydown', (e) => {
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

  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    window.open('https://wa.me/' + CONFIG.whatsapp, '_blank');
    mostrarToast('Abriendo WhatsApp...', 'info');
  }

  if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
    const tabs = ['inicio', 'web', 'soporte', 'combo', 'proceso', 'portafolio', 'contacto'];
    const num = parseInt(e.key);
    if (num >= 1 && num <= 7) {
      e.preventDefault();
      switchTab(tabs[num - 1]);
      mostrarToast('Pestaña: ' + tabs[num - 1].toUpperCase(), 'info');
    }
  }
});

/* ============================================
   18. SCROLL SUAVE EN ANCLAS
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      if (link.dataset.tab) return;
      if (link.dataset.servicio) return;

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
   19. PARALLAX EN HERO CARDS
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
      card.style.transform = 'translate(' + (x * factor) + 'px, ' + (y * factor) + 'px)';
    });
  });

  heroVisual.addEventListener('mouseleave', () => {
    cards.forEach(card => { card.style.transform = ''; });
  });
})();

/* ============================================
   20. AÑO AUTOMÁTICO EN FOOTER
   ============================================ */
(function actualizarAnio() {
  const yearElements = document.querySelectorAll('.footer__bottom p');
  const anioActual = new Date().getFullYear();
  yearElements.forEach(el => {
    el.innerHTML = el.innerHTML.replace('2026', anioActual);
  });
})();

/* ============================================
   21. SIN TRANSICIÓN AL CARGAR
   ============================================ */
(function evitarFlash() {
  document.documentElement.classList.add('no-transition');
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.documentElement.classList.remove('no-transition');
    }, 100);
  });
})();
