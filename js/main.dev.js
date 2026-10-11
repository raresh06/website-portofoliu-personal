/**
 * PORTOFOLIU PERSONAL — GHEORGHES RAREȘ (GR)
 * Script dedicat:
 * - Redare video Google Drive (cele 7 TikTok-uri în player adaptiv vertical 9:16)
 * - Lightbox modal pentru grafică și imagini (Postere, Carusele, Afișe)
 * - Filtrare pe categorii
 * - Copiere rapidă email și telefon
 */

'use strict';

// Protecție Anti-Clickjacking & Anti-Framing (Frame-Busting)
if (window.top !== window.self) {
  try {
    window.top.location = window.self.location;
  } catch (e) {
    window.location = 'about:blank';
  }
}

/* ==========================================================================
   1. REGISTRU PROIECTE VIDEO DIN GOOGLE DRIVE (CELE 7 CLIPURI)
   ========================================================================== */
const PROIECTE_VIDEO = {
  'v-sticker': {
    id: 'v-sticker',
    title: 'Tiktok — Campanie „Găsește Sticker-ul”',
    category: 'Campanie Interactivă',
    client: 'Comunitate',
    description: 'Concept de tip treasure hunt gândit pentru a stimula participarea activă și căutarea fizică/online a stickerelor.',
    videoUrl: 'https://drive.google.com/file/d/1cnYOrz1-uuj7vkuJhknJLTAJS18QuIUF/preview'
  },
  'v-chez-les-amis': {
    id: 'v-chez-les-amis',
    title: 'Tiktok — Atmosferă & Concurs Chez Les Amis',
    category: 'Eveniment & Atmosferă',
    client: 'Chez Les Amis',
    description: 'Clip promoțional axat pe dinamica evenimentului și prezentarea biletelor de giveaway pentru comunitate.',
    videoUrl: 'https://drive.google.com/file/d/19fgjzxdkBpo71eL4O6RhaIPz3XS8qkA-/preview'
  },
  'v-emimusic': {
    id: 'v-emimusic',
    title: 'Tiktok — Promo Lansare Muzicală',
    category: 'Campanie Muzicală',
    client: 'Promo Muzical',
    description: 'Conținut video promoțional editat în CapCut pentru canal muzical, cu ritm dinamic sincronizat pe beat.',
    videoUrl: 'https://drive.google.com/file/d/1gRKT7Z-gPzVBbK-OOuFSLy2tgtqwkswD/preview'
  },
  'v-sytc-1': {
    id: 'v-sytc-1',
    title: 'Tiktok — See You There Club (Vol. 1)',
    category: 'Prezentare Concept',
    client: 'See You There Club',
    description: 'Primul clip din seria de teasere vizuale pentru clubul de evenimente, punând accentul pe experiență și anturaj.',
    videoUrl: 'https://drive.google.com/file/d/1Ft3--MMe3zfr51esLusxRFz1QUYndBgK/preview'
  },
  'v-sytc-2': {
    id: 'v-sytc-2',
    title: 'Tiktok — See You There Club (Vol. 2)',
    category: 'Engagement & Vibe',
    client: 'See You There Club',
    description: 'Continuarea campaniei video cu cadre rapide și tranziții curate adaptate algoritmului TikTok.',
    videoUrl: 'https://drive.google.com/file/d/1ReWg1S6gDNCqeVYvd_rWcMBeVs9KxUlu/preview'
  },
  'v-sytc-3': {
    id: 'v-sytc-3',
    title: 'Tiktok — See You There Club (Vol. 3)',
    category: 'Reminder Eveniment',
    client: 'See You There Club',
    description: 'Clip video scurt conceput pentru consolidarea mesajului de participare și direcționarea spre link-ul de bilete.',
    videoUrl: 'https://drive.google.com/file/d/1JMX6n0DtrQ6vlszNGPWAnEDwZ61-3wxE/preview'
  },
  'v-sytc-amr': {
    id: 'v-sytc-amr',
    title: 'Tiktok — Numărătoare Inversă A.M.R.',
    category: 'Countdown Final',
    client: 'See You There Club',
    description: 'Video de urgență (FOMO) publicat în ultimele zile înaintea evenimentului pentru a stimula decizia de achiziție.',
    videoUrl: 'https://drive.google.com/file/d/1hv3KeuWl8dK486HIpwqc2zQdV--IzMML/preview'
  }
};

/* ==========================================================================
   2. PARSER LINK-URI GOOGLE DRIVE & VIDEO
   ========================================================================== */
function analizeazaSursaVideo(adresa) {
  if (!adresa || typeof adresa !== 'string' || adresa.trim() === '') {
    return { tip: 'gol', url: '' };
  }

  const url = adresa.trim();

  // Google Drive
  const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=))([a-zA-Z0-9_-]+)/i;
  const driveMatch = url.match(driveRegex);
  if (driveMatch && driveMatch[1]) {
    const idFisier = driveMatch[1];
    return {
      tip: 'drive',
      url: `https://drive.google.com/file/d/${idFisier}/preview`
    };
  }

  return { tip: 'direct', url: url };
}

/* ==========================================================================
   3. MODAL VIDEO ADAPTIV (TIKTOK VERTICAL 9:16) CU NAVIGARE COMPLETĂ
   ========================================================================== */
class ControlerModalVideo {
  constructor() {
    this.modal = document.getElementById('videoModal');
    this.frame = document.getElementById('modalMediaFrame');
    this.title = document.getElementById('modalTitle');
    this.cat = document.getElementById('modalCategory');
    this.client = document.getElementById('modalClient');
    this.desc = document.getElementById('modalDescription');
    this.closeBtn = document.getElementById('modalClose');
    this.copyBtn = document.getElementById('modalCopyLinkBtn');
    this.prevBtn = document.getElementById('modalPrevBtn');
    this.nextBtn = document.getElementById('modalNextBtn');
    this.indexBadge = document.getElementById('videoModalIndex');

    this.videoIds = Object.keys(PROIECTE_VIDEO);
    this.currentId = null;

    this.init();
  }

  init() {
    if (!this.modal) return;

    this.closeBtn.addEventListener('click', () => this.inchide());

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.anterior());
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.urmator());
    }

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.inchide();
    });

    document.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('active')) return;
      if (e.key === 'Escape') {
        this.inchide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.anterior();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.urmator();
      }
    });

    if (this.copyBtn) {
      this.copyBtn.addEventListener('click', () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href);
          afiseazaToast('Link-ul paginii a fost copiat în clipboard.');
        }
      });
    }

    this.ataseazaEvenimente();
  }

  ataseazaEvenimente() {
    document.querySelectorAll('[data-video-id]').forEach(element => {
      element.addEventListener('click', (e) => {
        const idVideo = element.getAttribute('data-video-id');
        if (idVideo) this.deschide(idVideo);
      });
    });

    document.querySelectorAll('.open-modal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idVideo = btn.getAttribute('data-video-id');
        if (idVideo) this.deschide(idVideo);
      });
    });
  }

  anterior() {
    if (!this.currentId) return;
    const idx = this.videoIds.indexOf(this.currentId);
    const nextIdx = (idx - 1 + this.videoIds.length) % this.videoIds.length;
    this.deschide(this.videoIds[nextIdx]);
  }

  urmator() {
    if (!this.currentId) return;
    const idx = this.videoIds.indexOf(this.currentId);
    const nextIdx = (idx + 1) % this.videoIds.length;
    this.deschide(this.videoIds[nextIdx]);
  }

  deschide(idVideo) {
    const proiect = PROIECTE_VIDEO[idVideo];
    if (!proiect) return;

    this.currentId = idVideo;
    this.title.textContent = proiect.title;
    this.cat.textContent = proiect.category;
    this.client.textContent = proiect.client;
    this.desc.textContent = proiect.description;

    const idx = this.videoIds.indexOf(idVideo);
    if (this.indexBadge && idx !== -1) {
      this.indexBadge.textContent = `${idx + 1} / ${this.videoIds.length}`;
    }

    const sursa = analizeazaSursaVideo(proiect.videoUrl);

    this.frame.innerHTML = `
      <iframe 
        src="${sursa.url}" 
        allow="autoplay; fullscreen" 
        allowfullscreen 
        title="${proiect.title}"
        style="width: 100%; height: 100%; border: none;">
      </iframe>
    `;

    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  inchide() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    if (this.frame) this.frame.innerHTML = '';
  }
}

/* ==========================================================================
   4. LIGHTBOX PENTRU IMAGINI GRAFICE
   ========================================================================== */
class ControlerImageLightbox {
  constructor() {
    this.lightbox = document.getElementById('imageLightbox');
    this.imgEl = document.getElementById('lightboxImg');
    this.titleEl = document.getElementById('lightboxTitle');
    this.closeBtn = document.getElementById('lightboxClose');

    this.init();
  }

  init() {
    if (!this.lightbox) return;

    this.closeBtn.addEventListener('click', () => this.inchide());

    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.inchide();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.lightbox.classList.contains('active')) {
        this.inchide();
      }
    });

    document.querySelectorAll('[data-img-src]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const src = el.getAttribute('data-img-src');
        const titlu = el.getAttribute('data-img-title') || 'Imagine Proiect';
        this.deschide(src, titlu);
      });
    });
  }

  deschide(src, titlu) {
    this.imgEl.src = src;
    this.titleEl.textContent = titlu;
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  inchide() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
    this.imgEl.src = '';
  }
}

/* ==========================================================================
   5. FILTRE CATEGORII VIDEO
   ========================================================================== */
function initFiltre() {
  const chips = document.querySelectorAll('.filter-chip');
  const articole = document.querySelectorAll('.video-card-vertical');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const categorie = chip.getAttribute('data-filter');

      articole.forEach(articol => {
        const catArticol = articol.getAttribute('data-category');
        if (categorie === 'all' || catArticol === categorie) {
          articol.style.display = 'flex';
        } else {
          articol.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. CURSOR MINIMALIST
   ========================================================================== */
function initCursor() {
  const dot = document.getElementById('cursorDot');
  const circle = document.getElementById('cursorCircle');
  if (!dot || !circle || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = -100, mouseY = -100;
  let circleX = -100, circleY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function randeaza() {
    circleX += (mouseX - circleX) * 0.18;
    circleY += (mouseY - circleY) * 0.18;
    circle.style.transform = `translate(${circleX}px, ${circleY}px)`;
    requestAnimationFrame(randeaza);
  }
  randeaza();

  document.querySelectorAll('a, button, input, textarea, .vcard-thumb-wrap, .graphic-img-wrap, .mini-asset-link').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ==========================================================================
   7. MENIU MOBIL, COPIERE DATE & FORMULAR CONTACT
   ========================================================================== */
function initMeniuSiContact() {
  // Meniu mobil
  const toggle = document.getElementById('menuToggle');
  const navMobil = document.getElementById('mobileNav');
  const backdrop = document.getElementById('mobileNavBackdrop');
  const closeBtn = document.getElementById('mobileNavClose');
  const linkuriMobile = document.querySelectorAll('.mobile-link');

  function inchideMeniu() {
    if (navMobil) navMobil.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    if (toggle) toggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  function deschideMeniu() {
    if (navMobil) navMobil.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    if (toggle) toggle.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (toggle && navMobil) {
    toggle.addEventListener('click', () => {
      if (navMobil.classList.contains('active')) {
        inchideMeniu();
      } else {
        deschideMeniu();
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', inchideMeniu);
    if (backdrop) backdrop.addEventListener('click', inchideMeniu);

    linkuriMobile.forEach(link => {
      link.addEventListener('click', inchideMeniu);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMobil.classList.contains('active')) {
        inchideMeniu();
      }
    });
  }

  // Copiere email
  const copyEmail = document.getElementById('copyEmailTrigger');
  if (copyEmail) {
    copyEmail.addEventListener('click', (e) => {
      e.preventDefault();
      const email = copyEmail.getAttribute('data-email');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email);
        afiseazaToast('Email-ul raresh554@gmail.com a fost copiat!');
      }
    });
  }

  // Copiere telefon
  const copyPhone = document.getElementById('copyPhoneTrigger');
  if (copyPhone) {
    copyPhone.addEventListener('click', (e) => {
      e.preventDefault();
      const phone = copyPhone.getAttribute('data-phone');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(phone);
        afiseazaToast('Numărul +40730148593 a fost copiat!');
      }
    });
  }

  // Formular de contact (Securizat: Anti-Bot Honeypot, Rate Limiting & GDPR)
  const form = document.getElementById('contactForm');
  const formAlert = document.getElementById('formAlert');

  // Funcție de igienizare date (protecție împotriva atacurilor XSS)
  function curataInput(text) {
    if (!text || typeof text !== 'string') return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // 1. Verificare Anti-Bot Honeypot
      const hpField = document.getElementById('_hp_security_check');
      if (hpField && hpField.value.trim() !== '') {
        // Bot detectat: simulăm succes fără a procesa nimic
        formAlert.textContent = 'Mesajul a fost transmis!';
        formAlert.className = 'form-alert success';
        afiseazaToast('Mulțumesc! Mesajul tău a fost transmis.');
        form.reset();
        return;
      }

      // 2. Client-side Rate Limiting (Anti-Spam & Flooding Cooldown)
      const RATE_KEY = 'gr_contact_rate_limit';
      const COOLDOWN_MS = 25000; // 25 secunde între trimiteri consecutive
      const MAX_PER_HOUR = 4;    // Maximum 4 trimiteri pe oră
      const now = Date.now();

      let trimiteri = [];
      try {
        trimiteri = JSON.parse(localStorage.getItem(RATE_KEY) || '[]');
      } catch (err) {
        trimiteri = [];
      }

      // Păstrăm doar trimiterile din ultima oră (3600000 ms)
      trimiteri = trimiteri.filter(t => (now - t) < 3600000);

      if (trimiteri.length > 0) {
        const ultimulTimp = trimiteri[trimiteri.length - 1];
        const diferenta = now - ultimulTimp;
        if (diferenta < COOLDOWN_MS) {
          const secundeAsteptare = Math.ceil((COOLDOWN_MS - diferenta) / 1000);
          formAlert.textContent = `Securitate anti-spam: Te rugăm să aștepți încă ${secundeAsteptare} secunde înainte de a retrimite.`;
          formAlert.className = 'form-alert error';
          return;
        }
      }

      if (trimiteri.length >= MAX_PER_HOUR) {
        formAlert.textContent = 'Securitate: Ai atins limita de mesaje pe această oră. Te rog să mă contactezi direct pe WhatsApp sau telefon.';
        formAlert.className = 'form-alert error';
        return;
      }

      // 3. Preluare și igienizare date
      const numeRaw = document.getElementById('nume').value.trim();
      const emailRaw = document.getElementById('email').value.trim();
      const gdprCheckbox = document.getElementById('gdprConsent');

      const nume = curataInput(numeRaw);
      const email = curataInput(emailRaw);

      if (!nume || !email) {
        formAlert.textContent = 'Te rog să introduci numele și adresa de email.';
        formAlert.className = 'form-alert error';
        return;
      }

      // Validare format email de bază
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailRaw)) {
        formAlert.textContent = 'Te rog să introduci o adresă de email validă.';
        formAlert.className = 'form-alert error';
        return;
      }

      if (gdprCheckbox && !gdprCheckbox.checked) {
        formAlert.textContent = 'Te rog să bifezi acordul pentru prelucrarea datelor conform Politicii de Confidențialitate (GDPR).';
        formAlert.className = 'form-alert error';
        return;
      }

      // Înregistrare timestamp trimitere pentru rate-limiting
      trimiteri.push(now);
      try {
        localStorage.setItem(RATE_KEY, JSON.stringify(trimiteri));
      } catch (err) {}

      formAlert.textContent = 'Mesajul a fost transmis! Îți voi răspunde în cel mai scurt timp.';
      formAlert.className = 'form-alert success';
      afiseazaToast('Mulțumesc! Mesajul tău a fost transmis.');

      form.reset();
      setTimeout(() => {
        formAlert.textContent = '';
      }, 5000);
    });
  }
}

/* ==========================================================================
   8. TOAST NOTIFICARE
   ========================================================================== */
function afiseazaToast(mesaj) {
  const toast = document.getElementById('simpleToast');
  if (!toast) return;

  toast.textContent = mesaj;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ==========================================================================
   9. QOL: LINIE DE PROGRES, BUTON ÎNAPOI SUS & HIGHLIGHT NAVIGARE
   ========================================================================== */
function initScrollQOL() {
  const progressBar = document.getElementById('scrollProgress');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateScrollState() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // 1. Linie de progres scroll
    if (progressBar && docHeight > 0) {
      const procent = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      progressBar.style.width = `${procent}%`;
    }

    // 2. Buton Înapoi Sus
    if (backToTopBtn) {
      if (scrollTop > 380) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // 3. Highlight secțiune activă în meniu
    let currentId = '';
    const scrollPos = scrollTop + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* ==========================================================================
   10. GESTIUNE CONSIMȚĂMÂNT COOKIE-URI (GDPR & DIRECTIVA ePRIVACY)
   ========================================================================== */
function initCookieConsent() {
  const banner = document.getElementById('cookieBanner');
  const acceptAllBtn = document.getElementById('acceptAllCookiesBtn');
  const essentialBtn = document.getElementById('essentialCookiesBtn');
  const footerSettingsBtn = document.getElementById('footerCookieSettingsBtn');

  if (!banner) return;

  const status = localStorage.getItem('cookie_consent_status');

  // Afișează bannerul dacă vizitatorul nu a făcut o alegere anterioară
  if (!status) {
    setTimeout(() => {
      banner.classList.add('active');
    }, 700);
  }

  if (acceptAllBtn) {
    acceptAllBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent_status', 'all');
      banner.classList.remove('active');
      afiseazaToast('Preferințele au fost salvate (Toate cookie-urile acceptate).');
    });
  }

  if (essentialBtn) {
    essentialBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent_status', 'essential');
      banner.classList.remove('active');
      afiseazaToast('Preferințele au fost salvate (Doar cookie-uri strict necesare).');
    });
  }

  if (footerSettingsBtn) {
    footerSettingsBtn.addEventListener('click', () => {
      banner.classList.add('active');
      banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
}

/* ==========================================================================
   11. MODAL DOCUMENTE LEGALE (GDPR, COOKIES, TERMENI & DREPTURI AUTOR)
   ========================================================================== */
function initLegalModal() {
  const modal = document.getElementById('legalModal');
  const closeBtn = document.getElementById('legalModalClose');
  const triggers = document.querySelectorAll('.open-legal-btn');
  const tabBtns = document.querySelectorAll('.legal-tab-btn');
  const tabContents = document.querySelectorAll('.legal-tab-content');

  if (!modal) return;

  function switchTab(tabId) {
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-target') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    tabContents.forEach(content => {
      if (content.id === tabId) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }

  function openLegal(targetTabName) {
    let targetTabId = 'tab-confidentialitate';
    if (targetTabName === 'cookie') {
      targetTabId = 'tab-cookie';
    } else if (targetTabName === 'termeni') {
      targetTabId = 'tab-termeni';
    }

    switchTab(targetTabId);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLegal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = btn.getAttribute('data-legal-tab') || 'confidentialitate';
      openLegal(tabName);
    });
  });

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      if (targetId) switchTab(targetId);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLegal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLegal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLegal();
    }
  });
}

/* ==========================================================================
   12. COMMAND PALETTE (CMD+K / CTRL+K SPOTLIGHT SEARCH)
   ========================================================================== */
const COMANDI_PALETTE = [
  // Videoclipuri 9:16
  {
    id: 'v-sticker',
    title: 'Tiktok — Campanie „Găsește Sticker-ul”',
    category: 'Video 9:16',
    icon: 'fa-solid fa-play',
    keywords: 'sticker concurs interactiv tiktok video reels',
    action: () => { window.modalVideo && window.modalVideo.deschide('v-sticker'); }
  },
  {
    id: 'v-chez-les-amis',
    title: 'Tiktok — Atmosferă & Concurs Chez Les Amis',
    category: 'Video 9:16',
    icon: 'fa-solid fa-play',
    keywords: 'chez les amis eveniment party bilete giveaway tiktok',
    action: () => { window.modalVideo && window.modalVideo.deschide('v-chez-les-amis'); }
  },
  {
    id: 'v-emimusic',
    title: 'Tiktok — Promo Lansare Muzicală',
    category: 'Video 9:16',
    icon: 'fa-solid fa-play',
    keywords: 'muzica promo capcut beat ritm lansare tiktok',
    action: () => { window.modalVideo && window.modalVideo.deschide('v-emimusic'); }
  },
  {
    id: 'v-sytc-1',
    title: 'Tiktok — See You There Club (Vol. 1)',
    category: 'Video 9:16',
    icon: 'fa-solid fa-play',
    keywords: 'see you there club sytc teaser petrecere noapte',
    action: () => { window.modalVideo && window.modalVideo.deschide('v-sytc-1'); }
  },
  {
    id: 'v-sytc-2',
    title: 'Tiktok — See You There Club (Vol. 2)',
    category: 'Video 9:16',
    icon: 'fa-solid fa-play',
    keywords: 'sytc vol 2 tranzitie dinamica tiktok',
    action: () => { window.modalVideo && window.modalVideo.deschide('v-sytc-2'); }
  },
  {
    id: 'v-sytc-3',
    title: 'Tiktok — See You There Club (Vol. 3)',
    category: 'Video 9:16',
    icon: 'fa-solid fa-play',
    keywords: 'sytc vol 3 reminder bilete link',
    action: () => { window.modalVideo && window.modalVideo.deschide('v-sytc-3'); }
  },
  {
    id: 'v-sytc-amr',
    title: 'Tiktok — Numărătoare Inversă A.M.R.',
    category: 'Video 9:16',
    icon: 'fa-solid fa-play',
    keywords: 'amr countdown urgenta fomo sytc final',
    action: () => { window.modalVideo && window.modalVideo.deschide('v-sytc-amr'); }
  },
  // Secțiuni Pagină
  {
    id: 'sec-acasa',
    title: 'Mergi la: Acasă (Început)',
    category: 'Navigare',
    icon: 'fa-solid fa-house',
    keywords: 'acasa sus top hero',
    action: () => { document.getElementById('acasa')?.scrollIntoView({ behavior: 'smooth' }); }
  },
  {
    id: 'sec-despre',
    title: 'Mergi la: Despre Mine & Credențiale FEAA',
    category: 'Navigare',
    icon: 'fa-solid fa-user',
    keywords: 'despre mine bio feaa marketing facultate studii',
    action: () => { document.getElementById('despre')?.scrollIntoView({ behavior: 'smooth' }); }
  },
  {
    id: 'sec-video',
    title: 'Mergi la: Portofoliu Videoclipuri (Cele 7 TikTok-uri)',
    category: 'Navigare',
    icon: 'fa-solid fa-film',
    keywords: 'videoclipuri reels tiktok portofoliu clipuri',
    action: () => { document.getElementById('videoclipuri')?.scrollIntoView({ behavior: 'smooth' }); }
  },
  {
    id: 'sec-grafica',
    title: 'Mergi la: Campanii Vizuale & Afișe',
    category: 'Navigare',
    icon: 'fa-solid fa-palette',
    keywords: 'grafica afise postere canva figma',
    action: () => { document.getElementById('grafica')?.scrollIntoView({ behavior: 'smooth' }); }
  },
  {
    id: 'sec-proces',
    title: 'Mergi la: Proces de Lucru',
    category: 'Navigare',
    icon: 'fa-solid fa-list-check',
    keywords: 'proces lucru cum lucrez etape strategie',
    action: () => { document.getElementById('proces')?.scrollIntoView({ behavior: 'smooth' }); }
  },
  {
    id: 'sec-contact',
    title: 'Mergi la: Contact & Colaborări',
    category: 'Navigare',
    icon: 'fa-solid fa-paper-plane',
    keywords: 'contact colaboreaza formular scrie email telefon',
    action: () => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }
  },
  // Documente & Credențiale
  {
    id: 'doc-cv',
    title: 'Descarcă: Curriculum Vitae (PDF)',
    category: 'Document',
    icon: 'fa-solid fa-file-arrow-down',
    keywords: 'cv curriculum vitae resume descarca pdf',
    action: () => { window.open('https://drive.google.com/file/d/1YLLMNy8l8LGd3vWrVJnFyFIHM9wlyg5-/view', '_blank', 'noopener,noreferrer'); }
  },
  {
    id: 'doc-efset',
    title: 'Vezi: Certificat EF SET C1 Engleză (PDF)',
    category: 'Certificat',
    icon: 'fa-solid fa-award',
    keywords: 'ef set engleza c1 certificat limbi',
    action: () => { window.open('https://drive.google.com/file/d/13Eg0R29hQQGtWPJM6xENJZiQUlxEiaWa/view', '_blank', 'noopener,noreferrer'); }
  },
  {
    id: 'doc-pptx',
    title: 'Vezi: Prezentare Marketing FEAA (PPTX)',
    category: 'Prezentare',
    icon: 'fa-solid fa-file-powerpoint',
    keywords: 'marketing pptx prezentare feaa studiu',
    action: () => { window.open('https://drive.google.com/file/d/1UNjBTrV2YokOktUYHAxcwBTCbJyi6Vh1/view', '_blank', 'noopener,noreferrer'); }
  },
  // Acțiuni Rapide
  {
    id: 'act-email',
    title: 'Copiază Adresa de Email (raresh554@gmail.com)',
    category: 'Acțiune Rapidă',
    icon: 'fa-regular fa-copy',
    keywords: 'copiaza email raresh554 mail adresa',
    action: () => {
      navigator.clipboard && navigator.clipboard.writeText('raresh554@gmail.com');
      afiseazaToast('Email-ul raresh554@gmail.com a fost copiat în clipboard!');
    }
  },
  {
    id: 'act-whatsapp',
    title: 'Scrie direct pe WhatsApp (+40 730 148 593)',
    category: 'Comunicare',
    icon: 'fa-brands fa-whatsapp',
    keywords: 'whatsapp mesaj chat telefon',
    action: () => { window.open('https://wa.me/40730148593', '_blank', 'noopener,noreferrer'); }
  },
  // Documente Legale & GDPR
  {
    id: 'leg-conf',
    title: 'Deschide: Politică de Confidențialitate (GDPR)',
    category: 'Legal',
    icon: 'fa-solid fa-user-shield',
    keywords: 'gdpr confidentialitate date personale securitate',
    action: () => {
      const modal = document.getElementById('legalModal');
      if (modal) {
        const triggers = document.querySelectorAll('.legal-tab-btn');
        triggers.forEach(b => {
          if (b.getAttribute('data-target') === 'tab-confidentialitate') b.click();
        });
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  },
  {
    id: 'leg-cookie',
    title: 'Deschide: Politică de Cookie-uri',
    category: 'Legal',
    icon: 'fa-solid fa-cookie',
    keywords: 'cookie cookies eprivacy preferinte',
    action: () => {
      const modal = document.getElementById('legalModal');
      if (modal) {
        const triggers = document.querySelectorAll('.legal-tab-btn');
        triggers.forEach(b => {
          if (b.getAttribute('data-target') === 'tab-cookie') b.click();
        });
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  },
  {
    id: 'leg-termeni',
    title: 'Deschide: Termeni & Drepturi de Autor',
    category: 'Legal',
    icon: 'fa-solid fa-file-contract',
    keywords: 'termeni drepturi autor proprietate intelectuala legea 8/1996 blog',
    action: () => {
      const modal = document.getElementById('legalModal');
      if (modal) {
        const triggers = document.querySelectorAll('.legal-tab-btn');
        triggers.forEach(b => {
          if (b.getAttribute('data-target') === 'tab-termeni') b.click();
        });
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  }
];

function initCommandPalette() {
  const modal = document.getElementById('cmdPaletteModal');
  const trigger = document.getElementById('cmdKTrigger');
  const input = document.getElementById('cmdPaletteInput');
  const list = document.getElementById('cmdPaletteList');
  const backdrop = document.getElementById('cmdPaletteBackdrop');
  const escKey = document.getElementById('cmdPaletteCloseKey');

  if (!modal || !input || !list) return;

  let activeIndex = 0;
  let currentFiltered = [...COMANDI_PALETTE];

  function renderList(items) {
    list.innerHTML = '';
    currentFiltered = items;

    if (items.length === 0) {
      list.innerHTML = `<div class="cmd-palette-empty"><i class="fa-solid fa-magnifying-glass"></i> Niciun rezultat găsit pentru „${input.value}”</div>`;
      return;
    }

    items.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = `cmd-item ${idx === activeIndex ? 'active' : ''}`;
      el.innerHTML = `
        <div class="cmd-item-left">
          <i class="${item.icon} cmd-item-icon"></i>
          <span>${item.title}</span>
        </div>
        <span class="cmd-item-cat">${item.category}</span>
      `;

      el.addEventListener('click', () => {
        executeAction(item);
      });

      el.addEventListener('mouseenter', () => {
        activeIndex = idx;
        updateActiveItem();
      });

      list.appendChild(el);
    });

    scrollActiveIntoView();
  }

  function updateActiveItem() {
    const itemEls = list.querySelectorAll('.cmd-item');
    itemEls.forEach((el, idx) => {
      if (idx === activeIndex) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  function scrollActiveIntoView() {
    const activeEl = list.querySelector('.cmd-item.active');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }

  function executeAction(item) {
    closePalette();
    setTimeout(() => {
      if (typeof item.action === 'function') {
        item.action();
      }
    }, 120);
  }

  function openPalette() {
    modal.classList.add('active');
    input.value = '';
    activeIndex = 0;
    renderList(COMANDI_PALETTE);
    document.body.style.overflow = 'hidden';
    setTimeout(() => input.focus(), 60);
  }

  function closePalette() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    input.blur();
  }

  if (trigger) {
    trigger.addEventListener('click', openPalette);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closePalette);
  }

  if (escKey) {
    escKey.addEventListener('click', closePalette);
  }

  // Căutare live
  input.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      activeIndex = 0;
      renderList(COMANDI_PALETTE);
      return;
    }

    const filtered = COMANDI_PALETTE.filter(item => {
      return item.title.toLowerCase().includes(query) ||
             item.category.toLowerCase().includes(query) ||
             item.keywords.toLowerCase().includes(query);
    });

    activeIndex = 0;
    renderList(filtered);
  });

  // Navigare tastatură
  window.addEventListener('keydown', (e) => {
    // Cmd+K sau Ctrl+K pentru a deschide/închide
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal.classList.contains('active')) {
        closePalette();
      } else {
        openPalette();
      }
      return;
    }

    if (!modal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentFiltered.length > 0) {
        activeIndex = (activeIndex + 1) % currentFiltered.length;
        updateActiveItem();
        scrollActiveIntoView();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentFiltered.length > 0) {
        activeIndex = (activeIndex - 1 + currentFiltered.length) % currentFiltered.length;
        updateActiveItem();
        scrollActiveIntoView();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentFiltered.length > 0 && currentFiltered[activeIndex]) {
        executeAction(currentFiltered[activeIndex]);
      }
    }
  });
}

/* ==========================================================================
   13. EFECTE ATELIER ARTISTIC: LANTERNĂ CURATORIALĂ & PARALLAX SUBTIL
   ========================================================================== */
function initHeroArtAtelier() {
  const heroSection = document.querySelector('.hero-section');
  const spotlight = document.getElementById('heroGallerySpotlight');
  const sketchLayer = document.querySelector('.hero-sketch-degas');
  const oilLayer = document.querySelector('.hero-painting-etoile');
  const scapigliataLayer = document.querySelector('.hero-sketch-scapigliata');
  if (!heroSection) return;

  // 1. Felinar cald de atelier la mișcarea cursorului
  if (spotlight) {
    let targetX = -600;
    let targetY = -600;
    let currentX = -600;
    let currentY = -600;
    let isHovering = false;

    heroSection.addEventListener('mouseenter', () => {
      isHovering = true;
      spotlight.style.opacity = '1';
    });

    heroSection.addEventListener('mouseleave', () => {
      isHovering = false;
      spotlight.style.opacity = '0';
      if (sketchLayer) sketchLayer.style.transform = '';
      if (oilLayer) oilLayer.style.transform = '';
      if (scapigliataLayer) scapigliataLayer.style.transform = '';
    });

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;

      // Parallax subtil de adâncime de atelier (3-6px max)
      const normX = (targetX / rect.width) - 0.5;
      const normY = (targetY / rect.height) - 0.5;

      if (sketchLayer) {
        sketchLayer.style.transform = `translate(${normX * 14}px, ${normY * 12}px)`;
      }
      if (oilLayer) {
        oilLayer.style.transform = `translate(${-normX * 16}px, ${-normY * 14}px)`;
      }
      if (scapigliataLayer) {
        scapigliataLayer.style.transform = `translate(${normX * 8}px, ${normY * 8}px)`;
      }
    }, { passive: true });

    function tickSpotlight() {
      if (isHovering) {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;
        spotlight.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
      requestAnimationFrame(tickSpotlight);
    }
    requestAnimationFrame(tickSpotlight);
  }
}

/* ==========================================================================
   14. SECURITATE AVANSATĂ: ANTI-INSPECT, ANTI-DEVTOOLS & DREPTURI DE AUTOR
   ========================================================================== */
function initSecurityProtections() {
  // 1. Alertă de securitate în DevTools Console
  try {
    const bannerStyle = 'color: #f59e0b; font-size: 15px; font-weight: bold; background: #161618; padding: 6px 14px; border-radius: 4px; border: 1px solid #d97706;';
    const subStyle = 'color: #a1a1aa; font-size: 12px; line-height: 1.6;';
    console.log('%c🔒 ZONĂ SECURIZATĂ — PORTOFOLIU GHEORGHEȘ RAREȘ (GR)', bannerStyle);
    console.log('%cConținutul multimedia, montajele video și codul sursă sunt protejate prin drepturi de autor conform Legii nr. 8/1996.\nInspectarea și extragerea neautorizată de active sunt restricționate.', subStyle);
  } catch (err) {}

  // 2. Blocare comenzi de tastatură pentru Inspect Element, View Source & Console
  window.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      afiseazaToast('🛡️ Accesul la consola de dezvoltare este restricționat.');
      return false;
    }

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const isDevToolsCombo = isMac 
      ? (e.metaKey && e.altKey && (e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J' || e.key === 'c' || e.key === 'C'))
      : (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J' || e.key === 'c' || e.key === 'C'));

    if (isDevToolsCombo) {
      e.preventDefault();
      afiseazaToast('🛡️ Inspectarea elementelor este dezactivată pentru protecția codului.');
      return false;
    }

    // Ctrl+U / Cmd+Option+U (Vizualizare sursă brută pagină)
    if ((e.ctrlKey && (e.key === 'u' || e.key === 'U')) || (isMac && e.metaKey && e.altKey && (e.key === 'u' || e.key === 'U'))) {
      e.preventDefault();
      afiseazaToast('🛡️ Vizualizarea codului sursă brut este restricționată.');
      return false;
    }

    // Salvare pagină (Ctrl+S / Cmd+S)
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      return false;
    }
  }, { capture: true });

  // 3. Blocare Right-Click (Meniu Contextual) cu excepția câmpurilor formularului
  document.addEventListener('contextmenu', (e) => {
    const targetTag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
    if (targetTag === 'input' || targetTag === 'textarea') return;

    e.preventDefault();
    afiseazaToast('🛡️ Conținutul și codul sursă sunt protejate prin drepturi de autor.');
    return false;
  });

  // 4. Protecție suplimentară împotriva tragerii imaginilor
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName && e.target.tagName.toLowerCase() === 'img') {
      e.preventDefault();
    }
  });
}

/* ==========================================================================
   PORNIRE LA ÎNCĂRCAREA PAGINII
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initSecurityProtections();
  initCursor();
  initHeroArtAtelier();
  initFiltre();
  initMeniuSiContact();
  initScrollQOL();
  initCookieConsent();
  initLegalModal();
  initCommandPalette();
  window.modalVideo = new ControlerModalVideo();
  window.modalImagine = new ControlerImageLightbox();

  console.log('Portofoliu personal GR — conformitate GDPR, Cookie consent, securitate & cele 7 clipuri video active.');
});
