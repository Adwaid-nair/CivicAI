# CivicAI — Full Build Task Checklist

> Starting from scratch. Each item maps to the implementation plan + stitch designs.

---

## Phase 1 — Foundation

### 1.1 Project Setup
- [x] Initialize Next.js 14 (App Router) + TypeScript frontend
- [x] Initialize Express.js backend
- [x] Setup Prisma ORM with PostgreSQL + PostGIS schema
- [x] Configure environment variables (.env files)
- [x] Setup project folder structure (as per implementation plan)

### 1.2 Design System & UI Shell
- [x] Global CSS: dark theme, glassmorphism, brand colors (cyan/purple accents), typography
- [x] Reusable UI primitives (buttons, cards, inputs, badges, modals)
- [x] TopNav component (logo, desktop nav links, user dropdown)
- [x] BottomNav component (role-based mobile navigation — different tabs per role)
- [x] Responsive layout wrapper (mobile-first)

### 1.3 App Entry & Onboarding
- [x] Onboarding slides (3 screens: `onboarding_report_with_ai`, `onboarding_earn_impact`, `onboarding_verified_transparency`)
- [x] Landing page (`civicai_landing_page` — hero, features grid, stats, CTA, footer)
- [x] **Home Selector Screen** (`civicai_home_selector` — the gateway asking "Report Issue" or "View Dashboard" as the first authenticated view)
- [x] Unauthenticated Guest Reporting (Citizens can report without an account, only need an account to track updates and rewards)
- [x] Issue Reporting Screen (Camera + Category Dropdowns)

### 1.4 Authentication System
- [x] Login page — 2 variants (`civicai_login_screen_1`, `civicai_login_screen_2`)
- [x] Registration page with role selector (`civicai_registration_screen`)
- [x] JWT auth (register, login, profile endpoints)
- [x] Auth middleware (JWT verify + role-based authorize)
- [x] Zustand auth store with persistence
- [x] Axios API client with JWT interceptor
- [x] Route guards (frontend) + API middleware (backend) for role-based access
- [ ] Google OAuth (stretch goal)

### 1.5 Database Schema & Migrations
- [x] Users table (with roles: citizen, official, contractor, worker, admin)
- [x] Reports table (with PostGIS geography, status flow, workflow path)
- [x] Report images table
- [x] Departments table
- [x] Workers table (skills, location, availability)
- [x] Worker assignments table
- [x] Agent actions log table
- [x] Bids table
- [x] Points ledger table
- [x] Status history table
- [x] Notifications table
- [ ] Performance indexes (GIST for geospatial, status, tracking_id, etc.)
- [x] Run Prisma migrations

---

## Phase 2 — Core Reporting

### 2.1 Camera-First Evidence Capture (Inline WebRTC)
- [ ] Inline camera viewfinder using `getUserMedia()` rendering a `<video>` stream **inside the webpage** — never launching native camera app
- [ ] Canvas-based photo capture (draw video frame to `<canvas>`, export as JPEG blob)
- [ ] Front/rear camera toggle (`facingMode: "environment"` / `"user"`)
- [ ] Flash/torch control via `ImageCapture` API
- [ ] Multi-photo capture (up to 10 photos) with scrollable thumbnail previews (`civicai_evidence_collection_2`)
- [ ] Photo full-screen preview with retake/delete option (`civicai_evidence_collection_3`)
- [ ] EXIF metadata: GPS coordinates + timestamp captured at shutter press
- [ ] AI scan overlay on viewfinder (cyan corner brackets + scan line animation) (`civicai_evidence_collection_1`)
- [ ] Video recording via `MediaRecorder` API for 360° panoramic evidence (stretch)
- [ ] Block all `<input type="file">` and gallery access — camera-only enforcement

### 2.2 Report Submission Form
- [x] Full report form page (`Report issue section` stitch)
  - [x] Photo evidence section (captured images)
  - [ ] **"Quick Sweep" Video** recording (180° pan for complex issues)
  - [x] Location verification with GPS auto-detect + manual adjust
  - [ ] **Proximity Duplicate Alert** (Checks DB within 50m while getting GPS lock)
  - [ ] Street View cross-check display (match percentage)
  - [ ] Description input (text)
  - [ ] **Voice-to-Text via Sarvam AI** (Support for multiple Indian languages) + **Tone Analysis** integration
  - [ ] Privacy notice (anonymization)
  - [ ] Submit to authority button
- [ ] Submission success screen (`submission_success_summary` — AI analysis summary, points earned, view status CTA)

### 2.3 AI Pipeline Integration (Gemini API)
- [ ] Image validation endpoint (reject non-infrastructure images)
- [ ] **Real-time Safety Warnings** (Live viewfinder danger detection overlay, e.g., "⚠️ DANGER DETECTED")
- [ ] Issue detection & classification (pothole, water leak, etc.)
- [ ] Severity assessment (Low / Medium / High / Critical)
- [ ] **Voice Tone Assessment** (Panicked audio = automatic CRITICAL severity)
- [ ] Location verification (GPS cross-check)
- [ ] Duplicate detection (PostGIS `ST_DWithin` within 200m) + **Dynamic Severity Escalation** if issue worsened
- [ ] Cost estimation (hidden base price for bidding benchmark)
- [ ] AI reporting screens (`civicai_ai_reporting_screen_1` — live analysis overlay, `civicai_ai_reporting_screen_2`)
- [ ] Structured JSON prompt templates for each AI stage

### 2.4 Report Storage
- [ ] Image upload to cloud storage (Cloudinary / S3)
- [x] Report creation API (AI analysis to be connected)
- [x] Tracking ID generation (e.g., `CIV-2026-A3X9`)
- [ ] Status history logging on creation

---

## Phase 3 — Smart Routing & AI Agents

### 3.1 Hybrid Workflow Router
- [ ] Smart router service: classify issue → agent path vs bidding path
  - Agent path: Electricity, Water, Drainage, Street Light
  - Bidding path: Road, Bridge, Building damage
- [ ] Jurisdiction detection (NHAI, PWD, Municipal Corp, etc.) from location + issue type
- [ ] Department mapping: `issue_type` × `state` × `district` → `department`

### 3.2 Agent 1 — Citizen Advocate Agent
- [ ] Auto-trigger on verified report routed to agent path
- [ ] Compose formal complaint using Gemini (with evidence, photos, severity)
- [ ] Send anonymous email to relevant authority (Nodemailer, `noreply@civicai.in`)
- [ ] Follow-up emails if no response within SLA
- [ ] Audit trail logging (email sent, timestamp, authority contacted)
- [ ] Complaint email template (`complaint-email.hbs`)

### 3.3 Agent 2 — Authority Operations Agent
- [ ] Evaluate issue requirements (skill type needed, materials)
- [ ] Worker matching by skill, proximity (PostGIS), and workload
- [ ] Generate AI recommendation card (worker name, distance, rating, est. time)
- [ ] Show recommendation on Authority Dashboard for approval
- [ ] On "Assign" click → execute assignment, notify worker
- [ ] Progress monitoring (check-in, duration, completion)
- [ ] Auto-escalate if worker doesn't respond within 1 hour or SLA at risk
- [ ] Completion verification trigger (worker submits photo → AI verifies fix)

### 3.4 SLA Tracking & Escalation
- [ ] SLA deadline calculation based on severity tier
  - Critical: 2h response / 48h resolution
  - High: 12h / 7 days
  - Medium: 24h / 14 days
  - Low: 48h / 30 days
- [ ] Cron-based SLA monitor (agent scheduler)
- [ ] Auto-escalation to supervisor on breach

### 3.5 Notification System
- [ ] Notifications table + API endpoints (list, mark read)
- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] Email notifications (Nodemailer)
- [ ] Trigger notifications for all events (see Module 11 in plan)

---

## Phase 4 — Dashboards, Bidding & Workers

### 4.1 Citizen Dashboard
- [ ] Citizen home (`civicai_citizen_dashboard` — welcome, stats cards, recent reports)
- [ ] Global Filters across all dashboard views (State, District, Problem Category)
- [ ] My Reports list with status badges
- [ ] Issue lifecycle tracking (`civicai_issue_lifecycle_tracking` — status timeline)

### 4.2 Authority Dashboard (Officials)
- [ ] Authority dispatch board (`civicai_authority_dispatch_board` — issue queue, AI agent recommendations, approve dispatch)
- [ ] Official impact dashboard (`civicai_official_impact_dashboard` — city health score, active issues, repairs done, contractor bids, budget allocation)
- [ ] City health heatmap (`civicai_city_health_heatmap` — full map view with search, filters, layers, AI insights)
- [ ] Global Filters across all dashboard views (State, District, Problem Category)
- [ ] Worker/crew management
- [ ] Bulk actions for high-volume periods
- [ ] SLA alert badges

### 4.3 Contractor Bidding System
- [ ] Bid submission screen (`civicai_bid_submission_screen`)
- [ ] Contractor selection screen (`civicai_contractor_selection` — AI recommended, AI score, bid amount, completion time, assign)
- [ ] Contractor performance analytics (`civicai_contractor_performance_analytics`)
- [ ] Hidden base price comparison (officials only)
- [ ] Transparency score (bid history + completion rate)
- [ ] Contract awarded notification flow

### 4.4 Worker Panels
- [ ] Worker task interface (`civicai_worker_task_interface` — active job, map, AI analysis, start work, next queue)
- [ ] Field task panel (`civicai_field_task_panel` — on-site task details)
- [ ] **GPS Turn-by-Turn Navigation** (Integrate with Google Maps/Apple Maps via capacitor to guide worker directly to the exact GPS coordinates of the issue)
- [ ] Work verification screen (`civicai_work_verification_screen` — before/after photo submission)
- [ ] Worker earnings dashboard (`civicai_worker_earnings_dashboard`)
- [ ] Worker check-in (GPS), complete task, toggle availability APIs

### 4.5 Public Transparency
- [x] Transparency dashboard (`civicai_transparency_dashboard` — live civic tracker, KPI cards, map, recent reports)
- [ ] **Dual Tab Interface** (Active Issues vs. Resolved Issues)
- [ ] City map view (`civicai_city_map_view` — heatmap with color-coded pins)
- [ ] **City Health Score** visualization (by District)
- [ ] **Follow Issue** button (subscribe to push notifications for community issues)
- [ ] Detailed Workflow Tracker (public search by tracking ID → full status timeline)
- [ ] **Before & After Interactive Sliders** (for resolved issues)
- [ ] Agent activity log (public, anonymized)
- [ ] **Local Heroes Leaderboard** (top workers/contractors)

### 4.6 Community & Social
- [ ] Community social feed (`civicai_community_social_feed` — before/after comparisons, AI impact summary, upvotes, comments, share)

---

## Phase 5 — Gamification, Profile & Polish

### 5.1 Points & Reputation System
- [ ] Points ledger (submit +10, verified +15, resolved +25, upvote +5, spam -20, streak +50)
- [ ] Level system (Newcomer → Active Citizen → Community Champion → Civic Hero → Legend)
- [ ] Leaderboard (top citizens, opt-in)

### 5.2 Profile & Achievements
- [ ] Profile page (`civicai_profile_achievements` — avatar, level, XP bar, stats, achievements/badges, settings links)
- [ ] Achievement badges (Pothole Hunter, Night Watchman, Fast Responder, etc.)
- [ ] My Impact Report section

### 5.3 Settings & Help
- [x] Settings & notifications (`civicai_settings_notifications`)
- [ ] Help & FAQ center (`civicai_help_faq_center`)

### 5.4 Audit & Admin
- [ ] Final project audit screen (`civicai_final_project_audit`)
- [ ] Admin panel (manage users, roles, view all data)

### 5.5 PWA Setup
- [ ] Web App Manifest (icons, theme, splash screen)
- [ ] Service Worker (offline caching, background sync)
- [ ] Offline report queue (capture now, submit when online)
- [ ] Install prompt ("Add to Home Screen")

### 5.6 Multi-Language
- [ ] Hindi + 2 regional languages

### 5.7 Performance & Testing
- [ ] Unit tests (Jest — backend services)
- [ ] API tests (Supertest — all endpoints)
- [ ] Frontend tests (React Testing Library — critical components)
- [ ] E2E tests (Playwright — full user flows)
- [ ] Performance optimization

---

## Phase 6 — Capacitor Native App

- [ ] Capacitor project setup (Android + iOS)
- [ ] Native camera plugin (`@capacitor/camera`)
- [ ] Native geolocation (`@capacitor/geolocation`)
- [ ] Native push notifications (`@capacitor/push-notifications`)
- [ ] Deep linking
- [ ] Build & publish to Google Play Store
- [ ] Build & publish to Apple App Store
