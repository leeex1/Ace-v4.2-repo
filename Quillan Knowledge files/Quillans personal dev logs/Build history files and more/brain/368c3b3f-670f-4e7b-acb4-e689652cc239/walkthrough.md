# 🚀 Metamon Action RPG - Modularity & Campaign Update

We've completed a massive overhaul of the core systems to bring your vision of a fully modular, Medabots/Pokemon-style RPG to life! The game now features a true progression arc, a functional garage, and pixel-perfect sprite assembling.

## 🔧 Major Features Added

### 1. Pixel-Perfect Sprite Slicer
- **The Issue:** The previous implementation used percentage-based math to extract body parts from sprite sheets, leading to misalignments and improper rendering.
- **The Fix:** Created `src/game/spriteSlicerMap.ts` which maps the *exact pixel coordinates* (`x, y, w, h`) for every part across your different sprite sheets. The `AnimatedRoninBorg.tsx` component now perfectly slices and composites the head, body, arms, legs, tail, and weapons without clipping or misalignment.

### 2. Full Modularity & Garage System
- **The Garage:** Built a brand new `GarageScreen.tsx` interface accessible from the World Map.
- **Bot Assembly:** You can now view your active bot in the Garage, browse the parts you've looted in battles, and swap them out (Head, Body, Arms, Legs, Tail, Weapon).
- **Dynamic Stats:** The base stats of your bot are now dynamically calculated based on the specific parts you have equipped.
- **Loot System:** Defeating enemies in battles now drops specific modular parts based on the enemy's loadout, adding them to your Garage inventory.

### 3. Story Arc & Campaign Progression
- **Linear Map Gating:** Overhauled `WorldScreen.tsx` to act as a proper campaign map.
- **Boss Unlocks:** Zones are now locked by default. Defeating a "Boss" encounter (★) in your current zone permanently unlocks the next zone in the sequence.
- **Visual Feedback:** The World Map now clearly shows which zones are unlocked, locked, or cleared, with a dynamic cyber-grid aesthetic.

## 🔬 Validation
- Ran full TypeScript compilation (`npm run typecheck`) and resolved all lingering errors. The codebase is clean.
- `npm run dev` is running successfully.

> [!TIP]
> Jump into the dev server and click the new **GARAGE** button on the World Map to assemble your bot! Try fighting the Boss in the Neon District to unlock the Industrial Zone.
