/* ===== Offline / Online Mode — drives VISIBLE changes across the app ===== */
(function(){
  const btn = document.getElementById('mode-toggle');
  const label = document.getElementById('mode-label');
  const dot = document.getElementById('mode-dot');
  const banner = document.getElementById('mode-banner');
  const bannerIcon = document.getElementById('mode-banner-icon');
  const bannerTitle = document.getElementById('mode-banner-title');
  const bannerSub = document.getElementById('mode-banner-sub');
  const quizSwitch = document.getElementById('quiz-net-switch');
  const quizSource = document.getElementById('quiz-source');
  const buddyNote = document.getElementById('buddy-net-note');
  const teacherNote = document.getElementById('teacher-net-note');

  function apply(online, silent){
    Saral.mode = online ? 'online' : 'offline';
    try{ localStorage.setItem('saral_mode', JSON.stringify(Saral.mode)); }catch(e){}

    // body class — other modules & CSS key off this
    document.body.classList.toggle('mode-online', online);
    document.body.classList.toggle('mode-offline', !online);

    // header pill
    label.textContent = online ? 'Online' : 'Offline';
    dot.className = 'dot ' + (online ? 'online' : 'offline');
    btn.classList.toggle('is-online', online);
    btn.classList.toggle('is-offline', !online);

    // dashboard banner
    banner.className = 'mode-banner ' + (online ? 'online' : 'offline');
    bannerIcon.textContent = online ? '🌐' : '📴';
    bannerTitle.textContent = online ? 'Online mode' : 'Offline mode';
    bannerSub.textContent = online
      ? 'Cloud AI + live sync with your teachers'
      : 'On-device AI — everything still works, no internet needed!';

    // quiz screen follows the global mode
    if (quizSwitch){
      quizSwitch.classList.toggle('on', online);
      quizSwitch.setAttribute('aria-checked', String(online));
    }
    if (quizSource){
      quizSource.textContent = online
        ? '🌐 Live question bank + class leaderboard'
        : '📴 Downloaded question bank — works without internet';
    }

    // peer/teacher screens show an inline note when offline
    if (buddyNote) buddyNote.classList.toggle('hidden', online);
    if (teacherNote) teacherNote.classList.toggle('hidden', online);

    if (!silent){
      showToast(online
        ? '🌐 Switched to Online — cloud AI, live sync & peer matching'
        : '📴 Switched to Offline — on-device AI keeps working!');
    }
  }

  btn.addEventListener('click', () => apply(Saral.mode !== 'online'));

  // Restore the saved/manual mode, or the device state selected by app.js on first launch.
  apply(Saral.mode === 'online', true);

  // Follow real device connectivity. A manual Offline choice is preserved until the
  // browser actually reports a network change.
  window.addEventListener('offline', () => {
    apply(false);
    showToast('📡 Network lost — switched to Offline mode');
  });
  window.addEventListener('online', () => {
    apply(true);
    showToast('🌐 Back online! Syncing your progress...');
  });

  Saral.isOnline = () => document.body.classList.contains('mode-online');
})();
