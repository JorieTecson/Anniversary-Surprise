/* =========================================================
   ANNIVERSARY SURPRISE — script.js
   Sections: 1) Background  2) Navigation  3) Music
             4) Envelope + Typewriter  5) Gallery  6) Cards
             7) Gift + Confetti  8) Finale
   ========================================================= */

/* ---------- 1) BACKGROUND: floating hearts + glowing particles ---------- */
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W, H, items = [];

function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
addEventListener('resize', resize);
resize();

const COLORS = ['#F4A6C1', '#C8A2E8', '#FFF5F0', '#ff4d88'];

function makeItem(fromBottom = false) {
  return {
    x: Math.random() * W,
    y: fromBottom ? H + 20 : Math.random() * H,
    size: 6 + Math.random() * 16,
    speed: 0.3 + Math.random() * 0.8,
    drift: Math.random() * Math.PI * 2,
    heart: Math.random() < 0.45,           // hearts vs glowing dots
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: 0.2 + Math.random() * 0.5
  };
}
for (let i = 0; i < 55; i++) items.push(makeItem());

function drawHeart(x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s / 4);
  ctx.bezierCurveTo(x, y, x - s / 2, y, x - s / 2, y + s / 4);
  ctx.bezierCurveTo(x - s / 2, y + s / 2, x, y + s * 0.7, x, y + s);
  ctx.bezierCurveTo(x, y + s * 0.7, x + s / 2, y + s / 2, x + s / 2, y + s / 4);
  ctx.bezierCurveTo(x + s / 2, y, x, y, x, y + s / 4);
  ctx.fill();
}

function animateBg() {
  ctx.clearRect(0, 0, W, H);
  items.forEach((p, i) => {
    p.y -= p.speed;
    p.drift += 0.01;
    p.x += Math.sin(p.drift) * 0.4;
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 14;
    if (p.heart) drawHeart(p.x, p.y, p.size);
    else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size / 4, 0, Math.PI * 2); ctx.fill(); }
    if (p.y < -30) items[i] = makeItem(true);
  });
  ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  requestAnimationFrame(animateBg);
}
animateBg();

/* ---------- 2) NAVIGATION between screens ---------- */
function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  target.classList.add('active');
  target.scrollTop = 0;
  if (id === 'finale') startFinale();
}

// Any button with data-next="sectionId" moves to that section
document.querySelectorAll('[data-next]').forEach(btn => {
  btn.addEventListener('click', () => {
    goTo(btn.dataset.next);
  });
});


/* ---------- 4) ENVELOPE + TYPEWRITER LETTER ---------- */
const envelope = document.getElementById('envelope');
const openLetterBtn = document.getElementById('openLetter');

const LETTER = `To my favorite person,

Another year, another chapter, and still... I choose you.

You make my ordinary days feel special, my hard days a little easier, and my good days even brighter.

Thank you for your love, your patience, your support, and for simply being you.

I may not always find the perfect words, but I hope you never forget how much you mean to me.

And if I could choose again, I would still choose you.

Always, my love. ❤️`;

let typedOnce = false;
function typeLetter() {
  if (typedOnce) return;
  typedOnce = true;
  const el = document.getElementById('typed');
  const box = el.parentElement;
  let i = 0;
  (function tick() {
    el.textContent = LETTER.slice(0, ++i);
    box.scrollTop = box.scrollHeight;
    if (i < LETTER.length) setTimeout(tick, 38);
    else document.getElementById('moreBtn').classList.remove('hidden');
  })();
}

openLetterBtn.addEventListener('click', () => {
  envelope.classList.add('open');           // animate the flap + paper
  openLetterBtn.classList.add('hidden');
  setTimeout(() => { goTo('letter'); typeLetter(); }, 1900);
});
envelope.addEventListener('click', () => openLetterBtn.click());

/* ---------- 5) GALLERY LIGHTBOX ---------- */
const lightbox = document.getElementById('lightbox');
document.querySelectorAll('.polaroid').forEach(p => {
  p.addEventListener('click', () => {
    document.getElementById('lightImg').src = p.querySelector('img').src;
    document.getElementById('lightCap').textContent = p.querySelector('figcaption').textContent;
    lightbox.classList.add('show');
  });
});
lightbox.addEventListener('click', () => lightbox.classList.remove('show'));

/* ---------- 6) FLIP CARDS ---------- */
document.querySelectorAll('.card').forEach(c =>
  c.addEventListener('click', () => c.classList.toggle('flipped'))
);

/* ---------- 7) GIFT BOX + CONFETTI ---------- */
// Spawns emojis that float up from a point on screen
function burst(emojis, count, x = innerWidth / 2, y = innerHeight / 2) {
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'pop';
    s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    s.style.left = x + (Math.random() - 0.5) * 300 + 'px';
    s.style.top = y + (Math.random() - 0.5) * 120 + 'px';
    s.style.fontSize = 16 + Math.random() * 24 + 'px';
    s.style.animationDelay = Math.random() * 0.5 + 's';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 3200);
  }
}

const giftBox = document.getElementById('giftBox');
giftBox.addEventListener('click', () => {
  if (giftBox.classList.contains('open')) return;
  giftBox.classList.add('open');
  burst(['💗', '💖', '🎉', '✨', '💕', '🎊'], 50);
  setTimeout(() => document.getElementById('giftMsg').classList.remove('hidden'), 700);
  setTimeout(() => document.getElementById('finalBtn').classList.remove('hidden'), 3500);
});

/* ---------- 8) FINALE: petals + subtle confetti ---------- */
let finaleTimer;
function startFinale() {
  burst(['🌸', '💗', '✨'], 30);
  clearInterval(finaleTimer);
  finaleTimer = setInterval(() => {
    if (!document.getElementById('finale').classList.contains('active')) return clearInterval(finaleTimer);
    burst(['🌸', '🌹', '✨', '💗'], 4, Math.random() * innerWidth, innerHeight * 0.9);
  }, 1200);
}

document.getElementById('kissBtn').addEventListener('click', e => {
  document.getElementById('kissMsg').classList.remove('hidden');
  const r = e.target.getBoundingClientRect();
  burst(['💋', '😘', '❤️'], 30, r.left + r.width / 2, r.top);
});
