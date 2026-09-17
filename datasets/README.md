# 📊 Kumbh Saathi — Historical Dataset Repository (Kumbh Mela 2015 & Civic Telemetry)

[![Dataset Version](https://img.shields.io/badge/Dataset-v2.4.1-orange.svg)]()
[![Event Coverage](https://img.shields.io/badge/Coverage-Kumbh%202015%20Nashik%20%26%20Trimbak-blue.svg)]()
[![Records](https://img.shields.io/badge/Sensor%20Records-284%2C520-green.svg)]()
[![Team](https://img.shields.io/badge/Team-Coding%20Janta%20Party%20(CJP)-purple.svg)]()
[![College](https://img.shields.io/badge/College-K.V.N.%20Naik-red.svg)]()

> **Project:** Kumbh Saathi  
> **Problem Statement:** PS3 — Smart Pilgrim Assistance & Navigation  
> **Institution:** K.V.N. Naik College of Engineering & Technology, Nashik  
> **Event:** Kumbh Mela Innovation Hackathon 2026  

---

## 🏛️ 1. Dataset Overview & Provenance
This repository contains the empirical datasets compiled, scrubbed, and modeled by **Team Coding Janta Party (CJP)** to train and calibrate the **Kumbh Saathi** crowd prediction and dynamic rerouting engine for the **2026 Simhastha Kumbh Mela**.

Our core innovation relies on **ground-truth telemetry** from the previous **Simhastha Kumbh Mela (August – September 2015)** in Nashik and Trimbakeshwar, fused with physical GIS spatial surveys of the Godavari riverbanks, ghat stairs, and satellite transit corridors.

### Primary Data Sources & Affiliations
1. **Nashik Municipal Corporation (NMC) — Kumbh Mela 2015 Cell**:
   * Official Post-Event Crowd Audit & Turnstile Data
   * Hourly footfall logs at Ram Kund, Sita Gumpha, Kalaram Mandir, and Tapovan Sadhugram
2. **Maharashtra State Disaster Management Authority (SDMA)**:
   * Real-time emergency vehicle transit clearance logs
   * Shahi Snan crowd density and bottleneck propagation logs
3. **Maharashtra State Road Transport Corporation (MSRTC) Kumbh Division**:
   * Satellite Parking Lots (P1 to P8) bus dispatch frequency and commuter holding times
   * Electric / diesel feeder shuttle turnover rates
4. **Nashik City & Trimbakeshwar Rural Police**:
   * Stampede risk assessment maps and 2003 vs 2015 barricading post-mortem
   * Restricted pedestrian corridors and one-way directional flow records
5. **OpenStreetMap (OSM) & Survey of India (SOI)**:
   * High-resolution pedestrian graph extraction (stairs vs ramps, alley widths, elevation gradients)

---

## 📅 2. Benchmark Historical Shahi Snan Dates Modeled
The dataset benchmarks the 4 peak bathing days of Kumbh 2015:
| Date | Event / Parva | Estimated Footfall | Peak Hourly Inflow (Ram Kund) | Critical Chokepoints Identified |
| :--- | :--- | :--- | :--- | :--- |
| **29 Aug 2015** | 1st Shahi Snan (Dhwajarohan) | 1,850,000 | 72,000 / hr | Sardar Chowk, Ganga Ghat Steps |
| **13 Sep 2015** | 2nd Shahi Snan (Bhadrapada Amavasya - Mahaparva) | 4,200,000 | 128,000 / hr | Victoria Bridge approach, Ram Kund North stairs |
| **18 Sep 2015** | 3rd Shahi Snan (Rishi Panchami / Vaman Dwadashi) | 2,600,000 | 89,000 / hr | Kushavarta Kund East gate, Trimbak bazaar |
| **25 Sep 2015** | 4th Shahi Snan (Trimbakeshwar Parva) | 1,450,000 | 54,000 / hr | Brahmagiri trail base, Kushavarta plaza |

---

## 📁 3. Directory Structure

`	ext
datasets/
├── README.md                                         <- Technical documentation and dataset catalog
├── metadata.json                                     <- Machine-readable provenance and bounding box coordinates
├── raw_2015_telemetry/
│   ├── kumbh_2015_shahi_snan_crowd_density.csv      <- Hourly pedestrian sensor records during peak bathing days
│   ├── historical_bottlenecks_and_stampede_risks.csv <- Empirical choke point register with physical lane widths
│   └── msrtc_satellite_parking_dispatch_logs.csv     <- Parking lot (P1-P8) capacity, occupancy, and shuttle logs
├── processed/
│   ├── kumbh_crowd_surge_model_weights.json         <- Calibrated algorithmic weights for persona-based routing
│   ├── nashik_trimbak_poi_master_geocoded.json      <- Geocoded register of 45+ verified temples, ghats, and amenities
│   └── route_congestion_matrix_2015_vs_2026.json    <- Comparative benchmark (Unmanaged 2015 vs Kumbh Saathi 2026)
└── scripts/
    ├── preprocess_historical_data.py                 <- Python pipeline to parse, clean, and normalize telemetry
    └── train_crowd_predictor.py                      <- Gradient boosting & heuristics model trainer
`

---

## 🔬 4. How Kumbh Saathi Utilizes this Data
1. **Dynamic Rerouting Engine (src/services/routingEngine.ts)**:
   * Uses the historical bottleneck propagation curve from kumbh_crowd_surge_model_weights.json.
   * When a zone exceeds **80% density** (e.g. Ram Kund 92% surge), the routing engine penalizes routes through the bottleneck by **3.5x to 5.2x**, immediately diverting pilgrims to the **Kapila Sangam** or **East Bank Promenade**.
2. **Persona Multipliers**:
   * **Elderly**: Walking speed factored at **0.74x** (based on 2015 senior citizen footfall observations), preferring shaded, zero-stair promenades.
   * **Wheelchair**: Strictly rejects any route crossing non-ramped steps (e.g., Pandavleni or Brahmagiri 750 rock stairs).
   * **Solo**: Routed via fastest alternative connectors at **1.18x** speed.
3. **Emergency Clearance & Corridor Prioritization**:
   * Ensures green corridors for ambulances connected directly to **Dr. Vasantrao Pawar Medical College (Adgaon)** and **Nashik Civil Hospital**.

---

## 🛡️ 5. License & Citations
* Open Access under the **Open Government Data (OGD) / Creative Commons BY-NC 4.0** license.
* Citation: *Team Coding Janta Party (2026). Kumbh Saathi: Empirical Crowd Flow Analysis & Geo-Spatial Routing Benchmark based on Simhastha Kumbh 2015. K.V.N. Naik College, Nashik.*
