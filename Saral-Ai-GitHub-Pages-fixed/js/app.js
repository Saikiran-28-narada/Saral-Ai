/* ===== Saral AI — Core App (auth, onboarding, navigation) ===== */
'use strict';

/* ---------- State & storage ---------- */
function store(k, v){
  try{
    if (v === undefined) {
      const raw = localStorage.getItem('saral_' + k);
      return raw === null ? null : JSON.parse(raw);
    }
    localStorage.setItem('saral_' + k, JSON.stringify(v));
  }catch(e){ return null; }
}
const savedMode = store('mode');
const Saral = {
  user: store('user') || null,   // {name, email, verified, school, klass, syllabus, onboarded}
  // Respect the user's saved choice; otherwise start in the device's real connectivity state.
  mode: savedMode === 'online' || savedMode === 'offline'
    ? savedMode
    : (navigator.onLine ? 'online' : 'offline'),
};
window.Saral = Saral;

/* ---------- Toast ---------- */
const toastEl = document.getElementById('toast');
let toastTimer;
function showToast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}
window.showToast = showToast;

/* ---------- Navigation ---------- */
const screens = document.querySelectorAll('#app .screen');
function showScreen(id){
  screens.forEach(s => s.classList.toggle('active', s.id === id));
  document.querySelectorAll('.nav-item').forEach(n =>
    n.classList.toggle('active', n.dataset.goto === id));
  const sc = document.getElementById(id);
  if (sc) sc.scrollTop = 0;
}
window.showScreen = showScreen;
document.addEventListener('click', e => {
  const t = e.target.closest('[data-goto]');
  if (!t) return;
  e.preventDefault();
  showScreen(t.dataset.goto);
});
document.querySelectorAll('.back-btn').forEach(b =>
  b.addEventListener('click', () => showScreen('screen-home')));

/* ---------- Particles (subtle background) ---------- */
(function particles(){
  const cv = document.getElementById('particle-canvas');
  const ctx = cv.getContext('2d');
  function resize(){ cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; }
  setTimeout(resize, 50); addEventListener('resize', resize);
  const pts = Array.from({length: 30}, () => ({
    x: Math.random()*430, y: Math.random()*880,
    vx: (Math.random()-.5)*.3, vy: (Math.random()-.5)*.3, r: Math.random()*1.6+.8
  }));
  (function loop(){
    ctx.clearRect(0,0,cv.width,cv.height);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x<0||p.x>cv.width) p.vx*=-1; if (p.y<0||p.y>cv.height) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7);
      ctx.fillStyle = 'rgba(91,91,214,.35)'; ctx.fill();
    });
    requestAnimationFrame(loop);
  })();
})();

/* ================= LOGIN ================= */
let otpCode = null;
const emailStep = document.getElementById('login-step-email');
const verifyStep = document.getElementById('login-step-verify');

function validEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

function showLoginError(msg){
  const el = document.getElementById('login-error');
  el.textContent = msg;
  el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
}

document.getElementById('btn-send-code').addEventListener('click', () => {
  const name = document.getElementById('login-name').value.trim();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  if (!name){ showLoginError('Please enter your name first 🙏'); return; }
  if (!validEmail(email)){ showLoginError('That email doesn\u2019t look right — check and try again'); return; }
  otpCode = String(Math.floor(100000 + Math.random()*900000));
  Saral.user = Object.assign(Saral.user || {}, { name, email, verified:false, onboarded:false });
  store('user', Saral.user);
  document.getElementById('verify-email').textContent = email;
  document.getElementById('demo-code').innerHTML = 'Demo mode — your code is <b>'+otpCode+'</b> <small>(a real app emails this)</small>';
  document.getElementById('verify-error').textContent = '';
  document.querySelectorAll('.otp').forEach(o => o.value = '');
  emailStep.classList.add('hidden');
  verifyStep.classList.remove('hidden');
  setTimeout(() => document.querySelector('.otp').focus(), 150);
  showToast('📬 Verification code sent to ' + email);
});

/* OTP inputs: auto-advance + backspace */
document.querySelectorAll('.otp').forEach((inp, i, arr) => {
  inp.addEventListener('input', () => {
    inp.value = inp.value.replace(/\D/g,'').slice(0,1);
    if (inp.value && i < arr.length-1) arr[i+1].focus();
  });
  inp.addEventListener('keydown', e => {
    if (e.key === 'Backspace' && !inp.value && i > 0) arr[i-1].focus();
  });
});

function verifyOTP(){
  const entered = Array.from(document.querySelectorAll('.otp')).map(o => o.value).join('');
  const err = document.getElementById('verify-error');
  if (entered.length < 6){ err.textContent = 'Enter all 6 digits of the code'; return; }
  if (entered !== otpCode){
    err.textContent = 'Wrong code — check the code shown above and retry';
    err.classList.remove('show'); void err.offsetWidth; err.classList.add('show');
    return;
  }
  Saral.user.verified = true;
  store('user', Saral.user);
  showToast('✅ Email verified! Welcome, ' + Saral.user.name.split(' ')[0]);
  startOnboarding();
}
window.verifyOTP = verifyOTP;
document.getElementById('btn-verify').addEventListener('click', verifyOTP);

document.getElementById('btn-resend').addEventListener('click', () => {
  otpCode = String(Math.floor(100000 + Math.random()*900000));
  document.getElementById('demo-code').innerHTML = 'Demo mode — your code is <b>'+otpCode+'</b> <small>(a real app emails this)</small>';
  showToast('📬 New code sent to ' + Saral.user.email);
});

document.getElementById('btn-back-email').addEventListener('click', () => {
  verifyStep.classList.add('hidden');
  emailStep.classList.remove('hidden');
});

/* ================= ONBOARDING ================= */
let obStep = 1;
const obNext = document.getElementById('ob-next');
const obBack = document.getElementById('ob-back');
const obFill = document.getElementById('ob-progress-fill');
const obLabel = document.getElementById('ob-step-label');

function startOnboarding(){
  // prefill if re-editing
  if (Saral.user){
    document.getElementById('ob-school').value = Saral.user.school || '';
    document.querySelectorAll('.class-chip').forEach(c =>
      c.classList.toggle('selected', String(c.dataset.class) === String(Saral.user.klass)));
    document.querySelectorAll('.syllabus-card').forEach(c =>
      c.classList.toggle('selected', c.dataset.syl === Saral.user.syllabus));
  }
  obStep = 1;
  document.getElementById('screen-onboard').classList.add('active');
  renderObStep();
}
window.startOnboarding = startOnboarding;

function renderObStep(){
  document.querySelectorAll('.ob-q').forEach(q =>
    q.classList.toggle('hidden', Number(q.dataset.step) !== obStep));
  obFill.style.width = (obStep/3*100) + '%';
  obLabel.textContent = 'Step ' + obStep + ' of 3';
  obBack.classList.toggle('hidden', obStep === 1);
  obNext.textContent = obStep === 3 ? 'Finish ✨' : 'Next →';
  validateObStep();
}

function validateObStep(){
  let ok = false;
  if (obStep === 1) ok = document.getElementById('ob-school').value.trim().length >= 2;
  if (obStep === 2) ok = !!document.querySelector('.class-chip.selected');
  if (obStep === 3) ok = !!document.querySelector('.syllabus-card.selected');
  obNext.disabled = !ok;
}

document.getElementById('ob-school').addEventListener('input', validateObStep);
document.querySelectorAll('.class-chip').forEach(c => c.addEventListener('click', () => {
  document.querySelectorAll('.class-chip').forEach(x => x.classList.remove('selected'));
  c.classList.add('selected'); validateObStep();
}));
document.querySelectorAll('.syllabus-card').forEach(c => c.addEventListener('click', () => {
  document.querySelectorAll('.syllabus-card').forEach(x => x.classList.remove('selected'));
  c.classList.add('selected'); validateObStep();
}));

obBack.addEventListener('click', () => { if (obStep > 1){ obStep--; renderObStep(); } });
obNext.addEventListener('click', () => {
  if (obNext.disabled) return;
  if (obStep < 3){ obStep++; renderObStep(); return; }
  // finish
  Saral.user.school = document.getElementById('ob-school').value.trim();
  Saral.user.klass = document.querySelector('.class-chip.selected').dataset.class;
  Saral.user.syllabus = document.querySelector('.syllabus-card.selected').dataset.syl;
  Saral.user.onboarded = true;
  store('user', Saral.user);
  enterApp();
  showToast('🎓 All set, ' + Saral.user.name.split(' ')[0] + '! Your dashboard is ready.');
});

let editingProfile = false;
document.getElementById('btn-edit-profile').addEventListener('click', () => {
  editingProfile = true;
  startOnboarding();
  showToast('✏️ Update your details and press Finish');
});

document.getElementById('btn-logout').addEventListener('click', () => {
  localStorage.removeItem('saral_user');
  location.reload();
});

/* ---------- Profile / dashboard rendering ---------- */
function renderProfile(){
  const u = Saral.user; if (!u) return;
  document.getElementById('profile-name').textContent = u.name;
  document.getElementById('profile-meta').textContent = 'Class ' + u.klass + ' • ' + u.syllabus;
  document.getElementById('profile-school').textContent = '🏫 ' + u.school;
  document.getElementById('profile-avatar').textContent = u.name.charAt(0).toUpperCase();
}

/* ---------- Stats (persisted) ---------- */
function renderStats(){
  document.getElementById('stat-streak').textContent = store('streak') || 7;
  document.getElementById('stat-doubts').textContent = store('doubts') || 12;
  document.getElementById('stat-xp').textContent = store('xp') || 120;
}
Saral.addXP = function(n){
  const xp = (store('xp') || 120) + n;
  store('xp', xp);
  document.getElementById('stat-xp').textContent = xp;
};
Saral.addDoubt = function(){
  const d = (store('doubts') || 12) + 1;
  store('doubts', d);
  document.getElementById('stat-doubts').textContent = d;
};

/* ---------- Enter app (after auth + onboarding) ---------- */
function enterApp(){
  document.getElementById('screen-login').classList.remove('active');
  document.getElementById('screen-onboard').classList.remove('active');
  document.getElementById('app-header').classList.remove('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('bottom-nav').classList.remove('hidden');
  renderProfile();
  renderStats();
  showScreen('screen-home');
  editingProfile = false;
}

/* ---------- Boot ---------- */
(function boot(){
  const u = Saral.user;
  if (u && u.verified && u.onboarded){
    enterApp();
  } else if (u && u.verified){
    startOnboarding();
  } else {
    document.getElementById('screen-login').classList.add('active');
  }
})();

/* ---------- PWA ---------- */
if ('serviceWorker' in navigator){
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(()=>{}));
}
