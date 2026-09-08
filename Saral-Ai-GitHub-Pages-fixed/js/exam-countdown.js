/* ===== Exam Countdown Module ===== */
(function(){
  // Ring: 326 total circumference; 14 of 30 days remaining
  const TOTAL = 326;
  const ring = document.getElementById('ring-fg');
  let offset = 326;
  function tick(){
    offset -= 0.4;
    if (offset < 60) offset = 326;
    ring.style.strokeDashoffset = offset;
  }
  setInterval(tick, 60);
  window.addEventListener('saral:exam-days', e => {
    const days = e.detail;
    document.querySelector('.countdown-text b').textContent = days;
  });
})();
