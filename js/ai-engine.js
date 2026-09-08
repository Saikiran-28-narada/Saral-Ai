/* ===== AI Engine (mock Socratic responses, mode-aware) ===== */
const AI_REPLIES = [
  "Good thinking! 💡 Now, what happens if we plug the numbers into that formula?",
  "Almost there! 🤔 Remember the units — what should speed be measured in?",
  "Yes! 🎯 Try one more step and tell me what you get.",
  "Interesting... let's break it down smaller. What is 120 ÷ 2?",
  "Superb! You figured it out yourself 🙌 That's real learning."
];
let aiIdx = 0;

function aiBadge(){
  // visible difference between modes: on-device vs cloud AI
  return document.body.classList.contains('mode-online')
    ? '<span class="msg-badge cloud">☁️ Cloud AI</span>'
    : '<span class="msg-badge on-device">⚡ On-Device AI</span>';
}

function aiRespond(){
  const box = document.getElementById('chat-box');
  const div = document.createElement('div');
  div.className = 'msg ai';
  div.innerHTML = AI_REPLIES[aiIdx % AI_REPLIES.length] + '<br>' + aiBadge();
  aiIdx++;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

/* ===== Chat wiring (send + voice) ===== */
(function(){
  const field = document.getElementById('chat-field');
  const box = document.getElementById('chat-box');
  let firstMsg = true;

  function send(){
    const v = field.value.trim(); if (!v) return;
    const d = document.createElement('div'); d.className = 'msg user'; d.textContent = v;
    box.appendChild(d); field.value = ''; box.scrollTop = box.scrollHeight;
    if (firstMsg && window.Saral && Saral.addDoubt){ Saral.addDoubt(); firstMsg = false; }

    // typing indicator
    const t = document.createElement('div');
    t.className = 'msg ai typing'; t.textContent = 'Saral AI is thinking…';
    box.appendChild(t); box.scrollTop = box.scrollHeight;

    // offline responds faster (on-device!), online a bit slower (network)
    const delay = document.body.classList.contains('mode-online') ? 900 : 400;
    setTimeout(() => { t.remove(); aiRespond(); }, delay);
  }
  document.getElementById('btn-send').addEventListener('click', send);
  field.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });

  const vbtn = document.getElementById('btn-voice');
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null, listening = false;
  vbtn.addEventListener('click', () => {
    if (!SR){ showToast('🎙️ Voice input not supported on this browser — type instead!'); return; }
    if (!rec){
      rec = new SR();
      rec.lang = 'ta-IN';
      rec.onresult = e => { field.value = e.results[0][0].transcript; send(); };
      rec.onend = () => { listening = false; vbtn.textContent = '🎙️'; };
    }
    if (!listening){ rec.start(); listening = true; vbtn.textContent = '⏹'; showToast('🎙️ Listening... speak in Tamil or English'); }
    else { rec.stop(); listening = false; vbtn.textContent = '🎙️'; }
  });
})();
