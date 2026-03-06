# CivicAI — Project Abstract

## AI-Powered Civic Infrastructure Reporting & Resolution Platform

Urban infrastructure decay remains one of the most persistent challenges facing Indian cities, with millions of civic complaints — potholes, water leaks, broken streetlights, damaged roads — filed annually yet resolved at abysmally low rates. The core problem is not a lack of citizen awareness but a broken pipeline between reporting, verification, routing, and resolution. Traditional complaint portals rely on manual classification, opaque tracking, and zero accountability, leading to citizen fatigue and administrative bottleneck.

**CivicAI** addresses this end-to-end by introducing an AI-driven civic reporting platform that transforms how infrastructure issues are reported, validated, routed, and resolved.

### How It Works

A citizen captures a photo of an infrastructure issue through a **camera-first mobile interface** (no gallery uploads — ensuring authenticity). The image is immediately processed through a **multi-stage AI pipeline powered by Google Gemini**, which performs:

1. **Image Validation** — Rejecting non-infrastructure or manipulated images
2. **Issue Classification** — Identifying the type (pothole, water leak, electrical fault, etc.)
3. **Severity Assessment** — Assigning priority (Critical → Low) based on visual analysis
4. **Location Verification** — Cross-referencing GPS coordinates with Street View data
5. **Duplicate Detection** — Using PostGIS geospatial queries to flag nearby existing reports
6. **Cost Estimation** — Generating a hidden AI-estimated repair cost as a bidding benchmark

### The Hybrid Workflow

CivicAI introduces a **smart routing engine** that classifies verified issues into one of two resolution paths:

- **Agent Path** (for government-handled issues like electricity, water, drainage): Two AI agents — a *Citizen Advocate Agent* that composes and sends formal complaints to the correct authority, and an *Authority Operations Agent* that recommends the best-matched field worker based on skill, proximity, and workload. Authorities simply review and approve the AI's recommendation.

- **Bidding Path** (for construction-heavy issues like roads, bridges): The issue is opened for **transparent contractor bidding**, where contractors submit bids evaluated against the AI's hidden cost estimate. An AI scoring system ranks bids by cost, contractor reputation, completion time, and material quality.

### Key Differentiators

| Feature | Traditional Portals | CivicAI |
|---------|-------------------|---------|
| Reporting | Text-based forms | Camera-first with AI validation |
| Classification | Manual by clerks | Automated by Gemini AI |
| Routing | Random assignment | AI-matched by skill, location, workload |
| Accountability | Opaque | Public transparency dashboard + heatmaps |
| Citizen Engagement | None | Gamified points, leaderboards, achievements |
| Contractor Selection | Political/manual | AI-scored transparent bidding |
| Verification | Self-reported | AI before/after photo comparison |

### Technology Stack

- **Frontend**: Next.js 14 (PWA) — mobile-first, glassmorphism dark UI
- **Backend**: Node.js + Express.js with RESTful APIs
- **AI Engine**: Google Gemini API (multimodal image + text analysis)
- **Database**: PostgreSQL with PostGIS for geospatial queries
- **Maps**: Leaflet + OpenStreetMap for heatmaps and issue visualization
- **Notifications**: Firebase Cloud Messaging + Nodemailer

### Impact & Vision

CivicAI transforms passive civic complaint systems into an **intelligent, transparent, and gamified platform** where every reported issue is validated, tracked, and resolved with full public accountability. By automating the entire pipeline — from photo capture to contractor payment certification — it eliminates bureaucratic delays, reduces corruption in contractor selection, and empowers citizens to actively participate in city governance.

The platform serves five distinct user roles — **Citizens, Government Officials, Field Workers, Contractors, and the General Public** — each with tailored interfaces designed for their specific workflows.

> *"Your city's problems, solved by AI. Verified by transparency. Powered by citizens."*
