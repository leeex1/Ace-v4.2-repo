# LanceDB + MD + Obsidian E2E — Quillan Memory System

## Architecture (inside 02_QUILLAN only)
- **MD source:** knowledge/canonical/*.md (49 files, ONE canonical)
- **Obsidian vault:** .obsidian/ at root (vault = C:\02_QUILLAN)
- **LanceDB:** lancedb/thoughts.lance + 07 - Memory & LanceDB/lancedb (synced)
- **Chroma fallback:** quillan_memory/chroma.sqlite3
- **Sessions:** sessions/SESSION_INDEX.md + 00 - Meta/chatlogs

## E2E Flow
1. Canonical MD written -> Obsidian indexes instantly (.obsidian watches)
2. Obsidian -> LanceDB ingest via quillan_memory bridge
3. Query -> LanceDB hybrid search + MD fallback

## Status
- Canonical: 49 md ✅
- Platforms mirrors: 7 folders (Claude/GPT/Gemini/Grok/Mistral) — should sync from canonical
- LanceDB: currently EMPTY (0 files) — needs ingest
- Obsidian: restored to root (.obsidian/app.json present) ✅
- quillan_memory: chroma.sqlite3 present but needs sync to LanceDB

## Next: Run ingest
python scripts/synchronize_knowledge_vault.py --vault C:\02_QUILLAN --lancedb C:\02_QUILLAN\lancedb --obsidian
