# Sprite Slicer Calibrator & Visual Fixes

- `[/]` Build in-game `SpriteSlicerCalibrator.tsx` tool
  - `[ ]` Create UI for selecting sprite sheets
  - `[ ]` Implement draggable bounding boxes for each part (head, body, leftArm, rightArm, leftLeg, rightLeg, tail, weapon)
  - `[ ]` Add real-time composite preview
  - `[ ]` Output JSON for `spriteSlicerMap.ts`
  - `[ ]` Add access button in `MenuScreen.tsx`
- `[ ]` Add Chroma-key background removal
  - `[ ]` Implement `removeGreenScreen` function in `useSpriteSheet` or canvas rendering
  - `[ ]` Apply chroma-key directly in `AnimatedRoninBorg.tsx` modular rendering function
- `[ ]` Hero / Avatar Default Setup
  - `[ ]` Ensure player uses a defined default `RoninBorg` profile in World Map and Battle
