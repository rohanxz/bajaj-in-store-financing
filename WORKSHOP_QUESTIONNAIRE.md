# Bajaj POS Agentic AI MVP - Workshop Driving Questionnaire

> **Role Focus**: API Design & Frontend Development (PWA / Middleware / Data Integration)  
> **Target Audience**: Customer (BFL Business & Architecture Teams) + AI/ML Engineering Team  
> **Objective**: Guide the discovery design workshops (Weeks 1–2) to establish rock-solid API contracts, Firestore database schemas, PWA screen workflows, and AI/ML handoff boundaries.

---

## 📅 Session 1: PWA Screen Inventory, CUJ & UX Workflows
*Target: Align on the 10-screen PWA layout, hardware capabilities, and state transitions.*

### 1.1 Customer Front-of-Store (FOS) Experience
1. **Screen Breakdown (Customer Flow)**:
   - What are the exact screen transitions for the customer flow (e.g., *Home/Welcome ➔ Voice Product Search ➔ Product EMI Comparison ➔ Document Capture ➔ Instant Loan Result*)?
   - How should the conversational UI display voice feedback? Should it render real-time streaming text (chat bubbles) alongside audio, or voice-only animations?
2. **Camera & Document Capture UI**:
   - Does the camera view require real-time bounding box overlays (e.g., PAN card auto-capture frame, barcode scanner reticle) or a standard tap-to-capture trigger?
   - What image resolution and aspect ratio constraints should the PWA enforce before sending payloads to Document AI?
3. **Offline Tolerance & Network Flakes**:
   - What user interface indicator should appear if store Wi-Fi drops momentarily during a voice search or OCR submission?
   - Which actions can be queued locally in the Firestore SDK cache vs. which actions require blocking screen spinners?

### 1.2 Sales Enablement Portal Experience
4. **Sales Team Screen Breakdown**:
   - What views are required for the Sales Portal (e.g., *Active In-Store Sessions Dashboard, Live Conversation Transcript View, Extracted Intent Summary Card, Historical Customer Session Logs*)?
   - Should a sales rep be able to "take over" or view real-time state mutations while the customer is on the PWA?
5. **Real-Time Log Synchronization**:
   - How frequently should conversation transcripts and intent summaries stream into the Sales Portal view (instant per-message stream vs. batch on turn complete)?

---

## 📡 Session 2: AI/ML Service Handoffs & API Contracts
*Target: Define JSON payload contracts between Frontend/Middleware and the AI/ML microservices.*

### 2.1 Document AI / OCR Microservice Interface
1. **OCR Ingestion API**:
   - What is the REST contract for image upload to the GKE OCR parser microservice? (`POST /api/v1/ocr/parse`)
   - What standardized JSON payload format does the OCR parser return to the Middleware/Frontend?
   - *Example Verification*: How are confidence scores and missing fields (e.g., unreadable PAN number or blurry invoice line items) reported back to the UI?
2. **Edge Liveness & Video Framing**:
   - How are liveness verification results (blink pattern, face alignment via Cloud Vision API) communicated to the PWA? Is it a REST response or a WebSocket event?

### 2.2 Gemini Live & Voice Session Handoff
3. **WebSocket Proxy Control & State Sync**:
   - What WebSocket control messages does the GKE proxy emit to the PWA (e.g., `SESSION_START`, `VAD_PAUSE`, `TOKEN_USAGE_UPDATE`, `INTENT_EXTRACTED`)?
   - How is the Real-Time Token Tracker payload structured so the PWA/Admin portal can display active session token usage?
4. **Intent Summary Contract**:
   - What is the exact JSON structure for the intent summary extracted by Gemini Pro?  
     *Proposed Schema*:
     ```json
     {
       "sessionId": "string",
       "customerIntent": "string",
       "selectedProduct": { "sku": "string", "name": "string", "price": number },
       "preferredEmi": { "tenureMonths": number, "monthlyInstallment": number, "isNoCost": boolean },
       "confidenceScore": number
     }
     ```
   - When is this intent summary finalized and written to Firestore?

---

## 🗄️ Session 3: Real-Time State Machine, Firestore Schema & Financing Matrix
*Target: Finalize Firestore NoSQL schema, deterministic financing logic, and mock disbursement handoffs.*

### 3.1 Firestore NoSQL Schema Design
1. **Collections & Subcollections Structure**:
   - Are we structuring Firestore as `sessions/{sessionId}` with subcollections for `transcripts` and `ocr_results`, or top-level collections?
   - What index requirements are needed for the Sales Portal to query historical sessions by date, product type, or KYC status?
2. **State Machine Variable Alignment**:
   - What are all the enumerated states in the customer journey? (e.g., `INITIATED`, `SEARCHING`, `KYC_PENDING`, `KYC_VERIFIED`, `CALCULATING_ELIGIBILITY`, `DISBURSEMENT_READY`, `COMPLETED`).

### 3.2 Deterministic Static Financing Matrix
3. **Calculation Middleware API**:
   - What inputs are required for the middleware microservice to evaluate financing (`POST /api/v1/financing/calculate`)?  
     *(Inputs: Product SKU, Price, Customer Minimum Down Payment, Selected Tenure)*
   - What rule format is used for the deterministic static matrix (e.g., JSON matrix file on GKE)?

### 3.3 Mock Disbursements & CRM/LMS Handoffs
4. **Salesforce & Pennant LMS Mock Payload Mappers**:
   - What exact JSON schema mimics the target Salesforce LOS payload upon journey completion?
   - What JSON schema represents the Pennant LMS Loan Booking request & Delivery Order (DO) response?
   - How does the generated Delivery Order (DO) number get written to Firestore to trigger instant audio/visual confirmation on the PWA?

---

## 🔒 Session 4: Security, Mock Data & Testing Boundaries
*Target: Establish boundary rules for mock datasets, error handling, and test data.*

1. **Mock Data Provisioning**:
   - When will the Customer deliver static JSON datasets for product catalogs, financing matrices, and mock CRM/LMS responses?
2. **PII Handling & Sanitization**:
   - What synthetic names, Aadhaar/PAN numbers, and invoice SKUs will be used in the staging dataset to ensure zero PII exposure?
3. **Error Handling & Edge Cases**:
   - What should the PWA display if OCR parsing fails 3 consecutive times?
   - How does the middleware handle non-eligible loan requests according to the static financing matrix?

---

## 🚀 Session 5: App Mod Deep Dive (GKE Infra, PWA Lifecycle & Observability)
*Target: Address specific App Mod infrastructure, deployment, and GKE WebSocket proxy engineering questions.*

### 5.1 GKE Infrastructure & WebSocket Proxy Routing
1. **GKE Ingress & WebSocket Upgrade Configuration**:
   - How will the GKE Ingress Controller (NGINX / Google Cloud HTTP(S) LB) be configured to handle persistent `wss://` WebSocket upgrades without timing out long audio streaming sessions?
   - What connection timeout (e.g., `proxy-read-timeout` / `proxy-send-timeout`) should be configured on GKE for voice streams?
2. **Stateful Session Affinity & Pod Scaling**:
   - How should GKE route client reconnection requests if a PWA temporarily loses network and reconnects? Is sticky session affinity required per `sessionId`?
   - What sizing and resource requests/limits (CPU/Memory) are assigned to the WebSocket proxy and middleware pod deployments?

### 5.2 React PWA Build & Deployment Lifecycle
3. **PWA Hosting & CDN Architecture**:
   - Will the React PWA static assets be served via a lightweight Nginx container running inside GKE, or deployed to Google Cloud Storage (GCS) + Cloud CDN?
4. **Service Worker Versioning & Cache Control**:
   - How will PWA Service Worker cache updates be managed so in-store tablets automatically load new PWA builds without requiring manual browser cache clears?
5. **Target Tablet Viewports**:
   - What primary target viewports (e.g., 10.9" iPad Air, 11" Samsung Galaxy Tab) should the responsive React PWA layout be optimized for during Weeks 3–4 building?

### 5.3 App Mod Observability & Mock Environment Control
6. **Logging & Debugging Strategy**:
   - What structured JSON logging format will the GKE middleware microservices produce for Google Cloud Logging (Stackdriver) to track state transitions and payload schemas?
7. **Mock Endpoint Environment Control**:
   - How will the client-side proxy switch between local mock data vs. GKE middleware microservices during development (`VITE_MOCK_MODE=true/false`)?
8. **Simulated Core Banking Latency**:
   - Should the mock backend endpoints inject artificial response delays (e.g., 300ms–800ms) to simulate realistic network latency during loan booking and Delivery Order generation?
