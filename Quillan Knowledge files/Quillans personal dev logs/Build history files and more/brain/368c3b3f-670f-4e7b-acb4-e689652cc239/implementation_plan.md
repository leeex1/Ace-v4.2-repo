# Pixel-Perfect Modular Sprite Slicer - Implementation Plan

I see exactly what's wrong in the screenshot! The sprite sheets being used (especially the AI-generated ones like the Samurai `.jpg` and the Mixup `.png`) do not have predefined standard layouts, and some of them have solid backgrounds (like green-screens) instead of true transparency. Because I cannot physically see your spritesheets to know exactly where the head, body, arms, and legs are drawn, my hardcoded pixel coordinates are just carving out random rectangular chunks of the image!

To give you the **pixel-perfect** AAA precision you demand, we need to stop guessing coordinates. 

## Proposed Changes

### 1. Interactive Sprite Slicer Calibrator Tool
I will build an in-game developer tool (`SpriteSlicerCalibrator`) that you can access from the main menu. 
- It will load any of your sprite sheets on the screen.
- You can visually click and drag bounding boxes to define *exactly* where the Head, Body, Left Arm, Right Arm, etc., are located on the sheet.
- A live preview will show your modular bot assembling in real-time as you adjust the boxes.
- Once it looks perfect, the tool will output the exact JSON code you need to copy-paste into `spriteSlicerMap.ts`.

### 2. Chroma-Key (Green Screen) Removal for AI Sprites
Since some of the AI-generated sheets (like the `.jpg` files) have solid colored backgrounds instead of transparency, I will add a dynamic Chroma-Key filter to the canvas rendering in `AnimatedRoninBorg.tsx`. 
- This will automatically strip out the solid background color (e.g., green or white) when rendering the modular parts so they composite cleanly without the ugly square backgrounds shown in your screenshot.

### 3. Hero / Avatar Setup
I will ensure the hero (player) uses a default modular model correctly on the World and Battle screens instead of falling back to a broken/missing model.

## User Review Required
> [!IMPORTANT]
> Since I am an AI and cannot visually "see" your custom sprite sheets, building this Calibrator Tool is the best way for you to easily define the exact pixel boundaries for your parts without us going back and forth guessing numbers. 
> 
> Does this sound like a good solution to you? If so, I will build the Calibrator Tool and the Chroma-Key transparency fix right away!
