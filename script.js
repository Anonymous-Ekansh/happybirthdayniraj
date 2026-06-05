/* ═══════════════════════════════════════════
   PAPA'S 50TH BIRTHDAY — script.js
   Full production-ready JS
═══════════════════════════════════════════ */

'use strict';

/* ─── FIREBASE CONFIG ───────────────────────
   Replace these values with your own from:
   Firebase Console → Project Settings → Your App
────────────────────────────────────────────── */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, onValue, query, orderByChild }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  databaseURL:       "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

const firebaseApp = initializeApp(firebaseConfig);
const db          = getDatabase(firebaseApp);
const wishesRef   = ref(db, 'wishes');

/* ─── IMAGE CONFIGURATION ───────────────────
   Since photos were not uploaded, we use the
   images/photo1.jpg … images/photo9.jpg paths.
   Swap these for your real file paths or base64
   strings from imagedata.js if you have it.
────────────────────────────────────────────── */
const PHOTOS = [
  'images/photo1.jpg',
  'images/photo2.jpg',
  'images/photo3.jpg',
  'images/photo4.jpg',
  'images/photo5.jpg',
  'images/photo6.jpg',
  'images/photo7.jpg',
  'images/photo8.jpg',
  'images/photo9.jpg',
];

// photo index 0 → hero portrait
// photo index 1 → orbit center (most emotional)
// photos 2–8  → orbiting satellites

/* ─── DOM READY ─────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initImages();
  initCurtain();
  initParticles();
  initMusic();
  initScrollReveal();
  initOrbit();
  initWishWall();
  initConfetti();
  initSmoothScroll();
});

/* ═══════════════════════════════════════════
   IMAGES
═══════════════════════════════════════════ */
function initImages() {
  const heroImg = document.getElementById('hero-img');
  if (heroImg) heroImg.src = PHOTOS[0];

  const centerImg = document.getElementById('center-img');
  if (centerImg) centerImg.src = PHOTOS[1];

  for (let i = 1; i <= 8; i++) {
    const el = document.getElementById(`orbit-p${i}`);
    if (el) {
      const img = el.querySelector('img');
      if (img) img.src = PHOTOS[i + 1] || PHOTOS[i % PHOTOS.length];
    }
  }
}

/* ═══════════════════════════════════════════
   CURTAIN REVEAL SEQUENCE
═══════════════════════════════════════════ */
function initCurtain() {
  const curtainStage = document.getElementById('curtain-stage');
  const revealStage  = document.getElementById('reveal-stage');
  const fiftyNum     = document.getElementById('fifty-anim');
  const heroCard     = document.getElementById('hero-card');
  const heroTitle    = document.querySelector('.hero-title');
  const heroSub      = document.querySelector('.hero-sub');
  const heroDivider  = document.querySelector('.hero-divider');

  setTimeout(() => { curtainStage.classList.add('open'); }, 1800);
  setTimeout(() => { revealStage.classList.add('visible'); }, 2400);
  setTimeout(() => {
    if (fiftyNum)    fiftyNum.classList.add('show');
    if (heroDivider) heroDivider.classList.add('show');
  }, 3000);
  setTimeout(() => { if (heroTitle) heroTitle.classList.add('show'); }, 3300);
  setTimeout(() => { if (heroSub)   heroSub.classList.add('show'); }, 3600);
  setTimeout(() => { if (heroCard)  heroCard.classList.add('show'); }, 3900);
  setTimeout(() => { curtainStage.classList.add('hidden'); }, 4400);
  setTimeout(() => { burstConfetti(120); }, 3200);
}

/* ═══════════════════════════════════════════
   FLOATING PARTICLES (particle-canvas)
═══════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const colors = [
    'rgba(139,115,199,',
    'rgba(103,182,179,',
    'rgba(220,206,240,',
    'rgba(232,214,232,',
    'rgba(167,146,216,',
  ];

  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x   = Math.random() * W;
      this.y   = initial ? Math.random() * H : H + 10;
      this.r   = Math.random() * 3 + 1;
      this.dx  = (Math.random() - 0.5) * 0.4;
      this.dy  = -(Math.random() * 0.6 + 0.2);
      this.col = colors[Math.floor(Math.random() * colors.length)];
      this.a   = Math.random() * 0.5 + 0.2;
      this.da  = (Math.random() - 0.5) * 0.003;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.015 + Math.random() * 0.01;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.col + this.a + ')';
      ctx.fill();
    }
    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.dx + Math.sin(this.wobble) * 0.3;
      this.y += this.dy;
      this.a += this.da;
      this.a = Math.max(0.05, Math.min(0.7, this.a));
      if (this.y < -10) this.reset(false);
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
}

/* ═══════════════════════════════════════════
   AUTO MUSIC + EXISTING BUTTON
═══════════════════════════════════════════ */
function initMusic() {
  const audio = document.getElementById("bg-audio");
  const btn   = document.getElementById("music-btn");
  if (!audio) return;

  audio.volume = 0.55;

  async function startMusic() {
    try {
      await audio.play();
      if (btn) btn.classList.add("is-playing");
    } catch {
      document.addEventListener("pointerdown", async function unlock() {
        audio.muted = false;
        try {
          await audio.play();
          if (btn) btn.classList.add("is-playing");
        } catch {}
      }, { once: true });
    }
  }

  startMusic();

  if (btn) {
    btn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
        btn.classList.add("is-playing");
      } else {
        audio.pause();
        btn.classList.remove("is-playing");
      }
    });
  }
}

/* ═══════════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
═══════════════════════════════════════════ */
function initScrollReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal-section').forEach(el => io.observe(el));

  document.querySelectorAll('.timeline-item').forEach((el, i) => {
    const ioTl = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 160);
          ioTl.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    ioTl.observe(el);
  });

  document.querySelectorAll('.poem-stanza').forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.8s ease ${i * 0.2}s, transform 0.8s ease ${i * 0.2}s`;
    const ioPm = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
          ioPm.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    ioPm.observe(el);
  });

  observeWishCards();
}

function observeWishCards() {
  const ioW = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        ioW.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.wish-card').forEach(c => ioW.observe(c));
}

/* ═══════════════════════════════════════════
   ORBIT COLLAGE
═══════════════════════════════════════════ */
function initOrbit() {
  const container = document.getElementById('orbit-container');
  if (!container) return;

  const orbitPhotos = container.querySelectorAll('.orbit-photo');
  const count = orbitPhotos.length;
  let rotationAngle = 0;
  const ORBIT_RADIUS_RATIO = 0.42;
  let rafId;

  function positionPhotos(baseAngle) {
    const size   = container.offsetWidth;
    const radius = size * ORBIT_RADIUS_RATIO;
    const cx = size / 2;
    const cy = size / 2;

    orbitPhotos.forEach((photo, i) => {
      const angle = baseAngle + (i / count) * Math.PI * 2;
      photo.style.left = `${cx + radius * Math.cos(angle)}px`;
      photo.style.top  = `${cy + radius * Math.sin(angle)}px`;
    });
  }

  function animate() {
    rotationAngle += 0.0018;
    positionPhotos(rotationAngle);
    rafId = requestAnimationFrame(animate);
  }

  container.addEventListener('mouseenter', () => cancelAnimationFrame(rafId));
  container.addEventListener('mouseleave', () => { rafId = requestAnimationFrame(animate); });

  positionPhotos(0);
  animate();

  window.addEventListener('resize', () => positionPhotos(rotationAngle));

  orbitPhotos.forEach(photo => {
    photo.addEventListener('mouseenter', () => {
      photo.style.zIndex    = '10';
      photo.style.transform = 'translate(-50%, -50%) scale(1.35)';
    });
    photo.addEventListener('mouseleave', () => {
      photo.style.zIndex    = '';
      photo.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
}

/* ═══════════════════════════════════════════
   WISH WALL — Firebase powered
   All wishes saved to Firebase Realtime DB
   and synced live to every visitor's browser
═══════════════════════════════════════════ */
function initWishWall() {
  const submitBtn = document.getElementById('wish-submit');
  const nameInput = document.getElementById('wish-name');
  const textInput = document.getElementById('wish-text');
  const wall      = document.getElementById('wish-wall');
  if (!submitBtn || !wall) return;

  // ── Listen for wishes from Firebase in real-time ──
  // This fires immediately on load AND whenever anyone
  // anywhere adds a new wish — all browsers update live.
  onValue(wishesRef, (snapshot) => {
    // Remove all previously rendered user wishes (keep preseeded ones)
    wall.querySelectorAll('.wish-card:not(.wish-preset)').forEach(c => c.remove());

    snapshot.forEach((child) => {
      const w = child.val();
      appendWish(w.name, w.text, false);
    });

    // Re-attach scroll reveal to new cards
    setTimeout(() => observeWishCards(), 50);
  });

  // ── Submit a wish → push to Firebase ──
  submitBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (!text) {
      textInput.style.borderColor = 'rgba(199,115,115,0.6)';
      setTimeout(() => textInput.style.borderColor = '', 1500);
      return;
    }

    const displayName = name || 'A Loved One';

    // Push to Firebase — onValue listener above will render it
    push(wishesRef, {
      name:      displayName,
      text:      text,
      timestamp: Date.now()
    });

    nameInput.value = '';
    textInput.value = '';

    burstConfetti(40);
  });
}

function appendWish(name, text, isNew) {
  const wall = document.getElementById('wish-wall');
  if (!wall) return;

  const card = document.createElement('div');
  card.className = 'wish-card glass-card' + (isNew ? ' new-wish' : '');
  card.innerHTML = `
    <div class="wish-quote">"</div>
    <p>${escHtml(text)}</p>
    <div class="wish-author">— ${escHtml(name)}</div>
  `;

  // Insert after the last pre-seeded wish
  const preseeds    = wall.querySelectorAll('.wish-preset');
  const lastPreseed = preseeds[preseeds.length - 1];
  if (lastPreseed && lastPreseed.nextSibling) {
    wall.insertBefore(card, lastPreseed.nextSibling);
  } else {
    wall.appendChild(card);
  }
}

function escHtml(s) {
  return s
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

/* ═══════════════════════════════════════════
   CONFETTI (confetti-canvas overlay)
═══════════════════════════════════════════ */
let confettiPieces = [];
let confettiRaf;
let confettiCanvas, confettiCtx;

function initConfetti() {
  confettiCanvas = document.getElementById('confetti-canvas');
  if (!confettiCanvas) return;
  confettiCtx = confettiCanvas.getContext('2d');

  function resize() {
    confettiCanvas.width  = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
}

function burstConfetti(count) {
  if (!confettiCanvas) return;

  const colors = [
    '#8B73C7','#67B6B3','#DCCEF0','#E8D6E8',
    '#A792D8','#8ECFCC','#C9B8E8','#F0E8F8',
  ];
  const shapes = ['circle','rect','triangle'];

  for (let i = 0; i < count; i++) {
    confettiPieces.push({
      x:     confettiCanvas.width  * (0.3 + Math.random() * 0.4),
      y:     confettiCanvas.height * (0.3 + Math.random() * 0.3),
      vx:    (Math.random() - 0.5) * 8,
      vy:    -(Math.random() * 10 + 4),
      r:     Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rot:   Math.random() * Math.PI * 2,
      rotV:  (Math.random() - 0.5) * 0.2,
      alpha: 1,
      life:  1,
    });
  }

  if (!confettiRaf) loopConfetti();
}

function loopConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces = confettiPieces.filter(p => p.alpha > 0.02);

  confettiPieces.forEach(p => {
    p.vy   += 0.22;
    p.vx   *= 0.995;
    p.x    += p.vx;
    p.y    += p.vy;
    p.rot  += p.rotV;
    p.life -= 0.012;
    p.alpha = Math.max(0, p.life);

    confettiCtx.save();
    confettiCtx.globalAlpha = p.alpha;
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rot);
    confettiCtx.fillStyle = p.color;

    if (p.shape === 'circle') {
      confettiCtx.beginPath();
      confettiCtx.arc(0, 0, p.r, 0, Math.PI * 2);
      confettiCtx.fill();
    } else if (p.shape === 'rect') {
      confettiCtx.fillRect(-p.r, -p.r * 0.5, p.r * 2, p.r);
    } else {
      confettiCtx.beginPath();
      confettiCtx.moveTo(0, -p.r);
      confettiCtx.lineTo(p.r, p.r);
      confettiCtx.lineTo(-p.r, p.r);
      confettiCtx.closePath();
      confettiCtx.fill();
    }

    confettiCtx.restore();
  });

  if (confettiPieces.length > 0) {
    confettiRaf = requestAnimationFrame(loopConfetti);
  } else {
    confettiRaf = null;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

/* ═══════════════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ═══════════════════════════════════════════
   SCROLL INDICATOR FADE
═══════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const indicator = document.querySelector('.scroll-indicator');
  if (indicator) indicator.style.opacity = window.scrollY > 80 ? '0' : '1';
}, { passive: true });
