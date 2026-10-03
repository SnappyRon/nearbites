# NearBites — UX Architecture & User Flows Specification

> **Document Status**: CANONICAL UX SPECIFICATION (Baseline v1.0)  
> **Release Target**: Mobile MVP (iOS & Android)  
> **Core Interaction**: Map Marker Selection → Photo-First Peek Bottom Sheet (< 200ms)  
> **Navigation Baseline**: 4-Tab Navigation Shell (`Map`, `Saved`, `Add`, `Profile`)

---

## Table of Contents

1. [Information Architecture & Navigation Hierarchy](#1-information-architecture--navigation-hierarchy)
2. [Complete User Journey Flowcharts (Flows 1 to 9)](#2-complete-user-journey-flowcharts-flows-1-to-9)
   - [Flow 1: Cold Start & Geolocation Permission Flow](#flow-1-cold-start--geolocation-permission-flow)
   - [Flow 2: Map Discovery & Budget Filtering Flow](#flow-2-map-discovery--budget-filtering-flow)
   - [Flow 3: Map Marker Selection to Bottom Sheet Flow](#flow-3-map-marker-selection-to-bottom-sheet-flow)
   - [Flow 4: Tripartite Search & Area Exploration Flow](#flow-4-tripartite-search--area-exploration-flow)
   - [Flow 5: Progressive Authentication Interception Flow](#flow-5-progressive-authentication-interception-flow)
   - [Flow 6: Favorites Management Flow](#flow-6-favorites-management-flow)
   - [Flow 7: Community Contribution Wizard Flow](#flow-7-community-contribution-wizard-flow)
   - [Flow 8: Price Freshness & Community Verification Flow](#flow-8-price-freshness--community-verification-flow)
   - [Flow 9: Content Reporting & Flagging Flow](#flow-9-content-reporting--flagging-flow)
3. [State Machine Specification for Map & Bottom Sheet](#3-state-machine-specification-for-map--bottom-sheet)
4. [Exhaustive Error & Recovery Matrix](#4-exhaustive-error--recovery-matrix)

---

## 1. Information Architecture & Navigation Hierarchy

NearBites is architected around an uncluttered 4-tab bottom navigation shell. Public food exploration is completely ungated. Secondary modalities, detailed meal views, and authentication are managed through non-intrusive bottom sheets and contextual overlays.

```mermaid
graph TD
    App["NearBites Mobile App"] --> NavShell["4-Tab Navigation Shell"]
    
    subgraph Tabs ["Primary Navigation Tabs"]
        NavShell --> TabMap["Tab 1: Map (Default Discovery)"]
        NavShell --> TabSaved["Tab 2: Saved (Favorites)"]
        NavShell --> TabAdd["Tab 3: Add (Meal Contribution)"]
        NavShell --> TabProfile["Tab 4: Profile (Settings & History)"]
    end

    subgraph MapOverlays ["Map Contextual Overlays & Sheets"]
        TabMap --> TopBar["Top Bar: Search Input + Location Button"]
        TabMap --> BudgetBar["Budget Carousel: All, ≤ ₱99, ≤ ₱150, ≤ ₱250, Slider"]
        TabMap --> MapCanvas["PostGIS Geospatial Map Canvas"]
        TabMap --> SearchOverlay["Search Overlay: Tripartite Autocomplete"]
        TabMap --> SliderModal["Custom Budget Slider Bottom Sheet"]
        TabMap --> PeekSheet["Meal Bottom Sheet (Peek State ~200dp)"]
        PeekSheet --> ExpandedSheet["Meal Bottom Sheet (Expanded State 85%)"]
        ExpandedSheet --> VenueSheet["Venue Detail Sub-Sheet"]
        ExpandedSheet --> ExtNav["External Navigation App (Apple/Google Maps)"]
    end

    subgraph AuthLayer ["Progressive Interception Layer"]
        TabSaved -.-> AuthModal["Progressive Auth Modal Sheet"]
        TabAdd -.-> AuthModal
        PeekSheet -.-> AuthModal
        ExpandedSheet -.-> AuthModal
    end
```

### 1.1 Primary Navigation Tabs

| Tab | Icon | Route | Access Level | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Map** | Map Pin / Compass | `/ (index)` | Anonymous / Public | Primary discovery interface. Viewport map markers, budget filter chips, and photo-first bottom sheet. |
| **Saved** | Heart (Outline / Fill) | `/saved` | Protected (Progressive Auth) | List/grid of favorited meals. Prompts auth modal if anonymous user taps tab. |
| **Add** | Plus Circle | `/add` | Protected (Progressive Auth) | Multi-step community meal & restaurant submission wizard. Staged as pending. |
| **Profile** | User Avatar | `/profile` | Anonymous & Authenticated | Account preferences, submission history, price verification counter, legal/terms. |

### 1.2 Contextual Overlays & Modal Architecture

- **Search Overlay**: Floats over the map canvas when search bar is focused; shows recent queries, popular categories, and neighborhood suggestions.
- **Custom Budget Modal**: Bottom sheet modal providing a fine-grained price slider (`₱50` to `₱500` in `₱10` increments).
- **Meal Bottom Sheet (Peek State ~200dp)**: Non-blocking bottom sheet showing hero photo, dish title, price badge, venue name, distance, and one-tap "Get Directions".
- **Meal Bottom Sheet (Expanded State 85% height)**: Scrollable sheet showing multi-photo carousel, freshness indicator badge, operating hours, and other dishes at this eatery.
- **Progressive Auth Modal**: Slide-up sheet triggered when an anonymous user attempts a write action (Favorite, Verify, Submit, Report).
- **Content Reporting Sheet**: Structured modal to report incorrect prices, closed eateries, bad photos, or duplicate dishes.

---

## 2. Complete User Journey Flowcharts (Flows 1 to 9)

### Flow 1: Cold Start & Geolocation Permission Flow

Handles first-time launch, foreground permission requests, granting, and non-blocking recovery when permission is denied or restricted.

```mermaid
flowchart TD
    Start["User Opens App (Cold Start)"] --> CheckStorage{"Has user seen<br/>permission prompt?"}
    
    CheckStorage -- "No" --> ShowExplainer["Display Native OS Location Dialog<br/>'Allow NearBites to find food near you'"]
    CheckStorage -- "Yes" --> QueryPerm["Query System Permission Status"]
    
    ShowExplainer --> PermResult{"Permission Decision"}
    
    PermResult -- "Granted (While in Use)" --> LockGPS["Acquire Foreground Coordinates<br/>(lat, lng) via Expo Location"]
    PermResult -- "Denied / Restricted" --> SetDefaultArea["Set Map Camera to Default Pilot Center<br/>(e.g., University Belt, Manila)"]
    
    QueryPerm -- "Granted" --> LockGPS
    QueryPerm -- "Denied" --> SetDefaultArea
    
    LockGPS --> AnimateMap["Smoothly Pan Camera to GPS Coordinates<br/>(Zoom Level: 16z)"]
    AnimateMap --> FetchMarkers["Fetch Viewport Markers<br/>with Active Budget Filter"]
    
    SetDefaultArea --> ShowToast["Display Non-Blocking Toast:<br/>'Location off. Showing Manila Pilot Area.'"]
    ShowToast --> HighlightSearch["Highlight Search Bar with District Chips"]
    HighlightSearch --> FetchMarkers
    
    FetchMarkers --> Idle["Map Ready (State: IDLE_MAP)"]
```

---

### Flow 2: Map Discovery & Budget Filtering Flow

Controls the interactive map canvas, 300ms query debouncing upon camera idle, marker clustering, and instant client/server budget filtering.

```mermaid
flowchart TD
    Idle["State: IDLE_MAP"] --> UserAction{"User Map Action"}
    
    UserAction -- "Pan / Zoom Camera" --> DebounceTimer["Start 300ms Debounce Timer"]
    DebounceTimer --> CameraIdle{"Camera Stopped > 300ms?"}
    CameraIdle -- "No (Still dragging)" --> DebounceTimer
    CameraIdle -- "Yes" --> ExtractBounds["Extract Viewport Bounding Box<br/>[min_lat, min_lng, max_lat, max_lng]"]
    
    ExtractBounds --> QueryDB["PostGIS Viewport RPC<br/>with Active Max Budget Ceiling"]
    QueryDB --> MarkersReturn["Receive Markers Payload<br/>(id, title, price, lat, lng, thumb, status)"]
    MarkersReturn --> RenderMarkers["Render Clustered / Standalone Price Markers"]
    
    UserAction -- "Tap Budget Chip (e.g. ≤ ₱150)" --> UpdateBudget["Set Active Budget Filter = 150"]
    UpdateBudget --> FilterClient["Instant Client Filter:<br/>Hide visible markers with price > ₱150"]
    FilterClient --> RequeryDB["Refresh Viewport Query with max_price = 150"]
    
    UserAction -- "Tap Custom Slider Button" --> OpenSliderModal["Open Custom Budget Slider Modal"]
    OpenSliderModal --> AdjustSlider["User Drags Slider to Target (e.g. ₱130)"]
    AdjustSlider --> ApplySlider["Tap 'Apply Budget'"]
    ApplySlider --> UpdateBudget
    
    RequeryDB --> CheckResults{"Any markers returned?"}
    CheckResults -- "Count > 0" --> RenderMarkers
    CheckResults -- "Count == 0" --> ShowEmptyState["Display Empty State Banner<br/>(Mascot with empty bowl + 'Raise budget')"]
```

---

### Flow 3: Map Marker Selection to Bottom Sheet Flow

The core interaction of NearBites. Tapping a price pin snaps the bottom sheet to Peek State (~200dp) in under 200ms, positioning the camera so the pin remains visible.

```mermaid
flowchart TD
    MarkerTap["User Taps Price Marker (e.g. '₱99')"] --> VisualFeedback["1. Marker Scales 1.15x<br/>2. Deep Teal fill + Warm Gold border<br/>3. Pan camera slightly north (+80dp offset)"]
    
    VisualFeedback --> SnapPeek["Snap Bottom Sheet to Peek State (~200dp)<br/>Animation completes in < 200ms"]
    
    SnapPeek --> RenderPeekContent["Render Peek Content:<br/>• 1:1 Food Photo Thumbnail (96x96)<br/>• Dish Title (bold, max 2 lines)<br/>• Large Price Badge ('₱99')<br/>• Venue Name + Distance ('210m')<br/>• 'Get Directions' Button"]
    
    RenderPeekContent --> UserGesture{"User Gesture / Interaction"}
    
    UserGesture -- "Swipe Sheet Up" --> ExpandSheet["Animate Sheet to Expanded State (85% height)"]
    UserGesture -- "Tap 'Get Directions'" --> LaunchNav["Resolve Native Navigation Provider<br/>(iOS: Apple Maps / Android: Google Maps)"]
    UserGesture -- "Tap Map Backdrop / Swipe Down" --> DismissSheet["Animate Sheet to Hidden State (0dp)<br/>Reset Selected Marker Scale"]
    UserGesture -- "Tap Venue Name" --> OpenVenue["Open Venue Detail Sheet (All meals at eatery)"]
    
    ExpandSheet --> RenderExpanded["Render Expanded Details:<br/>• 16:9 Hero Photo Carousel<br/>• Price Freshness Badge (<30d, 30-90d, >90d)<br/>• 'Confirm Price' / 'Report Correction' CTAs<br/>• Operating Hours Status (Open/Closed)<br/>• Other affordable meals at venue"]
    
    LaunchNav --> ExtApp["External Turn-by-Turn Directions Launched"]
    DismissSheet --> BackToIdle["Return to State: IDLE_MAP"]
```

---

### Flow 4: Tripartite Search & Area Exploration Flow

Handles instant debounced search across three distinct entities: Meal Titles, Food Categories, and Neighborhoods/Streets.

```mermaid
flowchart TD
    TapSearch["User Taps Top Search Input"] --> OpenOverlay["Slide Down Search Overlay (State: SEARCH_OPEN)<br/>Show Recent Searches + Popular Districts"]
    
    OpenOverlay --> UserTypes["User Types Query (e.g. 'Sisig')"]
    UserTypes --> DebounceSearch["Debounce Input (300ms)"]
    
    DebounceSearch --> QuerySearch["Execute Search across 3 Entities:<br/>1. Dishes (e.g., 'Pork Sisig')<br/>2. Categories (e.g., 'Silog', 'Pares')<br/>3. Neighborhoods (e.g., 'Sampaloc, Manila')"]
    
    QuerySearch --> ShowResults["Display Grouped Autocomplete Results"]
    
    ShowResults --> SelectResult{"User Selects Item"}
    
    SelectResult -- "Selects Neighborhood" --> FlyToArea["Animate Map Camera to District Coordinates (15z)<br/>Close Search Overlay<br/>Load Area Budget Markers"]
    
    SelectResult -- "Selects Meal Title" --> FilterMapMeal["Filter Viewport to Matching Dish Pins<br/>Auto-select nearest matching marker<br/>Open Peek Bottom Sheet"]
    
    SelectResult -- "Selects Food Category" --> FilterCategory["Filter Active Viewport by Category Keyword<br/>Close Search Overlay"]
    
    SelectResult -- "Taps Cancel / Back" --> CloseOverlay["Dismiss Search Overlay<br/>Restore Previous Map Viewport"]
```

---

### Flow 5: Progressive Authentication Interception Flow

Allows 100% friction-free discovery. When an anonymous user attempts any write or bookmark action, the flow intercepts, preserves the pending action, authenticates, and resumes automatically.

```mermaid
flowchart TD
    AnonymousUser["User is Browsing Anonymously"] --> ActionTrigger{"User Triggers Protected Action"}
    
    ActionTrigger -- "Tap Favorite Heart" --> SavePending["Save to Memory: PENDING_FAVORITE(meal_id)"]
    ActionTrigger -- "Tap Confirm Price" --> SavePending2["Save to Memory: PENDING_CONFIRM(meal_id)"]
    ActionTrigger -- "Tap Submit Correction" --> SavePending3["Save to Memory: PENDING_CORRECTION(meal_id)"]
    ActionTrigger -- "Tap Add Dish (+ Tab)" --> SavePending4["Save to Memory: PENDING_ADD_MEAL()"]
    ActionTrigger -- "Tap Report Listing" --> SavePending5["Save to Memory: PENDING_REPORT(target_id)"]
    
    SavePending & SavePending2 & SavePending3 & SavePending4 & SavePending5 --> OpenAuthModal["Open Progressive Auth Modal Sheet<br/>(State: AUTH_MODAL_ACTIVE)"]
    
    OpenAuthModal --> ShowProviders["Present Sign-In Options:<br/>• Continue with Google<br/>• Continue with Apple<br/>• Email Magic Link"]
    
    ShowProviders --> UserAuthChoice{"User Interaction"}
    
    UserAuthChoice -- "Dismiss / Tap Close" --> DismissModal["Dismiss Auth Sheet<br/>Clear Pending Action Memory<br/>Remain on Current Screen Uninterrupted"]
    
    UserAuthChoice -- "Completes Authentication" --> SupabaseAuth["Supabase Auth Session Established<br/>User Profile Created / Loaded"]
    
    SupabaseAuth --> AutoDismiss["Dismiss Auth Modal Sheet Automatically"]
    AutoDismiss --> ExecutePending{"Execute Interrupted Action"}
    
    ExecutePending -- "PENDING_FAVORITE" --> AddFavorite["Add to `favorites` Table<br/>Animate Heart Icon to Solid Warm Gold<br/>Show Toast: 'Saved to favorites!'"]
    ExecutePending -- "PENDING_CONFIRM" --> RecordConfirm["Record in `price_confirmations`<br/>Update Freshness Badge to Fresh Green<br/>Show Toast: 'Price verified!'"]
    ExecutePending -- "PENDING_ADD_MEAL" --> LaunchWizard["Navigate to Step 1 of Contribution Wizard"]
    ExecutePending -- "PENDING_REPORT" --> OpenReportSheet["Open Content Reporting Modal Sheet"]
```

---

### Flow 6: Favorites Management Flow

Authenticated bookmark management accessible via the bottom navigation "Saved" tab.

```mermaid
flowchart TD
    OpenSaved["User Taps 'Saved' Tab"] --> CheckAuth{"Is User Authenticated?"}
    
    CheckAuth -- "No" --> ShowEmptyAuth["Display Saved Tab Teaser Screen<br/>Mascot: 'Sign in to save your favorite budget spots!'<br/>Button: 'Sign In / Register'"]
    ShowEmptyAuth --> TapSignIn["User Taps 'Sign In'"] --> OpenAuthModal["Open Progressive Auth Modal"]
    
    CheckAuth -- "Yes" --> FetchFavorites["Fetch Saved Meals from Supabase<br/>JOIN meals, restaurants, meal_photos"]
    
    FetchFavorites --> CheckCount{"Any saved meals?"}
    
    CheckCount -- "0 meals" --> ShowZeroState["Display Empty State:<br/>Mascot scout peering through binoculars<br/>'No saved meals yet. Tap the heart on any dish!'<br/>Button: 'Explore Food Nearby'"]
    ShowZeroState --> TapExplore["Tap 'Explore Food Nearby'"] --> SwitchToMap["Switch to Map Tab"]
    
    CheckCount -- "> 0 meals" --> RenderGrid["Render Saved Meals List/Grid<br/>Sort controls: 'Recently Added' | 'Distance'"]
    
    RenderGrid --> UserCardAction{"User Action on Card"}
    
    UserCardAction -- "Tap Dish Card" --> OpenDetail["Open Meal Detail Bottom Sheet<br/>(Peek / Expanded State)"]
    
    UserCardAction -- "Tap Active Heart Icon" --> OptimisticRemove["Optimistically Remove Card from Screen"]
    OptimisticRemove --> ShowUndo["Display 5-Second Undo Snackbar:<br/>'Removed from Saved. [Undo]'"]
    
    ShowUndo --> UndoAction{"User Taps Undo?"}
    UndoAction -- "Yes (< 5 seconds)" --> RestoreCard["Restore Card to Saved List<br/>Cancel Deletion"]
    UndoAction -- "No (Timeout > 5s)" --> DeleteRecord["Execute DELETE on `favorites` table in DB"]
```

---

### Flow 7: Community Contribution Wizard Flow

Guided 4-step wizard to submit new meals and venues with camera integration, client-side compression (<500KB WebP), and staging into the `pending` moderation queue.

```mermaid
flowchart TD
    StartAdd["User Taps 'Add' Tab (Authenticated)"] --> Step1["Step 1: Venue Selection"]
    
    Step1 --> VenueChoice{"Venue Origin"}
    VenueChoice -- "Pick Nearby Venue" --> SelectExisting["Select from Proximity List<br/>(e.g., 'Mang Larry's Isawan')"]
    VenueChoice -- "New Eatery" --> DropPin["Drop Pin on Map + Enter Venue Name & Address"]
    
    SelectExisting & DropPin --> Step2["Step 2: Meal Details"]
    Step2 --> EnterFields["Enter Dish Title (e.g. 'Pork BBQ 3pcs')<br/>Select Category (e.g. 'BBQ & Street Food')<br/>Enter Price in PHP (e.g. '₱75')"]
    
    EnterFields --> ValidateStep2{"Fields Valid?<br/>(Title length ≥ 3, Price > 0)"}
    ValidateStep2 -- "Invalid" --> ShowErrors["Display Inline Red Validation Errors"]
    ValidateStep2 -- "Valid" --> Step3["Step 3: Food Photo Upload"]
    
    Step3 --> PhotoSource{"Photo Source"}
    PhotoSource -- "Take Photo" --> OpenCamera["Open Camera with Centered Framing Box Overlay"]
    PhotoSource -- "Choose from Library" --> OpenPicker["Open System Image Picker"]
    
    OpenCamera & OpenPicker --> CompressImage["Client-Side Processing:<br/>1. Resize max 1600px dimension<br/>2. Compress to WebP / JPEG quality 80%<br/>3. Verify payload < 500KB"]
    
    CompressImage --> Step4["Step 4: Review & Submit"]
    Step4 --> ShowPreview["Display Full Card Preview as it will look on NearBites<br/>Notice: 'Submissions are reviewed by our scouts before going live.'"]
    
    ShowPreview --> TapSubmit["User Taps 'Submit Dish'"]
    
    TapSubmit --> UploadStorage["Upload Photo to Supabase Storage `submission_photos`"]
    UploadStorage --> InsertSubmission["Insert Record into `submissions` Table<br/>Status: 'pending'"]
    
    InsertSubmission --> ShowSuccess["Display Confirmation Modal:<br/>Mascot Scout giving thumbs up<br/>'Salamat! Your dish was sent to our scouts.'<br/>Button: 'Back to Map'"]
    ShowSuccess --> BackMap["Redirect to Map Tab"]
```

---

### Flow 8: Price Freshness & Community Verification Flow

Ensures price accuracy through lightweight community updates without destructive overwrites.

```mermaid
flowchart TD
    ViewDetail["User Viewing Meal in Expanded Bottom Sheet"] --> FreshnessCheck{"Inspect Price Freshness Badge"}
    
    FreshnessCheck -- "< 30 days" --> TierFresh["Fresh Green Badge: 'Verified X days ago'"]
    FreshnessCheck -- "30–90 days" --> TierAging["Warm Gold Badge: 'Confirmed X months ago'"]
    FreshnessCheck -- "> 90 days" --> TierStale["Charcoal/Alert Badge: 'Price may have changed'"]
    
    TierFresh & TierAging & TierStale --> UserInspects{"User Verification Action"}
    
    UserInspects -- "Taps 'Confirm Price Still Valid'" --> CheckAuth1{"Authenticated?"}
    CheckAuth1 -- "No" --> AuthModal1["Trigger Progressive Auth Modal"]
    CheckAuth1 -- "Yes" --> OptimisticConfirm["Optimistically update badge to Fresh Green ('Verified today')"]
    OptimisticConfirm --> InsertConfirmDB["Insert record into `price_confirmations`<br/>Update `last_confirmed_at` = NOW() on meal"]
    InsertConfirmDB --> Toast1["Show Toast: 'Thanks for keeping prices fresh!'"]
    
    UserInspects -- "Taps 'Submit Price Correction'" --> CheckAuth2{"Authenticated?"}
    CheckAuth2 -- "No" --> AuthModal2["Trigger Progressive Auth Modal"]
    CheckAuth2 -- "Yes" --> OpenCorrectionModal["Open Price Correction Modal Sheet"]
    
    OpenCorrectionModal --> InputPrice["Input Current In-Store Price (e.g. ₱110 instead of ₱99)<br/>Optional: Attach receipt/menu board photo"]
    InputPrice --> SubmitCorrection["Tap 'Submit Correction'"]
    SubmitCorrection --> AppendHistory["Insert record into `price_history`<br/>Status: 'pending_verification'"]
    AppendHistory --> Toast2["Show Toast: 'Correction submitted for scout review!'"]
```

---

### Flow 9: Reporting & Content Flagging Flow

Community moderation system that protects content quality with automated temporary unpublishing upon reaching threshold.

```mermaid
flowchart TD
    TriggerReport["User Taps 'Report Issue' (Meal or Venue)"] --> CheckAuth{"Is User Authenticated?"}
    
    CheckAuth -- "No" --> TriggerAuth["Open Progressive Auth Modal Sheet"]
    CheckAuth -- "Yes" --> OpenReportSheet["Open Reporting Bottom Sheet"]
    
    OpenReportSheet --> SelectReason["User Selects Report Category:<br/>1. Incorrect / Outdated Price<br/>2. Restaurant is Permanently Closed<br/>3. Offensive / Inappropriate Photo<br/>4. Duplicate Listing<br/>5. Dish No Longer Offered"]
    
    SelectReason --> OptionalNote["Optional: Enter Details / Notes (max 200 chars)"]
    OptionalNote --> SubmitReport["Tap 'Submit Report'"]
    
    SubmitReport --> InsertReport["Insert Row into `reports` Table<br/>(user_id, target_id, target_type, reason, note)"]
    
    InsertReport --> CheckThreshold{"Query Count of Distinct User Reports<br/>for target_id in last 30 days"}
    
    CheckThreshold -- "Count < 3" --> NormalToast["Display Toast:<br/>'Thanks for reporting. Our scouts will inspect this.'"]
    
    CheckThreshold -- "Count >= 3 Flags" --> AutoHide["Automated Safety Guardrail:<br/>Update `moderation_status` = 'flagged_hidden'<br/>Exclude item from public PostGIS viewport queries"]
    AutoHide --> AlertAdmin["Route High-Priority Alert to Moderation Dashboard"]
    AlertAdmin --> NormalToast
```

---

## 3. State Machine Specification for Map & Bottom Sheet

The core mobile experience coordinates map camera movements with bottom sheet gestures so that selected markers are never obscured by UI chrome.

```mermaid
stateDiagram-v2
    [*] --> IDLE_MAP: App Launch / Foregrounded
    
    IDLE_MAP --> SEARCH_OPEN: Tap Search Bar
    SEARCH_OPEN --> IDLE_MAP: Tap Back / Backdrop / Select Area
    
    IDLE_MAP --> MARKER_SELECTED_PEEK: Tap Price Marker on Map
    MARKER_SELECTED_PEEK --> IDLE_MAP: Tap Map Canvas / Swipe Sheet Down
    
    MARKER_SELECTED_PEEK --> MARKER_SELECTED_PEEK: Tap Different Price Marker
    
    MARKER_SELECTED_PEEK --> BOTTOM_SHEET_EXPANDED: Swipe Sheet Up / Tap Header
    BOTTOM_SHEET_EXPANDED --> MARKER_SELECTED_PEEK: Drag Sheet Down
    BOTTOM_SHEET_EXPANDED --> IDLE_MAP: Fling Sheet Down / Tap Back Button
    
    BOTTOM_SHEET_EXPANDED --> VENUE_VIEW_EXPANDED: Tap Venue Name / Address
    VENUE_VIEW_EXPANDED --> BOTTOM_SHEET_EXPANDED: Tap Back to Dish
    VENUE_VIEW_EXPANDED --> IDLE_MAP: Close Sheet
    
    MARKER_SELECTED_PEEK --> AUTH_MODAL_ACTIVE: Tap Favorite / Confirm Price (Unauthed)
    BOTTOM_SHEET_EXPANDED --> AUTH_MODAL_ACTIVE: Tap Report / Correction (Unauthed)
    AUTH_MODAL_ACTIVE --> MARKER_SELECTED_PEEK: Auth Complete / Dismiss
```

### 3.1 State Definitions & Camera Coordination

| State Name | Visible UI Chrome | Bottom Sheet Height | Camera Pan Behavior | Map Interactivity |
| :--- | :--- | :---: | :--- | :--- |
| **`IDLE_MAP`** | Search Bar, Budget Chips, Floating Location Button, Navigation Bar | `0dp` (Hidden) | Free user panning / zooming. | 100% interactive. Marker taps enabled. |
| **`MARKER_SELECTED_PEEK`** | Search Bar (dimmed), Budget Chips, Navigation Bar, Peek Bottom Sheet | `~200dp` (~25% screen) | **Auto-pan camera**: Centers selected marker coordinates with a `+80dp` vertical northward offset so marker stays visible above Peek Sheet. | Map behind sheet remains pan-able. Tapping another marker switches peek target. Tapping empty map dismisses sheet. |
| **`BOTTOM_SHEET_EXPANDED`** | Expanded Sheet Header with Back/Close affordance, full photo gallery, detail tabs | `85%` screen height | Map camera frozen. Map dimmed behind 40% Charcoal backdrop overlay. | Map touch disabled; gestures scroll sheet contents or collapse sheet. |
| **`VENUE_VIEW_EXPANDED`** | Venue Header, Exterior Photo, Full list of affordable meals at venue | `85%` screen height | Map camera frozen. | Scrollable list of meals; tapping any meal transitions back to meal detail. |
| **`SEARCH_OPEN`** | Search Input active with autofocus, Autocomplete suggestions, Recent chips | `100%` screen overlay | Camera remains at current position until suggestion selected. | Map occluded by search overlay. |
| **`AUTH_MODAL_ACTIVE`** | Modal sheet over dimmed screen, Social Auth buttons, Terms link | `~340dp` (Modal) | Camera frozen. | Map and underlying sheets touch-disabled until modal resolves. |

### 3.2 Gesture & Drag Thresholds

- **Peek to Expanded Transition**: Swiping upward with a velocity > `500dp/s` or dragging upward past `260dp` snaps sheet to `85%` height using Reanimated spring physics (`damping: 20`, `stiffness: 150`).
- **Expanded to Peek Transition**: Dragging downward from sheet top handle past `70%` screen height snaps back to `Peek State (~200dp)`.
- **Dismissal Threshold**: Dragging downward from Peek State past `120dp` or flinging downward with velocity > `600dp/s` dismisses the sheet completely (`0dp`), restoring `IDLE_MAP`.

---

## 4. Exhaustive Error & Recovery Matrix

| Scenario / Trigger | Entry Condition | System Action & Visual State | Error Indication | Recovery Path (User & System) |
| :--- | :--- | :--- | :--- | :--- |
| **Location Permission Denied** | User taps "Don't Allow" on OS prompt or permission restricted in settings. | Map centers on default pilot coordinate (Manila University Belt: `14.5995° N, 120.9842° E`). Non-blocking top snackbar appears. | Mascot icon with subtle text: *"Location off. Showing Manila Pilot area."* | 1. User can tap "Change Area" to open manual neighborhood search.<br>2. User can tap "Settings" on toast to open OS App Settings. |
| **Complete Offline / No Network** | Device loses WiFi and Cellular data connection during discovery. | Map displays cached map tiles. Bounding box query fails. Sticky offline banner slides down below budget bar. | Mascot Scout holding compass: *"You're offline. Showing previously loaded meals."* Offline banner `#222A28` with `#D8964B` text. | 1. System caches last successful viewport in local SQLite storage.<br>2. User can browse already-rendered markers.<br>3. Banner includes "Retry Connection" button that re-fires query when tapped. |
| **Weak / Intermittent Network** | Viewport query or bottom sheet detail request exceeds 5.0-second timeout. | Request aborts gracefully. Skeleton placeholders remain visible. Non-intrusive bottom snackbar displays. | Toast notification: *"Connection is sluggish. Tap to reload."* | 1. Auto-retry once with exponential backoff (1s delay).<br>2. If secondary retry fails, present explicit "Reload Meals" floating action pill over map. |
| **Zero Budget Matches in Viewport** | Active budget filter (e.g. `≤ ₱80`) yields 0 meals in currently visible bounding box. | All map markers disappear. A soft Cream card slides into the bottom viewport. | Mascot Scout presenting empty bowl: *"No meals found under ₱80 in this area."* | 1. Prominent primary button: *"Reset Budget to ≤ ₱150"*.<br>2. Secondary action: *"Explore Wider Area"* (automatically zooms out map by 2 zoom levels). |
| **Image Loading Failure** | Food photo fails to load (CDN 404, DNS failure, corrupted bytes). | Meal card / bottom sheet renders all text, price, venue, and distance data uninterrupted. | Image box displays warm Cream background (`#F5EBD7`) with a category glyph (e.g., 🍜 or 🍗) and subtle retry icon. | 1. User can tap the placeholder icon to retry fetching image asset.<br>2. App automatically falls back to secondary photo from `meal_photos` table if available. |
| **Progressive Auth Abandonment** | Anonymous user triggers auth modal (e.g. via Favorite), but swipes down or taps "X". | Auth modal sheet dismisses smoothly. Screen returns to exact previous state. | No error alert shown. Heart icon remains in unselected outline state. | 1. Interrupted action is discarded gracefully from memory.<br>2. User continues browsing without interruption or nag screens. |
| **Submission Upload Failure** | Network drops while uploading photo (>1MB) or inserting row into `submissions` table. | Upload progress bar halts. Form retains all user-typed inputs in local memory (Title, Price, Venue, Photo URI). | Red alert toast: *"Upload failed due to connection error. Your draft is saved."* | 1. "Retry Submission" button appears on Step 4.<br>2. Photo and inputs are cached in local draft storage so user never re-types data. |
