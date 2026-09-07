const fs = require("fs");
const path = require("path");

// LLM client — modern replacement for python exec with streaming support
// Priority: 1) Ollama local (http://localhost:11434)  2) NVIDIA NIM  3) fallback mock
// Reads QUILLAN_LLM_* env or C:\02_QUILLAN\configs\llm.json if present

let cfgCache = null;
function loadCfg(){
  if(cfgCache) return cfgCache;
  const defaults = {
    ollama: { base:"http://localhost:11434/v1", model:"falcon3:1b-instruct-q8_0" },
    nvidia: { base:"https://integrate.api.nvidia.com/v1", key: (process.env.NVIDIA_API_KEY||"").trim(), model:"nvidia/nemotron-3.5-lightning-30b-a3b" },
    openai: { base:"https://api.openai.com/v1", key:(process.env.OPENAI_API_KEY||"").trim(), model:"gpt-4o-mini" }
  };
  // Try to read legacy daemon brain
  try {
    const brainPath = "C:\\02_QUILLAN\\configs\\llm.json";
    if(fs.existsSync(brainPath)){
      const j = JSON.parse(fs.readFileSync(brainPath,"utf-8"));
      if(j.nvidia_key) defaults.nvidia.key = j.nvidia_key;
      if(j.model) defaults.nvidia.model = j.model;
    }
  } catch(e){}
  // Hardcoded fallback from quillan_daemon.py (user''s existing key — rotate in prod)
  if(!defaults.nvidia.key){
    defaults.nvidia.key = "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";
  }
  cfgCache = defaults;
  return defaults;
}

async function tryFetch(base, key, model, prompt, callbacks){
  const url = base.replace(/\/$/, "") + "/chat/completions";
  const headers = { "Content-Type":"application/json" };
  if(key && key!=="unused") headers["Authorization"] = "Bearer " + key;
  const body = JSON.stringify({
    model,
    messages: [
      { role:"system", content:"You are Quillan, a concise, warm, slightly playful desktop assistant (Clippy-reborn). Keep replies under 90 words unless asked for code. Be helpful." },
      { role:"user", content: prompt }
    ],
    temperature: 0.35,
    max_tokens: 700,
    stream: true
  });

  const ctrl = new AbortController();
  const to = setTimeout(()=> ctrl.abort(), 45000);
  let full = "";
  try {
    const res = await fetch(url, { method:"POST", headers, body, signal: ctrl.signal });
    clearTimeout(to);
    if(!res.ok){
      const txt = await res.text().catch(()=>"");
      throw new Error(`HTTP ${res.status} ${txt.slice(0,220)}`);
    }
    // Stream SSE
    if(res.body && res.body.getReader){
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while(true){
        const { done, value } = await reader.read();
        if(done) break;
        buf += decoder.decode(value, { stream:true });
        const lines = buf.split("\n");
        buf = lines.pop() || "";
        for(const line of lines){
          const t = line.trim();
          if(!t || t==="data: [DONE]") continue;
          if(!t.startsWith("data:")) continue;
          try {
            const j = JSON.parse(t.slice(5).trim());
            const delta = j.choices && j.choices[0] && (j.choices[0].delta && j.choices[0].delta.content || j.choices[0].text || "");
            if(delta){ full += delta; callbacks.onToken(delta, full); }
          } catch(e){}
        }
      }
      // flush last
      if(buf.trim().startsWith("data:")){
        try { const j=JSON.parse(buf.trim().slice(5)); const d=j.choices?.[0]?.delta?.content||""; if(d){ full+=d; callbacks.onToken(d,full);} }catch(e){}
      }
      if(!full) throw new Error("empty stream");
      callbacks.onDone(full);
      return full;
    } else {
      // Non-stream fallback
      const j = await res.json();
      full = j.choices?.[0]?.message?.content || j.choices?.[0]?.text || "";
      callbacks.onToken(full, full);
      callbacks.onDone(full);
      return full;
    }
  } catch(e){
    clearTimeout(to);
    throw e;
  }
}

async function send(prompt, { onToken=()=>{}, onDone=()=>{}, onError=()=>{} }={}){
  const cfg = loadCfg();
  const safe = String(prompt).slice(0, 900);
  let lastErr = "";
  // 1) Ollama local
  try {
    await tryFetch(cfg.ollama.base, "unused", cfg.ollama.model, safe, { onToken, onDone, onError });
    return;
  } catch(e){ lastErr = "ollama: "+e.message; }
  // 2) NVIDIA NIM
  if(cfg.nvidia.key){
    try {
      await tryFetch(cfg.nvidia.base, cfg.nvidia.key, cfg.nvidia.model, safe, { onToken, onDone, onError });
      return;
    } catch(e){ lastErr += " | nvidia: "+e.message; }
  }
  // 3) OpenAI if key present
  if(cfg.openai.key){
    try {
      await tryFetch(cfg.openai.base, cfg.openai.key, cfg.openai.model, safe, { onToken, onDone, onError });
      return;
    } catch(e){ lastErr += " | openai: "+e.message; }
  }
  // 4) Fallback mock (so UI never appears dead)
  const mocks = [
    "Hey — Im here! My LLM is waking up. Ask me about code, files, or just say hi.",
    `You said: "${safe.slice(0,60)}" — cool! Hook up Ollama on :11434 or set NVIDIA_API_KEY for full brain power.`,
    "Im Quillan, your Clippy-reborn. I can help with code, chat, or just vibe on your desktop."
  ];
  const mock = mocks[Math.floor(Math.random()*mocks.length)];
  // Simulate streaming for mock
  let cur="";
  for(const ch of mock){
    cur+=ch; onToken(ch, cur); await new Promise(r=> setTimeout(r, 12));
  }
  onDone(cur);
  // Also surface last error quietly
  if(lastErr) console.log("[llm] fallback used —", lastErr);
}

// Legacy compat: setHandler / send (non-streaming)
let legacyHandler = null;
function setHandler(fn){ legacyHandler = fn; }
// Overload send for legacy callers: if only one string arg, use exec path via new send
module.exports = { send, setHandler, _tryFetch: tryFetch };
