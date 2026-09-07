let bubble, msgs, input, sendBtn, hdrName, isStreaming=false, streamingEl=null, sendHandler=null;

function init({ bubbleId="bubble", msgsId="msgs", inputId="chatInput", sendId="btnSend" }={}){
  bubble = document.getElementById(bubbleId);
  msgs = document.getElementById(msgsId);
  input = document.getElementById(inputId);
  sendBtn = document.getElementById(sendId);
  if(!bubble || !msgs || !input || !sendBtn) throw new Error("bubble elements missing");
  bubble.style.display = "none";
  bubble.classList.remove("open");
}

function visible(){ return bubble.style.display !== "none"; }
function show(){
  bubble.style.display = "flex";
  bubble.classList.add("open");
  updateWindowSize();
  setTimeout(()=> input.focus(), 30);
}
function hide(){
  bubble.style.display = "none";
  bubble.classList.remove("open");
  updateWindowSize();
}
function toggle(){ visible() ? hide() : show(); }
function isVisible(){ return visible(); }

function append(who, text, kind){
  if(isStreaming && streamingEl){ finalizeStreaming(who, text); return; }
  const d = document.createElement("div");
  d.className = "msg " + (kind||"quillan");
  const safe = esc(text).replace(/\n/g,"<br>");
  d.innerHTML = "<b>"+esc(who)+":</b> "+safe;
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
  show();
  return d;
}

function upsertStreaming(who, fullText){
  if(!isStreaming){
    streamingEl = document.createElement("div");
    streamingEl.className = "msg quillan streaming";
    const safe = esc(fullText).replace(/\n/g,"<br>");
    streamingEl.innerHTML = "<b>"+esc(who)+":</b> <span class=\"streamText\">"+safe+"</span> <span class=\"typing\"></span>";
    msgs.appendChild(streamingEl);
    show();
  } else if(streamingEl){
    const span = streamingEl.querySelector(".streamText");
    if(span) span.innerHTML = esc(fullText).replace(/\n/g,"<br>");
  } else {
    streamingEl = append(who, fullText, "quillan streaming");
    const t = document.createElement("span"); t.className="typing"; streamingEl.appendChild(t);
  }
  msgs.scrollTop = msgs.scrollHeight;
}

function finalizeStreaming(who, fullText){
  if(streamingEl){
    streamingEl.classList.remove("streaming");
    const span = streamingEl.querySelector(".streamText");
    if(span) span.innerHTML = esc(fullText).replace(/\n/g,"<br>");
    const typing = streamingEl.querySelector(".typing");
    if(typing) typing.remove();
    streamingEl = null;
  } else if(fullText){
    append(who, fullText, "quillan");
  }
  msgs.scrollTop = msgs.scrollHeight;
}

function setStreaming(on){
  isStreaming = !!on;
  if(sendBtn) sendBtn.disabled = !!on;
  if(!on && streamingEl){
    const t = streamingEl.querySelector(".typing");
    if(t) t.remove();
  }
}

function clear(){ msgs.innerHTML=""; streamingEl=null; }
function onInput(handler){
  sendHandler = handler;
  input.addEventListener("keydown", e=>{ if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); handler(input.value); }});
  sendBtn.addEventListener("click", ()=> handler(input.value));
}
function getInput(){ return input.value; }
function clearInput(){ input.value = ""; }

function updateWindowSize(){
  const { ipcRenderer } = require("electron");
  if(visible()) ipcRenderer.send("resize-window", 200+320+24, 360);
  else ipcRenderer.send("resize-window", 200+16, 200+60);
}

function esc(s){
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

module.exports = { init, show, hide, toggle, isVisible, visible, append, clear, onInput, getInput, clearInput, upsertStreaming, finalizeStreaming, setStreaming, updateWindowSize };
