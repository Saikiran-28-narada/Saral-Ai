/* ===== Reels Module ===== */
(function(){
  const REELS = [
    {emoji:'🚂', title:'Speed trick in 30s', views:'12.4K', caption:'Speed = Distance ÷ Time — easiest trick ever! #speed #class10 #physics', g:'linear-gradient(160deg,#5B5BD6,#9B5BFF)'},
    {emoji:'💡', title:'Ohm\u2019s law visualised', views:'9.1K', caption:'V=IR explained with water flow 💧 #electricity #ohm #class10', g:'linear-gradient(160deg,#FF7A59,#FFB347)'},
    {emoji:'🔺', title:'Pythagoras in 20s', views:'21.7K', caption:'a² + b² = c² with a rope! #maths #pythagoras #trick', g:'linear-gradient(160deg,#22C55E,#4ADE80)'},
    {emoji:'⚗️', title:'Acids vs Bases', views:'7.8K', caption:'Litmus test made simple 🧪 #chemistry #acids #bases', g:'linear-gradient(160deg,#EC4899,#F472B6)'},
    {emoji:'🌊', title:'Light reflection', views:'15.2K', caption:'Mirror rules you\u2019ll never forget ✨ #light #physics #diagram', g:'linear-gradient(160deg,#0EA5E9,#38BDF8)'},
    {emoji:'📐', title:'Trigonometry hack', views:'18.9K', caption:'SOH-CAH-TOA song 🎵 #trigonometry #maths #hack', g:'linear-gradient(160deg,#8B5CF6,#A78BFA)'},
    {emoji:'🔋', title:'Series vs Parallel', views:'6.3K', caption:'Circuits decoded in 40s 🔌 #electricity #circuits', g:'linear-gradient(160deg,#F59E0B,#FBBF24)'},
    {emoji:'🧲', title:'Magnetism basics', views:'11.5K', caption:'Field lines explained with iron filings #magnetism #physics', g:'linear-gradient(160deg,#14B8A6,#2DD4BF)'}
  ];
  const grid = document.getElementById('reels-grid');
  const player = document.getElementById('reel-player');
  REELS.forEach((r, i) => {
    const t = document.createElement('div');
    t.className = 'reel-thumb';
    t.style.background = r.g;
    t.innerHTML = `<span class="views">▶ ${r.views}</span><span>${r.emoji} ${r.title}</span>`;
    t.addEventListener('click', () => {
      document.getElementById('reel-video-mock').textContent = r.emoji;
      document.getElementById('reel-caption').textContent = r.caption;
      player.classList.remove('hidden');
    });
    grid.appendChild(t);
  });
  player.querySelector('.reel-close').addEventListener('click', () => player.classList.add('hidden'));

  const uploadModal = document.getElementById('reel-upload');
  const uploadDrop = uploadModal.querySelector('.upload-drop');
  const submitBtn = document.getElementById('btn-reel-submit');
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'video/*';
  fileInput.hidden = true;
  uploadModal.appendChild(fileInput);

  function openReelPicker(){
    if (window.Saral && !Saral.isOnline()){
      showToast('📴 Uploading reels needs internet — watching saved reels still works!');
      return;
    }
    uploadModal.classList.remove('hidden');
    fileInput.click();
  }

  uploadDrop.addEventListener('click', openReelPicker);
  uploadDrop.setAttribute('role', 'button');
  uploadDrop.setAttribute('tabindex', '0');
  uploadDrop.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openReelPicker(); }
  });

  document.getElementById('btn-upload-reel').addEventListener('click', () => {
    if (window.Saral && !Saral.isOnline()){
      showToast('📴 Uploading reels needs internet — watching saved reels still works!');
      return;
    }
    uploadModal.classList.remove('hidden');
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    uploadDrop.textContent = '🎥 ' + file.name;
    const nameEl = uploadModal.querySelector('.upload-file-name');
    if (nameEl) nameEl.textContent = 'Selected: ' + file.name;
    submitBtn.disabled = false;
  });

  submitBtn.addEventListener('click', () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file){
      showToast('📁 Choose a video first');
      return;
    }
    uploadModal.classList.add('hidden');
    showToast('🎉 Demo reel posted! AI captions & hashtags are simulated.');
    fileInput.value = '';
    uploadDrop.textContent = '📤 Drop video or tap to choose';
    const nameEl = uploadModal.querySelector('.upload-file-name');
    if (nameEl) nameEl.textContent = 'No video selected';
    submitBtn.disabled = true;
  });
})();
