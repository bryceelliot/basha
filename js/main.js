/* ============================================================
   Basha Donair & Shawarma Kelowna — Main JavaScript
   ============================================================ */

'use strict';

/* --- Navbar scroll behaviour --- */
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* --- Mobile menu toggle --- */
(function () {
  const btn  = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  const iconOpen  = btn.querySelector('.icon-open');
  const iconClose = btn.querySelector('.icon-close');

  btn.addEventListener('click', function () {
    const isOpen = menu.classList.toggle('open');
    if (iconOpen)  iconOpen.classList.toggle('hidden', isOpen);
    if (iconClose) iconClose.classList.toggle('hidden', !isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
      if (iconOpen)  iconOpen.classList.remove('hidden');
      if (iconClose) iconClose.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* --- Menu category tabs (menu.html) --- */
(function () {
  const tabs     = document.querySelectorAll('.menu-tab');
  const sections = document.querySelectorAll('.menu-section');
  if (!tabs.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const target = tab.dataset.target;

      // Update tabs
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');

      // Update sections
      sections.forEach(function (s) { s.classList.remove('active'); });
      const targetSection = document.getElementById(target);
      if (targetSection) targetSection.classList.add('active');
    });
  });
})();

/* --- Scroll reveal --- */
(function () {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach(function (el) { observer.observe(el); });
})();

/* --- Back to top button --- */
(function () {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* --- Contact form (contact.html) — powered by Formspree --- */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending\u2026';
    btn.disabled = true;

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) {
        if (res.ok) {
          const msg = document.getElementById('form-success');
          if (msg) { msg.classList.remove('hidden'); form.reset(); }
        } else {
          res.json().then(function (data) {
            alert(data.errors ? data.errors.map(function (e) { return e.message; }).join(', ')
              : 'Something went wrong. Please call us at (778)\u00a0753-7313.');
          });
        }
      })
      .catch(function () {
        alert('Could not send your message. Please call us at (778)\u00a0753-7313.');
      })
      .finally(function () {
        btn.textContent = originalText;
        btn.disabled = false;
      });
  });
})();

/* --- Sticky active nav link highlight --- */
(function () {
  const links = document.querySelectorAll('nav a[href]');
  const current = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(function (link) {
    const href = link.getAttribute('href').split('/').pop();
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('text-basha-red');
    }
  });
})();

/* ============================================================
   PREMIUM INTERACTIONS — scroll progress, count-up, parallax
   ============================================================ */

/* --- Scroll progress bar --- */
(function () {
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  function update() {
    var h = document.documentElement;
    var scrolled = (h.scrollTop || document.body.scrollTop);
    var height = (h.scrollHeight - h.clientHeight) || 1;
    bar.style.width = ((scrolled / height) * 100) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* --- Count-up for numeric stats (data-count-to="487") --- */
(function () {
  var els = document.querySelectorAll('.count-up[data-count-to]');
  if (!els.length || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.textContent = el.getAttribute('data-count-to'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var end = parseFloat(el.getAttribute('data-count-to')) || 0;
      var dur = 1600;
      var start = performance.now();
      function tick(now) {
        var t = Math.min(1, (now - start) / dur);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (end % 1 === 0)
          ? Math.round(end * eased).toLocaleString()
          : (end * eased).toFixed(1);
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  els.forEach(function (el) { io.observe(el); });
})();

/* --- Reveal-on-scroll (.reveal → .is-visible) --- */
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (el) { io.observe(el); });
})();

/* --- Light parallax on .parallax elements --- */
(function () {
  var els = document.querySelectorAll('.parallax');
  if (!els.length) return;
  function update() {
    var y = window.scrollY;
    els.forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax') || '0.25');
      el.style.transform = 'translate3d(0,' + (y * speed * -1) + 'px,0)';
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* --- Magnetic button (subtle cursor follow on desktop) --- */
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  var els = document.querySelectorAll('.btn-magnetic');
  els.forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left - r.width / 2) * 0.15;
      var y = (e.clientY - r.top - r.height / 2) * 0.15;
      el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    });
    el.addEventListener('mouseleave', function () {
      el.style.transform = '';
    });
  });
})();

/* --- Hero cursor spotlight --- */
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  var hero = document.querySelector('section.relative.min-h-screen');
  if (!hero) return;
  hero.addEventListener('mousemove', function (e) {
    var r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    hero.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  }, { passive: true });
})();

/* --- Service Worker registration --- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function () {});
  });
}

/* --- Lightbox: any <img data-lightbox> opens a fullscreen viewer --- */
(function () {
  var imgs = document.querySelectorAll('img[data-lightbox]');
  if (!imgs.length) return;

  var overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML =
    '<button class="lightbox-close" aria-label="Close">&times;</button>' +
    '<button class="lightbox-nav lightbox-prev" aria-label="Previous">&larr;</button>' +
    '<button class="lightbox-nav lightbox-next" aria-label="Next">&rarr;</button>' +
    '<img class="lightbox-img" alt="">' +
    '<div class="lightbox-counter"></div>';
  document.body.appendChild(overlay);

  var imgEl = overlay.querySelector('.lightbox-img');
  var counter = overlay.querySelector('.lightbox-counter');
  var idx = 0;
  var sources = [].map.call(imgs, function (i) {
    return { src: i.dataset.lightbox || i.src, alt: i.alt || '' };
  });

  function open(i) {
    idx = (i + sources.length) % sources.length;
    imgEl.src = sources[idx].src;
    imgEl.alt = sources[idx].alt;
    counter.textContent = (idx + 1) + ' / ' + sources.length;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  imgs.forEach(function (i, n) {
    i.addEventListener('click', function (e) { e.preventDefault(); open(n); });
  });
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });
  overlay.querySelector('.lightbox-close').addEventListener('click', close);
  overlay.querySelector('.lightbox-prev').addEventListener('click', function (e) {
    e.stopPropagation(); open(idx - 1);
  });
  overlay.querySelector('.lightbox-next').addEventListener('click', function (e) {
    e.stopPropagation(); open(idx + 1);
  });
  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') open(idx - 1);
    if (e.key === 'ArrowRight') open(idx + 1);
  });
})();

/* --- Web Vitals: report to console (and to GA4 if available) --- */
(function () {
  if (!('PerformanceObserver' in window)) return;
  function report(name, value) {
    var v = Math.round(name === 'CLS' ? value * 1000 : value);
    if (window.console && console.log) console.log('[Web Vitals]', name, v);
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, { value: v, metric_id: name, non_interaction: true });
    }
  }
  // LCP
  try {
    new PerformanceObserver(function (l) {
      var entries = l.getEntries();
      var last = entries[entries.length - 1];
      report('LCP', last.startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {}
  // CLS
  try {
    var cls = 0;
    new PerformanceObserver(function (l) {
      l.getEntries().forEach(function (e) {
        if (!e.hadRecentInput) cls += e.value;
      });
      report('CLS', cls);
    }).observe({ type: 'layout-shift', buffered: true });
  } catch (e) {}
  // FCP
  try {
    new PerformanceObserver(function (l) {
      l.getEntries().forEach(function (e) {
        if (e.name === 'first-contentful-paint') report('FCP', e.startTime);
      });
    }).observe({ type: 'paint', buffered: true });
  } catch (e) {}
})();

/* --- Magnetic floating phone button --- */
(function () {
  var btn = document.querySelector('.whatsapp-float');
  if (!btn) return;
  if (window.matchMedia('(hover: none)').matches) return;
  btn.addEventListener('mousemove', function (e) {
    var r = btn.getBoundingClientRect();
    var x = ((e.clientX - r.left) / r.width - 0.5) * 12;
    var y = ((e.clientY - r.top) / r.height - 0.5) * 12;
    btn.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(1.08)';
  });
  btn.addEventListener('mouseleave', function () {
    btn.style.transform = '';
  });
})();

/* --- Mark active nav link with aria-current="page" --- */
(function () {
  var path = location.pathname.replace(/\/+$/, '/');
  var current = path === '/' ? 'index.html' : path.split('/').pop();
  document.querySelectorAll('#navbar a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    var leaf = href.split('/').pop();
    if (leaf === current || (current === '' && href === 'index.html')) {
      a.setAttribute('aria-current', 'page');
    }
  });
})();

/* --- Journal search (only on /journal/index.html) --- */
(function () {
  var input = document.getElementById('journal-search');
  if (!input) return;
  var cards = document.querySelectorAll('[data-journal-card]');
  input.addEventListener('input', function () {
    var q = input.value.toLowerCase().trim();
    cards.forEach(function (c) {
      var t = (c.textContent || '').toLowerCase();
      c.style.display = !q || t.indexOf(q) !== -1 ? '' : 'none';
    });
  });
})();
