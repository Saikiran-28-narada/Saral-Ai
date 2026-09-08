/* ===== Teacher Connect Module ===== */
(function(){
  document.querySelectorAll('.teacher-card').forEach(c => c.addEventListener('click', () => {
    if (window.Saral && !Saral.isOnline()){
      showToast('📴 You\u2019re offline — live teacher map needs internet. Your notes still work!');
      return;
    }
    const s = c.querySelector('.status');
    if (s.classList.contains('online')){
      showToast('📞 Requesting session with ' + c.querySelector('b').textContent + '...');
    } else {
      showToast('⏳ Teacher is busy — you\u2019ll be notified when free');
    }
  }));
})();
