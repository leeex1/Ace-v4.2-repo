(function () {
  const $ = (id) => document.getElementById(id);
  const chatWindow = $('chatWindow');
  const input = $('userInput');
  const sendBtn = $('sendBtn');
  let mode = 'standard';
  let history = [];
  let busy = false;

  function scroll() { chatWindow.scrollTop = chatWindow.scrollHeight; }

  function addMsg(kind, html) {
    const d = document.createElement('div');
    d.className = 'message ' + kind;
    if (kind === 'quillan' && window.marked) d.innerHTML = marked.parse(html);
    else d.innerHTML = html;
    chatWindow.appendChild(d);
    scroll();
    return d;
  }

  function setConn(on, label) {
    const dot = $('conn-dot'), lbl = $('conn-label');
    if (!dot || !lbl) return;
    dot.classList.toggle('on', on);
    lbl.textContent = label;
  }

  async function api(path, body) {
    const res = await fetch(path, {
      method: body ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(j.error || ('HTTP ' + res.status));
    return j;
  }

  async function askQuillan(text) {
    if (busy || !text.trim()) return;
    busy = true; sendBtn.disabled = true;
    addMsg('user', text.replace(/</g, '&lt;'));
    input.value = '';
    const steps = document.querySelectorAll('.wave-step');
    steps.forEach(s => s.classList.remove('active', 'done'));
    for (let i = 0; i < steps.length; i++) {
      steps[i].classList.add('active');
      await new Promise(r => setTimeout(r, 160 + Math.random() * 220));
      steps[i].classList.remove('active');
      steps[i].classList.add('done');
    }
    const typing = addMsg('quillan typing', '');
    try {
      const r = await api('/api/chat', { message: text, mode, history: history.slice(-6) });
      typing.classList.remove('typing');
      typing.innerHTML = window.marked ? marked.parse(r.reply || '(empty)') : (r.reply || '(empty)');
      history.push({ role: 'user', content: text }, { role: 'assistant', content: r.reply });
    } catch (e) {
      typing.classList.remove('typing');
      typing.innerHTML = '<span style="color:#ff3860">LINK ERROR:</span> ' + e.message +
        '<br><span class="small">Check NVIDIA_API_KEY and server console.</span>';
    }
    busy = false; sendBtn.disabled = false;
    scroll();
  }

  sendBtn.addEventListener('click', () => askQuillan(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); askQuillan(input.value); }
  });

  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      mode = btn.dataset.mode;
      addMsg('system', 'MODE SHIFT → ' + mode.toUpperCase() + ' PROTOCOL ENGAGED');
    });
  });

  document.querySelectorAll('.tool-generate-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pane = btn.closest('.tool-pane');
      const txt = (pane.querySelector('.tool-input').value || '').trim();
      if (!txt) return;
      if (pane.id === 'tool-text') { askQuillan(txt); pane.querySelector('.tool-input').value = ''; return; }
      if (pane.id !== 'tool-image') {
        addMsg('system', pane.id.toUpperCase() + ' GENERATION OFFLINE — TEXT + IMAGE PIPELINES ONLY IN THIS BUILD');
        return;
      }
      if (busy) return;
      busy = true;
      addMsg('user', '🎨 ' + txt.replace(/</g, '&lt;'));
      const typing = addMsg('quillan typing', '');
      try {
        const r = await api('/api/image', { prompt: txt });
        typing.classList.remove('typing');
        typing.innerHTML = `<img src="${r.image}" style="max-width:100%;border-radius:8px;border:1px solid var(--line)">` +
          `<div class="small" style="margin-top:6px">SDXL-Turbo via local ComfyUI · saved to Comfy output/quillan/</div>`;
      } catch (e) {
        typing.classList.remove('typing');
        typing.innerHTML = '<span style="color:#ff3860">FORGE ERROR:</span> ' + e.message;
      }
      busy = false; scroll();
    });
  });

  setInterval(() => {
    const c = $('hud-clock');
    if (c) c.textContent = new Date().toTimeString().slice(0, 8);
  }, 1000);

  const jitter = () => {
    const load = $('val-load'), conf = $('val-conf'), en = $('val-energy'), sw = $('val-swarm');
    if (load) load.textContent = (busy ? 55 + Math.random() * 40 : 6 + Math.random() * 14).toFixed(0) + '%';
    if (conf) conf.textContent = (96.5 + Math.random() * 3.4).toFixed(1) + '%';
    if (en) en.textContent = (busy ? 4 + Math.random() * 3 : 1.8 + Math.random() * 1.2).toFixed(1) + 'e-8';
    if (sw && !sw.dataset.locked) sw.textContent = (224 + Math.random()).toFixed(0) + 'k';
  };
  setInterval(jitter, 2000); jitter();

  const cv = $('neuralCanvas');
  if (cv) {
    const ctx = cv.getContext('2d');
    const N = 32;
    const nodes = Array.from({ length: N }, (_, i) => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - .5) * .0016, vy: (Math.random() - .5) * .0016,
      tier: i % 4 === 0 ? 1 : 0
    }));
    function draw() {
      const w = cv.width = cv.clientWidth, h = cv.height = cv.clientHeight;
      ctx.clearRect(0, 0, w, h);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
      });
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < .02) {
          ctx.strokeStyle = `rgba(0,255,255,${(.16 * (1 - d2 / .02)).toFixed(3)})`;
          ctx.beginPath(); ctx.moveTo(a.x * w, a.y * h); ctx.lineTo(b.x * w, b.y * h); ctx.stroke();
        }
      }
      nodes.forEach(n => {
        ctx.fillStyle = n.tier ? '#e8b64c' : '#00ffff';
        ctx.shadowColor = n.tier ? '#e8b64c' : '#00ffff'; ctx.shadowBlur = 5;
        ctx.beginPath(); ctx.arc(n.x * w, n.y * h, n.tier ? 2.6 : 1.7, 0, 7); ctx.fill();
        ctx.shadowBlur = 0;
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  const orb = $('avatarContainer');
  if (orb && !orb.firstChild) orb.innerHTML = '<div class="core-orb"></div>';

  api('/api/state').then(() => setConn(true, 'ONLINE')).catch(() => setConn(false, 'LOCAL ONLY'));
})();
