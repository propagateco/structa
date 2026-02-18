# Structa – Project Overview

## 1. Vision & Core Identity

Structa is an AI-powered renovation assistant that brings **context, clarity, and confidence** to UK homeowners managing renovation projects. Unlike generic project management tools, Structa serves as the **mission control** for renovations—a collaborative workspace where couples can plan together, consult an AI expert (The Clerk), and coordinate with tradespeople, all in one place.

At its core, Structa is:
- **Context-Aware**: The AI learns from your specific property (survey documents, floor plans, photos) rather than providing generic advice. Property age and characteristics inform AI recommendations in the background without changing user workflows.
- **Visual-First**: Uses semi-automated floor plan creation (AI extracts dimensions, user draws with CAD-lite tools) and drag-and-drop markup to make renovation planning tangible and actionable.
- **Digital Twin Foundation**: Floor plans capture comprehensive spatial metadata (room dimensions, ceiling heights, wall materials, window specs) that enable AI to provide precise cost estimates. When you ask "How much for a kitchen extension?", The Clerk already knows your existing kitchen's volume, where doors/windows are, and wall types—enabling material + labour breakdowns instead of vague ranges.
- **Collaborative by Default**: Partners share a workspace—same chat with The Clerk, same document library, same floor plans. Real-time editing and shared decision-making built into the foundation.
- **Sequencing-Intelligent**: Explicitly surfaces work dependencies (e.g., "electrical before plastering") and flags property-specific hazards based on building age and survey findings.
- **Budget-Transparent**: Real-time spend tracking with runway visibility and AI-powered quote benchmarking against UK market rates.

### Why Web-First?

The web application serves as **mission control** for renovation projects—the central hub where all planning, document management, and decision-making happens:

- **Desktop/Tablet Optimization**: Floor plan editing (CAD-lite tools with snap-to-grid), document review, and multi-quote comparison require screen real estate and precision input.
- **Collaborative Workflows**: Shared workspace for partners requires features best suited to desktop (side-by-side document viewing, real-time floor plan co-editing, multi-panel layouts).
- **Document Intelligence**: AI extraction of dimensions from survey PDFs and processing large documents works better with desktop computational context.
- **Digital Twin Data Entry**: Capturing comprehensive spatial metadata (ceiling heights per floor, window specifications, wall materials) benefits from desktop forms and multi-field input.
- **Progressive Enhancement**: The web app is functionally responsive (works on mobile browsers), but encourages desktop use for complex planning tasks while setting the stage for a mobile companion app (Phase 2) for on-site reference.

### Why "Context-Aware" Matters

Generic renovation advice ("Kitchen extensions cost £20,000-£60,000") is useless. Structa uses **your property's specifics** to provide targeted guidance:

- **Survey Intelligence**: The Clerk cites specific findings from your survey ("Your structural engineer noted concerns about the rear wall on page 7")
- **Property Age as Background Intelligence**: A 1960s house automatically triggers different hazard checks (asbestos in Artex, aluminum wiring, solid wall construction) than a 2010 new build—but this happens transparently in the AI layer without requiring users to navigate era-specific workflows
- **Location Awareness**: Market rates, building regulations, and tradesperson availability vary by region (Manchester vs. London)
- **Digital Twin Awareness**: Floor plan spatial data enables precise material + labour cost breakdowns (see example in Section 3.1)

---

## 2. Scope and Non-Goals (v1)

### In Scope

**Core Features (MVP - All 6 Components Included)**

1. **The Clerk (AI Agent)**: Context-aware chat interface that answers renovation questions using your survey documents, property details, **floor plan spatial data**, and UK building regulations. Cites sources for all claims (e.g., "According to page 3 of your survey..."). **Partners see the same chat history** and can ask follow-up questions collaboratively. Can generate **material lists on-demand** (e.g., "What materials for kitchen rewire?" → AI responds: "Based on your floor plan: 15× double sockets, 3× junction boxes, 45m cable...").

2. **Document Intelligence**: AI auto-extracts dimensions from uploaded survey PDFs (room measurements, structural details). Users can upload surveys, architectural plans, photos, and quotes to a **shared document library** accessible to both partners.

3. **Floor Plan Markup Tool**: Semi-automated floor plan creation + desktop-optimized CAD-lite editor that builds a **digital twin** of your property:
   
   **Spatial Data Capture (Digital Twin Foundation)**
   - **Room Dimensions**: AI extracts length × width from survey PDFs (e.g., Kitchen: 3.5m × 4.2m)
   - **Ceiling Heights**: User enters per-floor during onboarding (e.g., Ground: 2.7m, First: 2.4m, Loft: 2.1m)
   - **Wall Materials**: Property-wide setting from onboarding (solid brick, cavity wall, timber frame, etc.) - AI can infer from survey if available
   - **Window/Door Specs**: Type (sash/casement/bi-fold), size (W×H), glazing (single/double/triple)
   - **Floor Types**: Carpet, tile, hardwood, laminate (affects renovation costs for replacement or protection)
   
   **AI Extraction**: OpenAI Vision API extracts room dimensions from survey PDFs
   
   **Manual Drawing (CAD-Lite Tools)**:
   - User draws walls, doors, windows using extracted measurements (snap to grid, orthogonal constraints, measurements shown)
   - Add fixtures with specifications (not just generic symbols):
     - **Electrical**: "Double socket, white, 13A" (not just generic socket symbol)
     - **Plumbing**: "Chrome radiator, 600×800mm, BTU 2400" (linked to heating calculations)
     - **Lighting**: "Wall sconce, IP44 rated" (bathroom-safe specs)
   - Markup captures both **visual layout** (where things are) and **technical specs** (what things are)
   
   **Collaborative Editing**: Partners can edit the same floor plan in real-time with presence indicators ("Partner is editing Kitchen")
   
   **Color-Coded Annotations**: Mark demolition, new features, and trade-specific work (red = remove, green = new build, blue = electrical, yellow = plumbing)
   
   **Material List Generation**: On-demand via The Clerk (e.g., "What materials for bathroom rewire?" → AI calculates based on fixtures marked on floor plan + room dimensions)

4. **Live Budget Tracker**: Real-time spend tracking with runway visibility (days/weeks remaining at current burn rate). Both partners see the same budget and can add expenses. **AI cost estimates** (derived from digital twin data) can be added as line items for tracking.

5. **Project Pack Generation**: AI-compiled scope-of-work documents for each trade (electrician, plumber, builder) based on floor plan markups, **spatial metadata**, and renovation goals. Export as PDF or share directly with tradespeople via platform. Includes **material lists with quantities** (e.g., "15× double sockets, 45m 2.5mm² cable, 3× junction boxes").

6. **Quote Management & Tradesperson Search**:
   - **Find a Tradesperson**: Search and filter tradespeople by trade, region, and ratings (using search and webscraping for v1)
   - **Share Project Packs**: Send project packs (with material lists) to selected tradespeople via platform (an enriched link sent via SMS or email)
   - **Upload & Compare Quotes**: Manually upload quotes or receive them via platform. AI benchmarks against UK market rates (web-scraped or manually collected data—no Checkatrade API access for v1). **Digital twin enables line-item comparison** (quote says "£500 for sockets" vs. AI estimate "£380 for 15× sockets @ £25 each + £5 labour per socket").

**Collaboration Features (v1 - Critical Addition)**
- **Shared Workspace**: Invite partner (spouse, co-owner) to project workspace via email
- **Real-Time Co-Editing**: Both partners can edit floor plans simultaneously with presence indicators ("Partner is editing Kitchen")
- **Shared Chat Sessions**: All conversations with The Clerk are visible to both partners (no separate chat histories)
- **Shared Document Library**: Both partners see the same uploaded surveys, quotes, photos
- **Activity Feed**: See what your partner added/changed (e.g., "Sarah uploaded electrician quote", "John marked wall for demolition", "Sarah added ceiling height for first floor")

**Onboarding & Progressive Disclosure**
- **Fast Path (Immediate Value)**: Upload survey → Ask The Clerk questions → Get context-aware answers (no floor plan required) -> Plan budget and timelines
- **Deep Path (Full Features)**: Upload documents → Draw floor plan + capture spatial data → Set budget and timelines → Generate project packs → Compare quotes
- **No Documents Path**: Complete onboarding questionnaire (property details, renovation goals, timeline, budget, known issues, **ceiling heights, wall materials**) → Ask The Clerk generic advice → System prompts for document upload to unlock personalized guidance

**Technical Constraints**
- Web application (TanStack Start framework)
- Desktop/tablet-optimized with mobile-responsive fallback
- AI floor plan dimension extraction: 70-80% accuracy acceptable (user corrects during manual drawing)
- Real-time collaboration via WebSockets (presence, co-editing)
- Quote benchmarking via web scraping or manual data collection (no API dependency)
- Material list calculations: 90%+ accuracy target (based on floor plan spatial data)

**Platforms**
- Web (Desktop: 1920x1080, Tablet: 1024x768, full features)
- Mobile browser (functional and mainly for interaction with the Clerk, checking/updating budget and timelines, but encourages desktop for floor plan editing and collaboration)

### Out of Scope (for now)

- **Mobile-Native App**: iOS/Android apps for on-site reference (Phase 2)
- **Automated Tradesperson Matching**: AI-powered outreach to tradespeople based on project packs (Month 9+ per GTM strategy, requires 200+ active projects first)
- **Milestone-Based Escrow**: Payment protection tied to work completion (post-MVP feature)
- **Advanced Scheduling**: Gantt charts, tradesperson calendar coordination (post-MVP)
- **AR Overlays**: Augmented reality floor plan visualization (future enhancement)
- **Multi-Project Management**: v1 assumes one active renovation per household (multi-project support deferred)
- **3D Visualization**: 2D floor plans only for v1 (3D models deferred to Phase 2-3)

---

## 3. Foundational Principles

### 3.1 Context Over Generic Advice

The AI never provides generic ranges like "Kitchen renovations cost £15,000-£40,000". Instead, it uses **your property's specifics** (survey findings, location, property type, age, **floor plan spatial data**) to provide targeted guidance.

**Example WITHOUT Digital Twin (generic answer - bad):**
- User: "How much would a kitchen extension cost?"
- AI: "Kitchen extensions cost £20,000-£60,000 depending on size and finishes."

**Example WITH Digital Twin (Structa answer - good):**
- User: "How much would a kitchen extension cost?"
- AI: "Your existing kitchen is 12m² (3.5m × 3.4m) with 2.7m ceilings. A 15m² extension would add 40.5m³ of usable space. Based on your Manchester location and solid brick walls (matching existing), estimated costs:
  - **Foundations** (3m deep for clay soil per survey): £4,200-£5,800
  - **Brickwork** (5 tonnes matching existing solid brick): £3,500-£4,200  
  - **Roof** (flat roof, rubber membrane, 15m²): £2,800-£3,500
  - **Windows/doors** (2× bi-fold doors per your notes): £6,000-£8,500
  - **Electrics** (5× double sockets, 2× ceiling lights, 1× under-cabinet strip): £1,200-£1,800
  - **Plumbing** (relocate radiator, extend heating): £800-£1,200
  - **Labour** (8-10 weeks, 2-person crew): £12,000-£15,000
  - **Total: £28,500-£37,000** (including 15% contingency for clay soil issues noted in survey page 4)"

**Development Impact**: All AI prompts must include property context (age, location, survey excerpts, **floor plan spatial metadata**). No feature ships without property-specific outputs. Property age informs AI recommendations transparently (no separate "1960s house" UI mode). Digital twin data (room volumes, fixture counts, material types) enables material + labour breakdowns.

### 3.2 Show, Don't Tell

Visual floor plans with color-coded markup replace text-heavy project descriptions. Users should **see** their renovation plan, not read about it. CAD-lite tools (snap to grid, measurements) make drawing feel precise and professional, not sketchy. **Digital twin metadata** (ceiling heights, wall materials, window specs) is captured during drawing but displayed contextually (e.g., hover over window → "Casement, 1200×1200mm, double glazed").

**Development Impact**: Floor plan editor is a first-class feature (not an afterthought). All project decisions (budget, quotes, sequencing) tie back to visual annotations **and spatial metadata**. Manual drawing must feel intuitive (snap-to-grid, orthogonal constraints, dimension labels). Metadata entry must be progressive (user can skip initially, add later when asking cost questions).

### 3.3 Sequence Matters

Renovations have hard dependencies (electrical before plastering, structural before cosmetic). The AI explicitly surfaces these sequencing requirements and warns about out-of-order work.

**Development Impact**: Project packs must include sequencing logic. The Clerk must validate work order when answering questions (e.g., "You mentioned painting first, but have you checked for damp? That should happen before any cosmetic work."). Digital twin enables sequencing validation (e.g., "You can't plaster until electrical rough-in is complete—your floor plan shows 15 sockets to install first").

### 3.4 Trust Through Transparency

AI recommendations must **cite sources** for all claims: survey page numbers, building regulation clauses, market data sources, **floor plan measurements**. No "black box" advice. If The Clerk says "Your kitchen is 12m²," it must reference the floor plan data (hover to see room dimensions).

**Development Impact**: RAG system must return source citations. UI must display inline references (e.g., "According to Part L of UK Building Regs...", "Based on your floor plan: Kitchen 3.5m × 3.4m"). Hallucination detection is critical for safety-related advice (asbestos, structural, electrical). Conservative approach: flag anything suspicious, even at low confidence (high false positive rate is acceptable for safety). Cost estimates must show calculations (e.g., "15× sockets @ £25 each = £375").

### 3.5 Progressive Disclosure

The interface starts simple and reveals complexity as needed. Three entry points:

1. **Fast Path**: Upload survey → Ask The Clerk → Immediate value (no floor plan, no spatial data required)
2. **Deep Path**: Complete onboarding (including ceiling heights, wall materials) → Upload documents → Draw floor plan + capture specs → Full feature set unlocks
3. **No Documents Path**: Answer onboarding questionnaire (including spatial data if known) → Get generic advice → System prompts for document upload later

Don't overwhelm new users with empty forms and advanced features. Unlock capabilities progressively as context improves. **Digital twin metadata** (ceiling heights, wall materials) can be added incrementally: basic onboarding captures property-wide defaults, floor plan editor allows per-room overrides if needed.

**Development Impact**: Onboarding flow branches based on user readiness. The Clerk is accessible immediately (even without documents or floor plans). Advanced features (material lists, precise cost estimates) appear after floor plan spatial data captured. UI shows "You could get material quantities by drawing a floor plan—want to do that now?" when answering generic questions about costs.

### 3.6 Specific Over Generic

No vague language. "Fast" is bad. "Floor plan dimensions extracted in < 30 seconds for typical 3-bed survey" is good. "Affordable" is bad. "£25-£50 per room for asbestos survey in Greater Manchester" is good.

**Development Impact**: All AI outputs must include specific numbers, timeframes, and costs (with confidence levels where appropriate). **Digital twin enables specificity**: Instead of "You'll need sockets" → "You'll need 15× double sockets (one per 4m² kitchen rule) costing £375 for materials + £450 labour @ £30 per socket installation." Generic responses trigger warning logs for review. Conservative AI for safety: flag low-confidence hazards rather than staying silent.

### 3.7 Collaborative by Default

Renovations are joint decisions. Partners must work together seamlessly—no emailing screenshots or verbal summaries of conversations. The workspace is **shared by default**: same chat history with The Clerk, same floor plans, same documents, same budget, **same digital twin spatial data**.

**Development Impact**: 
- Real-time collaboration is foundational (not a "nice-to-have" added later)
- WebSocket infrastructure for presence indicators and co-editing
- Conflict resolution for simultaneous floor plan edits (last-write-wins for v1, operational transforms for v2)
- Activity feed shows partner actions ("Sarah added electrician quote 2 mins ago", "John updated ceiling height for first floor to 2.4m")
- All features assume multi-user access (permissions, audit logs, "who made this change?")
- **Digital twin metadata** is collaboratively editable (both partners can add ceiling heights, window specs, fixture details)

---

## 4. User Journey & Experience

### Entry Points (Three Paths to Value)

#### Path 1: Fast Path (Immediate Value)
*For users who want quick answers without commitment*

1. **Sign Up & Quick Start**
   - Create account (email + password)
   - Optional: Invite partner immediately
   - System asks: "Do you have your survey or architectural plans ready?"

2. **Upload Survey (Optional)**
   - User uploads survey PDF
   - AI extracts text for RAG in background (no waiting)
   - AI attempts dimension extraction (runs async)
   - System shows: "✓ Survey processed. The Clerk can now give you personalized advice."

3. **Ask The Clerk**
   - User asks: "I want to remove the wall between kitchen and living room. What do I need to know?"
   - The Clerk responds with context-aware guidance:
     - If survey uploaded: "According to page 7 of your survey, the wall between kitchen and living room is load-bearing. You'll need a structural engineer to design a steel beam (RSJ)..."
     - If no survey: "Removing walls requires checking if they're load-bearing. Most mid-terrace homes have a central load-bearing wall. I'd recommend uploading your survey so I can give you specific guidance—would you like to do that now?"
   
4. **Unlock Full Features (Progressive)**
   - After first Clerk conversation, system suggests: "Want to get precise cost estimates? Let's create a floor plan with spatial data."
   - User can proceed to floor plan editor or continue asking questions

**Time to Value: < 3 minutes (upload + first answer)**

---

#### Path 2: Deep Path (Full Feature Set - Digital Twin)
*For users ready to dive into planning and capture spatial data*

1. **Onboarding & Document Upload**
   - User creates account and enters property basics via guided questionnaire:
     - Address (auto-fill from postcode lookup)
     - Property type (terraced, semi, detached, flat)
     - Build year (dropdown: pre-1900, 1900-1929, 1930-1949, 1950-1966, 1967-1975, 1976-1982, post-1982)
     - **Ceiling heights per floor** (e.g., Ground: 2.7m, First: 2.4m, Loft: 2.1m) - *Digital Twin Foundation*
     - **Wall construction** (solid brick, cavity wall, timber frame, concrete block) - AI can infer from survey if available - *Digital Twin Foundation*
     - Renovation goals (checkbox: kitchen, bathroom, loft conversion, extension, full refurb)
     - Timeline (dropdown: 0-3 months, 3-6 months, 6-12 months, 12+ months)
     - Budget (range slider: £5k-£100k+)
     - Known issues (textarea: "Damp in bathroom, old wiring, roof leaks")
   - Upload survey PDF and/or architectural plans
   - AI processes documents (extracts text for RAG, identifies room dimensions)

2. **The Clerk Consultation (With Context)**
   - User asks initial question (e.g., "I want to convert the loft—what do I need to consider?")
   - The Clerk responds with context-aware guidance:
     - Flags property-age-specific hazards (asbestos in roof insulation for 1960s homes—detected automatically based on build year)
     - Suggests work sequence (structural survey → planning permission → party wall agreement → asbestos removal → conversion)
     - Cites survey findings (e.g., "Your survey notes concerns about roof structure on page 7")
     - **Uses ceiling height data**: "Your loft ceiling height is 2.1m. Building regs require 2.2m minimum for habitable space—you may need to lower the first-floor ceiling or raise the roof ridge."
   - Partner can see chat history and ask follow-up questions

3. **Visual Planning (Floor Plan Creation & Markup - Digital Twin Capture)**
   - **AI Dimension Extraction**:
     - System shows: "I found dimensions for 8 rooms in your survey. Let's draw your floor plan."
     - Displays extracted data in sidebar: "Kitchen: 3.5m × 4.2m, Living Room: 5.1m × 4.8m..."
   
   - **Manual Drawing (CAD-Lite Tools)**:
     - User draws walls using measurements (snap to grid, orthogonal constraints)
     - System pre-fills ceiling height from onboarding (e.g., "Ground floor: 2.7m") but allows per-room override
     - Add doors and windows (auto-snap to walls):
       - **Window specs capture**: Type (sash/casement), size (1200×1200mm), glazing (double/triple)
       - **Door specs capture**: Type (internal/external), size (762×1981mm standard), material (wood/uPVC)
     - Add fixtures with specifications:
       - **Electrical**: Click "Add socket" → Drawer opens: "Type: Double, Color: White, Rating: 13A" → Icon appears on floor plan
       - **Plumbing**: Click "Add radiator" → "Type: Panel, Size: 600×800mm, BTU: 2400, Finish: Chrome"
       - **Lighting**: Click "Add ceiling light" → "Type: Pendant, Wattage: 60W max, IP Rating: IP20 (dry room)"
     - Save as baseline floor plan
   
   - **Collaborative Editing**:
     - Partner sees real-time presence indicator ("Sarah is editing Kitchen")
     - Both can drag annotations simultaneously (different layers per user to avoid conflicts)
     - Activity feed: "John marked wall for demolition 30 seconds ago", "Sarah added 3× double sockets in kitchen"
   
   - **Markup Annotations**:
     - Drag elements to mark demolition (walls to remove), new features (kitchen island, new doorway)
     - Color-coded layers: Red = demo, Green = new build, Blue = electrical, Yellow = plumbing
     - Add notes: "Move radiator here", "New socket x3"
   
   - **Digital Twin Completeness**:
     - System tracks spatial data coverage: "✓ Room dimensions (8/8), ✓ Ceiling heights (3/3 floors), ⚠️ Window specs (5/12 windows)" 
     - Prompt to complete: "Add window specs for more accurate material costs?"

4. **Budget Setup (AI Cost Estimates from Digital Twin)**
   - User enters known costs (survey fee: £400, architect fee: £1,200) and total budget (£35,000)
   - System shows runway: "At current burn rate, 14.2 months of budget remaining"
   - **AI suggests costs using digital twin**:
     - "Based on your Manchester terraced house (12m² kitchen, 2.7m ceiling, solid brick walls):"
     - "Electrical rewire: £2,800 (15× double sockets @ £50 installed, 3× ceiling lights @ £80, consumer unit £800)"
     - "Plumbing: £1,200 (relocate 2× radiators, extend heating 8m from boiler)"
   - User can add AI estimates to budget tracker as line items
   - Partner can add expenses; both see updated totals instantly

5. **Project Pack Generation (With Material Lists)**
   - User clicks "Generate Project Packs" after completing floor plan markup
   - AI creates trade-specific documents (Electrician Pack, Plumber Pack, Builder Pack)
   - Each pack includes:
     - **Scope of work** (derived from floor plan annotations)
     - **Material list with quantities** (e.g., "15× double sockets, 3× junction boxes, 45m 2.5mm² cable")
     - **Floor plan snapshot** with relevant layers highlighted (electrician sees only blue layer + room dimensions)
     - **Relevant survey excerpts** (e.g., "Electrical section, pages 8-9")
     - **Sequencing notes** ("Must complete after structural work, before plastering")
     - **Spatial context** ("Kitchen: 12m², 2.7m ceiling, solid brick walls")

6. **Tradesperson Discovery & Quote Management (Line-Item Comparison)**
   - **Browse Directory**:
     - Search tradespeople by trade (electrician, plumber, builder) and region (postcode radius)
     - View profiles: ratings, typical project size, verified qualifications
   
   - **Share Project Packs**:
     - Select tradespeople from directory
     - Share project pack (with material lists) via platform (no email exchange required)
     - Tradesperson receives notification: "New project pack from John & Sarah (3-bed rewire, Manchester) - **Material list included: 15× sockets, 45m cable**"
   
   - **Receive & Compare Quotes (Digital Twin Line-Item Analysis)**:
     - Tradespeople upload quotes via platform OR user manually uploads quote PDFs
     - AI extracts line items and compares against **digital twin material quantities + market rates**:
       - "15× double sockets: Quote £750 (£50 each) vs. AI estimate £675 (£45 each) → ✓ Within 15%"
       - "Consumer unit: Quote £950 vs. Market avg £600-£800 → ⚠️ Above average (+32%)"
       - "Labour (8 days): Quote £2,400 (£300/day) vs. Market avg £250-£350/day → ✓ Fair rate"
     - Display comparison table: Line item | Quote | AI Estimate (Digital Twin) | Market | Variance
     - Flag outliers with confidence levels ("Based on 34 similar quotes in Greater Manchester + your floor plan material quantities")
   
   - Both partners see all quotes and can discuss via shared Clerk chat
   - **The Clerk can explain variances**: "The consumer unit quote is high. Based on your floor plan (15 circuits needed for your 8 rooms + extension), a standard 12-way consumer unit is sufficient (£600-£800). Ask if they're quoting for 18-way (unnecessary unless future-proofing)."

7. **Execution Phase (Track Against Digital Twin Estimates)**
   - **Track Spend**: User adds actual costs as work completes (manual entry for v1)
   - **Compare to Estimates**: Budget tracker shows variance: "Electrical: Estimated £2,800 (from digital twin), Actual £2,650 → £150 under budget"
   - **Update Floor Plan**: Mark tasks complete (change annotation from "Planned" to "Complete")
   - **Ongoing Clerk Consultation with Context**: 
     - User: "Electrician found old wiring—what now?"
     - Clerk: "Your 1960s house (per onboarding) likely has aluminum wiring if original. According to page 8 of your survey, electrical circuits were noted as 'dated.' I'd recommend full rewire (already in your project pack). This might add £800-£1,200 to the quote depending on accessibility. Want me to recalculate material quantities based on your floor plan?"
   - **Partner Coordination**: Activity feed shows who did what ("Sarah marked electrical work complete", "John added £2,650 payment to electrician - £150 under budget!")

**Time to Full Setup: 45-60 minutes (onboarding + floor plan + spatial data capture + budget)**

---

#### Path 3: No Documents Path (Generic Advice with Optional Spatial Data)
*For early-stage users researching before obtaining surveys*

1. **Onboarding Questionnaire (No Upload)**
   - User creates account
   - Completes full renovation profile (property details, goals, timeline, budget, known issues)
   - **Optional spatial data**: Ceiling heights per floor, wall construction (if known)
   - Skips document upload ("I don't have my survey yet")

2. **Generic Clerk Advice (with Basic Spatial Context if Provided)**
   - User asks: "How much does a loft conversion cost in Manchester?"
   - The Clerk responds:
     - **Without ceiling heights**: "Loft conversions in Greater Manchester typically cost £25,000-£45,000 for a 3-bed terraced house, depending on whether it's a hip-to-gable conversion..."
     - **With ceiling heights**: "You mentioned your loft ceiling is 2.1m. Building regs require 2.2m for habitable space. You'll likely need to lower the first-floor ceiling (~£2,000-£3,500) or raise the roof ridge (~£8,000-£12,000). Total estimate: £28,000-£52,000 depending on approach."
     - "⚠️ I could give you more specific advice if you upload your survey. For example, I could check if your roof structure can support a conversion and flag any issues."
   
3. **Document Upload Prompt**
   - After 3-5 generic questions, system shows banner: "Ready for personalized advice? Upload your survey to unlock context-aware guidance and material quantity calculations."
   - User uploads survey → system switches to context-aware mode
   - Previous generic answers remain in chat history (no reset)

**Time to Value: < 2 minutes (questionnaire + first generic answer)**

---

### Collaboration Touchpoints (Throughout Journey)

- **Invite Partner**: User can invite partner at any stage (onboarding, after first Clerk chat, after floor plan created)
- **Shared Context**: Partner joins existing workspace with full history (chat, documents, floor plan, **digital twin spatial data**)
- **Real-Time Presence**: See when partner is active ("Sarah is viewing Electrician Pack", "John is editing Kitchen floor plan")
- **Notifications**: Email alerts for major actions ("John shared project pack with 3 tradespeople", "Sarah added ceiling heights for all floors")
- **Decision Log**: Activity feed shows all actions with timestamps ("Who marked this wall for demolition? → John, 2 days ago", "Who added window specs for living room? → Sarah, 1 hour ago")

---

## 5. Testing & Quality Philosophy

### AI Output Validation (Human-in-the-Loop)

**Critical Decisions (Shadowing Mode)**
- **Asbestos Flagging**: AI suggests presence based on property age + survey mentions. User must acknowledge warning before proceeding. **Quality Target**: 95% recall on known asbestos indicators (1960s Artex, pipe lagging, etc.). **Conservative approach**: Flag anything suspicious, even at low confidence (false positives acceptable).
- **Structural Concerns**: AI flags survey mentions of subsidence, cracks, roof issues. User must review before generating project packs. **Quality Target**: 100% recall on survey keywords ("structural movement", "subsidence", "roof defect").
- **Sequencing Violations**: AI warns if user attempts out-of-order work (e.g., plastering before electrical rough-in). User can override with confirmation. **Quality Target**: Zero false positives on established dependencies (e.g., "always check for damp before cosmetic work").

**Non-Critical Decisions (Automation Mode with Override)**
- **Material Quantities** (Digital Twin-Derived): AI calculates paint coverage, tile quantities, fixture counts. User can override. **Quality Target**: Within 10% of actual requirements (based on floor plan spatial data).
- **Cost Estimates** (Digital Twin-Enabled): AI provides material + labour cost breakdowns. User can ignore. **Quality Target**: Within 20% of actual quotes received (vs. generic 50-100% ranges without digital twin).
- **Drying Times**: AI suggests wait times between tasks (plaster drying, paint curing). User can adjust. **Quality Target**: Matches manufacturer specifications ±1 day.

### Testing Approach

**Unit Tests** (Vitest)
- Core business logic: Budget calculations, runway projections, cost benchmarking
- Document parsing: Survey text extraction, dimension parsing from PDFs
- Sequencing logic: Dependency validation (electrical before plastering, etc.)
- **Material quantity calculations**: Fixture counts based on floor plan spatial data (e.g., "15× sockets for 12m² kitchen = 1.25 sockets per m²")
- Collaboration features: Conflict resolution for simultaneous floor plan edits (last-write-wins logic)

**Integration Tests**
- RAG pipeline: Document upload → chunking → embedding → retrieval accuracy
- Floor plan dimension extraction: Survey PDF → AI vision API → JSON dimensions (70-80% accuracy target)
- AI citation: Ensure all Clerk responses include source references (survey page numbers, regulation clauses, **floor plan measurements**)
- Real-time collaboration: WebSocket message delivery, presence updates, co-editing state sync
- **Digital twin cost estimation**: Floor plan spatial data → Material quantities → Cost estimates (within 20% of benchmark data)

**Manual QA Checks**
- **Hallucination Detection**: Spot-check AI responses for factually incorrect safety advice (e.g., "asbestos is safe to remove yourself"—should never happen).
- **Quote Benchmarking**: Validate AI market rate comparisons against real web-scraped data (sample 10 quotes per week).
- **Floor Plan Dimension Accuracy**: Human review of AI-extracted dimensions (measure 3 rooms per survey, verify within 10% of stated dimensions).
- **Material Quantity Accuracy**: Compare AI-generated material lists to actual project requirements (sample 5 projects per month).
- **Collaboration Conflicts**: Test simultaneous edits (2 users move same wall at same time) → ensure graceful resolution.

### Quality Benchmarks (v1 Targets)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Floor Plan Dimension Extraction Accuracy | 70-80% (dimensions within 10% of survey) | Manual spot-checks (10 surveys/week) |
| Material Quantity Accuracy | Within 10% of actual requirements | Compare AI estimates to real project data |
| Cost Estimate Accuracy (with digital twin) | Within 20% of actual quotes | Track estimates vs. received quotes |
| Hazard Detection Recall | 95% (asbestos, lead, structural) | Regression tests on known property types |
| Quote Benchmarking Accuracy | Within 15% of web-scraped market data | Compare AI estimates to Checkatrade/MyBuilder data |
| AI Citation Rate | 100% (all safety-critical claims cited) | Automated checks on Clerk responses |
| Sequencing Logic Correctness | Zero false positives on hard dependencies | Unit tests + user feedback |
| Collaboration Latency | <500ms (presence updates, co-editing state sync) | WebSocket ping tests |
| CAD Tool Precision | Snap-to-grid within 1cm, orthogonal constraints 100% enforced | Automated UI tests |

### Conservative AI Philosophy

For safety-critical features (hazard detection, structural advice), **false positives are acceptable**:
- If AI is 40% confident asbestos is present → flag it (better to over-warn than miss a hazard)
- If survey mentions "possible subsidence" even once → surface it prominently (even if context suggests it's resolved)
- If user attempts to demo a wall without mentioning structural engineer → block action and require confirmation

**Rationale**: Homeowners can get second opinions from professionals, but they can't undo structural damage or asbestos exposure. Err on the side of caution.

---

## 6. Inspirations & References

**Product Inspirations**
- **Reno.co.uk (renovatewithreno.co.uk)**: Floor plan markup, material lists, tradesperson integration. **We match**: Floor plan annotations, material quantity calculations, project pack sharing. **We exceed**: AI-powered cost estimation using digital twin data (Reno requires manual entry for every material item), context-aware Clerk consultation (Reno has no AI assistant), collaborative real-time editing (Reno is single-user).
- **Notion**: Document intelligence (upload PDFs → structured knowledge base) + clean workspace for planning. We adopt: AI-powered document parsing, progressive disclosure of features, visual hierarchy, **collaborative workspaces with real-time presence**.
- **Figma**: Canvas-based collaborative editing with layers and annotations. We adopt: Desktop-optimized floor plan editor, drag-and-drop markup, color-coded layers for different trades, **real-time co-editing with presence indicators**.
- **Linear**: Shared workspace for teams with activity feeds and real-time updates. We adopt: Activity feed showing partner actions, collaborative decision-making, "who changed what" audit trail.
- **Monzo**: Real-time budget tracking with runway visibility ("You have 47 days left at your current spending rate"). We adopt: Live budget dashboard, spend tracking with time-based projections.
- **Checkatrade / MyBuilder**: Tradesperson marketplace with quote benchmarking. We adopt: Quote comparison against market rates (web-scraped data for v1), tradesperson directory with profiles and project sharing.
- **AutoCAD (Lite Version)**: Professional CAD tools adapted for non-experts. We adopt: Snap-to-grid, orthogonal constraints, measurement labels, precision drawing without overwhelming complexity, **fixture specifications capture** (not just visual symbols).

**Technical References**
- **UK Building Regulations**: Sequencing and compliance knowledge (Part L for energy efficiency, Part P for electrical, Part B for fire safety). Used for AI validation (e.g., "2.2m minimum ceiling height for habitable loft space").
- **RICS Home Survey Standards**: Structure for parsing survey documents (condition ratings, defect classifications).
- **UK Property Age Database (EPC Data)**: Era-specific risk profiles (pre-1900, 1900-1929, 1930-1949, 1950-1966, 1967-1975, 1976-1982, post-1982). Used to inform AI hazard detection without requiring users to navigate era-specific UI.
- **IET Wiring Regulations (BS 7671)**: Electrical material quantity calculations (e.g., "1 double socket per 4m² for kitchens, 1 per 8m² for bedrooms").

**Design Philosophy References**
- **Jobs to Be Done Framework**: Users "hire" Structa to solve "I have no roadmap for my renovation" (not "I need project management software"). Partners "hire" Structa to solve "We need to coordinate decisions without miscommunication." Users "hire" digital twin to solve "I need accurate cost estimates, not vague ranges."
- **Context-Aware Computing (Mark Weiser)**: The system should understand the user's environment (property type, location, age, **spatial dimensions**) without requiring manual input for every decision. Property age and spatial data inform AI transparently.
- **Progressive Disclosure (Jakob Nielsen)**: Show users only what they need at each stage. Three entry points (fast/deep/no-documents) accommodate different readiness levels. Digital twin metadata can be added incrementally (property-wide defaults → per-room overrides).
- **Collaborative Software Design (Figma/Linear)**: Real-time collaboration isn't a feature—it's the foundation. Design for multi-user from day one (presence, conflicts, activity feeds, permissions).
- **Digital Twin Methodology (Industry 4.0)**: Capture comprehensive spatial + technical metadata to enable AI-driven insights. Floor plans aren't just drawings—they're structured data layers (dimensions + materials + fixtures + specifications).

---

## 7. Documentation & Project Resources

### Quick Links

| Purpose | Document |
|---------|----------|
| **Architecture & Technical Decisions** | [ARCHITECTURE.md](ARCHITECTURE.md) |
| **Current Development Status** | [STATUS.md](STATUS.md) |
| **UI Components (shadcn)** | [design/UI.md](design/UI.md) |
| **Quality Tools & Testing** | [development/QUALITY_TOOLS.md](development/QUALITY_TOOLS.md) |
| **Testing Philosophy (TDD)** | [development/TESTING.md](development/TESTING.md) |
| **Coding Standards & Style** | [development/CODING_STYLE.md](development/CODING_STYLE.md) |
| **Tech Stack Documentation** | [architecture/TECH_STACK.md](architecture/TECH_STACK.md) |
| **Git Workflow & PRs** | [workflow/GIT_WORKFLOW.md](workflow/GIT_WORKFLOW.md) |
| **Deployment Rules** | [workflow/DEPLOYMENT.md](workflow/DEPLOYMENT.md) |
| **Development Plan (Phases)** | [specs/plan/00-overview.md](../specs/plan/00-overview.md) |
| **Mathematical & Physical Rules** | [maths/COVING_CALCULATIONS.md](maths/COVING_CALCULATIONS.md) |

### Documentation Structure

```
docs/
├── OVERVIEW.md              # This file - Project vision & quick links
├── ARCHITECTURE.md         # System architecture & design decisions
├── STATUS.md               # Current phase & roadmap
├── design/                 # UI design & component guidelines
│   └── UI.md              # shadcn/ui component usage & best practices
├── maths/                 # Mathematical & physical rules for construction calculations
│   └── COVING_CALCULATIONS.md # Crown molding compound angle formulas
├── development/            # Development practices & tools
│   ├── QUALITY_TOOLS.md   # TypeScript, Biome, Vitest commands
│   ├── TESTING.md         # TDD workflow & test guidelines
│   ├── CODING_STYLE.md    # Naming, imports, formatting rules
│   └── DEBUGGING.md      # Log locations & troubleshooting
├── architecture/           # Architecture & tech decisions
│   └── TECH_STACK.md      # Technology stack documentation
└── workflow/              # Git & deployment processes
    ├── GIT_WORKFLOW.md    # PR workflow, quality gates, commits
    └── DEPLOYMENT.md     # Deployment rules & restrictions
```

### For Agent Context

When working on this repository, see `AGENTS.md` at repository root for:
- Quick start commands
- Package structure overview
- Progressive documentation navigation
- Important rules and constraints

---

## What We're Building Toward (Post-v1)

**Phase 2 (Mobile App)**
- On-site reference: View floor plans, consult The Clerk while at the property
- Photo capture: Document site conditions, annotate progress photos
- **Photo-to-metadata**: AI extracts window specs, fixture details from photos to populate digital twin
- Offline mode: Access plans and documents without internet
- Partner notifications: "John is on-site and just uploaded a photo of the kitchen"

**Phase 3 (Tradesperson Ecosystem - Month 9+)**
- Automated tradesperson matching (after reaching 200+ active projects)
- Verified tradesperson network (background checks, insurance validation)
- Quote automation (tradespeople receive project packs with material lists, submit structured quotes via platform)
- Tradesperson ratings from completed projects (verified reviews)
- **Material price database**: Tradespeople share actual material costs → improve AI estimates

**Digital Twin Evolution (Phase 2-3)**
- **3D Visualization**: Convert 2D floor plans to walkable 3D models (click "View in 3D" → explore rooms)
- **AI Render Generation**: Floor plan + material specs → photorealistic renders ("Show me kitchen with white cabinets vs. grey")
- **Extensions in 3D**: Easy-to-use 3D modeling tool for planning additions (drag walls in 3D space)
- **Thermal Analysis**: Heating cost estimation based on room volumes, insulation, window types, orientation ("Your living room loses £240/year through single-glazed windows—upgrade to triple glazing saves £180/year")
- **Light Optimization**: AI suggests window placement based on orientation ("Moving kitchen window to south wall increases natural light by 40%")
- **Resale Value Impact**: "This kitchen extension adds £40-60k to property value based on comparable sales in your postcode"
- **Planning Permission Checks**: AI flags if extension exceeds permitted development based on property dimensions ("Your proposed 4m rear extension exceeds 3m limit for terraced houses—requires full planning application")
- **Energy Performance**: EPC rating prediction based on digital twin ("Adding loft insulation + double glazing improves EPC from D to B, saving £680/year")

**Future Enhancements**
- Multi-project management (for landlords or serial renovators)
- Milestone-based escrow (payment protection tied to work completion)
- Advanced scheduling (Gantt charts, tradesperson calendar coordination)
- AR overlays (visualize renovations in augmented reality via mobile app—point phone at wall, see new kitchen extension rendered)
- AI photo analysis (upload photo of wall, AI identifies materials, condition, and suggests repairs with cost estimates)
- Operational transforms for conflict-free floor plan co-editing (beyond last-write-wins)
- **BIM Integration**: Import/export IFC files for professional architect collaboration
- **IoT Integration**: Connect smart meters → track actual energy usage vs. digital twin thermal predictions

---

**Document Version**: 3.0 (Phase 1: Overview Discovery Complete - Digital Twin Emphasis)  
**Last Updated**: January 22, 2026  
**Next Phase**: Architecture Discovery (Stack, Data Flow, Technical Decisions)

---

## Key Changes from Version 2.0

**Digital Twin Additions:**
- ✅ Added "Digital Twin Foundation" as 3rd core identity bullet
- ✅ Section 2.3: Complete rewrite of Floor Plan Markup Tool to emphasize spatial data capture (ceiling heights per floor, wall materials property-wide, window/door specs, fixture specifications)
- ✅ Section 3.1: Added example showing generic answer vs. digital twin-enabled answer with material + labour breakdown
- ✅ Section 4 (User Journey): Updated Deep Path to show spatial data capture during onboarding and floor plan editing
- ✅ Section 5 (Quality): Added material quantity accuracy and cost estimate accuracy benchmarks
- ✅ Section 6 (Inspirations): Added Reno.co.uk (what we match vs. exceed), added IET Wiring Regulations reference
- ✅ "What We're Building Toward": Added comprehensive "Digital Twin Evolution" section (3D viz, AI renders, thermal analysis, resale value, planning checks, EPC predictions)

**Core Philosophy Shift:**
- Floor plans are no longer just drawings—they're **structured data layers** (dimensions + materials + fixtures + specifications)
- Cost estimation shifts from "generic ranges" to "material + labour breakdowns based on digital twin"
- Material lists become a core feature (on-demand via Clerk, included in project packs)
- Quote comparison becomes line-item analysis (quote vs. digital twin material quantities)
