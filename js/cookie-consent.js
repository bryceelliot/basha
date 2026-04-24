/* ============================================================
   Cookie Consent — Basha Donair & Shawarma Kelowna
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'basha_cookie_consent';
  var banner = document.getElementById('cookie-banner');
  if (!banner) return;

  // Already decided — stay hidden
  if (localStorage.getItem(STORAGE_KEY)) return;

  // Show after a short delay so it doesn't flash on load
  setTimeout(function () { banner.classList.add('show'); }, 900);

  function dismiss(choice) {
    localStorage.setItem(STORAGE_KEY, choice);
    banner.classList.remove('show');
  }

  var btnAccept  = document.getElementById('cookie-accept');
  var btnDecline = document.getElementById('cookie-decline');

  if (btnAccept)  btnAccept.addEventListener('click',  function () { dismiss('accepted'); });
  if (btnDecline) btnDecline.addEventListener('click', function () { dismiss('declined'); });
})();
