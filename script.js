// ============================================================
// GALAXY MATH — script.js
// ============================================================

// ===== CUSTOM CURSOR — BINTANG =====
(function(){
  const isTouch = () => window.matchMedia('(hover:none)').matches;
  if(isTouch()) return;

  const star = document.getElementById('cursor-star');
  if(!star) return;

  let mx=0, my=0, rot=0, trailTick=0;

  document.addEventListener('mousemove', e=>{
    mx=e.clientX; my=e.clientY;
    rot += 3;
    star.style.left = mx+'px';
    star.style.top  = my+'px';
    // Rotasi terus
    if(!star.classList.contains('clicking') && !star.classList.contains('hovering')){
      star.style.transform = `translate(-50%,-50%) rotate(${rot}deg)`;
    }
    // Trail bintang kecil
    trailTick++;
    if(trailTick % 4 === 0){
      const t = document.createElement('div');
      t.className = 'cursor-trail';
      t.textContent = '★';
      t.style.left = mx+'px';
      t.style.top  = my+'px';
      t.style.fontSize = (6+Math.random()*6)+'px';
      t.style.color = ['#00d4ff','#a78bfa','#f59e0b','#10b981'][Math.floor(Math.random()*4)];
      document.body.appendChild(t);
      setTimeout(()=>t.remove(), 600);
    }
  });

  document.addEventListener('mousedown',()=>{
    star.classList.add('clicking');
  });
  document.addEventListener('mouseup',()=>{
    star.classList.remove('clicking');
  });

  const hoverSel='a,button,input,select,[onclick],[draggable],canvas,.drag-item,.drop-zone,.quiz-opt,.guess-btn,.tab-btn,.vtab-btn,.gtab-btn,.filter-btn,.soal-card,.topic-card,.calc-card';
  document.addEventListener('mouseover',e=>{
    if(e.target.closest(hoverSel)) star.classList.add('hovering');
  });
  document.addEventListener('mouseout',e=>{
    if(e.target.closest(hoverSel)) star.classList.remove('hovering');
  });
})();

// ===== XP SYSTEM =====
let totalXP = parseInt(localStorage.getItem('gm_xp') || '0');
function addXP(amount) {
  totalXP += amount;
  localStorage.setItem('gm_xp', totalXP);
  updateXPBar();
  document.getElementById('stat-xp').textContent = totalXP;
  showToast(`+${amount} XP ✨`);
}
function updateXPBar() {
  const maxXP = 500;
  const pct = Math.min((totalXP % maxXP) / maxXP * 100, 100);
  document.getElementById('xpBar').style.width = pct + '%';
  document.getElementById('xpLabel').textContent = 'XP: ' + totalXP;
  document.getElementById('stat-xp').textContent = totalXP;
}
updateXPBar();

// ===== STARFIELD =====
(function () {
  const c = document.getElementById('starfield');
  const ctx = c.getContext('2d');
  let stars = [];
  function resize() { c.width = innerWidth; c.height = innerHeight; }
  function init() {
    stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      r: Math.random() * 1.4 + 0.2, speed: Math.random() * 0.25 + 0.04,
      op: Math.random()
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    stars.forEach(s => {
      s.op += (Math.random() - .5) * .02;
      s.op = Math.max(.05, Math.min(1, s.op));
      s.y += s.speed;
      if (s.y > c.height) { s.y = 0; s.x = Math.random() * c.width; }
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,230,255,${s.op})`; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  resize(); init(); draw();
  window.addEventListener('resize', () => { resize(); init(); });
})();

// ===== HERO CIRCLE =====
(function () {
  const c = document.getElementById('heroCircle');
  if (!c) return;
  const ctx = c.getContext('2d');
  const cx = 210, cy = 210;
  const rings = [
    { r: 150, color: '#00d4ff', speed: .004, dash: [12, 6] },
    { r: 110, color: '#7c3aed', speed: -.007, dash: [6, 10] },
    { r: 70,  color: '#f59e0b', speed: .011, dash: [] }
  ];
  const dots = [
    { r: 150, a: 0, sp: .018, color: '#00d4ff', sz: 7 },
    { r: 110, a: 2, sp: -.028, color: '#a78bfa', sz: 5 },
    { r: 70,  a: 4, sp: .045, color: '#f59e0b', sz: 4 }
  ];
  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, 420, 420);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 170);
    g.addColorStop(0, 'rgba(0,212,255,.07)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 420, 420);
    rings.forEach(ring => {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * ring.speed);
      ctx.beginPath(); ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
      ctx.strokeStyle = ring.color; ctx.lineWidth = 1.5; ctx.globalAlpha = .45;
      if (ring.dash.length) ctx.setLineDash(ring.dash);
      ctx.stroke(); ctx.setLineDash([]); ctx.restore();
    });
    // Center
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 10);
    cg.addColorStop(0, '#fff'); cg.addColorStop(1, '#00d4ff');
    ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fillStyle = cg; ctx.globalAlpha = 1; ctx.fill();
    // Orbit dots
    dots.forEach(d => {
      d.a += d.sp;
      const x = cx + d.r * Math.cos(d.a), y = cy + d.r * Math.sin(d.a);
      ctx.beginPath(); ctx.arc(x, y, d.sz * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = d.color; ctx.globalAlpha = .15; ctx.fill();
      const dg = ctx.createRadialGradient(x, y, 0, x, y, d.sz);
      dg.addColorStop(0, '#fff'); dg.addColorStop(1, d.color);
      ctx.beginPath(); ctx.arc(x, y, d.sz, 0, Math.PI * 2);
      ctx.fillStyle = dg; ctx.globalAlpha = .95; ctx.fill();
    });
    t++;
    requestAnimationFrame(draw);
  }
  draw();
})();

// ===== FUN FACTS =====
const facts = [
  "π (pi) adalah rasio keliling lingkaran terhadap diameternya — nilainya ~3.14159...",
  "Lingkaran adalah satu-satunya bentuk yang memiliki simetri tak terbatas!",
  "Roda ditemukan ~3500 SM — memanfaatkan sifat lingkaran untuk gerak mulus.",
  "Persamaan lingkaran pertama kali diformulasikan oleh Euclid sekitar 300 SM.",
  "Orbit planet berbentuk elips, bukan lingkaran sempurna — tapi mendekati!",
  "Gelembung sabun selalu berbentuk bola (lingkaran 3D) karena meminimalkan luas permukaan.",
  "Nilai π sudah dihitung hingga lebih dari 100 triliun digit desimal!",
  "Lingkaran dengan jari-jari r memiliki luas πr² dan keliling 2πr.",
];
let factIdx = 0;
function rotateFact() {
  const el = document.getElementById('factsTicker');
  if (el) { el.textContent = facts[factIdx % facts.length]; factIdx++; }
}
rotateFact();
setInterval(rotateFact, 8000);

// ===== NAVBAR =====
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'));
});
window.addEventListener('scroll', () => {
  const ids = ['home','materi','kalkulator','visualisasi','soal','game','leaderboard'];
  let cur = 'home';
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el && scrollY >= el.offsetTop - 220) cur = id;
  });
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.section === cur));
});

function scrollToSection(id) { document.getElementById(id).scrollIntoView({ behavior: 'smooth' }); }

// ===== TABS =====
function showTopic(id, btn) {
  document.querySelectorAll('.topic-content').forEach(e => e.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(e => e.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (btn) btn.classList.add('active');
  addXP(5);
}
function showVisual(id, btn) {
  document.querySelectorAll('.visual-content').forEach(e => e.classList.remove('active'));
  document.querySelectorAll('.vtab-btn').forEach(e => e.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (btn) btn.classList.add('active');
  setTimeout(() => {
    if (id === 'v1') updateCircle1();
    if (id === 'v2') updatePointPos();
    if (id === 'v3') updateTwoCircles();
    if (id === 'v4') updateTangentVis();
  }, 50);
}
function showGame(id, btn) {
  document.querySelectorAll('.game-content').forEach(e => e.classList.remove('active'));
  document.querySelectorAll('.gtab-btn').forEach(e => e.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (btn) btn.classList.add('active');
  // Inisialisasi canvas shooter saat tab G4 dibuka
  if (id === 'g4') initShooterCanvas();
}
function toggleAnswer(id, btn) {
  const el = document.getElementById(id);
  el.classList.toggle('hidden');
  if (btn) btn.textContent = el.classList.contains('hidden') ? '📖 Lihat Pembahasan' : '🔼 Tutup Pembahasan';
}

// ===== TOAST =====
function showToast(msg, color) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.borderColor = color || 'var(--accent)';
  t.style.color = color || 'var(--accent)';
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ===== CONFETTI =====
function launchConfetti() {
  const container = document.getElementById('confetti-container');
  const colors = ['#00d4ff','#7c3aed','#f59e0b','#10b981','#ec4899','#fff'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.cssText = `
      left:${Math.random()*100}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;
      border-radius:${Math.random()>.5?'50%':'2px'};
      animation-duration:${1.5+Math.random()*2}s;
      animation-delay:${Math.random()*.5}s;
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), 3500);
  }
}

// ===== FILTER SOAL =====
function filterSoal(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.soal-card').forEach(c => {
    c.classList.toggle('hidden', cat !== 'all' && c.dataset.cat !== cat);
  });
}

// ===== CANVAS GRID HELPER =====
function drawGrid(ctx, W, H, scale, ox, oy) {
  ctx.strokeStyle = 'rgba(255,255,255,0.055)'; ctx.lineWidth = 1;
  for (let x = ox % scale; x < W; x += scale) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  for (let y = oy % scale; y < H; y += scale) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0,oy); ctx.lineTo(W,oy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ox,0); ctx.lineTo(ox,H); ctx.stroke();
  // Arrow heads
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.beginPath(); ctx.moveTo(W-2,oy); ctx.lineTo(W-10,oy-5); ctx.lineTo(W-10,oy+5); ctx.fill();
  ctx.beginPath(); ctx.moveTo(ox,2); ctx.lineTo(ox-5,10); ctx.lineTo(ox+5,10); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = '11px Exo 2';
  ctx.fillText('X', W-12, oy-8); ctx.fillText('Y', ox+6, 14); ctx.fillText('O', ox+4, oy+14);
  // Tick numbers
  ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.font = '9px Exo 2';
  for (let i = -8; i <= 8; i++) {
    if (i === 0) continue;
    const x = ox + i * scale, y = oy + i * scale;
    if (x > 5 && x < W-5) ctx.fillText(i, x-4, oy+14);
    if (y > 5 && y < H-5) ctx.fillText(-i, ox+4, y+4);
  }
}

// ===== KALKULATOR =====
function calcFromCenter() {
  const a = +document.getElementById('ca').value || 0;
  const b = +document.getElementById('cb').value || 0;
  const r = +document.getElementById('cr').value || 0;
  const r2 = r * r;
  let std = '', gen = '';
  if (a === 0 && b === 0) std = `x² + y² = ${r2}`;
  else {
    const xs = a === 0 ? 'x' : (a > 0 ? `(x−${a})` : `(x+${Math.abs(a)})`);
    const ys = b === 0 ? 'y' : (b > 0 ? `(y−${b})` : `(y+${Math.abs(b)})`);
    std = `${xs}² + ${ys}² = ${r2}`;
  }
  const A = -2*a, B = -2*b, C = a*a + b*b - r2;
  gen = `x² + y² ${A>=0?'+':''}${A}x ${B>=0?'+':''}${B}y ${C>=0?'+':''}${C} = 0`;
  document.getElementById('calc-center-result').innerHTML =
    `<strong>Bentuk Standar:</strong><br>${std}<br><br><strong>Bentuk Umum:</strong><br>${gen}<br><br>Keliling = ${(2*Math.PI*r).toFixed(3)}<br>Luas = ${(Math.PI*r2).toFixed(3)}`;
}
function calcFromPoint() {
  const a = +document.getElementById('cp-a').value || 0;
  const b = +document.getElementById('cp-b').value || 0;
  const x = +document.getElementById('cp-x').value || 0;
  const y = +document.getElementById('cp-y').value || 0;
  const r2 = (x-a)**2 + (y-b)**2;
  const r = Math.sqrt(r2).toFixed(4);
  const xs = a === 0 ? 'x' : (a > 0 ? `(x−${a})` : `(x+${Math.abs(a)})`);
  const ys = b === 0 ? 'y' : (b > 0 ? `(y−${b})` : `(y+${Math.abs(b)})`);
  document.getElementById('calc-point-result').innerHTML =
    `r = √((${x}−${a})²+(${y}−${b})²) = √${r2} ≈ ${r}<br><br><strong>${xs}² + ${ys}² = ${r2}</strong>`;
}
function calcFromGeneral() {
  const A = +document.getElementById('cu-a').value || 0;
  const B = +document.getElementById('cu-b').value || 0;
  const C = +document.getElementById('cu-c').value || 0;
  const a = -A/2, b = -B/2;
  const r2 = a*a + b*b - C;
  if (r2 < 0) { document.getElementById('calc-general-result').innerHTML = '⚠️ Bukan lingkaran (r² < 0)'; return; }
  const r = Math.sqrt(r2).toFixed(4);
  document.getElementById('calc-general-result').innerHTML =
    `Pusat P(${a}, ${b})<br>r² = ${r2}<br>r ≈ ${r}<br><br><strong>(x${a>=0?'−'+a:'+'+Math.abs(a)})² + (y${b>=0?'−'+b:'+'+Math.abs(b)})² = ${r2}</strong>`;
}
function calcGS() {
  const R = +document.getElementById('gs-R').value || 0;
  const r = +document.getElementById('gs-r').value || 0;
  const jp = +document.getElementById('gs-jp').value || 0;
  const gspl2 = jp*jp - (R-r)**2;
  const gspd2 = jp*jp - (R+r)**2;
  const gspl = gspl2 >= 0 ? Math.sqrt(gspl2).toFixed(4) : '—';
  const gspd = gspd2 >= 0 ? Math.sqrt(gspd2).toFixed(4) : '—';
  document.getElementById('calc-gs-result').innerHTML =
    `GSPL = √(${jp}²−(${R}−${r})²) = √${gspl2>=0?gspl2:'negatif'} = <strong>${gspl}</strong><br>GSPD = √(${jp}²−(${R}+${r})²) = √${gspd2>=0?gspd2:'negatif'} = <strong>${gspd}</strong>`;
}
// Init calculators
setTimeout(() => { calcFromCenter(); calcFromPoint(); calcFromGeneral(); calcGS(); }, 100);

// ===== VISUAL 1 =====
function updateCircle1() {
  const a = +document.getElementById('ctrl-a').value;
  const b = +document.getElementById('ctrl-b').value;
  const r = +document.getElementById('ctrl-r').value;
  document.getElementById('val-a').textContent = a;
  document.getElementById('val-b').textContent = b;
  document.getElementById('val-r').textContent = r;
  const r2 = r*r;
  let std = a===0&&b===0 ? `x² + y² = ${r2}` :
    `(x${a>0?'−'+a:a<0?'+'+Math.abs(a):''}${a===0?'':''})² + (y${b>0?'−'+b:b<0?'+'+Math.abs(b):''}${b===0?'':''})² = ${r2}`;
  if (a===0&&b!==0) std = `x² + (y${b>0?'−'+b:'+'+Math.abs(b)})² = ${r2}`;
  if (a!==0&&b===0) std = `(x${a>0?'−'+a:'+'+Math.abs(a)})² + y² = ${r2}`;
  document.getElementById('formula-display').textContent = std;
  const A=-2*a, B=-2*b, C=a*a+b*b-r2;
  document.getElementById('formula-general').textContent =
    `x²+y²${A>=0?'+':''}${A}x${B>=0?'+':''}${B}y${C>=0?'+':''}${C}=0`;
  const canvas = document.getElementById('circleCanvas');
  const ctx = canvas.getContext('2d');
  const W=canvas.width, H=canvas.height, scale=25, ox=W/2, oy=H/2;
  ctx.clearRect(0,0,W,H); drawGrid(ctx,W,H,scale,ox,oy);
  const cx=ox+a*scale, cy=oy-b*scale;
  ctx.beginPath(); ctx.arc(cx,cy,r*scale,0,Math.PI*2);
  ctx.fillStyle='rgba(0,212,255,0.06)'; ctx.fill();
  ctx.strokeStyle='#00d4ff'; ctx.lineWidth=2.5;
  ctx.shadowColor='#00d4ff'; ctx.shadowBlur=18; ctx.stroke(); ctx.shadowBlur=0;
  ctx.beginPath(); ctx.arc(cx,cy,5,0,Math.PI*2);
  ctx.fillStyle='#f59e0b'; ctx.fill();
  ctx.fillStyle='#f59e0b'; ctx.font='bold 12px Exo 2';
  ctx.fillText(`P(${a},${b})`, cx+8, cy-8);
  ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+r*scale,cy);
  ctx.strokeStyle='rgba(245,158,11,.6)'; ctx.lineWidth=1.5;
  ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle='rgba(245,158,11,.8)'; ctx.font='11px Exo 2';
  ctx.fillText(`r=${r}`, cx+r*scale/2-10, cy-6);
}

// ===== VISUAL 2 =====
function updatePointPos() {
  const px=+document.getElementById('ctrl-px').value;
  const py=+document.getElementById('ctrl-py').value;
  const pr=+document.getElementById('ctrl-pr').value;
  document.getElementById('val-px').textContent=px;
  document.getElementById('val-py').textContent=py;
  document.getElementById('val-pr').textContent=pr;
  const val=px*px+py*py, r2=pr*pr;
  let result, color;
  if (Math.abs(val-r2)<=1){result='🔵 Titik PADA lingkaran';color='#00d4ff';}
  else if(val<r2){result='🟢 Titik DI DALAM lingkaran';color='#10b981';}
  else{result='🔴 Titik DI LUAR lingkaran';color='#ef4444';}
  const el=document.getElementById('position-result');
  el.textContent=result; el.style.color=color; el.style.borderColor=color;
  document.getElementById('pos-calc-detail').innerHTML=
    `x²+y² = ${px}²+${py}² = <strong>${val}</strong> &nbsp;|&nbsp; r² = ${pr}² = <strong>${r2}</strong>`;
  const canvas=document.getElementById('pointCanvas');
  const ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height,scale=22,ox=W/2,oy=H/2;
  ctx.clearRect(0,0,W,H); drawGrid(ctx,W,H,scale,ox,oy);
  ctx.beginPath(); ctx.arc(ox,oy,pr*scale,0,Math.PI*2);
  ctx.fillStyle='rgba(124,58,237,0.06)'; ctx.fill();
  ctx.strokeStyle='#7c3aed'; ctx.lineWidth=2;
  ctx.shadowColor='#7c3aed'; ctx.shadowBlur=12; ctx.stroke(); ctx.shadowBlur=0;
  const ptx=ox+px*scale, pty=oy-py*scale;
  ctx.beginPath(); ctx.arc(ptx,pty,8,0,Math.PI*2);
  ctx.fillStyle=color; ctx.shadowColor=color; ctx.shadowBlur=15; ctx.fill(); ctx.shadowBlur=0;
  ctx.fillStyle=color; ctx.font='bold 12px Exo 2';
  ctx.fillText(`A(${px},${py})`, ptx+10, pty-8);
}

// ===== VISUAL 3 =====
function updateTwoCircles() {
  const R=+document.getElementById('ctrl-R').value;
  const r=+document.getElementById('ctrl-r2').value;
  const jp=+document.getElementById('ctrl-jp').value;
  document.getElementById('val-R').textContent=R;
  document.getElementById('val-r2').textContent=r;
  document.getElementById('val-jp').textContent=jp;
  let rel,color;
  const eps=0.01;
  if(jp<eps){rel='🟢 Sepusat (Kosentris)';color='#10b981';}
  else if(Math.abs(jp-(R+r))<eps){rel='🟠 Bersinggungan di luar';color='#f59e0b';}
  else if(Math.abs(jp-Math.abs(R-r))<eps){rel='🔴 Bersinggungan di dalam';color='#ef4444';}
  else if(jp>R+r){rel='⚪ Saling lepas';color='#94a3b8';}
  else if(jp<Math.abs(R-r)){rel='🔵 Satu di dalam yang lain';color='#00d4ff';}
  else{rel='🟡 Berpotongan di dua titik';color='#fbbf24';}
  const el=document.getElementById('relation-result');
  el.textContent=rel; el.style.color=color; el.style.borderColor=color;
  const canvas=document.getElementById('twoCircleCanvas');
  const ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height,scale=22,oy=H/2;
  ctx.clearRect(0,0,W,H); drawGrid(ctx,W,H,scale,W/2,oy);
  const c1x=W/2-(jp*scale)/2, c2x=W/2+(jp*scale)/2;
  ctx.beginPath(); ctx.arc(c1x,oy,R*scale,0,Math.PI*2);
  ctx.fillStyle='rgba(0,212,255,0.05)'; ctx.fill();
  ctx.strokeStyle='#00d4ff'; ctx.lineWidth=2;
  ctx.shadowColor='#00d4ff'; ctx.shadowBlur=10; ctx.stroke(); ctx.shadowBlur=0;
  ctx.beginPath(); ctx.arc(c2x,oy,r*scale,0,Math.PI*2);
  ctx.fillStyle='rgba(245,158,11,0.05)'; ctx.fill();
  ctx.strokeStyle='#f59e0b'; ctx.lineWidth=2;
  ctx.shadowColor='#f59e0b'; ctx.shadowBlur=10; ctx.stroke(); ctx.shadowBlur=0;
  ctx.beginPath(); ctx.arc(c1x,oy,5,0,Math.PI*2); ctx.fillStyle='#00d4ff'; ctx.fill();
  ctx.beginPath(); ctx.arc(c2x,oy,5,0,Math.PI*2); ctx.fillStyle='#f59e0b'; ctx.fill();
  if(jp>0){
    ctx.beginPath(); ctx.moveTo(c1x,oy); ctx.lineTo(c2x,oy);
    ctx.strokeStyle='rgba(255,255,255,.25)'; ctx.lineWidth=1;
    ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='rgba(255,255,255,.5)'; ctx.font='11px Exo 2';
    ctx.fillText(`JP=${jp}`, (c1x+c2x)/2-15, oy-10);
  }
}

// ===== VISUAL 4: TANGENT =====
function updateTangentVis() {
  const tx=+document.getElementById('ctrl-tx').value;
  const ty=+document.getElementById('ctrl-ty').value;
  const tr=+document.getElementById('ctrl-tr').value;
  document.getElementById('val-tx').textContent=tx;
  document.getElementById('val-ty').textContent=ty;
  document.getElementById('val-tr').textContent=tr;
  const jp2=tx*tx+ty*ty, r2=tr*tr;
  const d2=jp2-r2;
  const el=document.getElementById('tangent-result');
  if(d2<0){el.textContent='⚠️ Titik di dalam lingkaran!';el.style.color='#ef4444';return;}
  const d=Math.sqrt(d2).toFixed(4);
  el.textContent=`d = √(JP²−r²) = √(${jp2}−${r2}) = √${d2} ≈ ${d}`;
  el.style.color='var(--accent)';
  const canvas=document.getElementById('tangentCanvas');
  const ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height,scale=22,ox=W/2,oy=H/2;
  ctx.clearRect(0,0,W,H); drawGrid(ctx,W,H,scale,ox,oy);
  ctx.beginPath(); ctx.arc(ox,oy,tr*scale,0,Math.PI*2);
  ctx.fillStyle='rgba(124,58,237,0.06)'; ctx.fill();
  ctx.strokeStyle='#7c3aed'; ctx.lineWidth=2;
  ctx.shadowColor='#7c3aed'; ctx.shadowBlur=12; ctx.stroke(); ctx.shadowBlur=0;
  const ptx=ox+tx*scale, pty=oy-ty*scale;
  ctx.beginPath(); ctx.arc(ptx,pty,6,0,Math.PI*2);
  ctx.fillStyle='#f59e0b'; ctx.fill();
  ctx.fillStyle='#f59e0b'; ctx.font='bold 11px Exo 2';
  ctx.fillText(`P(${tx},${ty})`, ptx+8, pty-8);
  if(d2>=0){
    const jp=Math.sqrt(jp2);
    const angle=Math.atan2(-ty,tx);
    const alpha=Math.asin(tr/jp);
    [angle+alpha, angle-alpha].forEach(a => {
      const ex=ox+tr*scale*Math.cos(Math.PI-a+Math.PI);
      const ey=oy+tr*scale*Math.sin(Math.PI-a+Math.PI);
      ctx.beginPath(); ctx.moveTo(ptx,pty); ctx.lineTo(ox+tr*scale*Math.cos(Math.atan2(pty-oy,ptx-ox)+alpha*(a===angle+alpha?1:-1)), oy+tr*scale*Math.sin(Math.atan2(pty-oy,ptx-ox)+alpha*(a===angle+alpha?1:-1)));
      ctx.strokeStyle='rgba(0,212,255,.5)'; ctx.lineWidth=1.5;
      ctx.setLineDash([5,4]); ctx.stroke(); ctx.setLineDash([]);
    });
    ctx.beginPath(); ctx.moveTo(ox,oy); ctx.lineTo(ptx,pty);
    ctx.strokeStyle='rgba(245,158,11,.4)'; ctx.lineWidth=1;
    ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
  }
}
setTimeout(() => { updateCircle1(); updatePointPos(); updateTwoCircles(); updateTangentVis(); }, 150);

// ===== SOAL DATA & RENDER =====
const soalData = [
  {
    num:'01', cat:'persamaan', level:'easy',
    q:'Tentukan persamaan lingkaran berpusat di O(0,0) dan berjari-jari 3.',
    ans:`<strong>Diketahui:</strong> Pusat O(0,0), r = 3<br>
<strong>Rumus:</strong> x² + y² = r²<br>
<strong>Substitusi:</strong> x² + y² = 3²<br>
<strong>Jawab: x² + y² = 9</strong>`
  },
  {
    num:'02', cat:'persamaan', level:'easy',
    q:'Tentukan persamaan lingkaran berpusat di O(0,0) dan melalui titik P(5, 12).',
    ans:`<strong>Diketahui:</strong> Pusat O(0,0), melalui P(5,12)<br>
<strong>Langkah 1 — Hitung r:</strong><br>
r = √(x² + y²) = √(5² + 12²) = √(25 + 144) = √169 = 13<br>
<strong>Langkah 2 — Substitusi:</strong><br>
x² + y² = r² = 13² = 169<br>
<strong>Jawab: x² + y² = 169</strong>`
  },
  {
    num:'03', cat:'persamaan', level:'medium',
    q:'Tentukan persamaan lingkaran dengan pusat P(1, 2) dan jari-jari r = 8.',
    ans:`<strong>Diketahui:</strong> Pusat P(a,b) = (1,2), r = 8<br>
<strong>Rumus:</strong> (x−a)² + (y−b)² = r²<br>
<strong>Substitusi:</strong> (x−1)² + (y−2)² = 8² = 64<br>
<strong>Jawab: (x−1)² + (y−2)² = 64</strong>`
  },
  {
    num:'04', cat:'persamaan', level:'medium',
    q:'Tentukan persamaan lingkaran pusat P(3, 2) yang melalui titik A(10, 2).',
    ans:`<strong>Diketahui:</strong> Pusat P(3,2), melalui A(10,2)<br>
<strong>Langkah 1 — Hitung r:</strong><br>
r = √((10−3)² + (2−2)²) = √(49 + 0) = √49 = 7<br>
<strong>Langkah 2 — Persamaan:</strong><br>
(x−3)² + (y−2)² = 7² = 49<br>
<strong>Jawab: (x−3)² + (y−2)² = 49</strong>`
  },
  {
    num:'05', cat:'persamaan', level:'medium',
    q:'Tentukan persamaan lingkaran pusat P(2, −9) yang menyinggung sumbu X.',
    ans:`<strong>Diketahui:</strong> Pusat P(2,−9), menyinggung sumbu X<br>
<strong>Aturan:</strong> Jika lingkaran menyinggung sumbu X, maka r = |b| = nilai mutlak koordinat y pusat<br>
r = |−9| = 9<br>
<strong>Persamaan:</strong> (x−2)² + (y−(−9))² = 9²<br>
<strong>Jawab: (x−2)² + (y+9)² = 81</strong>`
  },
  {
    num:'06', cat:'bentuk-umum', level:'medium',
    q:'Tentukan pusat dan jari-jari dari x² + y² + 4x − 2y + 1 = 0.',
    ans:`<strong>Diketahui:</strong> x² + y² + 4x − 2y + 1 = 0<br>
<strong>Identifikasi:</strong> A = 4, B = −2, C = 1<br>
<strong>Pusat:</strong> P(−½A, −½B) = (−½·4, −½·(−2)) = <strong>(−2, 1)</strong><br>
<strong>Jari-jari:</strong><br>
r = √((−½A)² + (−½B)² − C)<br>
r = √((−2)² + (1)² − 1)<br>
r = √(4 + 1 − 1) = √4 = <strong>2</strong><br>
<strong>Jawab: Pusat (−2, 1), r = 2</strong>`
  },
  {
    num:'07', cat:'bentuk-umum', level:'medium',
    q:'Tentukan pusat dan jari-jari dari x² + y² − 6x + 8y − 24 = 0.',
    ans:`<strong>Diketahui:</strong> x² + y² − 6x + 8y − 24 = 0<br>
<strong>Identifikasi:</strong> A = −6, B = 8, C = −24<br>
<strong>Pusat:</strong> P(−½·(−6), −½·8) = <strong>(3, −4)</strong><br>
<strong>Jari-jari:</strong><br>
r = √((3)² + (−4)² − (−24))<br>
r = √(9 + 16 + 24) = √49 = <strong>7</strong><br>
<strong>Jawab: Pusat (3, −4), r = 7</strong>`
  },
  {
    num:'08', cat:'bentuk-umum', level:'hard',
    q:'Tentukan jari-jari dari lingkaran yang berpusat di (3, −2) dan melalui titik (7, 1).',
    ans:`<strong>Diketahui:</strong> Pusat P(3,−2), melalui titik Q(7,1)<br>
<strong>Rumus jarak dua titik:</strong><br>
r = √((x₂−x₁)² + (y₂−y₁)²)<br>
r = √((7−3)² + (1−(−2))²)<br>
r = √(4² + 3²)<br>
r = √(16 + 9) = √25 = <strong>5</strong><br>
<strong>Jawab: r = 5</strong><br>
Persamaan: (x−3)² + (y+2)² = 25`
  },
  {
    num:'09', cat:'posisi', level:'easy',
    q:'Tentukan posisi titik A(2, 7) pada lingkaran dengan pusat O(0,0) dan jari-jari 8.',
    ans:`<strong>Diketahui:</strong> Titik A(2,7), lingkaran x²+y²=64 (r=8)<br>
<strong>Substitusi titik A ke persamaan:</strong><br>
x² + y² = 2² + 7² = 4 + 49 = 53<br>
<strong>Bandingkan dengan r²:</strong><br>
53 &lt; 64 = r²<br>
Karena x²+y² &lt; r², maka:<br>
<strong>Jawab: Titik A(2,7) berada DI DALAM lingkaran</strong>`
  },
  {
    num:'10', cat:'posisi', level:'medium',
    q:'Tentukan posisi titik B(5, 3) pada lingkaran yang berpusat di P(3, 2) dan jari-jari 5.',
    ans:`<strong>Diketahui:</strong> Titik B(5,3), lingkaran pusat P(3,2), r=5<br>
<strong>Persamaan lingkaran:</strong> (x−3)² + (y−2)² = 25<br>
<strong>Substitusi titik B(5,3):</strong><br>
(5−3)² + (3−2)² = 2² + 1² = 4 + 1 = 5<br>
<strong>Bandingkan dengan r²:</strong><br>
5 &lt; 25 = r²<br>
<strong>Jawab: Titik B(5,3) berada DI DALAM lingkaran</strong>`
  },
  {
    num:'11', cat:'posisi', level:'hard',
    q:'Tentukan posisi titik C(8, 1) pada lingkaran x² + y² + 4x − 8y − 5 = 0.',
    ans:`<strong>Diketahui:</strong> Titik C(8,1), lingkaran x²+y²+4x−8y−5=0<br>
<strong>Substitusi x=8, y=1:</strong><br>
= 8² + 1² + 4(8) − 8(1) − 5<br>
= 64 + 1 + 32 − 8 − 5<br>
= 84<br>
<strong>Karena hasil &gt; 0:</strong><br>
x²+y²+Ax+By+C &gt; 0 → titik di luar lingkaran<br>
<strong>Jawab: Titik C(8,1) berada DI LUAR lingkaran</strong>`
  },
  {
    num:'12', cat:'posisi', level:'hard',
    q:'Tentukan posisi garis y = 3x + 2 pada lingkaran x² + y² + 4x − y + 1 = 0.',
    ans:`<strong>Diketahui:</strong> Garis y = 3x+2, lingkaran x²+y²+4x−y+1=0<br>
<strong>Langkah 1 — Substitusi y=3x+2:</strong><br>
x² + (3x+2)² + 4x − (3x+2) + 1 = 0<br>
x² + 9x²+12x+4 + 4x − 3x−2 + 1 = 0<br>
10x² + 13x + 3 = 0<br>
<strong>Langkah 2 — Hitung Diskriminan:</strong><br>
D = b²−4ac = 13²−4(10)(3) = 169−120 = 49<br>
<strong>Karena D = 49 &gt; 0:</strong><br>
<strong>Jawab: Garis memotong lingkaran di DUA titik</strong>`
  },
  {
    num:'13', cat:'singgung', level:'medium',
    q:'Dua lingkaran dengan R = 6, r = 2, dan jarak pusat JP = 10. Tentukan panjang GSPL!',
    ans:`<strong>Diketahui:</strong> R = 6, r = 2, JP = 10<br>
<strong>Rumus GSPL:</strong> d = √(JP² − (R−r)²)<br>
<strong>Substitusi:</strong><br>
d = √(10² − (6−2)²)<br>
d = √(100 − 16)<br>
d = √84 = √(4·21) = 2√21<br>
d ≈ <strong>9,165</strong><br>
<strong>Jawab: GSPL = 2√21 ≈ 9,165</strong>`
  },
  {
    num:'14', cat:'singgung', level:'medium',
    q:'Dua lingkaran dengan R = 6, r = 2, dan jarak pusat JP = 10. Tentukan panjang GSPD!',
    ans:`<strong>Diketahui:</strong> R = 6, r = 2, JP = 10<br>
<strong>Rumus GSPD:</strong> d = √(JP² − (R+r)²)<br>
<strong>Substitusi:</strong><br>
d = √(10² − (6+2)²)<br>
d = √(100 − 64)<br>
d = √36 = <strong>6</strong><br>
<strong>Jawab: GSPD = 6</strong>`
  },
  {
    num:'15', cat:'singgung', level:'hard',
    q:'Tentukan panjang garis singgung dari titik P(6, 0) ke lingkaran x² + y² = 16.',
    ans:`<strong>Diketahui:</strong> Titik P(6,0), lingkaran x²+y²=16 → r=4, pusat O(0,0)<br>
<strong>Langkah 1 — Hitung JP:</strong><br>
JP = √(6²+0²) = √36 = 6<br>
<strong>Langkah 2 — Rumus panjang garis singgung:</strong><br>
d = √(JP² − r²)<br>
d = √(36 − 16) = √20 = 2√5<br>
d ≈ <strong>4,472</strong><br>
<strong>Jawab: d = 2√5 ≈ 4,472</strong>`
  },
  {
    num:'16', cat:'hubungan', level:'easy',
    q:'Dua lingkaran: L1 pusat(0,0) r=3, L2 pusat(7,0) r=2. Tentukan hubungannya!',
    ans:`<strong>Diketahui:</strong> L1: pusat(0,0) r=3, L2: pusat(7,0) r=2<br>
<strong>Langkah 1 — Hitung JP:</strong><br>
JP = √((7−0)²+(0−0)²) = √49 = 7<br>
<strong>Langkah 2 — Hitung R+r dan |R−r|:</strong><br>
R+r = 3+2 = 5<br>
|R−r| = |3−2| = 1<br>
<strong>Langkah 3 — Bandingkan:</strong><br>
JP = 7 &gt; R+r = 5<br>
<strong>Jawab: Kedua lingkaran SALING LEPAS (tidak berpotongan)</strong>`
  },
  {
    num:'17', cat:'hubungan', level:'medium',
    q:'Dua lingkaran: L1 pusat(0,0) r=4, L2 pusat(6,0) r=2. Tentukan hubungannya!',
    ans:`<strong>Diketahui:</strong> L1: pusat(0,0) r=4, L2: pusat(6,0) r=2<br>
<strong>Langkah 1 — Hitung JP:</strong><br>
JP = √((6−0)²+(0−0)²) = 6<br>
<strong>Langkah 2 — Hitung R+r:</strong><br>
R+r = 4+2 = 6<br>
<strong>Langkah 3 — Bandingkan:</strong><br>
JP = 6 = R+r = 6<br>
<strong>Jawab: Kedua lingkaran BERSINGGUNGAN DI LUAR</strong><br>
(satu titik singgung, kedua lingkaran di luar satu sama lain)`
  },
  {
    num:'18', cat:'hubungan', level:'medium',
    q:'Dua lingkaran: L1 pusat(0,0) r=5, L2 pusat(3,0) r=1. Tentukan hubungannya!',
    ans:`<strong>Diketahui:</strong> L1: pusat(0,0) r=5, L2: pusat(3,0) r=1<br>
<strong>Langkah 1 — Hitung JP:</strong><br>
JP = √((3−0)²+(0−0)²) = 3<br>
<strong>Langkah 2 — Hitung |R−r|:</strong><br>
|R−r| = |5−1| = 4<br>
<strong>Langkah 3 — Bandingkan:</strong><br>
JP = 3 &lt; |R−r| = 4<br>
<strong>Jawab: L2 berada DI DALAM L1 (tidak berpotongan)</strong><br>
(lingkaran kecil sepenuhnya di dalam lingkaran besar)`
  },
  {
    num:'19', cat:'hubungan', level:'hard',
    q:'Dua lingkaran: L1 pusat(0,0) r=5, L2 pusat(4,0) r=2. Tentukan hubungannya!',
    ans:`<strong>Diketahui:</strong> L1: pusat(0,0) r=5, L2: pusat(4,0) r=2<br>
<strong>Langkah 1 — Hitung JP:</strong><br>
JP = √((4−0)²+(0−0)²) = 4<br>
<strong>Langkah 2 — Hitung R+r dan |R−r|:</strong><br>
R+r = 5+2 = 7<br>
|R−r| = |5−2| = 3<br>
<strong>Langkah 3 — Bandingkan:</strong><br>
|R−r| = 3 &lt; JP = 4 &lt; R+r = 7<br>
<strong>Jawab: Kedua lingkaran BERPOTONGAN DI DUA TITIK</strong>`
  },
  {
    num:'20', cat:'bentuk-umum', level:'hard',
    q:'Ubah x² + y² − 4x + 6y − 3 = 0 ke bentuk standar. Tentukan pusat dan jari-jarinya!',
    ans:`<strong>Diketahui:</strong> x² + y² − 4x + 6y − 3 = 0<br>
<strong>Langkah 1 — Kelompokkan suku x dan y:</strong><br>
(x² − 4x) + (y² + 6y) = 3<br>
<strong>Langkah 2 — Lengkapkan kuadrat sempurna:</strong><br>
(x² − 4x + 4) + (y² + 6y + 9) = 3 + 4 + 9<br>
<strong>Langkah 3 — Faktorkan:</strong><br>
(x−2)² + (y+3)² = 16<br>
<strong>Jawab:</strong><br>
Pusat P = <strong>(2, −3)</strong><br>
Jari-jari r = √16 = <strong>4</strong>`
  },
];

function renderSoal() {
  const list = document.getElementById('soal-list');
  const soalBaru = JSON.parse(localStorage.getItem('gm_soal_baru') || '[]');
  const allSoal = [...soalData, ...soalBaru];
  
  list.innerHTML = allSoal.map(s => `
    <div class="soal-card" data-cat="${s.cat}">
      <div class="soal-header">
        <span class="soal-num">${s.num}</span>
        <span class="soal-cat">${s.cat.replace('-',' ')}</span>
        <span class="soal-level ${s.level}">${s.level==='easy'?'⭐ Mudah':s.level==='medium'?'⭐⭐ Sedang':'⭐⭐⭐ Sulit'}</span>
        ${soalBaru.some(b => b.num === s.num) ? '<span style="background:#7c3aed; color:#fff; padding:0.2rem 0.6rem; border-radius:6px; font-size:0.7rem; margin-left:0.5rem">✍️ BARU</span>' : ''}
      </div>
      <p class="soal-text">${s.q}</p>
      <button class="btn-toggle-ans" onclick="toggleAnswer('ans-${s.num}', this)" style="margin-top:0.8rem; padding:0.5rem 1rem; background:rgba(0,212,255,0.15); border:1px solid rgba(0,212,255,0.3); color:#00d4ff; border-radius:6px; cursor:pointer; font-size:0.85rem; font-family:'Exo 2',sans-serif">📖 Lihat Pembahasan</button>
      <div id="ans-${s.num}" class="soal-answer hidden" style="margin-top:1rem; padding:1rem; background:rgba(16,185,129,0.1); border-left:3px solid #10b981; border-radius:8px; color:#a7f3d0; font-size:0.9rem; line-height:1.6">
        ${typeof s.ans === 'string' ? s.ans : (s.ans || 'Pembahasan tidak tersedia')}
      </div>
    </div>`).join('');
}
renderSoal();

// ===== QUIZ G1 (with COMBO) =====
const quizData = [
  { q:'Persamaan lingkaran pusat O(0,0) jari-jari 5 adalah...', opts:['x²+y²=5','x²+y²=25','x²+y²=10','(x+5)²+y²=25'], ans:1 },
  { q:'Pusat lingkaran (x−3)²+(y+2)²=16 adalah...', opts:['(3,2)','(−3,2)','(3,−2)','(−3,−2)'], ans:2 },
  { q:'Jari-jari lingkaran x²+y²=49 adalah...', opts:['49','7','√7','14'], ans:1 },
  { q:'Titik A(3,4) terhadap lingkaran x²+y²=25 berada...', opts:['Di dalam','Pada lingkaran','Di luar','Tidak tentu'], ans:1 },
  { q:'Bentuk umum persamaan lingkaran adalah...', opts:['x²+y²=r²','(x−a)²+(y−b)²=r²','x²+y²+Ax+By+C=0','ax²+by²=r'], ans:2 },
  { q:'Pusat lingkaran x²+y²+4x−6y+4=0 adalah...', opts:['(4,−6)','(−2,3)','(2,−3)','(−4,6)'], ans:1 },
  { q:'Jika D>0, posisi garis terhadap lingkaran adalah...', opts:['Menyinggung','Tidak memotong','Memotong di dua titik','Sejajar'], ans:2 },
  { q:'Dua lingkaran kosentris artinya...', opts:['Jari-jarinya sama','Pusatnya sama','Berpotongan dua titik','Saling lepas'], ans:1 },
  { q:'Rumus GSPL adalah...', opts:['√(JP²+(R−r)²)','√(JP²−(R+r)²)','√(JP²−(R−r)²)','√(JP²+(R+r)²)'], ans:2 },
  { q:'Persamaan lingkaran pusat P(1,2) r=3 adalah...', opts:['(x+1)²+(y+2)²=9','(x−1)²+(y−2)²=9','(x−1)²+(y−2)²=3','x²+y²=9'], ans:1 },
  { q:'Jari-jari lingkaran x²+y²−6x+8y−24=0 adalah...', opts:['5','6','7','8'], ans:2 },
  { q:'Titik B(5,3) pada lingkaran pusat P(3,2) r=5 berada...', opts:['Di luar','Pada lingkaran','Di dalam','Tidak tentu'], ans:2 },
];

let q1State = { idx:0, score:0, lives:3, combo:0, maxCombo:0, answered:false };

function _doStartQuiz() {
  q1State = { idx:0, score:0, lives:3, combo:0, maxCombo:0, answered:false };
  document.getElementById('start-quiz-btn').style.display='none';
  document.getElementById('q1-result').classList.add('hidden');
  document.getElementById('quiz-body').style.display='block';
  renderQuestion();
}
function renderQuestion() {
  const s = q1State;
  if (s.idx >= quizData.length || s.lives <= 0) { endQuiz(); return; }
  const q = quizData[s.idx];
  document.getElementById('q1-score').textContent = s.score;
  document.getElementById('q1-current').textContent = s.idx+1;
  document.getElementById('q1-total').textContent = quizData.length;
  document.getElementById('q1-lives').textContent = s.lives;
  document.getElementById('quiz-prog-fill').style.width = ((s.idx/quizData.length)*100)+'%';
  const cd = document.getElementById('combo-display');
  if (s.combo >= 2) { cd.style.display='block'; document.getElementById('combo-count').textContent=s.combo; }
  else cd.style.display='none';
  document.getElementById('q1-question').textContent = q.q;
  const opts = document.getElementById('q1-options');
  opts.innerHTML = '';
  q.opts.forEach((opt,i) => {
    const btn = document.createElement('button');
    btn.className='quiz-opt'; btn.textContent=opt;
    btn.onclick = () => selectAnswer(i);
    opts.appendChild(btn);
  });
  s.answered = false;
}
function selectAnswer(i) {
  if (q1State.answered) return;
  q1State.answered = true;
  const q = quizData[q1State.idx];
  const btns = document.querySelectorAll('.quiz-opt');
  btns[q.ans].classList.add('correct');
  if (i === q.ans) {
    q1State.combo++;
    q1State.maxCombo = Math.max(q1State.maxCombo, q1State.combo);
    const bonus = q1State.combo >= 3 ? 20 : q1State.combo >= 2 ? 15 : 10;
    q1State.score += bonus;
    showToast(q1State.combo>=3 ? `🔥 COMBO x${q1State.combo}! +${bonus}` : `✅ Benar! +${bonus}`, '#10b981');
    if (q1State.combo === 3) launchConfetti();
  } else {
    btns[i].classList.add('wrong');
    q1State.lives--;
    q1State.combo = 0;
    showToast('❌ Salah! −1 nyawa', '#ef4444');
    document.querySelector('.quiz-container').style.animation='shake .3s ease';
    setTimeout(() => document.querySelector('.quiz-container').style.animation='', 300);
  }
  setTimeout(() => { q1State.idx++; renderQuestion(); }, 1100);
}
function endQuiz() {
  document.getElementById('quiz-body').style.display='none';
  const res = document.getElementById('q1-result');
  res.classList.remove('hidden');
  const s = q1State.score;
  const xpEarned = Math.floor(s/2);
  addXP(xpEarned);

  // Simpan skor dengan nama & presensi
  saveScoreWithName('quiz', s, currentPlayer.nama, currentPlayer.presensi);
  saveScore('quiz', s); // tetap simpan ke leaderboard lama juga

  let icon,title,msg;
  if(s>=100){icon='🏆';title='SEMPURNA!';msg=`Skor ${s} — Kamu jenius lingkaran!`;launchConfetti();}
  else if(s>=70){icon='🎉';title='Luar Biasa!';msg=`Skor ${s} — Combo terbaik: x${q1State.maxCombo}`;}
  else if(s>=40){icon='👍';title='Bagus!';msg=`Skor ${s} — Terus semangat!`;}
  else{icon='📚';title='Belajar Lagi Yuk!';msg=`Skor ${s} — Pelajari materinya dulu!`;}

  document.getElementById('result-icon').textContent=icon;
  document.getElementById('result-title').textContent=title;
  document.getElementById('result-msg').textContent=msg;
  document.getElementById('result-xp').textContent=`+${xpEarned} XP diperoleh!`;

  // Tampilkan modal ranking
  setTimeout(() => showRankingModal(s), 600);
  renderLeaderboard();
}

// ===== SIMPAN SKOR DENGAN NAMA =====
function saveScoreWithName(game, score, nama, presensi) {
  const key = 'gm_rank_' + game;
  let data = JSON.parse(localStorage.getItem(key) || '[]');
  // Update jika nama+presensi sudah ada, ambil skor tertinggi
  const existing = data.findIndex(d => d.presensi === presensi);
  if (existing >= 0) {
    if (score > data[existing].score) {
      data[existing].score = score;
      data[existing].nama = nama;
      data[existing].date = new Date().toLocaleDateString('id-ID');
    }
  } else {
    data.push({ nama, presensi, score, date: new Date().toLocaleDateString('id-ID') });
  }
  data.sort((a,b) => b.score - a.score);
  localStorage.setItem(key, JSON.stringify(data));
}

// ===== TAMPILKAN MODAL RANKING =====
function showRankingModal(myScore) {
  const key = 'gm_rank_quiz';
  const data = JSON.parse(localStorage.getItem(key) || '[]');
  const myRank = data.findIndex(d => d.presensi === currentPlayer.presensi) + 1;
  const medals = ['🥇','🥈','🥉'];

  // Player card
  let badgeClass = myRank === 1 ? 'rank-badge-1' : myRank === 2 ? 'rank-badge-2' : myRank === 3 ? 'rank-badge-3' : 'rank-badge-other';
  let badgeText = myRank <= 3 ? `${medals[myRank-1]} Peringkat ${myRank}` : `Peringkat ${myRank} dari ${data.length}`;
  document.getElementById('rank-player-card').innerHTML = `
    <div class="rank-player-name">${currentPlayer.nama}</div>
    <div class="rank-player-info">No. Presensi: ${currentPlayer.presensi}</div>
    <div class="rank-player-score">${myScore} poin</div>
    <span class="rank-player-badge ${badgeClass}">${badgeText}</span>
  `;

  // Rank icon & title
  if(myRank===1){document.getElementById('rank-icon').textContent='🏆';document.getElementById('rank-title').textContent='Juara 1!';}
  else if(myRank===2){document.getElementById('rank-icon').textContent='🥈';document.getElementById('rank-title').textContent='Peringkat 2!';}
  else if(myRank===3){document.getElementById('rank-icon').textContent='🥉';document.getElementById('rank-title').textContent='Peringkat 3!';}
  else{document.getElementById('rank-icon').textContent='📊';document.getElementById('rank-title').textContent='Hasil Kuis';}

  // Tabel ranking
  const rows = data.slice(0,10).map((d,i) => {
    const isMe = d.presensi === currentPlayer.presensi;
    const medal = i < 3 ? medals[i] : `${i+1}.`;
    return `<tr class="${isMe?'highlight':''}">
      <td><span class="rank-medal">${medal}</span></td>
      <td>${d.nama}</td>
      <td style="text-align:center">${d.presensi}</td>
      <td style="text-align:right;font-family:'Orbitron',sans-serif;color:var(--accent)">${d.score}</td>
    </tr>`;
  }).join('');

  document.getElementById('rank-table').innerHTML = `
    <table class="rank-table">
      <thead><tr><th>#</th><th>Nama</th><th style="text-align:center">Presensi</th><th style="text-align:right">Skor</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;

  openModal('modalRanking');
  if(myRank===1) launchConfetti();
}

// ===== GAME 2: TEBAK POSISI (with timer) =====
let g2State = { round:0, score:0, px:0, py:0, r:0, answer:'', timer:null, timeLeft:10 };
function startGuessGame() {
  g2State = { round:1, score:0, px:0, py:0, r:0, answer:'', timer:null, timeLeft:10 };
  document.getElementById('g2-start-btn').style.display='none';
  document.getElementById('guess-buttons').style.display='flex';
  document.getElementById('g2-score').textContent=0;
  nextGuessRound();
}
function nextGuessRound() {
  if (g2State.round > 8) { endGuessGame(); return; }
  clearInterval(g2State.timer);
  g2State.timeLeft = 10;
  document.getElementById('g2-round').textContent = g2State.round;
  document.getElementById('g2-timer').textContent = g2State.timeLeft;
  document.getElementById('guess-feedback').textContent='';
  const r = Math.floor(Math.random()*5)+3;
  const px = Math.floor(Math.random()*17)-8;
  const py = Math.floor(Math.random()*17)-8;
  g2State.r=r; g2State.px=px; g2State.py=py;
  const val=px*px+py*py, r2=r*r;
  if(Math.abs(val-r2)<=2) g2State.answer='pada';
  else if(val<r2) g2State.answer='dalam';
  else g2State.answer='luar';
  drawGuessCanvas(px,py,r);
  g2State.timer = setInterval(() => {
    g2State.timeLeft--;
    document.getElementById('g2-timer').textContent = g2State.timeLeft;
    if (g2State.timeLeft <= 0) {
      clearInterval(g2State.timer);
      document.getElementById('guess-feedback').textContent = `⏰ Waktu habis! Jawaban: ${g2State.answer}`;
      document.getElementById('guess-feedback').style.color='#f59e0b';
      g2State.round++;
      setTimeout(nextGuessRound, 1500);
    }
  }, 1000);
}
function drawGuessCanvas(px,py,r) {
  const canvas=document.getElementById('guessCanvas');
  const ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height,scale=20,ox=W/2,oy=H/2;
  ctx.clearRect(0,0,W,H); drawGrid(ctx,W,H,scale,ox,oy);
  ctx.beginPath(); ctx.arc(ox,oy,r*scale,0,Math.PI*2);
  ctx.strokeStyle='#7c3aed'; ctx.lineWidth=2.5;
  ctx.shadowColor='#7c3aed'; ctx.shadowBlur=12; ctx.stroke(); ctx.shadowBlur=0;
  ctx.beginPath(); ctx.arc(ox,oy,r*scale,0,Math.PI*2);
  ctx.fillStyle='rgba(124,58,237,0.07)'; ctx.fill();
  const ptx=ox+px*scale, pty=oy-py*scale;
  ctx.beginPath(); ctx.arc(ptx,pty,9,0,Math.PI*2);
  ctx.fillStyle='#ef4444'; ctx.shadowColor='#ef4444'; ctx.shadowBlur=18; ctx.fill(); ctx.shadowBlur=0;
}
function submitGuess(guess) {
  clearInterval(g2State.timer);
  const correct = guess === g2State.answer;
  const fb = document.getElementById('guess-feedback');
  const timeBonus = Math.floor(g2State.timeLeft * 2);
  if (correct) {
    const pts = 20 + timeBonus;
    g2State.score += pts;
    fb.textContent = `✅ Benar! +${pts} (bonus waktu +${timeBonus})`;
    fb.style.color='#10b981';
    showToast(`✅ Benar! +${pts}`, '#10b981');
  } else {
    fb.textContent = `❌ Salah! Jawaban: ${g2State.answer==='dalam'?'Di Dalam':g2State.answer==='pada'?'Pada Lingkaran':'Di Luar'}`;
    fb.style.color='#ef4444';
  }
  document.getElementById('g2-score').textContent = g2State.score;
  g2State.round++;
  setTimeout(nextGuessRound, 1400);
}
function endGuessGame() {
  clearInterval(g2State.timer);
  document.getElementById('guess-buttons').style.display='none';
  document.getElementById('g2-instruction').textContent=`Game selesai! Skor: ${g2State.score}/200 🎉`;
  document.getElementById('g2-start-btn').style.display='inline-block';
  document.getElementById('g2-start-btn').textContent='Main Lagi 🎯';
  document.getElementById('guess-feedback').textContent='';
  addXP(Math.floor(g2State.score/5));
  saveScore('guess', g2State.score);
  if (g2State.score >= 150) launchConfetti();
  renderLeaderboard();
}

// ===== GAME 3: SPEED MATH =====
const raceQ = [
  { q:'Jari-jari x²+y²=36 adalah...', ans:6 },
  { q:'Pusat (x−2)²+(y−3)²=25, nilai a=...', ans:2 },
  { q:'Pusat (x+4)²+(y−1)²=9, nilai b=...', ans:1 },
  { q:'Jari-jari (x−1)²+(y−2)²=64 adalah...', ans:8 },
  { q:'3²+4²=...', ans:25 },
  { q:'Jari-jari x²+y²=100 adalah...', ans:10 },
  { q:'Pusat x²+y²+6x−4y+4=0, nilai a=...', ans:-3 },
  { q:'Jari-jari x²+y²−2x−4y−4=0 adalah...', ans:3 },
  { q:'R=6, r=4, JP=10. GSPL²=JP²−(R−r)²=...', ans:96 },
  { q:'R=5, r=3, bersinggungan luar → JP=...', ans:8 },
  { q:'r=7 → r²=...', ans:49 },
  { q:'Pusat x²+y²−8x+2y+7=0, nilai a=...', ans:4 },
  { q:'Pusat (x+3)²+(y−5)²=16, nilai b=...', ans:5 },
  { q:'Jari-jari x²+y²+10x−6y+18=0 adalah...', ans:4 },
  { q:'5²+12²=...', ans:169 },
];
let raceState = { active:false, score:0, timer:45, interval:null, qIdx:0, correct:0 };
function startRace() {
  raceState = { active:true, score:0, timer:45, interval:null, qIdx:0, correct:0 };
  document.getElementById('g3-start-btn').style.display='none';
  document.getElementById('g3-score').textContent=0;
  document.getElementById('g3-timer').textContent=45;
  document.getElementById('g3-correct').textContent=0;
  document.getElementById('g3-feedback').textContent='';
  document.getElementById('g3-input').value='';
  document.getElementById('g3-input').disabled=false;
  document.getElementById('g3-input').focus();
  for(let i=raceQ.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[raceQ[i],raceQ[j]]=[raceQ[j],raceQ[i]];}
  showRaceQ();
  raceState.interval = setInterval(() => {
    raceState.timer--;
    document.getElementById('g3-timer').textContent = raceState.timer;
    document.getElementById('race-timer-fill').style.width = (raceState.timer/45*100)+'%';
    if (raceState.timer <= 0) endRace();
  }, 1000);
}
function showRaceQ() {
  const q = raceQ[raceState.qIdx % raceQ.length];
  document.getElementById('g3-question').textContent = q.q;
  document.getElementById('g3-input').value='';
  document.getElementById('g3-feedback').textContent='';
}
function checkRace() {
  if (!raceState.active) return;
  const input = document.getElementById('g3-input').value.trim();
  const q = raceQ[raceState.qIdx % raceQ.length];
  const fb = document.getElementById('g3-feedback');
  if (parseFloat(input) === q.ans) {
    raceState.score += 5; raceState.correct++;
    document.getElementById('g3-score').textContent = raceState.score;
    document.getElementById('g3-correct').textContent = raceState.correct;
    fb.textContent='✅ +5'; fb.style.color='#10b981';
    raceState.qIdx++;
    setTimeout(showRaceQ, 400);
  } else {
    fb.textContent='❌ Coba lagi!'; fb.style.color='#ef4444';
    document.getElementById('g3-input').value='';
  }
}
function endRace() {
  clearInterval(raceState.interval);
  raceState.active=false;
  document.getElementById('g3-input').disabled=true;
  const s=raceState.score;
  addXP(Math.floor(s/2));
  saveScore('race', s);
  let msg = s>=60?`🏆 Luar biasa! Skor: ${s}`:s>=30?`🎉 Bagus! Skor: ${s}`:`📚 Latihan lagi! Skor: ${s}`;
  document.getElementById('g3-question').textContent = msg;
  document.getElementById('g3-start-btn').style.display='inline-block';
  document.getElementById('g3-start-btn').textContent='Main Lagi ⚡';
  if (s >= 60) launchConfetti();
  renderLeaderboard();
}

// ===== GAME 4: CIRCLE SHOOTER =====
let shooterState = { active:false, score:0, lives:3, level:1, circles:[], question:null, animId:null };
const SHOOTER_W = 600, SHOOTER_H = 340;

const shooterQuestions = [
  // Soal jari-jari
  { q:'Jari-jari x²+y²=25 adalah...', ans:'5', wrongs:['3','7','10'] },
  { q:'Jari-jari (x−1)²+(y−2)²=36 adalah...', ans:'6', wrongs:['4','8','36'] },
  { q:'Jari-jari x²+y²=81 adalah...', ans:'9', wrongs:['3','6','81'] },
  { q:'Jari-jari x²+y²−4x+6y−3=0 adalah...', ans:'4', wrongs:['2','3','5'] },
  { q:'Jari-jari x²+y²+2x−4y−4=0 adalah...', ans:'3', wrongs:['1','2','4'] },
  // Soal pusat — jawaban koordinat
  { q:'Pusat (x−4)²+(y+2)²=9 adalah...', ans:'(4,−2)', wrongs:['(−4,2)','(4,2)','(−4,−2)'] },
  { q:'Pusat (x+3)²+(y−5)²=16 adalah...', ans:'(−3,5)', wrongs:['(3,5)','(3,−5)','(−3,−5)'] },
  { q:'Pusat (x−1)²+(y−7)²=4 adalah...', ans:'(1,7)', wrongs:['(−1,7)','(1,−7)','(−1,−7)'] },
  { q:'Pusat x²+y²+6x−4y=0 adalah...', ans:'(−3,2)', wrongs:['(3,−2)','(−3,−2)','(3,2)'] },
  { q:'Pusat x²+y²−8x+2y+7=0 adalah...', ans:'(4,−1)', wrongs:['(−4,1)','(4,1)','(−4,−1)'] },
  { q:'Pusat x²+y²+4x−6y−3=0 adalah...', ans:'(−2,3)', wrongs:['(2,−3)','(−2,−3)','(2,3)'] },
  // Soal posisi titik
  { q:'Titik (3,4) pada x²+y²=25 berada...', ans:'pada', wrongs:['dalam','luar','tidak tentu'] },
  { q:'JP=10, R=6, r=2. GSPD=...', ans:'6', wrongs:['4','8','10'] },
  { q:'JP=10, R=6, r=2. GSPL=...', ans:'2√21', wrongs:['6','8','√84'] },
];

function initShooterCanvas() {
  const c = document.getElementById('shooterCanvas');
  c.width  = SHOOTER_W;
  c.height = SHOOTER_H;
  // Gambar layar tunggu
  const ctx = c.getContext('2d');
  ctx.fillStyle = 'rgba(5,10,24,0.97)';
  ctx.fillRect(0, 0, SHOOTER_W, SHOOTER_H);
  ctx.fillStyle = 'rgba(0,212,255,0.5)';
  ctx.font = 'bold 18px Exo 2';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Tekan "Mulai Shooter" untuk bermain!', SHOOTER_W/2, SHOOTER_H/2);
}

function startShooter() {
  const canvas = document.getElementById('shooterCanvas');
  canvas.width  = SHOOTER_W;
  canvas.height = SHOOTER_H;

  if (shooterState.animId) cancelAnimationFrame(shooterState.animId);
  shooterState = { active:true, score:0, lives:3, level:1, circles:[], question:null, animId:null };

  document.getElementById('g4-start-btn').style.display = 'none';
  document.getElementById('g4-score').textContent  = 0;
  document.getElementById('g4-lives').textContent  = 3;
  document.getElementById('g4-level').textContent  = 1;
  nextShooterQ();
}

function nextShooterQ() {
  if (!shooterState.active) return;
  const q = shooterQuestions[Math.floor(Math.random() * shooterQuestions.length)];
  shooterState.question = q;
  document.getElementById('g4-question').textContent = q.q;

  const W = SHOOTER_W, H = SHOOTER_H;
  const allAnswers = [q.ans, ...q.wrongs].sort(() => Math.random() - .5);
  const colW = W / allAnswers.length;

  shooterState.circles = allAnswers.map((val, i) => {
    const speed = 1.2 + shooterState.level * 0.35;
    let vx = (Math.random() < .5 ? 1 : -1) * (speed * (.6 + Math.random() * .8));
    let vy = (Math.random() < .5 ? 1 : -1) * (speed * (.6 + Math.random() * .8));
    const cx = colW * i + colW / 2 + (Math.random() * 20 - 10);
    const cy = 55 + Math.random() * (H - 110);
    const h = Math.floor(Math.random() * 360);
    return {
      x: Math.max(50, Math.min(W - 50, cx)),
      y: Math.max(50, Math.min(H - 50, cy)),
      r: 48, val: String(val), vx, vy,
      hue: h,
      hit: false, pulse: 0
    };
  });

  if (shooterState.animId) cancelAnimationFrame(shooterState.animId);
  shooterLoop();
}

function shooterLoop() {
  const canvas = document.getElementById('shooterCanvas');
  const ctx = canvas.getContext('2d');
  const W = SHOOTER_W, H = SHOOTER_H;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#050a18';
  ctx.fillRect(0, 0, W, H);

  // Grid latar
  ctx.strokeStyle = 'rgba(0,212,255,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

  // Bintang
  for (let i = 0; i < 25; i++) {
    const sx = (Math.sin(i * 137.5) * .5 + .5) * W;
    const sy = (Math.cos(i * 97.3)  * .5 + .5) * H;
    ctx.beginPath(); ctx.arc(sx, sy, .8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fill();
  }

  let allHit = true;
  shooterState.circles.forEach(c => {
    if (c.hit) {
      // Animasi meledak
      c.pulse = (c.pulse || 0) + 1;
      if (c.pulse < 20) {
        ctx.beginPath(); ctx.arc(c.x, c.y, c.r + c.pulse * 2, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${c.hue},75%,58%,0.27)`; ctx.lineWidth = 2; ctx.stroke();
      }
      return;
    }
    allHit = false;

    // Gerak + pantul
    c.x += c.vx; c.y += c.vy;
    if (c.x - c.r < 0)  { c.x = c.r;     c.vx = Math.abs(c.vx); }
    if (c.x + c.r > W)  { c.x = W - c.r; c.vx = -Math.abs(c.vx); }
    if (c.y - c.r < 0)  { c.y = c.r;     c.vy = Math.abs(c.vy); }
    if (c.y + c.r > H)  { c.y = H - c.r; c.vy = -Math.abs(c.vy); }

    // Glow background
    const gBg = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r * 1.6);
    gBg.addColorStop(0, `hsla(${c.hue},75%,58%,0.19)`);
    gBg.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(c.x, c.y, c.r * 1.6, 0, Math.PI * 2);
    ctx.fillStyle = gBg; ctx.fill();

    // Lingkaran utama
    const g = ctx.createRadialGradient(c.x - c.r*.3, c.y - c.r*.3, 0, c.x, c.y, c.r);
    g.addColorStop(0, `hsla(${c.hue},75%,58%,1)`);
    g.addColorStop(.7, `hsla(${c.hue},75%,58%,0.8)`);
    g.addColorStop(1, `hsla(${c.hue},75%,58%,0.33)`);
    ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill();

    // Border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = .4;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Teks jawaban — auto ukuran agar koordinat muat
    const txt = c.val;
    const fontSize = txt.length > 5 ? 11 : txt.length > 3 ? 13 : 16;
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${fontSize}px "Exo 2", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,.8)';
    ctx.shadowBlur = 4;
    ctx.fillText(txt, c.x, c.y);
    ctx.shadowBlur = 0;
  });

  if (shooterState.active) {
    shooterState.animId = requestAnimationFrame(shooterLoop);
  }
}

// Click handler — pasang sekali saja
(function() {
  const canvas = document.getElementById('shooterCanvas');
  canvas.addEventListener('click', function(e) {
    if (!shooterState.active) return;
    const rect = this.getBoundingClientRect();
    const scaleX = SHOOTER_W / rect.width;
    const scaleY = SHOOTER_H / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top)  * scaleY;

    let hit = false;
    shooterState.circles.forEach(c => {
      if (c.hit || hit) return;
      const dist = Math.sqrt((mx - c.x) ** 2 + (my - c.y) ** 2);
      if (dist <= c.r) {
        hit = true;
        c.hit = true;
        c.pulse = 0;
        if (c.val === String(shooterState.question.ans)) {
          shooterState.score += 10 * shooterState.level;
          document.getElementById('g4-score').textContent = shooterState.score;
          showToast(`🎯 Tepat! +${10 * shooterState.level}`, '#10b981');
          if (shooterState.score > 0 && shooterState.score % 50 === 0) {
            shooterState.level++;
            document.getElementById('g4-level').textContent = shooterState.level;
            showToast(`⬆️ Level ${shooterState.level}!`, '#f59e0b');
          }
          setTimeout(nextShooterQ, 700);
        } else {
          shooterState.lives--;
          document.getElementById('g4-lives').textContent = shooterState.lives;
          showToast('💥 Salah!', '#ef4444');
          if (shooterState.lives <= 0) endShooter();
        }
      }
    });
  });
})();
function endShooter() {
  cancelAnimationFrame(shooterState.animId);
  shooterState.active=false;
  const s=shooterState.score;
  document.getElementById('g4-question').textContent=`Game Over! Skor: ${s} 🚀`;
  document.getElementById('g4-start-btn').style.display='inline-block';
  document.getElementById('g4-start-btn').textContent='Main Lagi 🚀';
  addXP(Math.floor(s/3));
  saveScore('shooter', s);
  if(s>=100) launchConfetti();
  renderLeaderboard();
}

// ===== GAME 5: DRAG & MATCH =====
const matchData = [
  { eq:'x² + y² = 16', answer:'Pusat O(0,0), r = 4' },
  { eq:'(x−2)² + (y−3)² = 25', answer:'Pusat P(2,3), r = 5' },
  { eq:'(x+1)² + (y−4)² = 9', answer:'Pusat P(−1,4), r = 3' },
  { eq:'x² + y² + 4x − 6y − 3 = 0', answer:'Pusat P(−2,3), r = 4' },
  { eq:'(x−5)² + y² = 49', answer:'Pusat P(5,0), r = 7' },
  { eq:'x² + y² − 8x + 2y + 7 = 0', answer:'Pusat P(4,−1), r = √10' },
];
let g5State = { score:0, round:0, dragging:null };
function startDragGame() {
  g5State = { score:0, round:0, dragging:null };
  document.getElementById('g5-start-btn').style.display='none';
  document.getElementById('g5-score').textContent=0;
  document.getElementById('g5-round').textContent=1;
  renderDragRound();
}
function renderDragRound() {
  const layout = document.getElementById('drag-layout');
  const shuffled = [...matchData].sort(() => Math.random()-.5);
  const answers = shuffled.map(d => d.answer).sort(() => Math.random()-.5);
  layout.innerHTML = `
    <div>
      <h4>📋 Persamaan Lingkaran</h4>
      ${shuffled.map((d,i) => `<div class="drag-item" draggable="true" data-idx="${i}" data-eq="${d.eq}" ondragstart="dragStart(event,this)">${d.eq}</div>`).join('')}
    </div>
    <div>
      <h4>🎯 Pusat &amp; Jari-jari</h4>
      ${answers.map((a,i) => `<div class="drop-zone" data-answer="${a}" ondragover="dragOver(event)" ondrop="dropItem(event,this)">${a}</div>`).join('')}
    </div>`;
  document.getElementById('drag-feedback').textContent='Seret persamaan ke jawaban yang cocok!';
  document.getElementById('drag-feedback').style.color='var(--dim)';
}
function dragStart(e, el) {
  g5State.dragging = el;
  e.dataTransfer.setData('text/plain', el.dataset.eq);
  el.classList.add('dragging');
}
function dragOver(e) { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }
function dropItem(e, zone) {
  e.preventDefault();
  zone.classList.remove('drag-over');
  const eq = e.dataTransfer.getData('text/plain');
  if (g5State.dragging) g5State.dragging.classList.remove('dragging');
  const correct = matchData.find(d => d.eq === eq);
  if (correct && correct.answer === zone.dataset.answer) {
    zone.classList.add('correct');
    zone.textContent = '✅ ' + zone.dataset.answer;
    g5State.score += 15;
    document.getElementById('g5-score').textContent = g5State.score;
    showToast('✅ Cocok! +15', '#10b981');
    if (g5State.dragging) g5State.dragging.style.opacity='.3';
    const allDone = document.querySelectorAll('.drop-zone.correct').length === matchData.length;
    if (allDone) {
      document.getElementById('drag-feedback').textContent = `🎉 Semua cocok! Skor: ${g5State.score}`;
      document.getElementById('drag-feedback').style.color='#10b981';
      addXP(g5State.score);
      saveScore('drag', g5State.score);
      launchConfetti();
      document.getElementById('g5-start-btn').style.display='inline-block';
      document.getElementById('g5-start-btn').textContent='Main Lagi 🧩';
      renderLeaderboard();
    }
  } else {
    zone.classList.add('wrong');
    showToast('❌ Tidak cocok!', '#ef4444');
    setTimeout(() => zone.classList.remove('wrong'), 800);
  }
}

// ===== LEADERBOARD =====
function saveScore(game, score) {
  const key = 'gm_lb_' + game;
  let scores = JSON.parse(localStorage.getItem(key) || '[]');
  // Pakai nama dari currentPlayer kalau ada, fallback ke 'Anonim'
  const nama = (currentPlayer && currentPlayer.nama) ? currentPlayer.nama : 'Anonim';
  const presensi = (currentPlayer && currentPlayer.presensi) ? currentPlayer.presensi : '-';
  // Kalau nama+presensi sudah ada, update kalau skor lebih tinggi
  const idx = scores.findIndex(s => s.presensi === presensi && presensi !== '-');
  if (idx >= 0) {
    if (score > scores[idx].score) {
      scores[idx] = { nama, presensi, score, date: new Date().toLocaleDateString('id-ID') };
    }
  } else {
    scores.push({ nama, presensi, score, date: new Date().toLocaleDateString('id-ID') });
  }
  scores.sort((a,b) => b.score - a.score);
  scores = scores.slice(0, 5);
  localStorage.setItem(key, JSON.stringify(scores));
}

function renderLeaderboard() {
  const games = [
    { key: 'quiz',    id: 'lb-quiz' },
    { key: 'guess',   id: 'lb-guess' },
    { key: 'race',    id: 'lb-race' },
    { key: 'shooter', id: 'lb-shooter' },
    { key: 'drag',    id: 'lb-drag' },
  ];
  const medals = ['🥇','🥈','🥉','4️⃣','5️⃣'];
  games.forEach(({ key, id }) => {
    const el = document.getElementById(id);
    if (!el) return;
    const scores = JSON.parse(localStorage.getItem('gm_lb_' + key) || '[]');
    if (scores.length === 0) {
      el.innerHTML = '<div class="lb-empty">Belum ada skor</div>';
      return;
    }
    el.innerHTML = scores.map((s, i) => `
      <div class="lb-entry">
        <span class="lb-rank">${medals[i]}</span>
        <span class="lb-name">${s.nama || 'Anonim'}</span>
        <span class="lb-score">${s.score}</span>
      </div>`).join('');
  });
}

function clearLeaderboard() {
  if (confirm('Reset semua skor leaderboard?')) {
    ['quiz','guess','race','shooter','drag'].forEach(g => {
      localStorage.removeItem('gm_lb_' + g);
      localStorage.removeItem('gm_rank_' + g);
    });
    renderLeaderboard();
    showToast('🗑️ Leaderboard direset');
  }
}
function clearLeaderboard() {
  if (confirm('Reset semua skor leaderboard?')) {
    ['quiz','race','shooter'].forEach(g => localStorage.removeItem('gm_lb_'+g));
    renderLeaderboard();
    showToast('🗑️ Leaderboard direset');
  }
}
renderLeaderboard();

// ===== MODAL HELPERS =====
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// Tutup modal kalau klik overlay
document.querySelectorAll('.modal-overlay').forEach(el => {
  el.addEventListener('click', e => { if(e.target === el) el.classList.remove('open'); });
});

// ===== KUNCI JAWABAN — PASSWORD =====
function openKunciModal() {
  document.getElementById('input-password').value = '';
  document.getElementById('pw-error').textContent = '';
  openModal('modalPassword');
  setTimeout(() => document.getElementById('input-password').focus(), 300);
}
function togglePwVis() {
  const inp = document.getElementById('input-password');
  inp.type = inp.type === 'password' ? 'text' : 'password';
}
function checkPassword() {
  const val = document.getElementById('input-password').value.trim();
  const err = document.getElementById('pw-error');
  if (val === '221008') {
    closeModal('modalPassword');
    // Buka panel kunci jawaban di dalam halaman
    document.getElementById('panel-kunci').classList.add('open');
    document.body.style.overflow = 'hidden';
    // Aktifkan tab pertama
    showKJ('soal', document.querySelector('.kj-tab'));
  } else {
    err.textContent = '❌ Password salah! Coba lagi.';
    document.getElementById('input-password').value = '';
    document.getElementById('input-password').focus();
    const box = document.querySelector('#modalPassword .modal-box');
    box.style.animation = 'none';
    setTimeout(() => { box.style.animation = 'shake .4s ease'; }, 10);
    setTimeout(() => { box.style.animation = ''; }, 450);
  }
}

function closeKunci() {
  document.getElementById('panel-kunci').classList.remove('open');
  document.body.style.overflow = '';
}

function showKJ(id, btn) {
  document.querySelectorAll('.kj-section').forEach(e => e.classList.remove('active'));
  document.querySelectorAll('.kj-tab').forEach(e => e.classList.remove('active'));
  document.getElementById('kj-' + id).classList.add('active');
  if (btn) btn.classList.add('active');
}

// ===== PRESENSI SEBELUM KUIS =====
let currentPlayer = { nama: '', presensi: '' };

function startQuiz() {
  // Buka modal presensi dulu
  document.getElementById('input-nama').value = '';
  document.getElementById('input-presensi').value = '';
  document.getElementById('modal-error').textContent = '';
  openModal('modalPresensi');
  setTimeout(() => document.getElementById('input-nama').focus(), 300);
}

function submitPresensi() {
  const nama = document.getElementById('input-nama').value.trim();
  const presensi = document.getElementById('input-presensi').value.trim();
  const err = document.getElementById('modal-error');
  if (!nama) { err.textContent = '⚠️ Nama tidak boleh kosong!'; return; }
  if (!presensi || isNaN(presensi) || +presensi < 1) { err.textContent = '⚠️ Nomor presensi tidak valid!'; return; }
  currentPlayer = { nama, presensi };
  closeModal('modalPresensi');
  _doStartQuiz();
}

// Enter key di form presensi
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('input-nama').addEventListener('keydown', e => { if(e.key==='Enter') document.getElementById('input-presensi').focus(); });
  document.getElementById('input-presensi').addEventListener('keydown', e => { if(e.key==='Enter') submitPresensi(); });
  document.getElementById('start-quiz-btn').style.display = 'inline-block';
  document.getElementById('quiz-body').style.display = 'none';
  updateXPBar();
});
