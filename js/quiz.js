/* ===== Quiz Module ===== */
(function(){
  const BANK = {
    Physics: [
      {q:'A car covers 150 km in 3 hours. Its speed is:', o:['30 km/h','50 km/h','45 km/h','60 km/h'], a:1,
       hint:'Speed = Distance ÷ Time. Try 150 ÷ 3.'},
      {q:'SI unit of force is:', o:['Joule','Watt','Newton','Pascal'], a:2,
       hint:'Named after a famous scientist 🍎'},
      {q:'The acceleration due to gravity on Earth is about:', o:['9.8 m/s²','3.6 m/s²','12 m/s²','1.6 m/s²'], a:0,
       hint:'Close to 10!'}
    ],
    Maths: [
      {q:'If x + 5 = 12, then x = ?', o:['5','6','7','8'], a:2,
       hint:'What number plus 5 makes 12?'},
      {q:'√144 = ?', o:['10','11','12','14'], a:2,
       hint:'12 × 12 = ?'},
      {q:'The sum of angles in a triangle is:', o:['90°','180°','270°','360°'], a:1,
       hint:'Half of a full circle.'}
    ],
    Chemistry: [
      {q:'pH of pure water is:', o:['0','5','7','14'], a:2,
       hint:'It\u2019s neutral — right in the middle.'},
      {q:'Chemical symbol of Gold is:', o:['Gd','Go','Au','Ag'], a:2,
       hint:'From the Latin word Aurum ✨'},
      {q:'Which gas is released when metals react with acids?', o:['Oxygen','Hydrogen','Nitrogen','CO₂'], a:1,
       hint:'It makes a pop sound 🔥'}
    ]
  };
  let subject = 'Physics', idx = 0, score = 0, locked = false;

  const qEl = document.getElementById('quiz-question');
  const oEl = document.getElementById('quiz-options');
  const fEl = document.getElementById('quiz-feedback');
  const bar = document.getElementById('quiz-bar');

  function render(){
    const items = BANK[subject];
    const cur = items[idx % items.length];
    locked = false;
    qEl.textContent = cur.q;
    fEl.textContent = ''; fEl.className = 'quiz-feedback';
    oEl.innerHTML = '';
    cur.o.forEach((opt, i) => {
      const b = document.createElement('button');
      b.textContent = opt;
      b.addEventListener('click', () => pick(b, i, cur));
      oEl.appendChild(b);
    });
    bar.style.width = ((idx % items.length) / items.length * 100) + '%';
  }

  function pick(btn, i, cur){
    if (locked) return;
    locked = true;
    Array.from(oEl.children).forEach(b => { b.disabled = true; });
    if (i === cur.a){
      btn.classList.add('correct');
      fEl.textContent = '🎉 Correct! +10 XP'; fEl.className = 'quiz-feedback ok';
      score += 10;
      if (window.Saral && Saral.addXP) Saral.addXP(10);
      setTimeout(() => { idx++; render(); }, 900);
    } else {
      btn.classList.add('wrong');
      oEl.children[cur.a].classList.add('correct');
      fEl.textContent = `💪 Not quite — the answer is "${cur.o[cur.a]}"`;
      fEl.className = 'quiz-feedback bad';
      setTimeout(() => { idx++; render(); }, 1600);
    }
  }

  document.querySelectorAll('#subject-row .chip').forEach(c =>
    c.addEventListener('click', () => {
      document.querySelectorAll('#subject-row .chip').forEach(x => x.classList.remove('active'));
      c.classList.add('active');
      subject = c.dataset.subject; idx = 0; score = 0; render();
    }));

  document.getElementById('btn-hint').addEventListener('click', () => {
    const cur = BANK[subject][idx % BANK[subject].length];
    fEl.textContent = '💡 ' + cur.hint; fEl.className = 'quiz-feedback';
  });

  // The quiz Online/Offline switch follows the global mode (see offline-mode.js)

  render();
})();
