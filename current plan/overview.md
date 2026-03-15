# CivicAI — Project Overview

## 🌟 Mission
CivicAI is an AI-powered platform designed to revolutionize civic infrastructure reporting and resolution in Indian cities. By bridging the gap between citizens and authorities through a transparent, AI-driven pipeline, we aim to ensure that every pothole, water leak, and damaged streetlight is reported, validated, and fixed with accountability.

## 🚀 Key Innovation: The Hybrid Smart Workflow
Unlike traditional complaint portals, CivicAI uses a **dual-path resolution system** powered by Google Gemini:
1.  **🤖 Agent Path (Authority-Led):** For issues like water, electricity, and drainage. AI agents compose formal complaints to authorities and recommend the best-matching workers based on skill and proximity.
2.  **🏗️ Bidding Path (Contractor-Led):** For construction-heavy repairs like roads and bridges. The platform opens transparent bidding where contractors compete, evaluated against hidden AI benchmark costs.

## 📱 Core Features
-   **Camera-First Reporting:** Inline WebRTC camera capture ensures authenticity (no gallery uploads).
-   **Gemini AI Pipeline:** Multi-stage analysis for image validation, issue classification, severity assessment, and cost estimation.
-   **Public Transparency Dashboard:** Live heatmaps, city health scores, and before/after repair sliders.
-   **Gamified Civic Impact:** Citizens earn reputation points and badges for verified reports and community contributions.
-   **Voice-to-Text Multi-Language Support:** Integration for regional Indian languages.

## 🛠️ Technology Stack
-   **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, Leaflet.
-   **Backend:** Node.js, Express.js, Prisma ORM.
-   **Database:** PostgreSQL + PostGIS (Geospatial queries).
-   **AI:** Google Gemini (Analysis & Agents), Sarvam AI (Voice).
-   **Storage:** ImageKit (Evidence hosting).

## 📅 Roadmap Summary
-   **Phase 1 — Foundation:** Core architecture, auth, and database setup. [COMPLETED]
-   **Phase 2 — Core Reporting:** AI camera module and submission flow. [IN PROGRESS]
-   **Phase 3 — Smart Routing:** AI Agents and horizontal department mapping.
-   **Phase 4 — Dashboards & Bidding:** Authority interfaces and contractor systems.
-   **Phase 5 — Gamification & PWA:** Points, leaderboards, and offline support.
-   **Phase 6 — Native Mobile:** Capacitor wrappers for iOS and Android.
