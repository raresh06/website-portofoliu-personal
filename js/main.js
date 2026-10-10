/**
 * PORTOFOLIU PERSONAL — GHEORGHES RAREȘ (GR)
 * Script dedicat:
 * - Redare video Google Drive (cele 7 TikTok-uri în player adaptiv vertical 9:16)
 * - Lightbox modal pentru grafică și imagini (Postere, Carusele, Afișe)
 * - Filtrare pe categorii
 * - Copiere rapidă email și telefon
 */

'use strict';

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
    title: 'Tiktok — Promo Lansare EMIMUSIC5',
    category: 'Campanie Muzicală',
    client: 'emimusic.ro',
    description: 'Conținut video editat în CapCut pentru canalul emimusic, cu ritm dinamic sincronizat pe beat.',
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
   3. MODAL VIDEO ADAPTIV (TIKTOK VERTICAL 9:16)
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

    this.init();
  }

  init() {
    if (!this.modal) return;

    this.closeBtn.addEventListener('click', () => this.inchide());

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.inchide();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.inchide();
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

  deschide(idVideo) {
    const proiect = PROIECTE_VIDEO[idVideo];
    if (!proiect) return;

    this.title.textContent = proiect.title;
    this.cat.textContent = proiect.category;
    this.client.textContent = proiect.client;
    this.desc.textContent = proiect.description;

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
  const linkuriMobile = document.querySelectorAll('.mobile-link');

  if (toggle && navMobil) {
    toggle.addEventListener('click', () => {
      navMobil.classList.toggle('active');
    });

    linkuriMobile.forEach(link => {
      link.addEventListener('click', () => {
        navMobil.classList.remove('active');
      });
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

  // Formular de contact
  const form = document.getElementById('contactForm');
  const formAlert = document.getElementById('formAlert');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nume = document.getElementById('nume').value.trim();
      const email = document.getElementById('email').value.trim();

      if (!nume || !email) {
        formAlert.textContent = 'Te rog să introduci numele și adresa de email.';
        formAlert.className = 'form-alert error';
        return;
      }

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
   PORNIRE LA ÎNCĂRCAREA PAGINII
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initFiltre();
  initMeniuSiContact();
  initScrollQOL();
  window.modalVideo = new ControlerModalVideo();
  window.modalImagine = new ControlerImageLightbox();

  console.log('Portofoliu personal GR — cele 7 clipuri video active în player vertical 9:16.');
});
