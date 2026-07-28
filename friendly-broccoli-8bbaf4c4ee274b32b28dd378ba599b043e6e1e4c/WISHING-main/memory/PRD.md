# PRD — Arshia's Cinematic Birthday Website

## Overview
Frontend-only (React + framer-motion + lenis) premium, dark cosmic cinematic birthday experience for "Arshia" (Kiddo). No backend, no data persistence. DOB gate password = 01012000 (DDMMYYYY).

## Assets
- 5 photos, 4 videos, 1 background mp3 (see src/data.js ASSETS). All external customer-asset URLs.

## Personalized content (PRESERVE EXACTLY — src/data.js)
Memory Jar (10), Timeline/The Story (5), 6 mood Letters, Secret Letter, Wheel (10 categories), Compliments (7, "Tu"→"Aap" applied), Birthday wish, Best Friend Meter reasons, 12 Reasons, Grand Finale message + "Prashant" signature.

## Experience flow / section order
Intro: loader → waving velvet curtains → butterfly swarm → cosmic lock (animated footballer #10 + typing welcome, left; DOB glass panel, right) → football-kick transition → ARSHIA name reveal (+subtitle, music starts once) → Hero.
Sections: Hero → Little Moments (Gallery) → The Story → Moving Memories (hanging video frames) → 12 Reasons (NEW) → Memory Jar (left jar, stacking) → Letters (storybook, center) → Wheel (cloud result) → Cake (shift + golden wish) → Infinite Compliments → Best Friend Meter → Secret Letter → Grand Finale (gift box).

## Theme
Dark cosmic: midnight/purple/pink/gold. Dark glassmorphism, cosmic bg, row-based media flow, butterflies, no custom cursor. Fonts: Playfair Display (serif), Outfit (body), Dancing Script (hand).

## Implemented (2026-07-23)
- v1 light pastel build (all sections + intro) — tested pass.
- v2 dark cosmic redesign — tested pass.
- v3 big upgrade: footballer welcome + butterflies + kick transition, enhanced ARSHIA reveal, thread-hung hero, row media tracks, hanging video frames, left/stacking Memory Jar, storybook letters (center float), cloud wheel result, premium cake shift+message, 12 Reasons popup, Grand Finale gift box, single background music (no player UI), section reorder, "Tu"→"Aap". Tested: 16/16 flows pass.

## Notes / Known limitations
- "Footballer" is a stylized SVG character (jersey #10), NOT a photoreal 3D Messi (not feasible in web stack).
- Music autoplay depends on browser gesture policy; it starts on the unlock click (user gesture) so it plays reliably.

## Backlog / Next ideas (P2)
- Optional real 3D character via a lightweight GLB + three.js if desired.
- Optional shareable "made by" footer / downloadable keepsake.
