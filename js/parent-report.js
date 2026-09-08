/* ===== Parent Report Module ===== */
(function(){
  document.getElementById('btn-send-sms').addEventListener('click', () => {
    if (window.Saral && !Saral.isOnline()){
      showToast('📴 Sending SMS needs a network connection — go Online first');
      return;
    }
    const st = document.getElementById('sms-status');
    st.textContent = '📤 Preparing demo SMS...';
    setTimeout(() => {
      st.textContent = '✅ Demo SMS ready! A production version would send the weekly update here.';
      showToast('📱 Demo SMS generated');
    }, 1400);
  });
})();
