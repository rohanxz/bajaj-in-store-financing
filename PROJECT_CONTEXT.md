# Bajaj Finance Limited (BFL) POS Agentic AI MVP - Comprehensive Project Context

## 📌 Executive Summary & Background
Bajaj Finance Limited (BFL) is designing a high-scale digital transformation to streamline point-of-sale (POS) financing across its retail footprint. To eliminate transaction friction, reduce manual data entry, and scale customer engagement, BFL is deploying a **real-time Agentic AI in-store customer journey**.

The primary objective of this **6-week MVP engagement** (delivered by Google) is to build and deploy a scoped, real-time Agentic AI customer journey using the **Gemini Live API** via a specialized **Mobile/Tablet App (PWA only)** catering to both **Front-of-Store (FOS) Customers** and **Sales Enablement Teams**.

### Core Focus Use Case
- **In-Store Conversational Product Search & EMI Discovery**
- **OCR-Driven KYC Validation & Invoice/SKU Parsing**
- **Real-Time Sales Portal Tracking & Intent Summaries**
- Executed completely via isolated mock data frameworks utilizing static JSON files.

---

## 🚫 Architectural Boundaries & Exclusions (Strictly Enforced)

1. **No Live Systems Connectivity**:
   - No direct network integration with BFL's production core banking (Pennant LMS) or Salesforce backends.
   - All data flows utilize mock REST API endpoints, static staging datasets, and simulated JSON payloads provided by BFL prior to kickoff.
2. **No Wearable Integrations**:
   - Fully excluded; all interactions occur strictly on mobile/tablet PWA screens.
3. **No Facial Recognition or Biometric Databases**:
   - Camera-based facial recognition, biometric identity checks, and compliance photo archives are excluded for Responsible AI (RAI) compliance. (*Edge video liveness framing via Cloud Vision API is included strictly for alignment/blink detection*).
4. **No Dynamic Sizing/Policy Models**:
   - Calculations utilize a deterministic static financing matrix provided by BFL.
5. **No PII Processing**:
   - Customer must provide non-PII mock data or pre-masked evaluation datasets.
6. **No Production Deployment / Fine-Tuning**:
   - Scope is restricted to non-production code samples, IaC scripts, and TDD deliverables. No foundation model training from scratch.

---

## 🛠 Detailed Workstreams Overview

### 🤖 1. AI/ML Workstream
Focuses on conversational AI setup, WebSocket native audio streaming proxies, context caching, and document AI parsing pipelines.

* **Discovery & Architecture Alignment**:
  * Conduct design workshops (prompt structures, GKE serving setups, vector storage constraints).
  * Define target end-to-end AI latency budget for audio streaming and OCR processing.
* **Gemini Live API Integration (Native Audio)**:
  * Implement GKE-hosted stateful WebSocket connection proxies for persistent streaming of **16-bit PCM / Mu-law audio (at 16kHz / 24kHz)** to **Gemini 3.1 Flash Live API**.
  * Develop real-time token tracking mechanisms to monitor active input/output token consumption per voice session.
  * Configure **Client-Side & Server-Side Voice Activity Detection (VAD)** in the PWA to suspend audio streaming during pauses and ambient store noise, reducing token costs.
* **Context Caching Optimization**:
  * Configure Gemini Context Caching for static system instructions, base guidelines, and static product catalog references.
  * Target: **60% to 80% reduction in input token fees**.
* **Conversational Product Discovery Agent**:
  * Deploy **Gemini Pro Multimodal** in the PWA to execute multilingual, multi-turn conversational searches over the BFL product catalog.
  * Develop intent-extraction prompt modules to generate unstructured intent summaries (e.g., *"Customer requested high-end smartphone with 9-month no-cost EMI"*).
* **Document AI & OCR Parsing Pipelines**:
  * Configure Document AI custom OCR processors to parse PWA camera captures:
    * PAN Card & Aadhaar Card scans (mock KYC validation).
    * Product SKU barcodes, IMEI serial labels, and merchant invoices.
  * Develop GKE-hosted JSON parser microservices to structure extracted OCR fields into schema-compliant payloads.
* **Edge Liveness Verification**:
  * Implement edge-based liveness verification microservices on GKE to process PWA camera video frames (monitoring blink patterns and face alignments) using Cloud Vision API.
* **Disbursement Handoff (Salesforce Mock JSON → Pennant LMS Mock JSON)**:
  * Trigger "Journey Complete" process upon IMEI scan and MITC (terms & conditions) signing.
  * Orchestrate updating mock LOS with extracted data, fetching LMS mock JSON data for loan booking & Delivery Order (DO) generation, and syncing the DO number to Firestore for instant audio confirmation.
* **AI Evaluation & Validation**:
  * Automated evaluation scripts using **LLM-as-a-judge** to grade context retention and intent extraction.
  * Golden test scenarios suite:
    * Up to 50 test scenarios for context retention.
    * Up to 50 question/response pairs for follow-up logic.
    * Up to 50 pairs for pre-generated recommendations.
  * Validate user testing of AI modules for 1 week with 1 iteration of feedback adjustment.

---

### 💻 2. App Mod & Cloud Integration Workstream
Focuses on UI/UX design, React PWA implementation, Firestore real-time state machine, and GKE microservices.

* **UI/UX Design & Storyboarding (Up to 10 Screens)**:
  * Design screens for FOS Customer Experience & Sales Enablement Portal (up to 10 total screens).
  * Document Critical User Journey (CUJ), key workflows, user process flows, and wireframe storyboards.
  * Conduct design review sessions & backend technical design walkthrough (DB Schema & Middleware API spec).
  * Deliver UI design redlines and guidance to frontend engineering.
* **Basic React PWA Implementation (Up to 10 Views)**:
  1. Basic chat/audio interface for Product Search.
  2. Camera-trigger view for card captures (PAN/Aadhaar/Barcodes).
  3. Simple dashboard displaying mock verification results.
  4. **Sales Portal View**: Real-time & historical Customer conversation logs & extracted intent summaries for sales teams.
* **Real-Time State Machine (Firestore)**:
  * Unified NoSQL Firestore schema to track active session variables (limits, mock KYC status, scanned IMEI, invoice totals, sales tracking conversation logs).
  * Real-time event listeners to sync state mutations instantly without polling.
  * Firestore local SDK offline caching to support seamless synchronization during Wi-Fi dropouts.
* **Mock Transactional Flow Handling**:
  * Mock JSON schema mappers for target CRM and Core Banking structures.
  * Automatically finalize local Firestore records into static payloads upon journey closure (account update, loan application log, sales conversation/intent summary).
* **Middleware Services & GKE Backend Development**:
  * GKE microservices acting as orchestration middleware.
  * Ingestion of parsed text data, execution of validation logic against the deterministic static financing matrix, and writing state updates to Firestore.
  * Provisioning basic GKE node pools for microservices and API WebSocket proxy layers.

---

## 🗓️ 6-Week Timeline & Milestones

| Week | Key Phase | Activities & Focus Areas |
| :--- | :--- | :--- |
| **Weeks 1–2** | **Architecture Validation & Mock Design** | • Workshops on prompt structures, JSON schemas, Research/Sales portals.<br/>• Set up GKE node pools, wireframe Firestore NoSQL DB schema, initialize Basic React PWA repository. |
| **Weeks 3–4** | **Component Engineering** | • Integrate Gemini Live API over WebSockets & configure Context Caching.<br/>• Configure Document AI processors (PAN, Aadhaar, barcodes).<br/>• Build React PWA views (Chat UI, Camera trigger, Sales Admin portal dashboard). |
| **Week 5** | **End-to-End Mock Stitching & Testing** | • Stitch AI intent output & live logs with Firestore state machine.<br/>• Render data mutations dynamically across Customer and Sales Admin React UI views.<br/>• Execute LLM-as-a-judge evaluation scripts on static datasets. |
| **Week 6** | **User Testing & Handover** | • Guide user testing of integrated PWA modules (Customers & Sales Admins) for up to 1 week.<br/>• Deliver final code transition, IaC scripts, and Technical Design Document (TDD). |

---

## 📦 Project Deliverables

1. **Technical Design Document (TDD)**: Solution design, architecture, GCP service configurations, and guidelines for future enhancements.
2. **Non-Production Source Code Samples**: Complete sample source code of the PWA solution, backend microservices, sample Infrastructure as Code (IaC) scripts, and deployment scripts.

---

## 🤝 Prerequisites & Ongoing Customer Responsibilities

- **Prerequisites**: Secure GCP access, designated project sponsor, mock dataset setup prior to kickoff, evaluation golden dataset (50 customer samples, product line data, 50 evaluation Q&A pairs).
- **Ongoing Responsibilities**: 1-week module user testing turnaround, UI incorporation, feedback/approvals alignment.
