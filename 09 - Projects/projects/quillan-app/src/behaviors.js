let wanderTimer=null, nudgeTimer=null;

function startBehaviors(avatar, bubble, { onProactive=()=>{} }={}){
  // Idle wander every 38-72s: short walk across desktop (only if idle and bubble closed)
  function scheduleWander(){
    const delay = 38000 + Math.random()*34000;
    wanderTimer = setTimeout(async ()=>{
      if(avatar.getState()==="idle" && !bubble.isVisible()){
        avatar.setState("walk");
        // walk lasts ~4.2s then back to idle
        setTimeout(()=> { if(avatar.getState()==="walk") avatar.setState("idle"); }, 4300);
      }
      scheduleWander();
    }, delay);
  }

  // Proactive nudges (Clippy classic: "It looks like..." )
  const nudges = [
    "It looks like youre coding — need a hand?",
    "Psst — I can watch your files and remind you to commit.",
    "Want me to keep your window tidy? Click desk to focus.",
    "Im here if you need a rubber duck."
  ];
  function scheduleNudge(){
    nudgeTimer = setTimeout(()=>{
      if(!bubble.isVisible() && avatar.getState()==="idle" && Math.random()<0.45){
        const msg = nudges[Math.floor(Math.random()*nudges.length)];
        // subtle blink + nudge
        avatar.setState("think");
        setTimeout(()=> avatar.setState("idle"), 900);
        onProactive(msg, 5000);
      }
      scheduleNudge();
    }, 110000 + Math.random()*90000); // every ~2-3 min
  }

  scheduleWander();
  scheduleNudge();

  // Idle blink injection for sprite mode
  setInterval(()=>{
    if(avatar.getState()==="idle" && Math.random()<0.18){
      avatar.blink && avatar.blink();
    }
  }, 2600);
}

function stop(){
  if(wanderTimer) clearTimeout(wanderTimer);
  if(nudgeTimer) clearTimeout(nudgeTimer);
}

module.exports = { startBehaviors, stop };
