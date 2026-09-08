/* ===== Teach Back Module ===== */
(function(){
  const btn = document.getElementById('btn-teach-record');
  const wave = document.getElementById('teach-wave');
  const fb = document.getElementById('teach-feedback');
  let recorder = null, stream = null, chunks = [];

  async function startRecording(){
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder){
      btn.textContent = '⏹ Stop & Get Feedback';
      wave.classList.remove('hidden');
      btn.dataset.demo = '1';
      showToast('🎙️ Recording demo — explain the concept!');
      return;
    }

    try{
      stream = await navigator.mediaDevices.getUserMedia({audio:true});
      chunks = [];
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      recorder.onstop = finishRecording;
      recorder.start();
      btn.textContent = '⏹ Stop & Get Feedback';
      wave.classList.remove('hidden');
      showToast('🎙️ Recording... explain the concept!');
    }catch(e){
      showToast('🔒 Microphone unavailable — using demo feedback instead.');
      btn.textContent = '⏹ Stop & Get Feedback';
      wave.classList.remove('hidden');
      btn.dataset.demo = '1';
    }
  }

  function finishRecording(){
    if (stream) stream.getTracks().forEach(t => t.stop());
    stream = null;
    recorder = null;
    chunks = [];
    btn.textContent = '🎙️ Start Recording';
    wave.classList.add('hidden');
    showToast('🧠 AI analysing your explanation...');
    setTimeout(() => {
      fb.classList.remove('hidden');
      fb.scrollIntoView({behavior:'smooth'});
    }, 900);
  }

  btn.addEventListener('click', async () => {
    if (!recorder && btn.dataset.demo !== '1'){
      fb.classList.add('hidden');
      await startRecording();
      return;
    }

    if (btn.dataset.demo === '1'){
      delete btn.dataset.demo;
      btn.textContent = '🎙️ Start Recording';
      wave.classList.add('hidden');
      showToast('🧠 Demo feedback ready!');
      setTimeout(() => {
        fb.classList.remove('hidden');
        fb.scrollIntoView({behavior:'smooth'});
      }, 900);
      return;
    }

    if (recorder && recorder.state !== 'inactive') recorder.stop();
  });

  window.addEventListener('beforeunload', () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
  });
})();
