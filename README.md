# VOXSTOCK — Philippine Startup Challenge XI Entry

> **"Speak. Track. Manage. Effortlessly."**  
> *An AI-Powered Inventory Management System Using Voice Recognition*

---

## 🏆 Competition & Team Details

* **Event:** Philippine Startup Challenge XI (PSC XI)
* **Team Name:** TRIVOX
* **Grade & Section:** GRADE 12 — JAMES GOSLING
* **Startup Name:** VOXSTOCK

### 👥 Founding Team & Roles
1. **Versoza, Azhley Nicole D.** — *Project Lead & Business Strategy*
2. **Abique, Breian I.** — *AI/ML Development & Voice Engine*
3. **Profeta, Dref Nicolo F.** — *Full-Stack Development & UI/UX*

---

## 🌧️ Interactive Presentation Overview

This repository contains a **single-page interactive 3D presentation deck** built with **HTML5, CSS3, Three.js, and GSAP**, engineered specifically for high-stakes competition pitching.

### 🎨 Visual Theme & Atmosphere
* **Aesthetic:** Calm, rainy, foggy overcast atmosphere with frosted glassmorphism (`backdrop-filter: blur(14px)`).
* **Color Palette:**
  * Foggy Slate Grey (`#2A2D34`)
  * Deep Soft Charcoal (`#1C1E26` / `#12141A`)
  * Muted Silver (`#8E9AAF`)
  * Pale Blue-Grey (`#B0BEC5`)
  * White Mist (`#E8ECF1`)
  * High-Tech Cyan (`#5DADE2`) & Emerald Growth (`#48C78E`)

---

## 🎞️ 12-Slide Pitch Deck Outline

1. **Slide 1 — Title Hero:** Brand identity, competition badges, motto, and founding team roster.
2. **Slide 2 — I. Executive Summary:** ₱2.3B problem, voice-first AI solution, zero learning curve value proposition.
3. **Slide 3 — II. Background of the Problem:** 1.1M Philippine MSMEs, 15–30% discrepancies, 4.2 hours wasted daily, legacy ERP pricing failures.
4. **Slide 4 — III. Proposed Startup Solution:** 3 Core Modules (Voice NLP Engine, AI Forecasting Dashboard, Real-Time Sync Hub) + UN SDG 9 & 12 Alignment.
5. **Slide 5 — IV. Strategic Objectives:** Measurable 5-point milestone table with timeline and impact metrics.
6. **Slide 6 — V. Target Market & Beneficiaries:** Primary & Secondary beneficiaries + TAM (₱8.7B), SAM (₱1.2B), SOM (₱120M) breakdown.
7. **Slide 7 — VI. Value Proposition Matrix:** Comparison matrix vs. traditional ERPs & barcode scanning. *"Hindi mo na kailangang mag-type. Magsalita ka lang."*
8. **Slide 8 — VII. Business Model & Pricing:** Freemium SaaS tiers (Free/₱499/₱2,499), B2B API Licensing, FMCG Data Insights, Cost structure, Month 18 break-even.
9. **Slide 9 — VIII. Market Analysis:** $5.8B global market, 22% PH SaaS CAGR, $40B voice commerce trend, competitive moat analysis.
10. **Slide 10 — IX. Operations Plan & Roadmap:** Phase 1 (MVP/NCR), Phase 2 (DTI Scale), Phase 3 (ASEAN Expansion) + Team execution responsibilities.
11. **Slide 11 — X. Financial Requirement:** ₱5,000,000 Seed Round allocation table, 3-year revenue projections (₱3.6M → ₱28M), 3.2x ROI.
12. **Slide 12 — Closing Slide & Grand Pitch:** Contact information (`trivox.voxstock@gmail.com`, `www.voxstock.ph`), grand closing thank-you.

---

## 🌟 Interactive Features Built-In

1. **3D Three.js Persistent Environment:**
   * Dynamic falling rain particle system with floor recycling and streak texture.
   * Volumetric drifting mist and fog layers.
   * Mouse parallax camera tilting.
   * 12 distinct 3D visual objects mapped to each slide (gyro torus, glowing orb, shattered glass fragments, dynamic audio soundwave spectrum, milestone discs, constellation network, skyscraper towers, orbiting tokens, rising 3D bar chart, glowing highway roadmap, donut chart slices, and golden sunbeams).
2. **Procedural Web Audio Rain Synthesizer:**
   * Gentle procedural rain ambience synthesized in real-time via Web Audio API (zero external audio file dependencies).
   * Toggle button on header (`M` key or click).
3. **Interactive Live Voice AI Demo Sandbox:**
   * Test simulated voice commands in Tagalog, Cebuano, and English (e.g., *"Magdagdag ng 50 kaso ng sardinas"*, *"Pagbawas ug 15 ka sako nga bugas"*).
   * Live intent extraction, confidence scoring, and interactive cloud inventory ledger updates.
4. **Presenter Utility Tools:**
   * Slide Overview Grid Drawer (press `O`).
   * Speaker Pitch Notes Drawer (press `N`).
   * Fullscreen Mode (press `F`).
   * Touch swipe gesture support for tablets and mobile devices.

---

## ⌨️ Keyboard Navigation Shortcuts

| Key | Action |
|---|---|
| `→` / `Space` / `PageDown` | Next Slide |
| `←` / `Backspace` / `PageUp` | Previous Slide |
| `Home` | First Slide (Title) |
| `End` | Last Slide (Closing) |
| `O` | Toggle Slide Overview Grid |
| `N` | Toggle Speaker Pitch Notes |
| `D` | Toggle Voice AI Sandbox Demo |
| `M` | Toggle Ambient Rain Sound |
| `F` | Toggle Fullscreen Mode |

---

## 🚀 Running the Presentation Locally

To preview and present locally:
```bash
python3 -m http.server 3000
```
Then navigate to `http://localhost:3000` in any modern web browser.

---
*© 2026 Team TRIVOX (Grade 12 James Gosling). All rights reserved for Philippine Startup Challenge XI.*
