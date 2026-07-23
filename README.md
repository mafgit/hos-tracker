# 🚚 Hours of Service & ELD Logger

## ✨ Features

- **📊 SVG ELD Log Sheets:** Plots multi-day 24-hour log sheets using custom SVG paths to deliver clear, responsive visual duty lines.
- **🗺️ Interactive Route Map:** Renders polyline paths with custom markers identifying pickup, dropoff and current locations.
- Clean and modern input form with debounced autocompletions for location names.
- Simplified implementation of FMCSA Hours of Service (HOS) Regulations

## 🛠️ Tech Stack

- Backend:
  - **Django** (Python backend service executing the core schedule simulation logic.)
  - **OSRM API** Routing engine for distance, duration, and road coordinates.
- Frontend:
  - **Zustand** (State management tool)
  - **TypeScript**
  - **React**
  - **Tailwind**
  - **Photon (komoot.io)** (API for autocomplete results with lats and longs.)
- Deployment:
  - **Vercel** (Both frontend and backend are deployed on Vercel.)

## 🚀 Live Demo & Links

- **Live Application:** [Frontend](https://hos-tracker.vercel.app/)
- **Repository:** [GitHub](https://github.com/mafgit/hos-tracker)
