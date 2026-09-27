# SurakshitPath (सुरक्षित पथ) 🛡️🚶‍♀️✨
> **Safer Routes • Smarter Choices • Citizen-Powered Civic Safety**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDhruvplaz-web%2FSurakshitPath)

SurakshitPath is an advanced, AI & ML-powered nocturnal navigation and urban safety ecosystem tailored for Indian cities, starting with **Pune**. Built for commuters, night-shift workers, students, and lone travelers, SurakshitPath dynamically balances transit efficiency with pedestrian safety through algorithmic route evaluation, real-time civic hazard integration, and multi-role emergency response.

---

## 🌟 Key Features

### 1. 🧭 Multi-Factor Safe Navigation
- **Dijkstra-Based Safe Corridor Pathfinding**: Optimizes travel routes using dynamically-weighted edge costs based on street illumination, footfall density, commercial activity, and reported hazards.
- **TreeSHAP Explainable ML Safety Ensemble**: Every route alternative (Safe, Balanced, Fastest) includes transparent safety score breakdowns explaining why a segment is safe or flagged.
- **Multi-Modal Travel Profiles**: Tailored navigation modes for **Pedestrians**, **Two-Wheelers (Bikes/Scooters)**, **Four-Wheelers (Cars/Cabs)**, and **Public Transit (PMPML & Metro)**.

### 2. 🔐 Multi-Role Civic Portal
- **🚶 Commuter Gateway**:
  - 1-Click Google Sign-In with official Google Identity.
  - Indian Mobile Number (+91) OTP verification.
  - **Trusted Guardians Setup**: Link up to 3 emergency contacts for automated SOS alert dispatches.
  - Emergency rapid Zero-Barrier Guest session.
- **🏢 Civic Admin Gateway (Pune Municipal Corporation - PMC)**:
  - Streetlamp fault ticketing & infrastructure status monitoring.
  - Dark-spot density heatmaps for municipal electrical teams (Ward 12).
  - SDG-11 compliance analytics & citizen hazard verification.
- **🛡️ Suraksha Sahayak Gateway (Pune Police Damini Squad Liaison)**:
  - Emergency First Responder cockpit with real-time incident notifications.
  - Direct navigation to commuter distress coordinates for rapid dispatch.

### 3. 🚨 Emergency & Safe Havens Network
- **24/7 Verified Safe Shelters**: Instant 1-tap navigation to nearby Hospitals, Police Stations, Petrol Pumps, EV Stations, Temples, and 24-Hour Supermarkets.
- **Active Ride Shield**: Real-time corridor adherence tracking and cab verification for auto/taxi rides.
- **Emergency Roadway Hazards**: Instant citizen reporting for non-functional streetlights, waterlogging, or isolated stretches with community validation.
- **Nocturnal Weather Risk Engine**: Dynamic route safety penalties for nocturnal monsoon rains, severe waterlogging, and fog.

---

## 🏗️ Technology Stack

- **Frontend Core**: React 18, TypeScript, Vite
- **Mapping & Geo-Engine**: Leaflet, OpenStreetMap, Google Maps Satellite/Roads Hybrid Layers, Turf.js
- **Machine Learning**: Custom TreeSHAP Ensemble Feature Extractor (`mlSafetyModel.ts`)
- **Authentication**: Firebase Authentication (Google OAuth + Phone OTP) & Local Encrypted Offline Session Cache
- **UI Design System**: Vanilla CSS tokens, Lucide Icons, 8-Point Spatial Grid, WCAG AA Accessible

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Dhruvplaz-web/SurakshitPath.git
   cd SurakshitPath
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and provide your API keys:
   ```bash
   cp .env.example .env
   ```
   Required keys:
   - `VITE_FIREBASE_*`: Firebase Authentication config
   - `VITE_GEMINI_API_KEY`: Google Gemini AI safety assistant (optional)
   - `VITE_GROK_API_KEY`: xAI Grok civic analysis assistant (optional)

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🎯 UN Sustainable Development Goals (SDGs)
- **Goal 11**: *Sustainable Cities and Communities* — Enhancing inclusive, safe, and resilient urban public infrastructure.
- **Goal 5**: *Gender Equality* — Ensuring freedom of movement and safe mobility for women and vulnerable commuters at night.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
