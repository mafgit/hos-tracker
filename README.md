# 🚚 Hours of Service & ELD Logger

A full-stack web application for route planning and Electronic Logging Device (ELD) simulation, built for a technical assessment by Spotter.ai. It calculates route geometries and generates 24-hour driver log sheets following a simplified implementation of Federal Motor Carrier Safety Administration (FMCSA) Hours of Service (HOS) guidelines.

## ✨ Features

- 📊 **SVG ELD Log Sheets:** Renders multi-day 24-hour log sheets using custom SVG paths to deliver crisp, responsive visual duty status lines.
- 🗺️ **Interactive Route Map:** Visualizes polyline paths with custom markers identifying pickup, dropoff, and current driver locations.
- 🔍 **Smart Location Autocomplete:** Provides a clean, modern input form with debounced autocompletions for accurate location searching.
- ⏱️ **HOS Compliance Simulation:** Executes a simplified implementation of FMCSA Hours of Service (HOS) rules to calculate required driver rest breaks and duty transitions.

## 🛠️ Tech Stack

### ⚙️ Backend
- 💚 **Django:** Python backend service executing the core schedule simulation logic.
- 🛣️ **OSRM API:** Open-source routing engine for distance, duration, legs and waypoints to get help in sumulation logic.

### 🎨 Frontend
- 📦 **Zustand:** Centralized state management for trip parameters and log data.
- 📘 **TypeScript**
- ⚛️ **React**
- 📍 **Photon (Komoot):** Geocoding API delivering fast autocomplete results with latitude and longitude data.
- 🎨 **Tailwind CSS**

### 🚀 Deployment
- ▲ **Vercel:** Used Vercel to host both the React frontend and Django backend.

## 🔗 Live Demo & Repository

- 🌐 **Live Application:** [hos-tracker.vercel.app](https://hos-tracker.vercel.app/)
- 💻 **Source Code:** [GitHub Repository](https://github.com/mafgit/hos-tracker)
