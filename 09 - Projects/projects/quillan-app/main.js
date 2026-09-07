const { app, BrowserWindow, Tray, Menu, globalShortcut, screen, ipcMain, nativeImage } = require("electron");
const path = require("path");
const fs = require("fs");

let win, tray;
const AVATAR = 200;
const BUBBLE_W = 320;
const BUBBLE_H = 340;

// Single instance lock — prevents duplicate Clippy ghosts
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) app.quit();
else app.on("second-instance", () => { if (win) { win.show(); win.focus(); } });

function createWindow(){
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width: AVATAR + 16,
    height: AVATAR + 60,
    x: Math.round(width/2 - AVATAR/2),
    y: Math.round(height/2 - AVATAR/2),
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: false,
    hasShadow: false,
    resizable: false,
    backgroundColor: "#00000000",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false
    }
  });
  win.setAlwaysOnTop(true, "screen-saver"); win.show(); win.focus(); win.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen:true});;
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  // Click-through prevention: keep window interactive only where needed (handled via CSS -webkit-app-region)
  win.loadFile("index.html");
  // DevTools only in --dev
  if (process.argv.includes("--dev")) { try{ win.webContents.openDevTools({ mode: "detach" }); }catch(e){ console.log("devtools detach fail",e.message); }};
  win.webContents.on("console-message", (e, level, message) => console.log("[renderer] " + message));
  win.on("close", e => { if (!app.isQuitting) { e.preventDefault(); win.hide(); }});
  win.webContents.on("did-finish-load", () => {
    console.log("[main] renderer loaded");
  });
}

function createTray(){
  try {
    let iconPath = path.join(__dirname, "icon.png");
    // icon.png in repo is 1px placeholder (78 bytes) — guard against broken image
    let img = nativeImage.createFromPath(iconPath);
    if (img.isEmpty() || fs.statSync(iconPath).size < 500) {
      // Create a 16x16 purple fallback icon programmatically
      img = nativeImage.createFromDataURL("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAAsUlEQVR4AWNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMApGwSgYBSMDEQAA//8DAA7pIN8dN1Y0AAAAAElFTkSuQmCC");
    }
    tray = new Tray(img.resize({ width: 16, height: 16 }));
    tray.setToolTip("Quillan-Ronin  ·  Clippy Reborn  ·  Ctrl+Q summon");
    const ctx = Menu.buildFromTemplate([
      { label: "Summon / Hide (Ctrl+Q)", click: ()=> win.isVisible()?win.hide():win.show() },
      { type: "separator" },
      { label: "Dance!", click: ()=> win.webContents.send("behave", "dance") },
      { label: "Chill", click: ()=> win.webContents.send("behave", "chill") },
      { label: "Pull desk — help me code", click: ()=> win.webContents.send("behave", "desk") },
      { label: "Think", click: ()=> win.webContents.send("behave", "think") },
      { type: "separator" },
      { label: "Avatar: Quillan", type:"radio", checked:true, click: ()=> win.webContents.send("avatar", "quillan") },
      { label: "Avatar: JDXX", type:"radio", click: ()=> win.webContents.send("avatar", "jdxx") },
      { label: "Avatar: Clippy (sprite demo)", click: ()=> win.webContents.send("avatar", "clippy") },
      { type: "separator" },
      { label: "Always on top", type:"checkbox", checked:true, click: (mi)=> win.setAlwaysOnTop(mi.checked, "screen-saver") },
      { label: "Dock to edge", click: ()=> win.webContents.send("dock-edge") },
      { type: "separator" },
      { label: "Quit", click: ()=> { app.isQuitting=true; app.quit(); } }
    ]);
    tray.setContextMenu(ctx);
    tray.on("click", ()=> win.isVisible()?win.hide():win.show());
    tray.on("double-click", ()=> { win.show(); win.focus(); });
  } catch(e){ console.log("tray fail", e.message); }
}

app.whenReady().then(()=>{
  createWindow();
  createTray();
  globalShortcut.register("CommandOrControl+Q", ()=> win.isVisible()?win.hide():win.show());
  globalShortcut.register("CommandOrControl+Shift+D", ()=> win.webContents.send("behave","dance"));
  globalShortcut.register("CommandOrControl+Shift+H", ()=> win.webContents.send("behave","desk"));
  globalShortcut.register("CommandOrControl+Shift+C", ()=> win.webContents.send("behave","chill"));

  // --- IPC: window sizing & positioning ---
  ipcMain.on("resize-window", (_e, w, h)=> {
    if(!win) return;
    // Clamp to screen
    const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize;
    w = Math.min(Math.round(w), sw);
    h = Math.min(Math.round(h), sh);
    win.setSize(w, h, true);
  });
  ipcMain.on("move-window", (_e, x, y)=> {
    if(!win) return;
    win.setPosition(Math.round(x), Math.round(y), true);
  });
  ipcMain.on("walk-window", (_e, dx)=> {
    if(!win) return;
    const [cx,cy] = win.getPosition();
    const { width: sw } = screen.getPrimaryDisplay().workAreaSize;
    let nx = cx + Math.round(dx);
    // Bounce at screen edges instead of wandering off
    if (nx < 0) nx = 0;
    if (nx > sw - 220) nx = sw - 220;
    win.setPosition(nx, cy, true);
  });
  ipcMain.on("hide-window", ()=> win.hide());
  ipcMain.on("show-window", ()=> { win.show(); win.focus(); });
  ipcMain.on("drag-move", (_e, dx, dy)=> {
    if(!win) return;
    const [cx,cy] = win.getPosition();
    win.setPosition(cx + Math.round(dx), cy + Math.round(dy), true);
  });
  // Dock helpers
  ipcMain.on("dock", (_e, edge)=> {
    if(!win) return;
    const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize;
    const [w,h] = win.getSize();
    if(edge==="right") win.setPosition(sw - w - 8, sh - h - 40, true);
    if(edge==="left") win.setPosition(8, sh - h - 40, true);
    if(edge==="top") win.setPosition(Math.round(sw/2 - w/2), 8, true);
  });
  ipcMain.handle("get-screen-bounds", ()=> screen.getPrimaryDisplay().workAreaSize);
});

app.on("will-quit", ()=> globalShortcut.unregisterAll());
app.on("window-all-closed", ()=> {}); // keep alive in tray






