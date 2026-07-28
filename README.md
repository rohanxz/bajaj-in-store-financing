# Bajaj Finance In-Store Zero Friction Financing (Agentic AI POS MVP)

> **Real-Time Agentic AI Customer Journey for Point-of-Sale (POS) Financing**  
> *Powered by Google Cloud Platform, Gemini 3.1 Flash Live API, Document AI, and Cloud Firestore.*

---

## 📌 Executive Summary

**Bajaj Finance Limited (BFL)** in collaboration with Google is executing a 6-week MVP engagement to design and build a real-time **Agentic AI In-Store Customer Journey** for Point-of-Sale (POS) financing. 

The solution eliminates physical transaction friction, manual data entry, and traditional application delays during retail financing. By pairing an **In-Store Gemini-Powered Console** (Tablet/Desktop) with a **Mobile Customer Wallet App (PWA)**, the system delivers instant product discovery, automated Document AI OCR document validation (Aadhaar & PAN), edge liveness verification, bank mandate setup, and automated Delivery Order (DO) generation.

---

## 🏗️ System Architecture & Dual-Screen Interaction Model

The solution uses real-time state synchronization via **Google Cloud Firestore** to connect the store console and customer smartphone:

```mermaid
graph TD
    subgraph InStore["In-Store Ecosystem"]
        A["In-Store Gemini Console (Tablet/Desktop View)"] <-->|Real-Time Sync (Firestore)| B["Customer Mobile Wallet App (PWA)"]
    end

    subgraph GCP["GCP Cloud & AI Orchestration"]
        B <-->|16-bit PCM Audio / WebSockets| C["Gemini Live API Proxy"]
        A <-->|Image Payloads| D["Document AI Custom OCR Processors"]
        B <-->|Image Payloads| D
        A <-->|Face Frame Streams| E["Cloud Vision API (Liveness / Biometric)"]
        B <-->|Face Frame Streams| E
        A <-->|Real-Time State Listener| F["Google Cloud Firestore NoSQL State Machine"]
        B <-->|Real-Time State Listener| F
        F <-->|Mock JSON Payload Mapper| G["Mock Core Banking (Pennant LMS) & CRM (Salesforce)"]
    end
```

---

## 🌟 Key Technical Features

1. **Native Audio Gemini Live Integration**:
   - GKE-hosted WebSocket proxies stream 16-bit PCM / Mu-law audio (16kHz / 24kHz) directly to **Gemini 3.1 Flash Live API**.
   - Client & Server Voice Activity Detection (VAD) filters ambient retail store noise and optimizes token consumption.
   - Context Caching delivers **60–80% reduction** in input token fees.

2. **Document AI & OCR Parsing**:
   - Custom OCR processors automatically parse camera captures of Aadhaar Cards, PAN Cards, product SKU barcodes, and IMEI serial labels.

3. **Real-Time State Machine (Firestore)**:
   - Unified NoSQL schema tracks sessions, credit limits, KYC verifications, scanned IMEIs, and active step mutations via `onSnapshot` real-time listeners.

4. **Edge Biometrics & Liveness Verification**:
   - Uses Cloud Vision API microservices for facial alignment, blink pattern monitoring, and handover liveness validation.

5. **Mock Core Banking & CRM Integration**:
   - Seamlessly generates mock Salesforce LOS applications (`LN-920102`), Pennant LMS loan accounts (`LM-482791`), and Delivery Orders (`DO-CYMBAL-027318`).

---

## 🎬 10-Step Zero Friction Customer Journey

| Step | Phase & Visual | Description |
| :---: | :--- | :--- |
| **01** | **Biometric Entrance & Credit Lookup**<br/>![Step 1](./screenshots/01_entrance_biometric.png) | Customer enters store. Camera identifies facial biometrics, fetches pre-approved credit limit (e.g. ₹3.5 Lakh), and flags card status. |
| **02** | **Mobile Wallet Pairing**<br/>![Step 2](./screenshots/02_wallet_pairing.png) | Customer opens Mobile Wallet PWA. App pairs automatically with terminal `STORE-TERMINAL-LIVING-001` via Firestore state sync. |
| **03** | **Conversational Voice Search**<br/>![Step 3](./screenshots/03_product_search.png) | Customer speaks naturally (*"Show me Google Pixel 10 Pro XL"*). Gemini Live processes 16-bit PCM audio and displays matching product specs. |
| **04** | **No-Cost EMI Selection**<br/>![Step 4](./screenshots/04_emi_selection.png) | Customer compares and selects zero-cost EMI plans (e.g., 6 Months @ ₹21,666/mo). System triggers KYC refresh for expired card status. |
| **05** | **Document AI Aadhaar KYC**<br/>![Step 5](./screenshots/05_aadhaar_kyc.png) | PWA captures Aadhaar photo. Document AI extracts fields, validates via UIDAI mock gateway, and confirms OTP input. |
| **06** | **Document AI PAN Verification**<br/>![Step 6](./screenshots/06_pan_kyc.png) | PWA scans PAN card. Document AI parses PAN ID, verifies against NSDL mock gateway, completing OVD compliance. |
| **07** | **NPCI Bank Mandate Authorization**<br/>![Step 7](./screenshots/07_bank_mandate.png) | Customer authorizes automated EMI repayment via NPCI e-mandate OTP and facial liveness match via Cloud Vision API. |
| **08** | **Barcode & IMEI Scanning**<br/>![Step 8](./screenshots/08_mandate_approved.png) | Mandate approved. Sales representative scans product SKU barcode / IMEI serial number directly from the device box. |
| **09** | **Loan Booking & DO Generation**<br/>![Step 9](./screenshots/09_do_generation.png) | Middleware books loan in Pennant LMS, logs application in Salesforce CRM, generates Delivery Order (`DO-CYMBAL-027318`), and triggers instant audio confirmation. |
| **10** | **Final Handover & Delivery Verification**<br/>![Step 10](./screenshots/10_delivery_liveness.png) | Sales agent hands over device box. Final liveness frame verifies physical handover proof and closes transaction. |

---

## 📁 Repository Structure

```
.
├── README.md                           # Master Project Readme & Overview
├── PRODUCT_REQUIREMENTS_DOCUMENT.md   # Functional & Technical PRD (10-Step Journey Specs)
├── PROJECT_CONTEXT.md                 # 6-Week Engagement Scope, Milestones & Boundaries
├── WORKSHOP_QUESTIONNAIRE.md          # Discovery Workshop Questions & Technical Contracts
├── Cymbal Finance Zero Friction Journey v2.0.mp4  # Complete End-to-End Visual Demo Video
└── screenshots/                        # High-Resolution Journey Step Screenshots (01-10)
    ├── 01_entrance_biometric.png
    ├── 02_wallet_pairing.png
    ├── 03_product_search.png
    ├── 04_emi_selection.png
    ├── 05_aadhaar_kyc.png
    ├── 06_pan_kyc.png
    ├── 07_bank_mandate.png
    ├── 08_mandate_approved.png
    ├── 09_do_generation.png
    └── 10_delivery_liveness.png
```

---

## 🗄️ Core Data Models & API Specifications

### Firestore Session Document Schema (`sessions/{sessionId}`)
```json
{
  "sessionId": "SESS-2026-0728-9941",
  "terminalId": "STORE-TERMINAL-LIVING-001",
  "status": "CLOSED",
  "customer": {
    "name": "Ananya Iyer",
    "preApprovedCredit": 350000,
    "cardStatus": "EXPIRED",
    "walletPaired": true
  },
  "product": {
    "name": "Google Pixel 10 Pro XL",
    "variant": "256GB Obsidian",
    "retailPrice": 129999,
    "sku": "SKU-GGL-PX10PXL-256"
  },
  "emiPlan": {
    "tenureMonths": 6,
    "monthlyInstallment": 21666,
    "isNoCost": true
  },
  "kycStatus": {
    "aadhaarVerified": true,
    "panVerified": true,
    "livenessVerified": true
  },
  "disbursement": {
    "applicationId": "LN-920102",
    "lmsLoanAccount": "LM-482791",
    "deliveryOrderNumber": "DO-CYMBAL-027318",
    "handoverCompleted": true
  },
  "updatedAt": "2026-07-28T14:58:00Z"
}
```

### Middleware API Endpoints
- `POST /api/v1/ocr/parse`: Ingests camera image payloads, invokes Document AI, and returns structured JSON fields.
- `POST /api/v1/financing/calculate`: Evaluates tenure and installment pricing against deterministic static matrix.
- `POST /api/v1/disbursement/generate-do`: Executes mock LMS loan booking & returns final Delivery Order payload.

---

## 🗓️ 6-Week Delivery Roadmap

| Week | Phase | Focus Deliverables |
| :--- | :--- | :--- |
| **Weeks 1–2** | **Architecture & Design** | Discovery workshops, Firestore schema design, GKE WebSocket proxy setup. |
| **Weeks 3–4** | **Component Engineering** | Gemini Live API integration, Document AI processors, React PWA screens. |
| **Week 5** | **Mock Integration & Testing** | End-to-end Firestore state stitching, Sales Portal sync, LLM-as-a-judge automated eval. |
| **Week 6** | **User Testing & Handover** | 1-week user testing, code transition, IaC scripts & TDD delivery. |

---

## 📜 License & Usage

This repository contains non-production architecture, PRD specifications, mock integration schemas, and TDD deliverables created for Bajaj Finance Limited POS Agentic AI MVP evaluation.
