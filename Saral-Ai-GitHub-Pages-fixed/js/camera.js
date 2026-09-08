/* ===== Camera Module — live camera + gallery fallback ===== */
(function(){
  const video = document.getElementById('camera-video');
  const frame = document.getElementById('camera-frame');
  const placeholder = document.getElementById('camera-placeholder');
  const openBtn = document.getElementById('btn-open-camera');
  const captureBtn = document.getElementById('btn-capture');
  const uploadBtn = document.getElementById('btn-upload');
  const result = document.getElementById('scan-result');
  let stream = null, scanning = false, watchdog = null;

  const QUESTIONS = [
    {q:'A train travels 120 km in 2 hours. Find its speed.', tags:'#speed #time-distance #class10 #physics'},
    {q:'Solve the equation: 2x + 5 = 15', tags:'#algebra #equations #class9 #maths'},
    {q:'State Newton\u2019s Second Law and write its formula.', tags:'#force #newton #class10 #physics'},
    {q:'Find x if 3x − 7 = 2x + 4.', tags:'#algebra #class9 #maths'},
    {q:'Where does photosynthesis occur in a plant cell?', tags:'#biology #class10 #science'}
  ];
  const DEFAULT_PLACEHOLDER = '📷<br>Camera will open here';

  function resetPlaceholder(html){
    placeholder.classList.remove('hidden');
    placeholder.innerHTML = html || DEFAULT_PLACEHOLDER;
  }

  /* Some webviews never resolve the play() promise — fire it and never block on it. */
  function playSafe(){
    try{
      const p = video.play();
      if (p && p.catch) p.catch(()=>{ /* autoplay policy — watchdog + user tap will retry */ });
    }catch(e){}
  }

  /* Keep nudging playback while the camera is live: recovers from webview suspensions. */
  function startWatchdog(){
    stopWatchdog();
    watchdog = setInterval(() => {
      if (!stream) return stopWatchdog();
      if (video.paused || video.videoWidth === 0) playSafe();
    }, 800);
  }
  function stopWatchdog(){ if (watchdog){ clearInterval(watchdog); watchdog = null; } }

  function stopCamera(){
    stopWatchdog();
    if (stream){ stream.getTracks().forEach(t => t.stop()); stream = null; }
    video.srcObject = null;
    try{ video.pause(); }catch(e){}
    frame.classList.remove('live','scanning');
    frame.querySelectorAll('.cam-preview-note').forEach(n => n.remove());
  }

  async function startCamera(){
    openBtn.disabled = true;
    openBtn.textContent = '⏳ Starting camera…';
    resetPlaceholder('⏳<br>Starting camera…');
    try{
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
        throw { name:'NotSupported' };
      stream = await navigator.mediaDevices.getUserMedia({
        video:{ facingMode:{ ideal:'environment' }, width:{ ideal:1280 }, height:{ ideal:720 } },
        audio:false
      });
      video.srcObject = stream;
      video.muted = true;
      playSafe();
      // give the stream a moment to deliver its first frame
      await new Promise(res => setTimeout(res, 600));
      placeholder.classList.add('hidden');
      frame.classList.add('live');
      openBtn.classList.add('hidden');
      uploadBtn.classList.add('hidden');
      captureBtn.classList.remove('hidden');
      startWatchdog();
      // If the renderer won't composite frames (some embedded browsers), say so instead of looking broken
      setTimeout(() => {
        if (stream && video.videoWidth === 0){
          const note = document.createElement('div');
          note.className = 'cam-preview-note';
          note.innerHTML = '🎥 Camera is ON<br><small>Live preview isn\u2019t supported in this embedded browser —<br>it renders fully on your phone. You can still scan!</small>';
          frame.appendChild(note);
        }
      }, 4000);
      window.showToast && showToast('Camera on 📸 Point at a question');
    }catch(e){
      stopCamera();
      const name = (e && e.name) || '';
      const msg =
        name === 'NotAllowedError' ? '🔒 Camera permission denied.<br><small>Allow camera in browser settings,<br>or use 📁 Upload a photo below</small>' :
        name === 'NotFoundError' ? '📷 No camera found on this device.<br><small>Use 📁 Upload a photo instead</small>' :
        name === 'NotReadableError' ? '⚠️ Camera is busy in another app.<br><small>Close it and retry, or 📁 Upload</small>' :
        name === 'NotSupported' ? '📷 Live camera not supported here.<br><small>Use 📁 Upload a photo — or tap Scan anyway!</small>' :
        '📷 Camera couldn\u2019t start.<br><small>Tap retry, or 📁 Upload a photo</small>';
      resetPlaceholder(msg);
      openBtn.disabled = false;
      openBtn.textContent = '📸 Retry Camera';
      captureBtn.classList.remove('hidden'); // allow demo scan even without camera
    }
  }

  function showResult(){
    const pick = QUESTIONS[Math.floor(Math.random()*QUESTIONS.length)];
    result.querySelector('.mono').textContent = '"' + pick.q + '"';
    result.querySelector('.hashtags').textContent = pick.tags;
    result.classList.remove('hidden');
    result.scrollIntoView({ behavior:'smooth' });
    window.showToast && showToast('✨ Demo scan complete — question captured!');
    if (window.Saral && Saral.addDoubt) Saral.addDoubt();
  }

  function runScan(sourceLabel){
    if (scanning) return;
    scanning = true;
    frame.classList.add('scanning');
    window.showToast && showToast('🔍 ' + sourceLabel + ' — scanning on-device…');
    setTimeout(() => {
      scanning = false;
      frame.classList.remove('scanning');
      stopCamera();
      resetPlaceholder('✅<br>Question captured!<br><small>Scan another anytime</small>');
      captureBtn.classList.add('hidden');
      uploadBtn.classList.remove('hidden');
      openBtn.classList.remove('hidden');
      openBtn.disabled = false;
      openBtn.textContent = '📸 Open Camera';
      showResult();
    }, 1800);
  }

  openBtn.addEventListener('click', startCamera);
  captureBtn.addEventListener('click', () => runScan(stream ? 'Camera photo' : 'Demo photo'));
  // tapping the preview always re-triggers playback (user gesture)
  video.addEventListener('click', playSafe);

  // Gallery fallback — on a real phone the capture attr opens the native camera app
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.capture = 'environment';
  fileInput.hidden = true;
  fileInput.addEventListener('change', function(){
    if (this.files && this.files[0]) runScan('Photo');
    this.value = '';
  });
  document.getElementById('screen-scan').appendChild(fileInput);
  uploadBtn.addEventListener('click', () => fileInput.click());

  // Stop the camera when leaving the scan screen (saves battery)
  new MutationObserver(() => {
    if (!document.getElementById('screen-scan').classList.contains('active')) stopCamera();
  }).observe(document.getElementById('screen-scan'), { attributes:true, attributeFilter:['class'] });
})();
