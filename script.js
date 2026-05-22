/* ═══════════════════════════════════════════
   PAPA'S 50TH BIRTHDAY — script.js
   Full production-ready JS
═══════════════════════════════════════════ */

'use strict';

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
  // Hero image
  const heroImg = document.getElementById('hero-img');
  if (heroImg) heroImg.src = PHOTOS[0];

  // Center orbit image
  const centerImg = document.getElementById('center-img');
  if (centerImg) centerImg.src = PHOTOS[1];

  // Orbit satellite images (orbit-p1 … orbit-p8)
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

  // Step 1 → wait for prelude text animation, then open curtains
  setTimeout(() => {
    curtainStage.classList.add('open');
  }, 1800);

  // Step 2 → fade in reveal stage
  setTimeout(() => {
    revealStage.classList.add('visible');
  }, 2400);

  // Step 3 → animate hero elements
  setTimeout(() => {
    if (fiftyNum)    fiftyNum.classList.add('show');
    if (heroDivider) heroDivider.classList.add('show');
  }, 3000);

  setTimeout(() => {
    if (heroTitle) heroTitle.classList.add('show');
  }, 3300);

  setTimeout(() => {
    if (heroSub) heroSub.classList.add('show');
  }, 3600);

  setTimeout(() => {
    if (heroCard) heroCard.classList.add('show');
  }, 3900);

  // Step 4 → hide curtain stage entirely (keep DOM clean)
  setTimeout(() => {
    curtainStage.classList.add('hidden');
  }, 4400);

  // Step 5 → burst confetti at reveal
  setTimeout(() => {
    burstConfetti(120);
  }, 3200);
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
   MUSIC PLAYER
═══════════════════════════════════════════ */

function initMusic() {
  const btn = document.getElementById("music-btn");
  const audio = document.getElementById("bg-audio");

  if (!btn || !audio) {
    console.log("Audio element missing");
    return;
  }

  btn.addEventListener("click", async () => {
    try {

      if (audio.paused) {

        await audio.play();

        btn.querySelector(".music-label").textContent =
          "Pause Music";

        btn.querySelector(".music-icon").textContent =
          "♬";

        btn.classList.add("is-playing");

      } else {

        audio.pause();

        btn.querySelector(".music-label").textContent =
          "Play Music";

        btn.querySelector(".music-icon").textContent =
          "♪";

        btn.classList.remove("is-playing");
      }

    } catch (err) {

      console.error("Audio error:", err);

      alert(
        "Music could not play. Check song.mp3 and browser permissions."
      );
    }
  });
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

  // Sections
  document.querySelectorAll('.reveal-section').forEach(el => io.observe(el));

  // Timeline items (staggered)
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

  // Poem stanzas
  document.querySelectorAll('.poem-stanza').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.8s ease ${i * 0.2}s, transform 0.8s ease ${i * 0.2}s`;
    const ioPm = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          ioPm.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    ioPm.observe(el);
  });

  // Wish cards
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
  const count = orbitPhotos.length; // 8
  let rotationAngle = 0;
  const ORBIT_RADIUS_RATIO = 0.42; // fraction of container width
  let rafId;

  function positionPhotos(baseAngle) {
    const size = container.offsetWidth;
    const radius = size * ORBIT_RADIUS_RATIO;
    const cx = size / 2;
    const cy = size / 2;

    orbitPhotos.forEach((photo, i) => {
      const angle = baseAngle + (i / count) * Math.PI * 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      photo.style.left = `${x}px`;
      photo.style.top  = `${y}px`;
    });
  }

  function animate() {
    rotationAngle += 0.0018;
    positionPhotos(rotationAngle);
    rafId = requestAnimationFrame(animate);
  }

  // Pause on hover
  container.addEventListener('mouseenter', () => cancelAnimationFrame(rafId));
  container.addEventListener('mouseleave', () => { rafId = requestAnimationFrame(animate); });

  // Kick off
  positionPhotos(0);
  animate();

  // Re-position on resize
  window.addEventListener('resize', () => positionPhotos(rotationAngle));

  // Hover expand on individual photos
  orbitPhotos.forEach(photo => {
    photo.addEventListener('mouseenter', () => {
      photo.style.zIndex = '10';
      photo.style.transform = 'translate(-50%, -50%) scale(1.35)';
    });
    photo.addEventListener('mouseleave', () => {
      photo.style.zIndex = '';
      photo.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
}

/* ═══════════════════════════════════════════
   WISH WALL
═══════════════════════════════════════════ */
function initWishWall() {
  const submitBtn = document.getElementById('wish-submit');
  const nameInput = document.getElementById('wish-name');
  const textInput = document.getElementById('wish-text');
  const wall      = document.getElementById('wish-wall');
  if (!submitBtn || !wall) return;

  // Load saved wishes from localStorage
  const saved = JSON.parse(localStorage.getItem('papaWishes') || '[]');
  saved.forEach(w => appendWish(w.name, w.text, false));

  submitBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (!text) {
      textInput.style.borderColor = 'rgba(199,115,115,0.6)';
      setTimeout(() => textInput.style.borderColor = '', 1500);
      return;
    }

    const displayName = name || 'A Loved One';
    appendWish(displayName, text, true);

    // Persist
    const all = JSON.parse(localStorage.getItem('papaWishes') || '[]');
    all.push({ name: displayName, text });
    localStorage.setItem('papaWishes', JSON.stringify(all));

    nameInput.value = '';
    textInput.value = '';

    // Mini confetti burst
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

  // Insert at top (after pre-seeds)
  const preseeds = wall.querySelectorAll('.wish-preset');
  const lastPreseed = preseeds[preseeds.length - 1];
  if (lastPreseed && lastPreseed.nextSibling) {
    wall.insertBefore(card, lastPreseed.nextSibling);
  } else {
    wall.appendChild(card);
  }

  if (!isNew) {
    // Observe for scroll reveal
    setTimeout(() => observeWishCards(), 50);
  }
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
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
    p.vy   += 0.22;          // gravity
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
   SMOOTH SCROLL (for any nav/anchor links)
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
  if (indicator) {
    indicator.style.opacity = window.scrollY > 80 ? '0' : '1';
  }
}, { passive: true });
