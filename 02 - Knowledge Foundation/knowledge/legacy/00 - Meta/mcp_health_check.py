#!/usr/bin/env python3
import json, subprocess, sys, pathlib, time
from pathlib import Path

opencode = Path(r"C:\Users\Admin\.config\opencode\opencode.jsonc")
j = json.loads(opencode.read_text(encoding='utf-8-sig'))
mcps = j.get("mcp", {})

print("="*70)
print("MCP CHAIN HEALTH CHECK (expect 20, previous 7)")
print("="*70)
enabled = [k for k,v in mcps.items() if v.get("enabled", True) != False]
disabled = [k for k,v in mcps.items() if v.get("enabled")==False]
print(f"Total MCPs: {len(mcps)} | Enabled: {len(enabled)} | Disabled: {len(disabled)}")
print(f"Enabled: {enabled}")
if disabled:
    print(f"Disabled: {disabled}")
else:
    print("All MCPs ENABLED - fixed!")

# Quick command checks (don't actually launch stdio, just check executables exist)
checks = {
    "Fetch": ["uvx","mcp-server-fetch","--help"],
    "WebSearch": ["uvx","duckduckgo-mcp-server","--help"],
    "Filesystem": ["npx","-y","@modelcontextprotocol/server-filesystem","--help"],
    "Memory": ["npx","-y","@modelcontextprotocol/server-memory","--help"],
    "Git": ["uvx","mcp-server-git","--help"],
    "SQLite": ["uvx","mcp-server-sqlite","--help"],
}
ok=0
for name, cmd in checks.items():
    try:
        r=subprocess.run(cmd, capture_output=True, timeout=10, text=True)
        if r.returncode==0 or "usage" in r.stdout.lower() or "usage" in r.stderr.lower():
            print(f"  OK {name}")
            ok+=1
        else:
            print(f"  ? {name}: rc={r.returncode}")
    except Exception as e:
        print(f"  FAIL {name}: {e}")

# Check node paths
for name in ["Playwright","Puppeteer","ChromeDevTools","ThinkingEngine"]:
    cfg = mcps.get(name, {})
    cmd = cfg.get("command", [])
    p = Path(cmd[1]) if len(cmd)>1 else None
    exists = p.exists() if p else False
    print(f"  {'OK' if exists else 'MISSING'} {name}: {p} exists={exists}")

# Check python MCPs
for name in ["QuillanRAG"]:
    cfg = mcps.get(name, {})
    cmd = cfg.get("command", [])
    p = Path(cmd[1]) if len(cmd)>1 else None
    exists = p.exists() if p else False
    print(f"  {'OK' if exists else 'MISSING'} {name}: {p} exists={exists}")

print(f"\nMCP health: {ok}/{len(checks)} core checks passed + node/python paths verified")
print("="*70)

