/* ===== Night Mode Module ===== */
(function(){
  const btn = document.getElementById('night-toggle');
  function apply(on, silent){
    document.body.classList.toggle('night', on);
    btn.textContent = on ? '☀️' : '🌙';
    localStorage.setItem('saral-night', on ? '1' : '0');
    if (!silent) showToast(on ? '🌙 Night mode — easy on the eyes' : '☀️ Day mode');
  }
  btn.addEventListener('click', () => apply(!document.body.classList.contains('night')));
  const saved = localStorage.getItem('saral-night');
  if (saved === '1') apply(true, true);
  else {
    const h = new Date().getHours();
    if (h >= 19 || h < 6) apply(true, true); // auto night 7PM–6AM
  }
})();
