# Kumbh Saathi (कुंभ साथी) — Smart Pilgrim Assistance & Navigation

> **Problem Statement:** PS3 — Smart Pilgrim Assistance & Navigation  
> **Team:** Coding Janta Party (CJP)  
> **College:** K.V.N. Naik College of Engineering & Technology  
> **Event:** Kumbh Mela Innovation Hackathon 2026

---

## 1. Project Overview

**Kumbh Saathi** is an intelligent, accessibility-first pilgrim assistance and navigation platform specifically engineered for the high-density environment of Kumbh Mela 2026 in **Nashik and Trimbakeshwar**.

Standard navigation apps (e.g. Google Maps) prioritize the shortest road path, which often leads elderly pilgrims, families, and wheelchair users directly into dangerous pedestrian bottlenecks and stampede chokepoints. 

**Our Core Differentiator:**
> *"Google Maps tells you how to get there.  
> Kumbh Saathi helps decide how you should get there based on your needs and the current crowd situation."*

---

## 2. Key Features

1. **Smart Crowd-Aware Navigation:**
   - Multi-route comparison: **Route A** (Direct Bazaar), **Route B** (Shaded River Promenade), **Route C** (Outer Temple Ring).
   - Dynamic recommendation engine that adapts when crowd surges occur.
   - Transparent scoring formula factoring distance, walking time, crowd penalty, accessibility bonus, and risk factor.

2. **Personalized Pilgrim Profiles:**
   - Travel personas: **Elderly**, **Wheelchair User**, **Children**, **Family**, **Solo**, **Large Group**.
   - Route priorities: **Least Crowded**, **Accessible First**, **Fastest**, **Balanced**.

3. **Interactive Nashik & Trimbakeshwar Smart Map:**
   - Verified coordinates for Ghats (Ram Kund, Lakshman Kund, Kushavarta, Kapila Sangam), Temples (Kalaram, Trimbakeshwar Jyotirlinga, Kapileshwar), Emergency Medical Units, Police Posts, Bio-Toilets, RO Water Stations, Annakshetra (Langars), and Mega Parking grounds.
   - Interactive category filter chips and detailed place inspection drawers.
   - Visual spatial crowd density overlay (0–30% Low, 31–60% Moderate, 61–80% High, 81%+ Critical).

4. **Multilingual AI Pilgrim Assistant (Gemini):**
   - Responds in **English, हिन्दी (Hindi), and मराठी (Marathi)**.
   - Grounded strictly in the local Nashik spatial dataset to prevent hallucinating non-existent facilities.
   - Includes zero-config offline fallback so the hackathon demo never fails even without an API key or internet dropouts.

5. **Pilgrimage Itinerary Planner ("Plan My Pilgrimage"):**
   - Automated timeline generator for **1 Hour, 3 Hours, 5 Hours, or Full Day**.
   - Tailored specifically to seniors avoiding steep steps and peak ritual rush hours.

6. **Verified Nearby Facilities Directory:**
   - Sort by **Nearest**, **Recommended**, or **Most Accessible**.
   - Highlights wheelchair ramps, grab rails, non-slip matting, and direct contact helplines.

7. **One-Touch Emergency SOS Center:**
   - Live simulated GPS coordinates.
   - Instant 1-click directions to nearest ICU hospital (Civil Hospital / Ram Kund Emergency Unit #1) and Police Chowki.
   - Verified government disaster and medical helplines (112, 108, 1091).

8. **Admin / Crowd Surge Simulator (Judge Showcase):**
   - Interactive density sliders for Ram Kund, Panchavati, and Trimbakeshwar.
   - **"SIMULATE CROWD SURGE"** button that spikes Ram Kund to **92% (CRITICAL)** and immediately recalculates pilgrim routes in real time.

9. **Family & Group Safety Tracker:**
   - Temporary group creation (`Kumbh Family`) tracking battery level, last seen time, and "Navigate to Member" rendezvous route.

---

## 3. Tech Stack

- **Frontend:** React 18, Vite 5, TypeScript
- **Styling:** Tailwind CSS (custom saffron, deep navy, and sacred gold palette)
- **Icons:** Lucide React
- **Mapping:** Leaflet with high-contrast OpenStreetMap Carto tiles (zero-config, 100% offline-ready) + Google Maps Platform compatible
- **AI Service:** Google Gemini API (`gemini-1.5-flash`) + grounded multilingual local engine fallback

---

## 4. How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Setup Steps
```bash
# 1. Clone or navigate to the repository
cd c:\Users\admin\Desktop\kumbh

# 2. Install dependencies
npm install

# 3. (Optional) Configure environment variables
# Copy .env.example to .env if you wish to use your own Gemini or Google Maps API keys:
cp .env.example .env

# 4. Start development server
npm run dev

# 5. Build for production
npm run build
```

The application runs on `http://localhost:5173`.

---

## 5. Environment Variables (`.env.example`)

```env
# Optional - Leaflet OpenStreetMap fallback is active out-of-the-box
VITE_GOOGLE_MAPS_API_KEY=

# Optional - Intelligent grounded multilingual fallback is active out-of-the-box
VITE_GEMINI_API_KEY=
```

---

## 6. Exact 15-Step Hackathon Demonstration Flow

1. **Step 1:** Open Kumbh Saathi on the browser. Observe the clean Indian pilgrimage design, hero banner, and Ram Kund live condition ticker.
2. **Step 2:** In the search bar or Destination field, search or select **"Ram Kund"**.
3. **Step 3:** View location, verified facilities (drinking water, toilets, first aid), and tap **"Navigate Here"**.
4. **Step 4:** In Travelling With, choose **"Elderly"**.
5. **Step 5:** In Route Priority, choose **"Least Crowded"**.
6. **Step 6:** Review Route comparison: **Route A** (1.8 km, 18 min, Bazaar) vs. **Route B** (2.2 km, 23 min, Shaded Promenade).
7. **Step 7:** Notice that **Route B** is flagged as **"Recommended for You"** with transparent rationale (*"400m longer but has 60% lower crowd density, non-slip ramps, and continuous shade"*).
8. **Step 8:** Click **Admin** in the header or sidebar to open the **Crowd Simulator**.
9. **Step 9:** Click the prominent **"SIMULATE CROWD SURGE"** button (Ram Kund density spikes from 45% to **92% CRITICAL**).
10. **Step 10:** Return to **Navigation** or **Smart Map**.
11. **Step 11:** Notice the high-priority alert: *"Route A is now congested due to a sudden crowd surge at Ram Kund."*
12. **Step 12:** Confirm that the recommendation engine automatically locks onto **Route B** as the only safe path.
13. **Step 13:** Open the **AI Saathi** tab. Click or ask: *"I have 3 hours and I'm travelling with my parents. Plan my pilgrimage."*
14. **Step 14:** Observe the multilingual structured response breaking down darshan at Kalaram Temple, Route B riverwalk, and Ram Kund bathing ramp with interactive place links.
15. **Step 15:** Click the red **SOS Emergency** button in the header. View immediate directions to District Civil Hospital and emergency contacts (112, 108).

---

## 7. Real vs. Simulated Distinction

- **REAL:** Spatial calculations, interactive map rendering, multi-factor route scoring algorithm, Gemini AI prompt grounding, responsive UI, search and filtering.
- **SIMULATED:** Pedestrian density percentages (demo crowd sensor feeds), simulated crowd surge button, family member GPS pings. In production, these interfaces seamlessly plug into municipal CCTV computer-vision density feeds and crowd IoT sensors.

---

## 8. Team & College Details

- **Problem Statement:** PS3 — Smart Pilgrim Assistance & Navigation
- **Team Name:** Coding Janta Party (CJP)
- **College:** K.V.N. Naik College of Engineering & Technology
- **Event:** Kumbh Mela Innovation Hackathon 2026
