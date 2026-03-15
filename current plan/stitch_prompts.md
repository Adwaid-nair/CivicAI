# CivicAI — Stitch UI Prompts

> Use these prompts in Stitch to regenerate / recreate every screen. Each prompt is designed to produce a mobile-first (375×812) dark-themed UI.
>
> **Global Design Language**: Dark navy background (#0a0e1a to #111827), glassmorphism cards with semi-transparent borders, cyan (#00e5ff) and purple (#7c3aed) accent colors, green (#10b981) for success states, white text, rounded corners (16px), Inter/SF Pro font family.

---

## 1. Onboarding

### 1.1 — Onboarding: Report with AI

```
Design a mobile onboarding screen (375x812) for a civic reporting app called "CivicAI". Dark navy-black background (#0a0e1a). 

Center a large rounded-corner card (glassmorphism, light gray with subtle transparency) showing a 3D-rendered smartphone lying at an angle on a surface. The phone screen displays a pothole being scanned with a red laser line across it, giving a futuristic AI-scanning look.

Below the image card, display the heading "Report with AI Intelligence" in bold white text (28px). Below it, a lighter gray subtext: "Snap a photo and let our AI analyze, verify, and route the issue to the right authorities in seconds."

At the top center, show 3 pagination dots — the first one is an active cyan (#00e5ff) elongated bar, the other two are small gray circles.

At the bottom, a full-width "Continue" button with a gradient from purple-blue (#6366f1) on the left to cyan (#00e5ff) on the right, white bold text, large rounded corners (28px pill shape).

No header, no skip button on this first slide.
```

### 1.2 — Onboarding: Verified Transparency

```
Design a mobile onboarding screen (375x812) for "CivicAI". Dark navy-black background (#0a0e1a) with a subtle cyan (#00e5ff) thin glowing border/outline around the entire screen edge.

Center a large square-ish card with multiple layered glassmorphism rectangles (3D depth effect — a lighter gray rounded rectangle behind a slightly smaller one, behind another). In the innermost card center, show a green (#10b981) verified badge icon — a starburst/rosette shape with a white checkmark inside. The badge should glow subtly green.

Below the image, heading: "Verified Transparency" in bold white (28px). Subtext in light gray: "Track every step of the repair process with real-time AI verification and public accountability maps."

Pagination dots at the bottom center — 3 dots, the middle one is an active cyan elongated bar.

At the bottom, a full-width "Continue →" button with a gradient from purple (#7c3aed) to cyan (#00e5ff), white bold text, pill-shaped.

No header or skip button on this slide.
```

### 1.3 — Onboarding: Earn Points, Make Impact

```
Design a mobile onboarding screen (375x812) for "CivicAI". Dark background (#0a0e1a).

Top-left: "CivicAI" in white bold text. Top-right: "Skip" link in green (#10b981) text.

Center a large circular frame with a dark interior. Inside the circle, show a 3D-rendered golden trophy/cup with gold coins scattered around its base. The trophy sits on a small pedestal/platform. A subtle green glow emanates behind the circle.

Below the circle, heading: "Earn Points, Make Impact" in bold white (28px). Subtext in light gray: "Join the Elite Citizen leaderboard, earn points for every verified report, and help build a better city for everyone."

Pagination dots — 3 dots, the last/third one is an active green (#10b981) elongated bar.

At the bottom, a full-width "Get Started" button in solid bright green (#10b981), black bold text, large pill-shaped corners (28px). Subtle green glow/shadow around the button.
```

---

## 2. Landing Page

### 2.1 — Landing Page

```
Design a mobile landing page (375x812, scrollable) for "CivicAI" civic reporting app. Dark navy background (#0a0e1a).

TOP NAV: Horizontal bar with a green dot + "CivicAI" logo on the left, "Login" text link and a cyan "Sign Up" pill button on the right.

HERO SECTION: A small green pill badge "⚡ AI-Powered Civic Platform" at the top. Then a large bold heading in white: "Report." followed by "AI Analyzes." in cyan/gradient text, and "Authority Acts." on the next line. Subtext in gray: "Transform your city with automated infrastructure reporting and smart emergency dispatch." Below, two buttons stacked: a large cyan gradient "Get Started →" pill button, and below it a white-outlined "View Dashboard" pill button.

STATS ROW: Three columns — "REPORTED 2,481" | "RESOLVED 1,902" | "CITIZENS 12.5k" — white bold numbers, gray labels above.

HOW IT WORKS SECTION: Heading "How CivicAI Works" with a gray subtext. Then 6 feature cards stacked vertically, each in a glassmorphism dark card with a subtle border:
1. Purple camera icon → "Camera-First Reporting" + description
2. Green brain/circuit icon → "AI-Powered Analysis" + description
3. Blue arrow/routing icon → "Smart Routing" + description
4. Yellow lightning icon → "Automated Dispatch" + description
5. Pink/red bid icon → "Transparent Bidding" + description
6. Purple trophy icon → "Civic Points" + description

CTA SECTION: A large dark-blue/purple card with white text: "Your City Needs You" heading, subtext about joining, and a "Download CivicAI" dark pill button.

FOOTER: "CivicAI" logo centered, with "Privacy | Terms | Security | Contact" links and a copyright line below.
```

---

## 3. Authentication

### 3.1 — Login Screen (Variant 1 — Glassmorphism Card)

```
Design a mobile login screen (375x812) for "CivicAI". Dark navy background (#0a0e1a).

Center a large glassmorphism card (semi-transparent dark card with a subtle light border, rounded corners 20px). Inside the card:

- A rounded-square blue-purple gradient app icon with a white shield logo at the top center
- "Welcome back" in bold white text (24px)
- Gray subtext: "Sign in to continue reporting civic issues"
- "EMAIL" label in uppercase small gray text, then a glassmorphism input field with a mail icon and placeholder "name@example.com"
- "PASSWORD" label with a "Forgot?" link in purple on the right side. Password input field with a lock icon, dot-masked text, and an eye toggle icon on the right
- "Sign In →" button with a gradient from purple (#7c3aed) to cyan (#00e5ff), full-width, white bold text, pill-shaped
- Below: "Don't have an account? Create one" — the "Create one" part in purple

Below the card, two social login circle buttons: a Google icon and an Apple icon, both in dark outlined circles.
```

### 3.2 — Login Screen (Variant 2 — With Reports)

```
Design a mobile login screen (375x812) for "CivicAI". Dark navy background.

Top area shows a greeting: "Hello, Alex" with the user's avatar (circular), a green online dot, and a golden "ELITE CITIZEN" badge. A notification bell icon on the right.

Below: two glassmorphism stat cards side by side — "24 Total Reports" (with a purple clipboard icon) and "18 Issues Resolved" (with a green checkmark icon).

"Your Recent Reports" section heading with a "See All" link. Below, 3 report cards stacked, each a glassmorphism card with:
- A small thumbnail image on the left
- Report title ("Pothole on Main St."), time ago ("2h ago"), and a colored status badge ("AI Analyzing" in blue, "In Progress" in orange, "Resolved" in green)
- Chevron arrow on the right

Floating action button (FAB): cyan/blue circle with a "+" icon, bottom-right.

Bottom nav bar: 4 tabs — Home (house, active), Reports (document), Map (bookmark), Profile (person). Active tab highlighted in cyan.
```

### 3.3 — Registration Screen

```
Design a mobile registration screen (375x812) for "CivicAI". Dark navy-purple gradient background.

Top center: A rounded-square purple app icon with a white shield-heart logo. Below: "Join CivicAI" in bold white (24px) and gray subtext: "Create your account to start reporting".

A glassmorphism card with the form fields:
- "Full Name" label, white rounded input with placeholder "John Doe"
- "Email Address" label, white rounded input with placeholder "name@example.com"
- "Phone Number" label, white rounded input with placeholder "+1 (555) 000-0000"
- "Password" label, white rounded input with dot-masked text and an eye toggle icon

"Register as" section with two selectable pill buttons side by side:
- "🏠 Citizen" (selected — purple outline/fill)
- "🏗️ Contractor" (unselected — gray outline)

"Create Account →" button: full-width purple (#7c3aed) gradient, white bold text, pill-shaped.

Below: "Already have an account? Sign in" — "Sign in" in purple.
```

---

## 4. Citizen Flow

### 4.1 — Citizen Dashboard

```
Design a mobile citizen dashboard (375x812) for "CivicAI". Dark navy background (#0a0e1a).

Top: User avatar (circular) with "WELCOME BACK" small label and "Hi, Adwai 👋" in bold white. On the right, a purple pill badge "🌱 Newcomer". Below: "Ready to make your city better?" in gray.

Main CTA card: A large glassmorphism card with a purple camera icon, heading "Report an Issue", subtext "Help your community by reporting local infrastructure needs.", and a purple circle arrow button on the right.

Four stat cards in a 2×2 grid, each glassmorphism:
- "0 My Reports" with an orange warning triangle icon
- "0 Resolved" with a green checkmark circle icon
- "0 In Progress" with a cyan clock icon
- "0 Civic Points" with a purple trophy icon

"Recent Reports" section: Empty state — a glassmorphism card with a dashed border, a gray "no camera" icon, "No reports yet" heading, "Your city is waiting for your contribution!" subtext, and a purple "Report Your First Issue" pill button.

Bottom nav: 4 tabs — Home (house, active with cyan dot), Camera, Map (bookmark), Profile (person). Dark bar with icons.
```

### 4.2 — Evidence Collection Step 1 (AI Camera View)

```
Design a mobile camera/reporting screen (375x812) for "CivicAI". Dark background.

Header: "Report Issue" centered, back arrow left. The camera viewfinder takes up most of the screen showing a pothole photo. Overlaid on the image at top-left: "Analyzing..." label in a glassmorphism pill, and next to it "Detected: Pothole (89%)" in a green-accented pill with a checkmark.

The photo has cyan corner brackets/crop marks overlaid (AI scanning effect).

Below the image: three data columns — "SEVERITY: High (P3)" in red, "ESTIMATED SIZE: 1.2m Diameter" in white, "STATUS: 📡 GPS Locked" in cyan.

Location text: "📍 45 Main St, Central District"

Bottom controls: Three buttons in a row — a grid icon (left), a large cyan-glowing circle camera shutter button (center), and a lightning bolt icon (right).
```

### 4.3 — Evidence Collection Step 2 (Multi-Photo)

```
Design a mobile evidence capture screen (375x812) for "CivicAI". Dark background.

Header: Back arrow + "Report an Issue" + green "CivicAI Core" badge on the right.

"PHOTO EVIDENCE" section header with "4/10 Captured" in green on the right. Large camera viewfinder showing a street/pothole scene. Camera metadata overlay: "RAW 12MP", "f/1.8 1/120s ISO100". Three small button icons at bottom of viewfinder: flash, shutter (large center), and lens switch.

Below viewfinder: A horizontal row of circular thumbnail previews of captured photos (3 filled + an "ADD" camera icon button with dashed border).

"360 PANORAMIC VIDEO" section: a recording indicator "● 00:12 / 00:30" in red, a gradient progress bar (cyan-to-pink), and a "● Stop Recording" button. Small helper text: "Rotate slowly to capture full 360-degree context."

"LOCATION VERIFICATION" section: Green pin icon, "852 Market Street, San Francisco" in bold white, "HIGH ACCURACY" green badge, coordinates in gray.

"STREET VIEW CROSS-CHECK" section: A historical street view image with "HISTORICAL REF: 2023-OCT" label and a "MATCH: 98.4%" green badge. "🔗 STREET VIEW ARCHIVE" label on the image.

"DESCRIPTION" section: Text input with "Voice Type ●" green badge on the right. Placeholder: "Describe the issue in detail or use Voice Type..."

Privacy notice: Yellow shield icon + "Your report will be anonymized before submission..." text in a bordered card.

Bottom: Full-width green gradient "SUBMIT TO AUTHORITY ➤" button.
```

### 4.4 — Evidence Collection Step 3 (Review)

```
Design a mobile evidence review/report form screen (375x812) for "CivicAI". Dark background.

Similar layout to the evidence collection screen but focused on the report form with all sections filled. Show the captured photo evidence at top, photo thumbnails, 360 video section, location verification with GPS and Street View cross-check, description field with voice type option, privacy notice, and the green "SUBMIT TO AUTHORITY" button at the bottom.

Same dark theme, glassmorphism cards for each section, cyan/green accent colors.
```

### 4.5 — AI Reporting Screen 1 (Live Analysis)

```
Design a mobile AI analysis screen (375x812) for "CivicAI". Dark background.

Header: Back arrow + "Report Issue" centered.

Full-screen photo of a large pothole filling most of the screen. Overlaid on the photo:
- Top-left: "Analyzing..." glassmorphism pill (sparkle icon)
- Top-right: "Detected: Pothole (89%)" green-accented pill with green checkmark
- Cyan corner bracket overlays at all 4 corners (AI scanning frame effect)
- A cyan horizontal scan line across the image

Below the photo in a glassmorphism card, three columns:
- "SEVERITY" label → "High (P3)" in red/orange
- "ESTIMATED SIZE" label → "1.2m Diameter" in white
- "STATUS" label → "📡 GPS Locked" in cyan

Location: "📍 45 Main St, Central District"

Bottom: Grid icon, large glowing cyan camera shutter button (center), lightning bolt icon.
```

### 4.6 — AI Reporting Screen 2 (Reports Approval — Official View)

```
Design a mobile reports approval screen (375x812) for "CivicAI". Dark navy background.

Header: "Reports Approval" in bold white, filter icon top-right.

Two report cards stacked vertically, each in a glassmorphism card with border:

Card 1:
- Top row: "STRUCTURAL DAMAGE" cyan pill badge + "AI CONFIDENCE: 98%" green pill with checkmark
- Two images side by side: "User Capture" (pothole photo) and "Street View Reference" (same location from street view)
- "Severe Pothole Cluster" heading, "📍 852 Market Street, San Francisco, CA"
- "AI Summary:" in red accent label, followed by description text in white
- Two buttons at bottom: "Reject" (outlined red/pink) and "Approve & Open Bidding" (solid green/cyan pill)

Card 2: Similar structure with "ELECTRICAL" cyan badge + "AI CONFIDENCE: 94%" green badge. Different photos showing a damaged power pole. Title "Damaged Smart Pole #402", different location, AI summary, same Reject/Approve buttons.

Bottom nav: Dashboard, Reports (active, purple), Bids, Settings — 4 tab icons.
```

### 4.7 — Submission Success Summary

```
Design a mobile submission success screen (375x812) for "CivicAI". Dark navy background with a subtle map texture visible in the bottom half.

Header: back arrow + "CivicAI" centered.

Center top: A large green rounded-square icon with a white shield + checkmark inside. A smaller green circle checkmark overlaps at bottom-right. Below: "Report Submitted!" in bold white (28px) and "AI is now verifying your evidence." in green text. Then "Report ID: #CAI-9823" in gray.

"AI ANALYSIS SUMMARY" glassmorphism card:
- "Photo Verification" → "Verified ✓" in green, with a green progress bar at 100%
- "360° Panorama Match" → "94% Accuracy" in a purple progress bar
- "Street View Cross-Check" → "Confirmed ✓" in green with full green bar

Below: A purple trophy/badge icon + "You earned +50 Civic Points!" in bold cyan/green text.

Two buttons stacked:
- "View Status" — large purple (#7c3aed) solid pill button, white text
- "Back to Dashboard" — outlined/ghost button, white text
```

### 4.8 — Issue Lifecycle Tracking

```
Design a mobile issue tracking screen (375x812) for "CivicAI". Dark navy background.

Header: Back arrow + "Issue #CAI-9823" centered.

Below header: A cyan pill badge "🔄 IN PROGRESS" with cyan border.

Vertical timeline in a glassmorphism card, with green circles and connecting vertical lines:
1. ✅ "Reported" — "Verified by AI at 10:24 AM" (green checkmark, completed)
2. ✅ "Authority Approved" — "Reviewer: Commissioner Sarah" (green, completed)
3. ✅ "Contractor Assigned" — "EcoRoads Ltd" (green, completed)
4. 🔧 "Work in Progress" — "Estimated Completion: 2 days" (cyan, active, pulsing icon)
5. ○ "Final Audit" — grayed out (pending)

"Evidence & Proof" section: Two photos side by side — "Original Report" (pothole photo) and "Current Status" (construction cones photo).

"Community Support" glassmorphism card: Clapping hands icon, "42 Citizens clapping", purple "Follow" button on the right.

Bottom: Full-width outlined button "✉ Contact Ward Officer".
```

---

## 5. Authority / Official Dashboards

### 5.1 — Authority Dispatch Board

```
Design a mobile authority dispatch screen (375x812) for "CivicAI". Dark navy background.

Header: Shield icon + "Authority Dispatch" in bold cyan, notification bell (with red dot) top-right. Subtext: "Municipal Corporation Issue Queue".

Status pills row: "● System Live" (green dot), "● AI Agents Active" (blue dot), "⚙ High Prior..." (filter icon) — horizontal scrollable.

Two issue dispatch cards stacked:

Card 1: "ID: #CVK-9821" + "Pending Assignment" yellow badge. A thumbnail photo next to "123 Elm Street, District 4" heading. Quoted description in italic: "Massive pothole causing severe traffic disruption...". Reporter: "Sarah J. • 12 mins ago".
AI recommendation sub-card (darker glassmorphism): "🤖 AI AGENT ALPHA" header, "Dispatch Recommendation: Assign to Roadworks Unit 3 (John Doe). Proximity: 1.2km • Skill Match: 95% • Est. Time: ~2h."
Green "✅ Approve Dispatch" full-width button.

Card 2: Similar layout — "#CVK-9822", different photo, "Oak Ave & 5th St." with a red severity dot. AI AGENT BETA recommends Forestry Div B. Same green approve button.

Bottom text: "🔄 Syncing live updates..."

Bottom nav: Dash, Queue (active), Crews, Profile — 4 tabs.
```

### 5.2 — Official Impact Dashboard

```
Design a mobile official dashboard (375x812) for "CivicAI". Dark navy background.

Top: Commissioner avatar + "Good Morning, Commissioner" in bold white. Bell icon right.

"CITY HEALTH SCORE" glassmorphism card: Text on left, large cyan circular progress ring on right showing "84%".

Horizontally scrollable stat cards (showing 2.5 cards): "Active Issues ⚠ 142" (cyan border, orange icon), "Repairs Done ✅ 1,024" (green border), and a partially visible "Em..." card.

"Critical Infrastructure Map" heading + "Expand ↗" link. A dark map section showing red and orange heat dots representing high-priority areas. "● High Priority" legend.

"Recent Contractor Bids" section: Two glassmorphism cards:
- "Main St. Water Main Repair" — "Lowest Bid: $45,200" in cyan, "AI CONFIDENCE 92%" green badge
- "Downtown LED Upgrade" — "Lowest Bid: $12,850" in cyan, "AI CONFIDENCE 78%" yellow badge
"View All Pending Bids" link in cyan.

"Budget Allocation" section: A donut chart with "Q3" in center. Legend: Roads 45% (cyan), Water 30% (blue), Lighting 15% (orange), Waste 10% (gray).

Bottom nav: Dashboard (active, blue), Reports, Bids, Settings — 4 tabs.
```

### 5.3 — City Health Heatmap

```
Design a mobile city map screen (375x812) for "CivicAI". Dark background.

Top: Search bar with magnifying glass "Search districts, streets..." Horizontal filter pills below: "All Issues" (active, cyan), "Roads", "Water", "Lighting".

Full-screen map view (Google Maps / OSM style) showing a city (Chicago). Map has purple circular markers at various locations representing reported issues. Right side floating controls: +/− zoom buttons, location crosshair button, "📅 30 Days" filter button, "◆ Layers" button.

Bottom sheet (draggable, partially visible): "✨ AI Insights" heading with "VIEW ALL" link. Horizontally scrollable insight cards:
- "📈 ALERT: Road issues increased by 15% in the North District over the past week."
- Partially visible second card about outages.

Bottom nav: Map (active), Reports, Bids, Settings — 4 tabs.
```

### 5.4 — City Map View (Public)

```
Design a similar full-screen map view screen for the public-facing city map. Same layout as the heatmap but styled for public access without the official bottom nav. Show the map with issue markers, search, and category filter pills.
```

---

## 6. Contractor Flow

### 6.1 — Available Projects (Contractor Home)

```
Design a mobile contractor projects screen (375x812) for "CivicAI". Dark navy background.

Header: "Available Projects" in bold white, filter icon top-right.

Two project cards stacked, each in a glassmorphism card:

Card 1: "ROAD REPAIR" cyan pill badge + "● URGENCY: HIGH" red badge. Large pothole photo below. "Severe Pothole Cluster - Lane 2" heading, description text, "📍 852 Market Street, San Francisco, CA". "AI Estimated Cost" label with "$450 - $600" in red/orange. Full-width purple "Bid Now" pill button.

Card 2: "ELECTRICAL" cyan badge + "● URGENCY: HIGH" red badge. Street photo with "AI Verified" green badge overlay. "Damaged Smart Pole #402" heading, description text, different location. "AI Estimated Cost $1,200 - $1,550" in red. Same "Bid Now" button.

Bottom nav: Home (active), My Bids, Map, Profile — 4 tabs.
```

### 6.2 — Bid Submission Screen

```
Design a mobile bid submission form (375x812) for "CivicAI". Dark teal-navy background.

Header: "< Back" in cyan, "Submit Project Bid" centered.

Issue summary card (glassmorphism with teal border): Small photo thumbnail, "ISSUE SUMMARY" label in red, "High Urgency" red badge, "Pothole Repair - MG Road", "ID: #CIV-882 • 0.4 miles away".

"Smart Quote Assistant" toggle card: Sparkle icon, "Auto-fill using AI photo analysis", toggle switch (on).

Form fields:
- "YOUR BID AMOUNT": Input showing "$ 1250.00 USD" in a glassmorphism bordered field
- "ESTIMATED COMPLETION TIME": Dropdown showing "1 Day" with chevron
- "MATERIALS & EQUIPMENT": Textarea with sample text "Standard asphalt cold patch, traffic cones, tamping tool, and 2-person crew."

"FINANCIAL BREAKDOWN" card: "Subtotal Bid: $1,250.00", "Platform Fee (2%): -$25.00" in red, "Net Payout: $1,225.00" in cyan.

Bottom: "▶ Confirm & Submit Bid" gradient button (purple to cyan), full-width.
```

### 6.3 — Contractor Selection (Official View)

```
Design a mobile contractor selection screen (375x812) for "CivicAI". Dark navy background.

Header: Back arrow + "Select Contractor" centered, "Main St Pothole Repair" subtext.

Info bar: Wrench icon + "Infrastructure Project" + "Budget: $500 • Timeline: ASAP".

Three contractor cards stacked:

Card 1 (Recommended — highlighted with green border): "✨ AI RECOMMENDED" green label. "BuildRight Corp" bold, "4.8 ★ (124 reviews)". Two stat boxes: "Bid Amount: $420" (green) and "AI Score: 96/100" (green). "⏱ Completion: 2 days", "🔧 Asphalt Paver, Roller". Green "✅ Assign Project" full-width button.

Card 2: "CityPave LLC", "4.5 ★ (89 reviews)". Bid $450, AI Score 88/100. 3 days, Standard Paver. Gray outlined "Assign Project" button.

Card 3: "Apex Roadworks", "4.2 ★ (45 reviews)". Bid $390, AI Score 76/100. 4 days, Basic Equipment. Gray outlined button.

Bottom nav: Dashboard, Projects (active), Bids, Profile.
```

### 6.4 — Contractor Performance Analytics

```
Design a mobile contractor insights screen (375x812) for "CivicAI". Dark navy background.

Header: Back arrow + "Contractor Insights" centered.

Dropdown: "EcoRoads Ltd" with a chevron.

Company card: Circular dark logo + "EcoRoads Ltd" heading, "📍 Platinum Vendor" in cyan badge.

Four stat cards (2×2 grid): "⏱ Avg. Repair Time: 1.8 days", "🏗 Material Quality: 94%" (green), "✅ AI Verification: 99%" (green), "💰 Budget Adherence: 102%" (yellow).

"Performance Trends" card: "6 Months" cyan badge. "96.5% Avg" large text. A cyan line graph showing performance over JAN-JUN with fluctuations.

"Recent Project Audits" list:
- "Main St Potholes" — "Completed 2 days ago" — "Pass" in green
- "Elm Ave Resurfacing" — "Completed 1 week ago" — "Pass" in green
- "Oak St Sidewalks" — partially visible — "Needs Review"

Two buttons: "📝 Review Contractor" (cyan solid) and "⬇ Export Report" (outlined).
```

### 6.5 — Active Projects (Contractor Dashboard)

```
Design a mobile active projects screen (375x812) for "CivicAI". Dark teal-navy background.

Header: "Active Projects" bold white, notification bell right.

Tab bar: "In Progress" (active, cyan underline), "Pending", "Completed".

Two project cards:

Card 1: "Streetlight Repair - Brigade Rd" + "Urgent" orange badge. "Completion: 75%" with cyan progress bar. Map thumbnail + "⏱ Days Remaining: 2" in orange. Description text. Three action buttons: "📷 Upload Proof" (outlined cyan), "Details" (outlined gray), phone icon button.

Card 2: "Pothole Filling - MG Road" + "Standard" gray badge. "Completion: 30%" with cyan progress bar. Map thumbnail + "⏱ Days Remaining: 5". Description text. Same three action buttons.

"UPCOMING DEADLINES" section: Two small cards — "⚠ Tomorrow: Park Bench Repair" (orange-bordered) and "📅 In 3 Days: Sidewalk Leveling" (gray-bordered).

Bottom nav: Home (active), My Bids, Map, Profile.
```

---

## 7. Worker Flow

### 7.1 — Worker Task Interface

```
Design a mobile worker task screen (375x812) for "CivicAI". Dark navy background.

Header: "Assigned Work" centered. "ON-DUTY" cyan toggle switch top-right (toggled on).

Active job card: Map view at top showing a pin marker. "ACTIVE JOB" green badge overlay on map. "Pothole Repair" large heading, "12th Cross St." subtext. Purple "▲ Navigate" pill button overlaying the map.

"🔬 AI Analysis" section:
- "EST. MATERIAL: 20kg Asphalt" glassmorphism card
- "PRIORITY: ❗ High" in red, glassmorphism card

Large gradient "▶ Start Work" button (blue-to-cyan gradient), full-width.

Warning: "⚠ Verified Photographic Proof Required Before Completion" in yellow.

"Next in Queue" section: Horizontally scrollable small cards — "🔧 Sign Replacement, Oak Ave & 4th St, ~45 mins" and "🔧 Graffiti Remova..., Central Park Unde..." (partially visible).

Bottom nav: Tasks (active), Map, Earnings, Profile — 4 tabs.
```

### 7.2 — Field Task Panel

```
Design a mobile field task screen (375x812) for "CivicAI". Dark navy background.

Header: "My Field Tasks" in bold green, "ON DUTY" green badge top-right. "Logged in as: Lineman Bob" gray subtext. "📋 1 Active Task".

Task card with a red left border (urgent indicator):
- "ID: CAI-8924" gray badge + "⏱ Assigned 10:30 AM" right
- "Electricity Issue ⚠️" heading in bold white
- Location card: "📍 123 Main St, Anytown" + "Corner of Main and 1st Ave." gray subtext
- Quoted description in a dark glassmorphism card (italic): "Power line down at the corner of Main and 1st. Requires immediate attention and securing of the perimeter."
- Map section showing the location with a blue pin
- Large green "📷 Take After Photo & Mark Resolved" button, full-width, pill-shaped

Bottom nav: Tasks (active, green highlight), Map, Profile — 3 tabs.
```

### 7.3 — Work Verification Screen

```
Design a mobile work verification screen (375x812) for "CivicAI". Dark navy background.

Header: Back arrow + "Submit Work Proof" centered.

"Before Reference" card: Small thumbnail of original pothole + "Original site condition" label.

Large after-photo section: A road photo with a cyan glowing border/corner brackets (AI scanning effect). "✅ AI Verification" label + "Analyzing Repair Quality..." subtext overlaid at the bottom of the image.

Checklist card:
- ✅ "Debris Cleared" (checked, green)
- ✅ "Site Cleaned" (checked, green)
- ☐ "Safety Signs Removed" (unchecked, gray)

Center: A green glowing camera/verification icon (rotating/scanning animation placeholder).

Result card (green left border): "✅ Standard Met" in green heading. "Repair matches required dimensions and surface flushness. Awaiting final checklist confirmation."

Bottom: "⬆ Submit to Authority" full-width outlined button.
```

### 7.4 — Worker Earnings Dashboard

```
Design a mobile worker earnings screen (375x812) for "CivicAI". Dark navy background.

Header: "Earnings & Impact" centered white text with a subtle cyan underline.

Large circular progress ring (cyan gradient): "Total Earnings $1,420" in center white text.

Three stat cards in a row: "Jobs Completed: 42", "On-Time Rate: 98%", "AI Quality Score: 4.9/5" — each in a glassmorphism bordered card.

"Daily Earnings" card: "$420" large text, "📈 +12%" green badge. Bar chart showing Mon-Sun daily earnings in green/teal bars of varying heights.

"Recent Payouts" section: Two glassmorphism cards:
- Wallet icon + "Weekly Direct Deposit" + "Oct 24, 2023" → "$340.50" + "VERIFIED" green
- Same format, "Oct 17, 2023" → "$412.00" + "VERIFIED" green

Two buttons stacked:
- "Withdraw Funds" — green/cyan gradient, full-width
- "View Performance Reports" — dark outlined button

Bottom nav: Home, Jobs, Earnings (active, cyan), Profile — 4 tabs.
```

---

## 4. Home Selector Screen (Gateway)

```
Design a mobile "Home Selector" gateway screen (375x812) for a smart-city app called "CivicAI". Dark-mode native app aesthetics with a deep navy background (#0a0e1a).

1. Header: A clean, minimal top bar showing the CivicAI logo. No back buttons.
2. Hero Section: A welcoming greeting (e.g., "Welcome to CivicAI") and a short subtext ("How can we help your community today?").
3. Primary Action Card 1: "Report an Issue". A large, highly visible card with a camera/scanner icon. The card should have a subtle cyan glow or border to indicate it is the primary action.
4. Primary Action Card 2: "Public Dashboard". A large card with a map/analytics icon, styled slightly secondary to the reporting card (e.g., subtle purple accents).
5. Footer: A minimal bottom navigation bar or a simple footer.

Ensure generous padding, large tap targets, and rounded-2xl corners. Stick strictly to the dark mode palette: #0a0e1a background, #111827 card backgrounds, with #00e5ff (cyan) and #7c3aed (purple) for interactive elements.
```

---

## 5. Issue Reporting Section (Primary Action)

**Design Inspiration:** Futuristic, camera-first, AI-driven interface. Minimalist dark mode with cyan/purple accents.

**Requirements:**
- Full-screen height on mobile.
- **Header:** Sticky header with a back button (`←`) and title "Report Issue".
- **Step 1: Evidence Capture (Hero Element):** 
    - A large, prominent rectangular area acting as the camera viewfinder placeholder.
    - Inside this area: a sleek capture button (circular gradient), with text "Tap to Capture".
    - Decorate the corners of this area with cyan brackets (`[ ]`) to simulate an AI scanner looking for danger or issues.
    - Include a small text hint beneath: "Photo or 180° Quick Sweep".
- **Step 2: Issue Details:**
    - A custom-styled `<select>` dropdown for **Problem Category** (Options: Road & Streets, Water & Drainage, Electrical/Lighting, Physical Infrastructure, Waste & Cleanup, Other) with a custom chevron icon.
    - A `<textarea>` for the Description.
    - Above the description box, align a small "Voice Type" button with a microphone icon to the right, to indicate Sarvam AI voice input (supports Hindi, Tamil, Telugu).
- **Step 3: Updates (Optional section):**
    - A standard text input for "Email or Phone Number (Optional)".
    - Helper text below: "Location data is automatically captured via GPS."
- **Sticky Footer Action:**
    - A dark, glassmorphic container pinned to the bottom of the screen.
    - A single, massive gradient button (Cyan to Purple): "Submit to Authority".
- **Floating Action Button (FAB):**
    - A glowing floating button in the bottom right corner (above the sticky footer).
    - It should have a chatbot/sparkle icon to represent the "Live AI Assistant".
- **Color Palette:**
    - Background: Deep Navy/Black (`#0a0e1a`)
    - Inputs/Cards: Slightly lighter transparent dark (`#111827` or `rgba(255,255,255,0.05)`)
    - Accents: Cyan (`#00e5ff`) for tech elements, Purple (`#7c3aed`) for gradients.
    - Text: White and White/60 for secondary text.

---

## 5. Public Transparency Dashboard (Map View)

```
Design a mobile transparency dashboard (375x812) for "CivicAI". Dark navy background.

Top bar: "CivicAI Transparency" centered.

Hero section: "Live Civic Tracker" in bold white (32px). Gray subtext about transparent monitoring.

Three KPI cards in a horizontal row (scrollable): "Total Issues: 0" (purple chart icon), "Resolved: 0" (green checkmark icon), "Avg AI Dis... ~4.2" (cyan timer icon, partially cut off).

"Live Issue Map" heading + "Delhi Region" badge. An embedded interactive map (Leaflet style) showing Delhi area with colored circular markers — blue, green, violet dots at various locations. Location crosshair button bottom-right of map.

"Recent Reports" section: Three report cards stacked:
- "! #CAI-8492" red badge + "2 mins ago", "Severe Pothole Detected", "📍 Connaught Place, New Delhi"
- "💧 #CAI-8491" blue badge, "14 mins ago", "Main Pipe Leakage", "📍 Vasant Vihar"
- "💡 #CAI-8490" cyan badge, "45 mins ago", "Streetlight Outage", "📍 Hauz Khas"
```

---

## 9. Community & Social

### 9.1 — Community Social Feed

```
Design a mobile community feed screen (375x812) for "CivicAI". Dark navy background.

Header: "Community Impact" bold white, notification bell right.

Two social post cards stacked:

Post 1: "Adwai ✔️ Verified Reporter" + "🏢 CityWorks Inc." badge. Before/after comparison photo — left half shows a pothole, right half shows the repaired road, with a circular drag handle in the center. "✨ AI Impact Summary: Safety improved by 22% in this area" in a purple-accented card. Description text about the pothole fix. Bottom: "🎉 124" upvotes, "💬 12" comments, "↗ Share".

Post 2: "Sarah J. ✔️ Community Leader" + "🌿 Parks Dept." badge. Before/after photo of a park cleanup. "✨ AI Impact Summary: Local park usage increased by 45%" purple card. Description text. Bottom: "🎉 89" + "💬 24" + "↗ Share".

Floating action button: Cyan circle with "+" icon, bottom-right.

Bottom nav: Home (active), Report (+), Map, Profile — 4 tabs.
```

---

## 10. Profile & Gamification

### 10.1 — Profile & Achievements

```
Design a mobile profile screen (375x812) for "CivicAI". Dark navy background.

Header: Settings gear icon (left) + "CivicAI Profile" centered + share icon (right).

Large circular avatar with a cyan/blue glowing ring border. Golden "ELITE CITIZEN" badge overlaid at bottom of avatar circle. "Adwai 👋" name below, "Member since Oct 2023" gray text. "Edit Profile" blue pill button.

Stats row: "84 REPORTS" | "12k POINTS" | "14 BADGES" — three columns, bold white numbers.

"CURRENT STANDING" card (purple left border accent): "Level 4 Citizen" heading, "850 / 1000 XP" in orange/cyan. A purple-to-cyan gradient progress bar. Small text: "150 more to reach Level 5 and unlock 'Urban Guardian' title."

"My Achievements" heading + "View all" cyan link. Horizontal row of 3 circular badge icons: "🔧 Pothole Hunter" (yellow), "🌙 Night Watchman" (dark blue), "⚡ Fast Responder" (orange). Each with a label below.

Settings list (glassmorphism cards stacked):
- "👤 Personal Info" with chevron
- "📊 My Impact Report" with chevron
- "🔔 Notification Settings" with chevron
- "🚪 Log Out" in red with exit icon

Bottom nav: Home, Report (+), Map, Profile (active, with dot) — 4 tabs.
```

### 10.2 — Citizen Leaderboard

```
Design a mobile leaderboard screen (375x812) for "CivicAI". Dark navy background with subtle teal gradient at top-right corner.

Header: "Citizen Leaderboard" bold white centered.

Toggle tabs: "Weekly" (active, white/filled) | "All-time" (gray, outlined) — pill-shaped toggle.

Top 3 podium: Three circular avatar photos arranged with #1 center (larger, golden ring border, blue star badge above, "1" gold badge), #2 left (silver ring, "2" badge), #3 right (bronze ring, "3" badge). Names and points below each: "Alex Rivera ⭐ 3,120 PTS" (center), "Sarah J. 2,450 pts" (left), "Maya Chen 2,100 pts" (right).

Leaderboard list (positions 4-7), each a glassmorphism row card:
- Rank number, circular avatar, name, badge title, points + trophy icon on right
- #4: John Smith — "Top Reporter Badge" — 1,950
- #5: Elena V. — "Road Master" — 1,820
- #6: Marcus T. — "Civic Sentinel" — 1,750
- #7: Sophie Blue — "Green City Advocate" — 1,680

"Your" sticky card at bottom (slightly highlighted): Default avatar, "You", "Rank 42", "1,250 PTS" in cyan, "+120 THIS WEEK" label.

Bottom nav: Home, Report (+), Rank (active, with bar chart icon), Map, Profile — 5 tabs.
```

---

## 11. Settings & Utilities

### 11.1 — Settings & Notifications

```
Design a mobile settings screen (375x812) for "CivicAI". Dark navy background.

Header: Back arrow + "Settings" centered.

Profile card (glassmorphism): Circular avatar + "John Doe" name + "⭐ Elite Citizen" purple badge.

"NOTIFICATION PREFERENCES" section (uppercase small gray heading):
Three toggle rows in a glassmorphism card:
- Purple brain icon + "AI Analysis Updates" + subtitle "When AI analyzes your report" → purple toggle (on)
- Blue clipboard icon + "Report Status Changes" + subtitle "Alerts for resolution and updates" → purple toggle (on)
- Yellow bell icon + "Local Community Alerts" + subtitle "Issues reported near you" → gray toggle (off)

"APP SETTINGS" section:
Two rows in a glassmorphism card:
- Globe icon + "Language" → "English >" on right
- Moon icon + "Dark Mode" → purple toggle (on)

"Help & Support" button — full-width outlined button with question mark icon.

"🚪 Sign Out" button — full-width with red text and border, logout icon.
```

### 11.2 — Help & FAQ Center

```
Design a mobile help/FAQ screen (375x812) for "CivicAI". Dark navy background.

Header: Back arrow + "Help & FAQ" centered.

Search bar: Glassmorphism input with magnifying glass, "Search for help..."

"Top Categories" heading. 2×2 grid of cards:
- Rocket icon → "Getting Started"
- Shield/checkmark icon → "AI Verification"
- Star icon → "Civic Points"
- Warning triangle icon → "Reporting Issues"
Each card is a glassmorphism square with a purple circular icon and label below.

"Frequently Asked Questions" heading. Three expandable accordion items:
- "How does the AI verify my photos?" + chevron down
- "What are Civic Points?" + chevron down
- "Who sees my reports?" + chevron down
Each in a glassmorphism bordered row.

"Direct Support" section:
- "🤖 Chat with AI Assistant" — blue gradient (#4f46e5) full-width button
- "🎧 Contact Ward Officer" — dark outlined full-width button
```

---

## 12. Project Audit (Official)

### 12.1 — Project Audit

```
Design a mobile project audit screen (375x812) for "CivicAI". Dark teal-green tinted background (#0a1a15).

Header: Back arrow + "Project Audit" centered.

"📦 Pending Verification" yellow/amber pill badge.

"Before vs. After" glassmorphism card: Two photos side by side — "Before" (damaged pipe) and "After" (repaired pipe). Photos have subtle labels overlaid at bottom corners.

"AI Verification Result" badge card: Green shield icon + "99% Match" in green with a green dot.

"On-Site Metadata" card:
- "COORDINATES: 📍 34.0522° N, 118.2437° W"
- "TIMESTAMP: ⏱ Oct 24, 14:30 PST"

"🔗 View 360° Final Pan" — outlined button, full-width.

Two action buttons at bottom:
- "Request Rework" — red outlined button
- "✅ Certify & Release Payment" — green solid button, full-width

Bottom nav: Dashboard, Reports (active), Bids, Settings — 4 tabs.
```
