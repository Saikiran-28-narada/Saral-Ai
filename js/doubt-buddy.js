/* ===== Doubt Buddy Module ===== */
(function(){
  let timerInt = null, secs = 300;
  document.querySelectorAll('.buddy-card').forEach(card =>
    card.addEventListener('click', () => {
      if (window.Saral && !Saral.isOnline()){
        showToast('📴 You\u2019re offline — peer matching needs internet. Switch to Online mode!');
        return;
      }
      document.getElementById('buddy-list').classList.add('hidden');
      document.getElementById('buddy-chat').classList.remove('hidden');
      document.getElementById('buddy-name').textContent = card.dataset.buddy;
      startTimer();
      showToast('👥 Connected! 5 minutes — discuss first, AI helps after');
    }));
  function startTimer(){
    secs = 300; clearInterval(timerInt);
    timerInt = setInterval(() => {
      secs--;
      const m = String(Math.floor(secs/60)).padStart(1,'0');
      const s = String(secs%60).padStart(2,'0');
      document.getElementById('buddy-timer').textContent = `${m}:${s}`;
      if (secs <= 0){
        clearInterval(timerInt);
        showToast('⏰ Time up! AI summary is ready 🧠');
      }
    }, 1000);
  }
  const field = document.getElementById('buddy-field');
  const box = document.getElementById('buddy-chat-box');
  function send(){
    const v = field.value.trim(); if (!v) return;
    const d = document.createElement('div'); d.className = 'msg user'; d.textContent = v;
    box.appendChild(d); field.value = ''; box.scrollTop = box.scrollHeight;
  }
  document.getElementById('buddy-send').addEventListener('click', send);
  field.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
})();
