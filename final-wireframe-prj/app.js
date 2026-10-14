/**
 * ==========================================================================
 * BAJAJ FINANCE x CROMA — DUAL JOURNEY WIREFRAME APPLICATION (18 STEPS)
 * Fully interactive dual screen synced wireframe.
 * ==========================================================================
 */

// Customer Profiles (with temporary avatar photos)
const CUSTOMER_PROFILES = {
  rahul: {
    id: "BFL-IND-88219432",
    name: "Rahul Sharma",
    shortName: "Rahul...",
    phone: "+91 98765-43210",
    email: "rahul.sharma@bajajfinserv.in",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    kycStatus: "Pending",
    bankingStatus: "Active and Linked",
    preApprovedLimit: "₹1,65,000",
    totalLimit: "₹2,00,000",
    storeLocation: "CROMA Phoenix #442",
    detectedTime: "Just now"
  },
  ananya: {
    id: "BFL-IND-99321487",
    name: "Ananya Patel",
    shortName: "Ananya Patel",
    phone: "+91 98450-99887",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80",
    status: "Completed",
    product: "Samsung S25 Ultra"
  },
  karan: {
    id: "BFL-IND-77123984",
    name: "Karan Mehta",
    shortName: "Karan Mehta",
    phone: "+91 98199-22334",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
    status: "MITC Pending",
    product: "Sony Bravia 65\" TV"
  }
};

// Global State
let currentStep = 1;
let kycFlag = 'NO'; // 'NO' = KYC Capture Required, 'YES' = Skips to MITC (Step 10)
let faceAuthResult = 'SUCCESS'; // 'SUCCESS' = Live face matched, 'FAIL' = Mismatch requires Aadhaar & PAN scan
let isLoanAgreementAccepted = false; // Step 16 loan agreement acceptance flag
let isAutoPlaying = false;
let autoPlayInterval = null;
let viewMode = 'both'; // 'both', 'mobile', 'tablet'

// Selected Product State (updated dynamically when customer chooses a variant in Step 3)
let selectedProduct = {
  id: 1,
  title: "Apple iPhone 16 Pro Max",
  specs: "256GB • Desert Titanium • Model A3296",
  price: "₹1,44,900",
  rawPrice: 144900,
  stock: 4,
  floorBin: "MOB-3B",
  imeiPool: "Ready",
  warranty: "1 Yr Apple",
  schemeA_emi: "₹24,150",
  schemeB_emi: "₹28,980"
};

// Selected Scheme State (updated dynamically when customer chooses Scheme A or Scheme B in Step 4)
let selectedScheme = {
  id: 'A',
  name: "Scheme A: No Cost EMI (6m)",
  shortName: "Scheme A (No Cost EMI)",
  emi: "₹24,150",
  tenure: 6,
  type: "No Cost EMI"
};

// 18 Synchronized Journey Step Definitions
const STEPS_DATA = [
  {
    step: 1,
    phase: "1. Profile & Status",
    title: "1. Customer PWA: View Profile & KYC Status",
    description: "Customer opens PWA (checked in at CROMA Phoenix) and views profile and KYC status.",
    syncBadge: "Profile Active",
    mobileTitle: "My BFL Profile",
    tabletTitle: "FOS Store Queue — Customer In-Store"
  },
  {
    step: 2,
    phase: "2. Product Discovery",
    title: "2. Customer PWA: Voice Activate & Search Premium Mobiles",
    description: "Customer taps AI Voice Search microphone ('Say iPhone 16 Pro Max') to search for premium phones.",
    syncBadge: "⚡ Voice Search Active",
    mobileTitle: "Voice Product Search",
    tabletTitle: "FOS Portal — CROMA Mumbai #442"
  },
  {
    step: 3,
    phase: "2. Product Discovery",
    title: "3. Customer PWA: Voice Intent & Select iPhone 16 Variant",
    description: "Customer speaks 'Show iPhone 16 Pro Max' via Gemini Live Voice AI and selects model. FOS Portal remains on CROMA store view.",
    syncBadge: "Voice AI Variant Search",
    mobileTitle: "Select iPhone 16 Variant",
    tabletTitle: "FOS Portal — CROMA Mumbai #442"
  },
  {
    step: 4,
    phase: "3. EMI Scheme & Offers",
    title: "4. Customer PWA: Voice Scheme Assistant & Select Bajaj EMI Scheme",
    description: "Customer speaks 'Go ahead with Zero Down Payment scheme' or selects Scheme A/B via Gemini Live. FOS Portal remains on CROMA store view.",
    syncBadge: "Voice AI Scheme Assistant",
    mobileTitle: "Confirmed Product & EMI Schemes",
    tabletTitle: "FOS Portal — CROMA Mumbai #442"
  },
  {
    step: 5,
    phase: "3. EMI Scheme & Offers",
    title: "5. Customer PWA: Lock EMI Scheme -> FOS Portal Updated with Choices",
    description: "Customer locks scheme. PWA guides customer to FOS desk if KYC=NO, or confirms Pre-Verified status if KYC=YES.",
    syncBadge: "⚡ Synced & Locked to FOS",
    mobileTitle: "Offer Locked — Scheme A",
    tabletTitle: "FOS Action Desk — Offer Review"
  },
  {
    step: 6,
    phase: "4. Face Auth & KYC",
    title: "6. FOS Portal: Enable Face Auth & Capture Photo",
    description: "FOS representative captures customer live photo. If Face Auth = SUCCESS -> directly jumps to Step 9; if FAIL -> requires Aadhaar & PAN scan in Step 7.",
    syncBadge: "Face Authentication in Progress",
    mobileTitle: "Live Face Authentication",
    tabletTitle: "FOS Camera — Face Authentication"
  },
  {
    step: 7,
    phase: "4. Face Auth & KYC (Fallback)",
    title: "7. FOS Portal: Face Auth Failed — KYC Document Scan Required",
    description: "Face authentication mismatch. Representative initiates physical Aadhaar & PAN document capture on tablet.",
    syncBadge: "KYC Fallback: Doc Scan",
    mobileTitle: "KYC Verification Failed",
    tabletTitle: "FOS Portal — KYC Document Scan Required"
  },
  {
    step: 8,
    phase: "4. Face Auth & KYC (Capture)",
    title: "8. FOS Portal: Capture Customer Aadhaar & PAN on Tablet",
    description: "FOS representative captures customer's Aadhaar and PAN cards on the tablet while Customer PWA displays verifying status.",
    syncBadge: "FOS Capturing KYC Docs",
    mobileTitle: "Verifying System KYC Status",
    tabletTitle: "FOS Tablet — Document Camera Scanner"
  },
  {
    step: 9,
    phase: "4. Face Auth & KYC (Success)",
    title: "9. Customer PWA & FOS Portal: KYC Verified -> FOS: Trigger MITC Flow",
    description: "KYC verified. FOS representative initiates 'Trigger MITC Flow' to present agreement terms on customer app.",
    syncBadge: "✅ KYC Verified",
    mobileTitle: "KYC Verified Successfully",
    tabletTitle: "FOS Portal — KYC Verified & Trigger MITC"
  },
  {
    step: 10,
    phase: "5. MITC & OTP Approval",
    title: "10. Customer PWA: MITC Terms & OTP Verification -> FOS: MITC Signing in Progress",
    description: "Customer reviews MITC terms & submits SMS OTP on mobile PWA while FOS Portal shows MITC signing in progress.",
    syncBadge: "MITC Signing in Progress",
    mobileTitle: "MITC Agreement & OTP Request",
    tabletTitle: "FOS Portal — MITC Signing in Progress"
  },
  {
    step: 11,
    phase: "5. Loan Authorization & Approval",
    title: "11. Customer PWA: MITC Signed Successfully -> Action: Authorize Bank Loan",
    description: "Customer verifies MITC signed confirmation and clicks Authorize Bank Loan to initiate loan authorization.",
    syncBadge: "MITC Signed Successfully",
    mobileTitle: "MITC Verified — Authorize Loan",
    tabletTitle: "FOS Portal — MITC Signed by Customer"
  },
  {
    step: 12,
    phase: "5. Loan Authorization & Approval",
    title: "12. Customer PWA: Enter & Submit Bank Loan Authorization OTP -> FOS: Authorization in Progress",
    description: "Customer enters 6-digit loan authorization SMS OTP on mobile while FOS Portal shows Authorization in Progress.",
    syncBadge: "Loan Authorization in Progress",
    mobileTitle: "Enter Loan Authorization OTP",
    tabletTitle: "FOS Portal — Loan Authorization in Progress"
  },
  {
    step: 13,
    phase: "5. Loan Authorization & Approval",
    title: "13. Customer PWA & FOS Portal: Bank Loan Authorization Successful -> Action: Confirm Mandate via OTP",
    description: "Bank loan authorized successfully on both screens. Customer clicks button to start Mandate confirmation via OTP.",
    syncBadge: "✅ Bank Loan Authorized",
    mobileTitle: "Loan Authorized — Confirm Mandate",
    tabletTitle: "FOS Portal — Loan Authorized & Mandate Ready"
  },
  {
    step: 14,
    phase: "6. Banking & Mandate Details",
    title: "14. Customer PWA: Mandate Details & Submit OTP -> FOS: Mandate OTP Validation in Progress",
    description: "Customer reviews bank auto-debit mandate details, enters 6-digit OTP, and clicks Submit.",
    syncBadge: "Mandate OTP Validation",
    mobileTitle: "Configure Mandate & Enter OTP",
    tabletTitle: "FOS Desk — Mandate Setup in Progress"
  },
  {
    step: 15,
    phase: "6. Store Handover & Agreement",
    title: "15. Customer PWA & FOS Portal: Mandate Details Confirmed & Handover Initiated",
    description: "Mandate details are confirmed. FOS portal initiates handover and prepares to scan product IMEI and capture photo.",
    syncBadge: "⚡ Mandate Confirmed & Handover Initiated",
    mobileTitle: "Mandate Confirmed — Handover Initiated",
    tabletTitle: "FOS Action Desk — INITIATE HANDOVER"
  },
  {
    step: 16,
    phase: "7. Product Handover & Confirmation",
    title: "16. FOS Portal: Scan Product IMEI & Photo -> Customer PWA: Handover in Progress",
    description: "FOS representative scans product box IMEI barcode and captures joint photo with customer while Customer PWA shows Handover in Progress.",
    syncBadge: "📦 Product Handover in Progress",
    mobileTitle: "Product Handover in Progress",
    tabletTitle: "FOS Camera — Scan Product & Customer Photo"
  },
  {
    step: 17,
    phase: "7. Product Handover & Confirmation",
    title: "17. Customer PWA: Confirm Product Handover by OTP -> Action: Product Received",
    description: "Customer confirms physical receipt of product by entering 6-digit Handover OTP and clicking Product Received.",
    syncBadge: "🔐 Handover OTP Confirmation",
    mobileTitle: "Confirm Handover & Product Received",
    tabletTitle: "FOS Portal — Awaiting Customer Handover OTP"
  },
  {
    step: 18,
    phase: "7. Product Handover & Confirmation",
    title: "18. FOS Portal & Customer PWA: Transaction Completed Status",
    description: "FOS tablet portal & Customer PWA update with celebratory completion banner and recorded loan reference.",
    syncBadge: "🎉 Transaction Complete",
    mobileTitle: "Order Complete & Receipt",
    tabletTitle: "FOS Portal — Transaction Successfully Complete"
  }
];

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  renderTimeline();
  setupEventListeners();
  updateUI();
});

function setupEventListeners() {
  // KYC Buttons
  document.getElementById("btn-kyc-no").addEventListener("click", () => setKycFlag("NO"));
  document.getElementById("btn-kyc-yes").addEventListener("click", () => setKycFlag("YES"));

  // Face Auth Result Buttons
  document.getElementById("btn-face-success")?.addEventListener("click", () => setFaceAuthResult("SUCCESS"));
  document.getElementById("btn-face-fail")?.addEventListener("click", () => setFaceAuthResult("FAIL"));

  // View Mode Buttons
  document.getElementById("btn-view-both").addEventListener("click", () => setViewMode("both"));
  document.getElementById("btn-view-mobile").addEventListener("click", () => setViewMode("mobile"));
  document.getElementById("btn-view-tablet").addEventListener("click", () => setViewMode("tablet"));

  // Footer Nav
  document.getElementById("btn-prev").addEventListener("click", prevStep);
  document.getElementById("btn-next").addEventListener("click", nextStep);
  document.getElementById("btn-reset").addEventListener("click", resetJourney);
  document.getElementById("btn-autoplay").addEventListener("click", toggleAutoPlay);
}

window.setFaceAuthResult = function(result) {
  faceAuthResult = result;
  const btnSuccess = document.getElementById("btn-face-success");
  const btnFail = document.getElementById("btn-face-fail");
  if (btnSuccess) btnSuccess.classList.toggle("active", result === "SUCCESS");
  if (btnFail) btnFail.classList.toggle("active", result === "FAIL");
  updateUI();
};

window.selectVariant = function(id) {
  if (id === 1) {
    selectedProduct = {
      id: 1,
      title: "Apple iPhone 16 Pro Max",
      specs: "256GB • Natural Titanium",
      price: "₹1,44,900",
      rawPrice: 144900,
      schemeA_emi: "₹24,150",
      schemeB_emi: "₹28,980"
    };
  } else if (id === 2) {
    selectedProduct = {
      id: 2,
      title: "Apple iPhone 16 Pro",
      specs: "128GB • Desert Titanium",
      price: "₹1,19,900",
      rawPrice: 119900,
      schemeA_emi: "₹19,983",
      schemeB_emi: "₹23,980"
    };
  } else if (id === 3) {
    selectedProduct = {
      id: 3,
      title: "Apple iPhone 16 Standard",
      specs: "128GB • Teal",
      price: "₹79,900",
      rawPrice: 79900,
      schemeA_emi: "₹13,316",
      schemeB_emi: "₹15,980"
    };
  }

  // Update selectedScheme EMI automatically when product changes
  if (selectedScheme.id === 'A') {
    selectedScheme.emi = selectedProduct.schemeA_emi;
  } else {
    selectedScheme.emi = selectedProduct.schemeB_emi;
  }

  [1, 2, 3].forEach(vId => {
    const el = document.getElementById(`variant-${vId}`);
    if (el) {
      el.classList.toggle("selected", vId === id);
    }
  });

  const btn = document.getElementById("btn-confirm-variant");
  if (btn) {
    btn.disabled = false;
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
    btn.innerText = `✅ Confirm ${selectedProduct.title} & View Schemes`;
  }
};

window.selectScheme = function(schemeId) {
  if (schemeId === 'A') {
    selectedScheme = {
      id: 'A',
      name: "Scheme A: No Cost EMI (6m)",
      shortName: "Scheme A (No Cost EMI)",
      emi: selectedProduct.schemeA_emi,
      tenure: 6,
      type: "No Cost EMI"
    };
  } else if (schemeId === 'B') {
    selectedScheme = {
      id: 'B',
      name: "Scheme B: Zero Down EMI (5m)",
      shortName: "Scheme B (Zero Down EMI)",
      emi: selectedProduct.schemeB_emi,
      tenure: 5,
      type: "Zero Down EMI"
    };
  }

  const elA = document.getElementById("scheme-card-A");
  const elB = document.getElementById("scheme-card-B");
  if (elA && elB) {
    elA.classList.toggle("selected", schemeId === 'A');
    elB.classList.toggle("selected", schemeId === 'B');
  }

  const btn = document.getElementById("btn-lock-scheme");
  if (btn) {
    btn.innerText = `🔒 Lock ${selectedScheme.shortName} & Submit to FOS`;
  }
};

function setKycFlag(flag) {
  kycFlag = flag;
  document.getElementById("btn-kyc-no").classList.toggle("active", flag === "NO");
  document.getElementById("btn-kyc-yes").classList.toggle("active", flag === "YES");
  if (kycFlag === "YES" && currentStep >= 6 && currentStep <= 9) {
    currentStep = 10;
  }
  updateUI();
}

function setViewMode(mode) {
  viewMode = mode;
  const stage = document.getElementById("device-stage");
  stage.className = "device-stage view-mode-" + mode;
  document.getElementById("btn-view-both").classList.toggle("active", mode === "both");
  document.getElementById("btn-view-mobile").classList.toggle("active", mode === "mobile");
  document.getElementById("btn-view-tablet").classList.toggle("active", mode === "tablet");
}

function prevStep() {
  if (currentStep === 10 && kycFlag === "YES") {
    currentStep = 5;
  } else if (currentStep === 9 && faceAuthResult === "SUCCESS" && kycFlag === "NO") {
    currentStep = 6;
  } else if (currentStep > 1) {
    currentStep--;
  }
  updateUI();
}

function nextStep() {
  // If KYC = YES and we are on Step 5, skip Face Auth & KYC Capture (Steps 6-9) and jump directly to Step 10 (MITC Flow)
  if (currentStep === 5 && kycFlag === "YES") {
    currentStep = 10;
  } 
  // If KYC = NO and we are on Step 6 with FaceAuth = SUCCESS, skip document capture (Steps 7-8) and jump directly to Step 9 (KYC Verified)
  else if (currentStep === 6 && faceAuthResult === "SUCCESS") {
    currentStep = 9;
  } 
  // If KYC = NO and we are on Step 6 with FaceAuth = FAIL, go to Step 7 (KYC verification failed & need to scan Aadhaar & PAN)
  else if (currentStep === 6 && faceAuthResult === "FAIL") {
    currentStep = 7;
  } 
  else if (currentStep < 18) {
    currentStep++;
  }
  updateUI();
}

window.acceptLoanAgreement = function() {
  isLoanAgreementAccepted = true;
  updateUI();
};

function resetJourney() {
  stopAutoPlay();
  isLoanAgreementAccepted = false;
  currentStep = 1;
  updateUI();
}

function toggleAutoPlay() {
  if (isAutoPlaying) {
    stopAutoPlay();
  } else {
    isAutoPlaying = true;
    document.getElementById("autoplay-text").innerText = "Pause Demo";
    document.getElementById("autoplay-icon").innerText = "⏸️";
    autoPlayInterval = setInterval(() => {
      if (currentStep < 18) {
        nextStep();
      } else {
        stopAutoPlay();
      }
    }, 2800);
  }
}

function stopAutoPlay() {
  isAutoPlaying = false;
  clearInterval(autoPlayInterval);
  document.getElementById("autoplay-text").innerText = "Auto Play";
  document.getElementById("autoplay-icon").innerText = "▶️";
}

function renderTimeline() {
  const track = document.getElementById("timeline-track");
  track.innerHTML = "";
  STEPS_DATA.forEach((item) => {
    const chip = document.createElement("button");
    chip.className = "step-chip" + (item.step === currentStep ? " active" : "");
    chip.innerHTML = `
      <span class="step-chip-number">${item.step}</span>
      <span>Step ${item.step}</span>
    `;
    chip.addEventListener("click", () => {
      currentStep = item.step;
      updateUI();
    });
    track.appendChild(chip);
  });
}

function updateUI() {
  const stepData = STEPS_DATA[currentStep - 1];

  // Update Timeline active state
  document.querySelectorAll(".step-chip").forEach((chip, index) => {
    chip.classList.toggle("active", index + 1 === currentStep);
    chip.classList.toggle("completed", index + 1 < currentStep);
  });

  // Update Top Banner
  document.getElementById("step-number-badge").innerText = `Step ${currentStep} / 18`;
  document.getElementById("step-title").innerText = stepData.title;
  document.getElementById("step-description").innerText = stepData.description;
  document.getElementById("sync-text").innerText = stepData.syncBadge;

  // Update Footer Count
  document.getElementById("footer-step-count").innerText = `Step ${currentStep} of 18`;

  // Render Screens
  renderMobileScreen(currentStep);
  renderTabletScreen(currentStep);
}

/**
 * ==========================================================================
 * MOBILE SCREEN RENDERER (CUSTOMER PWA APP)
 * ==========================================================================
 */
function renderMobileScreen(step) {
  const container = document.getElementById("mobile-content");
  container.innerHTML = "";

  switch (step) {
    case 1:
      container.innerHTML = `
        <div class="profile-id-card">
          <div class="profile-header">
            <img src="${CUSTOMER_PROFILES.rahul.avatar}" class="profile-avatar" style="object-fit:cover; border:2px solid var(--croma-teal); width:52px; height:52px; border-radius:50%;" alt="Rahul" />
            <div>
              <div style="font-weight:700; font-size:1.05rem; color:#fff;">Rahul Sharma</div>
              <div style="font-size:0.75rem; color:var(--text-secondary);">Male, 34 yrs • +91 98765-43210</div>
            </div>
          </div>
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.75rem; border-top:1px solid rgba(255,255,255,0.1); padding-top:12px;">
            <div><span style="color:var(--text-muted);">KYC Status:</span> <span class="badge badge-success">${kycFlag === 'YES' ? 'YES (Verified)' : 'NO (Pending)'}</span></div>
            <div><span style="color:var(--text-muted);">Store Location:</span> <span style="color:var(--croma-teal); font-weight:600;">📍 CROMA Phoenix</span></div>
          </div>
        </div>
        <button class="btn-primary-mobile" style="margin-top:14px;" onclick="document.getElementById('btn-next').click()">
          Search Products →
        </button>
      `;
      break;

    case 2:
      container.innerHTML = `
        <div class="card-glass">
          <div class="section-title">AI Voice Shopping Assistant</div>
          <div class="voice-search-btn" onclick="document.getElementById('btn-next').click()">
            <div style="font-size:2.5rem; margin-bottom:8px;">🎙️</div>
            <div style="font-weight:700; font-size:0.95rem;">"Say 'Show iPhone 16 Pro Max'"</div>
            <div style="font-size:0.75rem; color:#93C5FD; margin-top:4px;">Tap microphone or speak now...</div>
          </div>
        </div>
        <div style="display:flex; gap:8px; overflow-x:auto; padding:4px 0; margin-top:10px;">
          <span class="badge badge-warning">📱 Premium Phones</span>
          <span class="badge badge-success">0% EMI Available</span>
          <span class="badge badge-warning">CROMA In-Stock</span>
        </div>
        <button class="btn-primary-mobile" style="margin-top:12px;" onclick="document.getElementById('btn-next').click()">
          Select iPhone 16 Pro Max →
        </button>
      `;
      break;

    case 3:
      container.innerHTML = `
        <div class="card-glass" style="margin-bottom:10px;">
          <div class="voice-search-btn" onclick="selectVariant(1)" style="padding:12px; border-radius:14px;">
            <div style="font-size:1.6rem; margin-bottom:2px;">🎙️</div>
            <div style="font-weight:700; font-size:0.85rem; color:#fff;">"Say 'Show iPhone 16 Pro Max' or 'Select 128GB'"</div>
            <div style="font-size:0.7rem; color:#93C5FD; margin-top:2px;">Gemini Live Voice AI Active • Tap to Speak or Select Variant</div>
          </div>
        </div>

        <div class="section-title">Select iPhone 16 Variant (Fetched)</div>
        <p style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:10px;">Fetched via Gemini Live API — choose your model:</p>
        
        <div class="product-tile ${selectedProduct.id === 1 ? 'selected' : ''}" id="variant-1" style="margin-bottom:8px;" onclick="selectVariant(1)">
          <div class="product-thumb">📱</div>
          <div style="flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:700; font-size:0.88rem; color:#fff;">iPhone 16 Pro Max</span>
              <span class="badge badge-success">RECOMMENDED</span>
            </div>
            <div style="font-size:0.73rem; color:var(--text-secondary);">256GB • Natural Titanium</div>
            <div style="font-weight:800; color:var(--croma-teal); margin-top:2px;">₹1,44,900</div>
          </div>
        </div>

        <div class="product-tile ${selectedProduct.id === 2 ? 'selected' : ''}" id="variant-2" style="margin-bottom:8px;" onclick="selectVariant(2)">
          <div class="product-thumb">📱</div>
          <div style="flex:1;">
            <div style="font-weight:700; font-size:0.88rem; color:#fff;">iPhone 16 Pro</div>
            <div style="font-size:0.73rem; color:var(--text-secondary);">128GB • Desert Titanium</div>
            <div style="font-weight:800; color:var(--bfl-orange); margin-top:2px;">₹1,19,900</div>
          </div>
        </div>

        <div class="product-tile ${selectedProduct.id === 3 ? 'selected' : ''}" id="variant-3" style="margin-bottom:12px;" onclick="selectVariant(3)">
          <div class="product-thumb">📱</div>
          <div style="flex:1;">
            <div style="font-weight:700; font-size:0.88rem; color:#fff;">iPhone 16 Standard</div>
            <div style="font-size:0.73rem; color:var(--text-secondary);">128GB • Teal</div>
            <div style="font-weight:800; color:#34D399; margin-top:2px;">₹79,900</div>
          </div>
        </div>

        <button id="btn-confirm-variant" class="btn-primary-mobile" onclick="document.getElementById('btn-next').click()">
          ✅ Confirm ${selectedProduct.title} & View Schemes
        </button>
      `;
      break;

    case 4:
      container.innerHTML = `
        <div class="card-glass" style="margin-bottom:10px;">
          <div class="voice-search-btn" onclick="selectScheme('B')" style="padding:12px; border-radius:14px; background:linear-gradient(135deg,#9A3412,#EA580C); border-color:#FDBA74;">
            <div style="font-size:1.6rem; margin-bottom:2px;">🎙️</div>
            <div style="font-weight:700; font-size:0.85rem; color:#fff;">"Say 'Go ahead with Zero Down Payment scheme'"</div>
            <div style="font-size:0.7rem; color:#FED7AA; margin-top:2px;">Gemini Live Scheme Assistant • Tap to Speak Intent</div>
          </div>
        </div>

        <div class="card-glass highlight" style="margin-bottom:10px;">
          <div class="section-title">Confirmed Product Choice</div>
          <div class="product-tile selected">
            <div class="product-thumb">📱</div>
            <div style="flex:1;">
              <div style="font-weight:700; font-size:0.9rem;">${selectedProduct.title}</div>
              <div style="font-size:0.75rem; color:var(--text-secondary);">${selectedProduct.specs}</div>
              <div style="font-weight:800; color:var(--croma-teal); margin-top:2px;">${selectedProduct.price}</div>
            </div>
          </div>
        </div>

        <div class="section-title">Available Bajaj EMI Schemes (Fetched)</div>
        <div class="scheme-card ${selectedScheme.id === 'A' ? 'selected' : ''}" id="scheme-card-A" style="margin-bottom:8px;" onclick="selectScheme('A')">
          <span class="scheme-tag">RECOMMENDED</span>
          <div style="font-weight:700; font-size:0.9rem; color:#fff;">Scheme A: No Cost EMI (6m)</div>
          <div style="font-size:0.8rem; color:var(--croma-teal); font-weight:700; margin:2px 0;">${selectedProduct.schemeA_emi} / month x 6 months</div>
          <div style="font-size:0.7rem; color:var(--text-secondary);">Downpayment: ₹0 • Fee: ₹500</div>
        </div>

        <div class="scheme-card ${selectedScheme.id === 'B' ? 'selected' : ''}" id="scheme-card-B" style="margin-bottom:10px;" onclick="selectScheme('B')">
          <div style="font-weight:700; font-size:0.9rem; color:#fff;">Scheme B: Zero Down EMI (5m)</div>
          <div style="font-size:0.8rem; color:var(--bfl-orange); font-weight:700; margin:2px 0;">${selectedProduct.schemeB_emi} / month x 5 months</div>
          <div style="font-size:0.7rem; color:var(--text-secondary);">Downpayment: ₹0 • Fee: ₹0</div>
        </div>

        <button id="btn-lock-scheme" class="btn-primary-mobile" onclick="document.getElementById('btn-next').click()">
          🔒 Lock ${selectedScheme.shortName} & Submit to FOS
        </button>
      `;
      break;

    case 5:
      container.innerHTML = `
        <div class="card-glass highlight" style="text-align:center; padding:18px;">
          <div style="font-size:2rem; color:#34D399; margin-bottom:6px;">🔒</div>
          <h3 style="color:#fff; font-size:1rem; margin-bottom:4px;">${selectedScheme.name} Locked</h3>
          <div style="font-size:0.85rem; color:var(--croma-teal); font-weight:700; margin-bottom:10px;">
            ${selectedScheme.emi} / month x ${selectedScheme.tenure} Months
          </div>

          <div style="background:#0F172A; padding:10px 12px; border-radius:8px; margin-bottom:12px; border:1px solid rgba(255,255,255,0.08); text-align:left;">
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem;">
              <span style="color:var(--text-secondary);">KYC Status:</span>
              <span class="badge ${kycFlag === 'YES' ? 'badge-success' : 'badge-warning'}">
                ${kycFlag === 'YES' ? 'KYC Flag: YES (Pre-Verified)' : 'KYC Flag: NO (Pending)'}
              </span>
            </div>
          </div>

          ${kycFlag === 'YES' ? `
            <div style="background:rgba(16,185,129,0.12); border:1px solid rgba(16,185,129,0.3); border-radius:10px; padding:12px; margin-bottom:12px; text-align:left;">
              <div style="font-weight:700; font-size:0.82rem; color:#34D399; margin-bottom:4px;">✅ Pre-Verified Customer</div>
              <p style="font-size:0.76rem; color:#E2E8F0; line-height:1.4; margin:0;">
                Your KYC is already verified. No document upload required — proceeding directly to MITC Terms and digital approval.
              </p>
            </div>
          ` : `
            <div style="background:rgba(59,130,246,0.12); border:1px solid rgba(96,165,250,0.3); border-radius:10px; padding:12px; margin-bottom:12px; text-align:left;">
              <div style="font-weight:700; font-size:0.82rem; color:#60A5FA; margin-bottom:4px;">🚶 Please Walk to BFL Representative Desk</div>
              <p style="font-size:0.76rem; color:#E2E8F0; line-height:1.4; margin:0;">
                Please approach our in-store representative <strong>Vikram R.</strong> at the Bajaj Finserv desk to complete a quick live photo capture and Aadhaar/PAN verification.
              </p>
            </div>
          `}

          <div class="badge badge-success" style="display:inline-block; font-size:0.75rem; padding:6px 12px;">
            ⚡ Submitted to FOS Portal
          </div>
        </div>
      `;
      break;

    case 6:
      container.innerHTML = `
        <div class="card-glass" style="text-align:center; padding:24px;">
          <div style="font-size:2.4rem; margin-bottom:8px;">🤳</div>
          <h3 style="font-size:1rem; color:#fff; margin-bottom:6px;">Live Face Authentication</h3>
          <p style="font-size:0.78rem; color:var(--text-secondary); margin-bottom:14px;">
            Please look at the tablet camera held by FOS Representative Vikram R.
          </p>
          <div class="badge badge-warning" style="display:inline-block; margin-bottom:8px;">
            ⏳ Camera Active on FOS Tablet
          </div>
          <div style="font-size:0.7rem; color:var(--text-secondary); font-style:italic; margin-top:6px;">
            Screen will update automatically once representative completes face photo capture.
          </div>
        </div>
      `;
      break;

    case 7:
    case 8:
      container.innerHTML = `
        <div class="card-glass highlight" style="text-align:center; padding:22px;">
          <div style="font-size:2.4rem; color:#EF4444; margin-bottom:8px;">⚠️</div>
          <h3 style="font-size:1rem; color:#fff; margin-bottom:6px;">KYC Verification Failed (Face Mismatch)</h3>
          <p style="font-size:0.78rem; color:var(--text-secondary); margin-bottom:14px;">
            Live face authentication could not match central database records. Please provide your physical <strong>Aadhaar Card</strong> and <strong>PAN Card</strong> to representative Vikram R. for document scanning.
          </p>
          <div class="badge badge-warning" style="display:inline-block; margin-bottom:8px; color:#F87171; border-color:#EF4444;">
            ⚠️ Physical Document Scan Required
          </div>
          <div style="font-size:0.7rem; color:var(--text-secondary); font-style:italic; margin-top:6px;">
            Representative is scanning Aadhaar & PAN on the tablet scanner...
          </div>
        </div>
      `;
      break;

    case 9:
      container.innerHTML = `
        <div class="card-glass" style="text-align:center; padding:24px;">
          <div style="font-size:2.5rem; color:#34D399; margin-bottom:8px;">✅</div>
          <h3 style="color:#34D399; margin-bottom:6px;">KYC Successfully Verified!</h3>
          <p style="font-size:0.78rem; color:var(--text-secondary); margin-bottom:14px;">
            ${faceAuthResult === 'SUCCESS' 
              ? 'Live Face Authentication matched central database records. Identity verified successfully!' 
              : 'Aadhaar & PAN validated via OCR scanner. KYC verified successfully!'}
          </p>
          <div class="badge badge-success" style="display:inline-block; font-size:0.75rem; padding:6px 12px;">
            ⏳ Awaiting Store Representative to Trigger MITC
          </div>
          <div style="font-size:0.7rem; color:var(--text-secondary); font-style:italic; margin-top:8px;">
            Digital loan terms will appear automatically on your screen once initiated on the store portal.
          </div>
        </div>
      `;
      break;

    case 10:
      container.innerHTML = `
        <div class="card-glass">
          <div class="section-title">MITC Terms & OTP Verification</div>
          <div style="background:#0F172A; padding:10px; border-radius:8px; font-size:0.72rem; color:var(--text-secondary); max-height:80px; overflow-y:auto; margin-bottom:12px;">
            Dummy MITC Terms: I hereby accept Bajaj EMI network loan terms for ${selectedProduct.title} (${selectedProduct.price}) under ${selectedScheme.name} at 0% interest...
          </div>
          <div style="font-size:0.78rem; color:#fff; margin-bottom:8px; font-weight:600;">Enter 6-Digit SMS OTP:</div>
          <div class="otp-boxes" onclick="document.getElementById('btn-next').click()">
            <div class="otp-box">4</div><div class="otp-box">8</div><div class="otp-box">2</div>
            <div class="otp-box">9</div><div class="otp-box">1</div><div class="otp-box">6</div>
          </div>
          <button class="btn-primary-mobile" style="margin-top:14px;" onclick="document.getElementById('btn-next').click()">
            🔐 Verify OTP & Agree
          </button>
        </div>
      `;
      break;

    case 11:
      container.innerHTML = `
        <div class="card-glass" style="text-align:center; padding:20px;">
          <div style="font-size:2.2rem; margin-bottom:8px;">📝</div>
          <div class="badge badge-success" style="display:inline-block; font-size:0.75rem; padding:6px 12px; margin-bottom:8px;">
            ✅ MITC Agreement Signed Successfully
          </div>
          <h3 style="color:#fff; font-size:1rem; margin-bottom:4px;">MITC Terms Verified</h3>
          <p style="font-size:0.78rem; color:var(--text-secondary); margin-bottom:14px; line-height:1.4;">
            Your MITC Terms & Conditions have been signed digitally via SMS OTP. Now start the loan authorization.
          </p>

          <div style="background:#0F172A; padding:10px 12px; border-radius:8px; font-size:0.75rem; margin-bottom:14px; text-align:left; border:1px solid rgba(255,255,255,0.08);">
            <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
              <span style="color:var(--text-secondary);">Loan Product:</span>
              <span style="font-weight:700; color:#fff;">${selectedProduct.title}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
              <span style="color:var(--text-secondary);">Loan Amount:</span>
              <span style="font-weight:700; color:var(--croma-teal);">${selectedProduct.price}</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-secondary);">EMI Scheme:</span>
              <span style="font-weight:700; color:var(--bfl-orange);">${selectedScheme.emi}/mo (${selectedScheme.tenure}m)</span>
            </div>
          </div>

          <button class="btn-primary-mobile" onclick="document.getElementById('btn-next').click()">
            Authorize Bank Loan →
          </button>
        </div>
      `;
      break;

    case 12:
      container.innerHTML = `
        <div class="card-glass">
          <div class="section-title">Authorize Bank Loan</div>
          
          <div style="background:#0F172A; padding:12px; border-radius:8px; font-size:0.75rem; margin-bottom:12px; border:1px solid rgba(255,255,255,0.08);">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span style="color:var(--text-secondary);">Loan Principal:</span>
              <span style="font-weight:700; color:var(--croma-teal);">${selectedProduct.price}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span style="color:var(--text-secondary);">Selected Plan:</span>
              <span style="font-weight:700; color:#fff;">${selectedScheme.name}</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-secondary);">Monthly EMI:</span>
              <span style="font-weight:700; color:var(--bfl-orange);">${selectedScheme.emi} / mo</span>
            </div>
          </div>

          <div style="font-size:0.78rem; color:#fff; margin-bottom:6px; font-weight:600;">Enter 6-Digit Bank Loan Authorization OTP:</div>
          <div class="otp-boxes" onclick="document.getElementById('btn-next').click()">
            <div class="otp-box">7</div><div class="otp-box">3</div><div class="otp-box">9</div>
            <div class="otp-box">1</div><div class="otp-box">4</div><div class="otp-box">0</div>
          </div>
          <button class="btn-primary-mobile" style="margin-top:14px;" onclick="document.getElementById('btn-next').click()">
            🔐 Submit Loan Authorization OTP →
          </button>
        </div>
      `;
      break;

    case 13:
      container.innerHTML = `
        <div class="card-glass" style="text-align:center; padding:20px;">
          <div style="font-size:2.4rem; color:#34D399; margin-bottom:8px;">✅</div>
          <div class="badge badge-success" style="display:inline-block; font-size:0.75rem; padding:6px 12px; margin-bottom:8px;">
            ✅ Bank Loan Authorization Successful!
          </div>
          <h3 style="color:#34D399; font-size:1rem; margin-bottom:4px;">Loan Approved & Authorized</h3>
          <p style="font-size:0.78rem; color:var(--text-secondary); margin-bottom:14px; line-height:1.4;">
            Your loan of <strong>${selectedProduct.price}</strong> has been authorized digitally via SMS OTP. Ref: <strong style="color:#34D399;">BFL-AUTH-88219</strong>.
          </p>

          <div style="background:#0F172A; padding:10px 12px; border-radius:8px; font-size:0.75rem; margin-bottom:14px; text-align:left; border:1px solid rgba(16,185,129,0.3);">
            <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
              <span style="color:var(--text-secondary);">Principal Amount:</span>
              <span style="font-weight:700; color:var(--croma-teal);">${selectedProduct.price}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
              <span style="color:var(--text-secondary);">Sanctioned Plan:</span>
              <span style="font-weight:700; color:#fff;">${selectedScheme.name}</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-secondary);">Monthly Auto-Debit:</span>
              <span style="font-weight:700; color:var(--bfl-orange);">${selectedScheme.emi}/mo (${selectedScheme.tenure}m)</span>
            </div>
          </div>

          <button class="btn-primary-mobile" onclick="document.getElementById('btn-next').click()">
            Confirm Mandate via OTP →
          </button>
        </div>
      `;
      break;

    case 14:
      container.innerHTML = `
        <div class="card-glass highlight" style="margin-bottom:10px;">
          <div class="section-title">Confirm Mandate Details</div>
          
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-size:0.8rem; color:var(--text-secondary);">Loan Amount:</span>
            <span style="font-size:1.2rem; font-weight:800; color:var(--croma-teal);">${selectedProduct.price}</span>
          </div>
          
          <div style="background:#0F172A; padding:10px; border-radius:8px; font-size:0.75rem; display:flex; flex-direction:column; gap:4px; margin-bottom:10px; border:1px solid rgba(255,255,255,0.08);">
            <div style="display:flex; justify-content:space-between;"><span>Bank Account:</span> <span style="font-weight:700; color:#fff;">HDFC Bank **** 8821</span></div>
            <div style="display:flex; justify-content:space-between;"><span>Mandate Type:</span> <span style="color:#34D399;">NPCI E-Mandate Auto-Debit</span></div>
            <div style="display:flex; justify-content:space-between;"><span>Locked EMI:</span> <span style="color:var(--croma-teal); font-weight:700;">${selectedScheme.emi} / mo (${selectedScheme.tenure}m)</span></div>
          </div>

          <div style="font-size:0.78rem; color:#fff; margin-bottom:6px; font-weight:600;">Enter 6-Digit Bank Mandate E-Sign OTP:</div>
          <div class="otp-boxes" onclick="document.getElementById('btn-next').click()">
            <div class="otp-box">5</div><div class="otp-box">1</div><div class="otp-box">8</div>
            <div class="otp-box">3</div><div class="otp-box">9</div><div class="otp-box">2</div>
          </div>
        </div>

        <button class="btn-primary-mobile" onclick="document.getElementById('btn-next').click()">
          🔐 Submit Mandate OTP →
        </button>
      `;
      break;

    case 15:
      container.innerHTML = `
        <div class="card-glass highlight" style="text-align:center; padding:20px;">
          <div style="font-size:2.2rem; margin-bottom:8px;">📦</div>
          <div class="badge badge-success" style="display:inline-block; font-size:0.75rem; padding:6px 12px; margin-bottom:8px;">
            ✅ Mandate Details Confirmed
          </div>
          <h3 style="color:#fff; margin-bottom:6px;">Handover Initiated!</h3>
          <p style="font-size:0.78rem; color:var(--text-secondary); margin-bottom:14px; line-height:1.4;">
            Bank mandate verified for <strong>HDFC Bank **** 8821</strong>. FOS Representative is preparing product box scan and handover photo...
          </p>
          <button class="btn-secondary-mobile" onclick="document.getElementById('btn-next').click()">
            Awaiting Representative Handover →
          </button>
        </div>
      `;
      break;

    case 16:
      container.innerHTML = `
        <div class="card-glass" style="text-align:center; padding:24px;">
          <div style="font-size:2.8rem; margin-bottom:10px;">📦</div>
          <div class="badge badge-warning" style="display:inline-block; font-size:0.75rem; padding:6px 14px; margin-bottom:10px;">
            ⏳ Product Handover in Progress
          </div>
          <h3 style="color:#fff; font-size:1rem; margin-bottom:6px;">Store Handover Active</h3>
          <p style="font-size:0.78rem; color:var(--text-secondary); margin-bottom:16px; line-height:1.4;">
            FOS Representative at CROMA Phoenix is scanning the <strong>${selectedProduct.title}</strong> box barcode IMEI and capturing handover photo with you.
          </p>

          <div style="background:#0F172A; padding:12px; border-radius:8px; font-size:0.75rem; text-align:left; border:1px solid rgba(255,255,255,0.08); margin-bottom:14px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span style="color:var(--text-secondary);">Product:</span>
              <span style="font-weight:700; color:#fff;">${selectedProduct.title}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span style="color:var(--text-secondary);">Specs:</span>
              <span style="color:var(--croma-teal);">${selectedProduct.specs}</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-secondary);">Status:</span>
              <span style="color:#FBBF24; font-weight:600;">Representative scanning IMEI...</span>
            </div>
          </div>

          <div style="font-size:0.72rem; color:var(--text-muted); font-style:italic;">
            Handover OTP confirmation will appear on your screen once scan is submitted.
          </div>
        </div>
      `;
      break;

    case 17:
      container.innerHTML = `
        <div class="card-glass highlight">
          <div class="section-title">Confirm Product Handover</div>
          
          <div style="background:#0F172A; padding:12px; border-radius:8px; font-size:0.75rem; margin-bottom:12px; border:1px solid rgba(255,255,255,0.08);">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span style="color:var(--text-secondary);">Product Handover:</span>
              <span style="font-weight:700; color:#fff;">${selectedProduct.title}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span style="color:var(--text-secondary);">Scanned IMEI:</span>
              <span style="font-weight:700; color:#34D399;">359128091283719 ✅</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-secondary);">Store Verification:</span>
              <span style="color:var(--croma-teal); font-weight:600;">Joint Photo Captured ✅</span>
            </div>
          </div>

          <div style="font-size:0.78rem; color:#fff; margin-bottom:6px; font-weight:600;">Enter 6-Digit Handover Confirmation OTP:</div>
          <div class="otp-boxes" onclick="document.getElementById('btn-next').click()">
            <div class="otp-box">9</div><div class="otp-box">4</div><div class="otp-box">2</div>
            <div class="otp-box">1</div><div class="otp-box">6</div><div class="otp-box">8</div>
          </div>

          <p style="font-size:0.72rem; color:var(--text-secondary); text-align:center; margin:10px 0 12px; line-height:1.3;">
            By clicking "Product Received", you confirm physical receipt of the device in inspected condition.
          </p>

          <button class="btn-primary-mobile" onclick="document.getElementById('btn-next').click()">
            📦 Product Received →
          </button>
        </div>
      `;
      break;

    case 18:
      container.innerHTML = `
        <div class="card-glass" style="text-align:center; padding:26px; background:linear-gradient(135deg,#064E3B,#047857);">
          <div style="font-size:3rem; margin-bottom:10px;">🎉</div>
          <h2 style="color:#fff; margin-bottom:6px;">Order & Handover Complete!</h2>
          <p style="font-size:0.8rem; color:#A7F3D0; margin-bottom:16px;">
            Congratulations Rahul! You have received your ${selectedProduct.title}.
          </p>
          <div style="background:rgba(0,0,0,0.2); padding:10px; border-radius:8px; font-size:0.75rem; color:#fff; font-weight:700;">
            Loan Ref: BFL-2026-88923 • IMEI: 359128091283719
          </div>
        </div>
      `;
      break;

    default:
      container.innerHTML = `<div>Select a step</div>`;
  }
}

/**
 * ==========================================================================
 * TABLET SCREEN RENDERER (FOS STORE PORTAL - REPRESENTATIVE VIEW)
 * ==========================================================================
 */
function renderTabletScreen(step) {
  const sidebar = document.getElementById("tablet-sidebar");
  const workspace = document.getElementById("tablet-workspace");

  // Render Sidebar Queue: Customer is already logged in and checked in
  sidebar.innerHTML = `
    <div class="section-title">LIVE STORE QUEUE</div>
    <div class="queue-card ${step >= 5 ? 'highlight' : 'active'}" style="cursor:pointer;">
      <div class="queue-card-top">
        <div class="queue-avatar-wrapper">
          <img src="${CUSTOMER_PROFILES.rahul.avatar}" class="queue-avatar-img" alt="Rahul" />
        </div>
        <div class="queue-info">
          <div class="queue-name-row">
            <span class="queue-name">${CUSTOMER_PROFILES.rahul.shortName}</span>
            <span class="badge ${step >= 18 ? 'badge-success' : step >= 5 ? 'badge-success' : 'badge-in-store'}">
              ${step >= 18 ? 'Completed' : step >= 5 ? 'Offer Locked' : 'In Store'}
            </span>
          </div>
          <div class="queue-sub-row">
            <span>KYC: <strong style="color:${kycFlag === 'YES' ? '#34D399' : 'var(--status-warning)'};">${kycFlag === 'YES' ? 'YES' : 'Pending'}</strong></span>
            <span>•</span>
            <span>Limit: <strong style="color:var(--croma-teal);">₹1.65L</strong></span>
          </div>
        </div>
      </div>
    </div>

    <div class="queue-card" style="opacity:0.65;">
      <div class="queue-card-top">
        <div class="queue-avatar-wrapper">
          <img src="${CUSTOMER_PROFILES.ananya.avatar}" class="queue-avatar-img" alt="Ananya" />
        </div>
        <div class="queue-info">
          <div class="queue-name-row">
            <span class="queue-name">${CUSTOMER_PROFILES.ananya.shortName}</span>
            <span class="badge badge-success">Completed</span>
          </div>
          <div class="queue-sub-row">${CUSTOMER_PROFILES.ananya.product}</div>
        </div>
      </div>
    </div>

    <div class="queue-card" style="opacity:0.55;">
      <div class="queue-card-top">
        <div class="queue-avatar-wrapper">
          <img src="${CUSTOMER_PROFILES.karan.avatar}" class="queue-avatar-img" alt="Karan" />
        </div>
        <div class="queue-info">
          <div class="queue-name-row">
            <span class="queue-name">${CUSTOMER_PROFILES.karan.shortName}</span>
            <span class="badge badge-warning">MITC Pending</span>
          </div>
          <div class="queue-sub-row">${CUSTOMER_PROFILES.karan.product}</div>
        </div>
      </div>
    </div>
  `;

  // Render Workspace Content
  workspace.innerHTML = "";

  if (step <= 3) {
    // 1st screen: At the time of checkin & product search
    workspace.innerHTML = `
      <div class="dossier-card">
        <div class="dossier-header">
          <div class="dossier-title">
            <span class="pulse-dot green"></span>
            <span>IN-STORE CUSTOMER ARRIVAL DOSSIER</span>
          </div>
          <div class="dossier-meta">
            <span>📍 CROMA Phoenix #442</span>
            <span>🕒 Detected: Just now</span>
          </div>
        </div>

        <div class="dossier-body">
          <!-- Left: Customer Profile -->
          <div class="dossier-customer-col">
            <div class="dossier-avatar-wrapper">
              <img src="${CUSTOMER_PROFILES.rahul.avatar}" alt="Rahul Sharma" class="dossier-avatar-img" />
              <div class="store-detected-badge">✓ STORE DETECTED</div>
            </div>
            <div class="dossier-customer-info">
              <div class="dossier-name">Rahul Sharma</div>
              <div class="dossier-id">ID: BFL-IND-882194...</div>
              <div class="dossier-phone">📱 +91 98765-43210</div>
            </div>
          </div>

          <!-- Right: Status & Eligibility -->
          <div class="dossier-status-col">
            <div class="status-card-inner">
              <div class="status-card-header">
                <span class="status-card-title">CUSTOMER STATUS & ELIGIBILITY</span>
                <span class="status-pill pending">${kycFlag === 'YES' ? 'Pre-Approved' : 'Pending'}</span>
              </div>
              <div class="status-card-list">
                <div class="status-list-item">
                  <span class="status-bullet">•</span>
                  <span class="status-label">KYC Status :</span>
                  <span class="status-val pending">${kycFlag === 'YES' ? 'Verified' : 'Pending'}</span>
                </div>
                <div class="status-list-item">
                  <span class="status-bullet">•</span>
                  <span class="status-label">Banking Status :</span>
                  <span class="status-val active">Active and Linked</span>
                </div>
                <div class="status-list-item">
                  <span class="status-bullet">•</span>
                  <span class="status-label">Pre approved limit :</span>
                  <span class="status-val limit">₹1,65,000</span>
                </div>
                <div class="status-subtext">(Total: ₹2,00,000)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (step === 4) {
    // 2nd screen: When he selects a product and EMI options are ready
    workspace.innerHTML = `
      <div class="dossier-card compact">
        <div class="dossier-header">
          <div class="dossier-title">
            <span class="pulse-dot green"></span>
            <span>IN-STORE CUSTOMER ARRIVAL DOSSIER</span>
          </div>
          <div class="dossier-meta">
            <span>📍 CROMA Phoenix #442</span>
            <span>🕒 Detected: Just now</span>
          </div>
        </div>

        <div class="dossier-body">
          <!-- Left: Customer Profile -->
          <div class="dossier-customer-col">
            <div class="dossier-avatar-wrapper">
              <img src="${CUSTOMER_PROFILES.rahul.avatar}" alt="Rahul Sharma" class="dossier-avatar-img" />
              <div class="store-detected-badge">✓ STORE DETECTED</div>
            </div>
            <div class="dossier-customer-info">
              <div class="dossier-name">Rahul Sharma</div>
              <div class="dossier-id">ID: BFL-IND-882194...</div>
              <div class="dossier-phone">📱 +91 98765-43210</div>
            </div>
          </div>

          <!-- Right: Status & Eligibility -->
          <div class="dossier-status-col">
            <div class="status-card-inner">
              <div class="status-card-header">
                <span class="status-card-title">CUSTOMER STATUS & ELIGIBILITY</span>
                <span class="status-pill pending">${kycFlag === 'YES' ? 'Pre-Approved' : 'Pending'}</span>
              </div>
              <div class="status-card-list">
                <div class="status-list-item">
                  <span class="status-bullet">•</span>
                  <span class="status-label">KYC Status :</span>
                  <span class="status-val pending">${kycFlag === 'YES' ? 'Verified' : 'Pending'}</span>
                </div>
                <div class="status-list-item">
                  <span class="status-bullet">•</span>
                  <span class="status-label">Banking Status :</span>
                  <span class="status-val active">Active and Linked</span>
                </div>
                <div class="status-list-item">
                  <span class="status-bullet">•</span>
                  <span class="status-label">Pre approved limit :</span>
                  <span class="status-val limit">₹1,65,000</span>
                </div>
                <div class="status-subtext">(Total: ₹2,00,000)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Card: PRODUCT SELECTED BY CUSTOMER -->
      <div class="product-selected-card">
        <div class="product-selected-header">
          <div class="product-selected-title">
            <span class="pulse-dot green"></span>
            <span>PRODUCT SELECTED BY CUSTOMER</span>
          </div>
          <div class="product-selected-meta">
            <span style="font-size:0.7rem; color:#fff;">⚪</span>
            <span>Selected: Just now</span>
          </div>
        </div>

        <div class="product-selected-body">
          <!-- Left: Product Specs -->
          <div class="product-specs-box">
            <div class="product-spec-row-top">
              <div class="product-icon-container">📱</div>
              <div class="product-name-and-variant">
                <div class="product-title-text">${selectedProduct.title}</div>
                <div class="product-variant-text">${selectedProduct.specs}</div>
                <div class="product-price-stock-row">
                  <span class="product-price-cyan">${selectedProduct.price}</span>
                  <span class="stock-pill">IN STOCK (${selectedProduct.stock || 4})</span>
                </div>
              </div>
            </div>

            <div class="product-meta-footer">
              <div class="meta-item">
                <span class="meta-label">Floor Bin:</span>
                <span class="meta-val">${selectedProduct.floorBin || 'MOB-3B'}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">IMEI Pool:</span>
                <span class="meta-val cyan">${selectedProduct.imeiPool || 'Ready'}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Warranty:</span>
                <span class="meta-val">${selectedProduct.warranty || '1 Yr Apple'}</span>
              </div>
            </div>
          </div>

          <!-- Right: EMI Financing Status -->
          <div class="emi-status-box">
            <div class="emi-status-header">
              <span class="emi-title-text">EMI FINANCING STATUS</span>
              <span class="awaiting-pill">AWAITING PLAN</span>
            </div>

            <div class="emi-alert-callout">
              <div class="emi-pulse-icon">🟠</div>
              <div class="emi-alert-text">
                <strong>EMI options ready; customer to select EMI plan</strong>
              </div>
            </div>

            <div class="emi-evaluating-subtext">
              Customer is evaluating Scheme A, B, C on mobile
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (step === 5) {
    workspace.innerHTML = `
      <div class="card-glass highlight">
        <div class="section-title">Customer Confirmed Product & Scheme Choice</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <div>
            <h3 style="color:#fff;">${selectedProduct.title} (${selectedProduct.specs})</h3>
            <div style="font-size:0.8rem; color:var(--croma-teal); font-weight:700;">Price: ${selectedProduct.price} • Available Limit: ₹1,50,000</div>
          </div>
          <span class="badge badge-success">Stock Confirmed</span>
        </div>

        <div style="background:#0E1D36; padding:10px 14px; border-radius:8px; margin-bottom:12px; border:1px solid var(--bfl-orange);">
          <div style="font-size:0.75rem; color:var(--text-secondary);">Locked Offer by Customer:</div>
          <div style="font-weight:700; color:#fff; font-size:0.9rem; margin-top:2px;">${selectedScheme.name}</div>
          <div style="font-size:0.85rem; color:var(--croma-teal); font-weight:700;">
            ${selectedScheme.emi} / month x ${selectedScheme.tenure} Months (${selectedScheme.type})
          </div>
        </div>

        <div style="background:#0F172A; padding:10px 14px; border-radius:8px; margin-bottom:14px; border:1px solid rgba(255,255,255,0.08);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:0.75rem; color:var(--text-secondary);">Customer KYC Status:</div>
              <div style="font-weight:700; font-size:0.92rem; color:${kycFlag === 'YES' ? '#34D399' : 'var(--bfl-orange)'}; margin-top:2px;">
                Customer KYC Flag Status: ${kycFlag}
              </div>
            </div>
            <span class="badge ${kycFlag === 'YES' ? 'badge-success' : 'badge-warning'}">
              ${kycFlag === 'YES' ? 'PRE-VERIFIED' : 'CAPTURE REQUIRED'}
            </span>
          </div>
          <p style="font-size:0.78rem; color:var(--text-secondary); margin-top:6px; margin-bottom:0;">
            ${kycFlag === 'YES' 
              ? 'Customer is pre-verified. Initiates MITC approval.' 
              : 'Customer requires document capture. Representative will take live face photo & scan documents on this tablet.'}
          </p>
        </div>

        <button class="btn-primary" onclick="document.getElementById('btn-next').click()">
          ${kycFlag === 'YES' ? '⚡ Trigger MITC Flow →' : '📸 Enable Face Auth Camera →'}
        </button>
      </div>
    `;
  } else if (step === 6) {
    workspace.innerHTML = `
      <div class="card-glass highlight" style="text-align:center;">
        <div class="section-title">FOS Face Authentication Camera</div>
        <div class="camera-scanner" style="height:140px; margin:14px 0;" onclick="document.getElementById('btn-next').click()">
          <div class="scan-line"></div>
          <div style="font-size:2.2rem; margin-bottom:4px;">🤳</div>
          <div style="font-weight:700;">Capturing Customer Face Photo...</div>
          <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:4px;">Live biometric frame validation with central database</div>
        </div>

        <button class="btn-primary" onclick="document.getElementById('btn-next').click()">
          📸 Submit Face Auth →
        </button>
      </div>
    `;
  } else if (step === 7) {
    workspace.innerHTML = `
      <div class="card-glass highlight">
        <div class="section-title">System KYC Verification Check</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h3 style="color:#EF4444; font-size:0.95rem; margin-bottom:4px;">❌ KYC Verification Failed: Face Auth Mismatch</h3>
            <p style="font-size:0.78rem; color:var(--text-secondary); margin:0;">
              Live face photo did not match database records. Customer KYC Flag remains <strong>NO</strong>.
            </p>
          </div>
          <span class="badge badge-warning" style="color:#F87171; border-color:#EF4444;">KYC FAILED</span>
        </div>

        <div style="background:#0F172A; padding:12px; border-radius:8px; margin-bottom:14px; border:1px solid rgba(239,68,68,0.3);">
          <div style="font-weight:700; font-size:0.82rem; color:#fff; margin-bottom:4px;">Mandatory Document Capture Required:</div>
          <p style="font-size:0.76rem; color:var(--text-secondary); margin:0;">
            Representative must scan customer's physical <strong>Aadhaar Card</strong> and <strong>PAN Card</strong> using the tablet camera scanner to complete KYC verification.
          </p>
        </div>

        <button class="btn-primary" onclick="document.getElementById('btn-next').click()">
          📸 Scan Customer KYC Documents (Aadhaar & PAN) →
        </button>
      </div>
    `;
  } else if (step === 8) {
    workspace.innerHTML = `
      <div class="card-glass highlight">
        <div class="section-title">FOS Tablet: Customer KYC Document Capture</div>
        <p style="font-size:0.78rem; color:var(--text-secondary); margin-bottom:10px;">
          Representative capturing customer Aadhaar and PAN cards via tablet camera scanner:
        </p>
        <div class="camera-scanner" style="height:140px; margin-bottom:12px;" onclick="document.getElementById('btn-next').click()">
          <div class="scan-line"></div>
          <div style="font-size:2rem; margin-bottom:4px;">🪪</div>
          <div style="font-weight:700; font-size:0.85rem;">Scanning Aadhaar & PAN Card...</div>
          <div style="font-size:0.7rem; color:var(--text-secondary);">Tap to complete capture & OCR validation</div>
        </div>
        <button class="btn-primary" onclick="document.getElementById('btn-next').click()">
          📤 Submit KYC Documents →
        </button>
      </div>
    `;
  } else if (step === 9) {
    workspace.innerHTML = `
      <div class="card-glass highlight">
        <div class="section-title">KYC Status Monitor</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h3 style="color:#34D399; font-size:1rem; margin-bottom:4px;">✅ KYC Verified Successfully</h3>
            <p style="font-size:0.78rem; color:var(--text-secondary); margin:0;">
              ${faceAuthResult === 'SUCCESS' 
                ? 'Live Face Authentication matched central database records.' 
                : 'Customer Aadhaar & PAN cards validated successfully.'}
            </p>
          </div>
          <span class="badge badge-success">KYC VERIFIED</span>
        </div>

        <div style="background:#0F172A; padding:12px; border-radius:8px; margin-bottom:14px; border:1px solid rgba(16,185,129,0.3);">
          <div style="font-weight:700; font-size:0.82rem; color:#fff; margin-bottom:4px;">Next Step: Digital Loan Agreement</div>
          <p style="font-size:0.76rem; color:var(--text-secondary); margin:0;">
            Representative to initiate MITC digital terms & conditions agreement on the Customer PWA.
          </p>
        </div>

        <button class="btn-primary" onclick="document.getElementById('btn-next').click()">
          ⚡ Trigger MITC Flow →
        </button>
      </div>
    `;
  } else if (step === 10) {
    workspace.innerHTML = `
      <div class="card-glass highlight">
        <div class="section-title">Digital MITC Agreement Status</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h3 style="color:var(--croma-teal); font-size:1rem; margin-bottom:4px;">⏳ MITC Signing in Progress</h3>
            <p style="font-size:0.78rem; color:var(--text-secondary); margin:0;">
              Customer is reviewing MITC agreement terms and entering SMS OTP on mobile app...
            </p>
          </div>
          <span class="badge badge-warning">SIGNING IN PROGRESS</span>
        </div>

        <div style="background:#0F172A; padding:12px; border-radius:8px; border:1px solid rgba(255,255,255,0.08);">
          <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:6px;">
            <span style="color:var(--text-secondary);">Loan Product:</span>
            <span style="font-weight:700; color:#fff;">${selectedProduct.title} (${selectedProduct.price})</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:6px;">
            <span style="color:var(--text-secondary);">EMI Scheme:</span>
            <span style="font-weight:700; color:var(--croma-teal);">${selectedScheme.name}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.75rem;">
            <span style="color:var(--text-secondary);">Customer Action:</span>
            <span style="color:#FBBF24; font-weight:600;">Submitting 6-Digit SMS OTP on PWA</span>
          </div>
        </div>
      </div>
    `;
  } else if (step === 11) {
    workspace.innerHTML = `
      <div class="card-glass highlight">
        <div class="section-title">Bank Loan Authorization Status</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h3 style="color:#34D399; font-size:1rem; margin-bottom:4px;">✅ MITC Signed by Customer</h3>
            <p style="font-size:0.78rem; color:var(--text-secondary); margin:0;">
              Customer Rahul Sharma successfully signed MITC terms via OTP. Awaiting Bank Loan Authorization.
            </p>
          </div>
          <span class="badge badge-success">MITC SIGNED</span>
        </div>

        <div style="background:#0F172A; padding:12px; border-radius:8px; border:1px solid rgba(255,255,255,0.08); font-size:0.75rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="color:var(--text-secondary);">Loan Product:</span>
            <span style="font-weight:700; color:#fff;">${selectedProduct.title} (${selectedProduct.price})</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="color:var(--text-secondary);">EMI Plan:</span>
            <span style="font-weight:700; color:var(--croma-teal);">${selectedScheme.name}</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-secondary);">Customer Action:</span>
            <span style="color:#FBBF24; font-weight:600;">Prompted to Start "Authorize Bank Loan" on PWA</span>
          </div>
        </div>
      </div>
    `;
  } else if (step === 12) {
    workspace.innerHTML = `
      <div class="card-glass highlight">
        <div class="section-title">Bank Loan Authorization Status</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h3 style="color:var(--croma-teal); font-size:1rem; margin-bottom:4px;">⏳ Loan Authorization in Progress</h3>
            <p style="font-size:0.78rem; color:var(--text-secondary); margin:0;">
              Customer Rahul Sharma is authorizing the bank loan agreement via SMS OTP on Customer PWA...
            </p>
          </div>
          <span class="badge badge-warning">AUTHORIZATION IN PROGRESS</span>
        </div>

        <div style="background:#0F172A; padding:12px; border-radius:8px; border:1px solid rgba(255,255,255,0.08); font-size:0.75rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="color:var(--text-secondary);">Loan Principal:</span>
            <span style="font-weight:700; color:#fff;">${selectedProduct.price}</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="color:var(--text-secondary);">Sanctioned Plan:</span>
            <span style="font-weight:700; color:var(--croma-teal);">${selectedScheme.name}</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-secondary);">Customer Status:</span>
            <span style="color:#FBBF24; font-weight:600;">Entering Authorization OTP on PWA</span>
          </div>
        </div>
      </div>
    `;
  } else if (step === 13) {
    workspace.innerHTML = `
      <div class="card-glass highlight">
        <div class="section-title">Bank Loan Authorization Status</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h3 style="color:#34D399; font-size:1rem; margin-bottom:4px;">✅ Bank Loan Authorization Successful</h3>
            <p style="font-size:0.78rem; color:var(--text-secondary); margin:0;">
              Customer Rahul Sharma has authorized the loan agreement. Ready to configure bank auto-debit mandate.
            </p>
          </div>
          <span class="badge badge-success">LOAN AUTHORIZED</span>
        </div>

        <div style="background:#0F172A; padding:12px; border-radius:8px; border:1px solid rgba(16,185,129,0.3); font-size:0.75rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="color:var(--text-secondary);">Authorization Ref:</span>
            <span style="font-weight:700; color:#34D399;">BFL-AUTH-88219 ✅</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="color:var(--text-secondary);">Sanctioned Amount:</span>
            <span style="font-weight:700; color:#fff;">${selectedProduct.price} (${selectedScheme.name})</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-secondary);">Customer Action:</span>
            <span style="color:#FBBF24; font-weight:600;">Prompted to "Confirm Mandate via OTP" on PWA</span>
          </div>
        </div>
      </div>
    `;
  } else if (step === 14) {
    workspace.innerHTML = `
      <div class="card-glass highlight">
        <div class="section-title">Bank Auto-Debit Mandate Setup</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h3 style="color:var(--croma-teal); font-size:1rem; margin-bottom:4px;">⏳ Mandate OTP Validation in Progress</h3>
            <p style="font-size:0.78rem; color:var(--text-secondary); margin:0;">
              Customer is validating bank auto-debit (NPCI E-Mandate) for HDFC Bank **** 8821 via OTP...
            </p>
          </div>
          <span class="badge badge-warning">MANDATE OTP ACTIVE</span>
        </div>

        <div style="background:#0F172A; padding:12px; border-radius:8px; border:1px solid rgba(255,255,255,0.08); font-size:0.75rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="color:var(--text-secondary);">Bank Account:</span>
            <span style="font-weight:700; color:#fff;">HDFC Bank **** 8821</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="color:var(--text-secondary);">Mandate EMI:</span>
            <span style="font-weight:700; color:var(--croma-teal);">${selectedScheme.emi} / month (${selectedScheme.tenure}m)</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-secondary);">Customer Status:</span>
            <span style="color:#FBBF24; font-weight:600;">Entering Mandate OTP on PWA</span>
          </div>
        </div>
      </div>
    `;
  } else if (step === 15) {
    workspace.innerHTML = `
      <div class="card-glass highlight">
        <div class="section-title">Initiate Handover Flow</div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h3 style="color:#34D399;">⚡ Mandate Confirmed: ${selectedScheme.shortName}</h3>
            <p style="font-size:0.8rem; color:var(--text-secondary);">Bank auto-debit registered. Ready to scan product barcode and capture handover photo.</p>
          </div>
          <button class="btn-primary" onclick="document.getElementById('btn-next').click()">
            📸 Scan Box & Take Handover Photo →
          </button>
        </div>
      </div>
    `;
  } else if (step === 16) {
    workspace.innerHTML = `
      <div class="card-glass highlight" style="text-align:center;">
        <div class="section-title">FOS Product Barcode & Joint Handover Photo</div>
        
        <div style="background:#0F172A; padding:10px 14px; border-radius:8px; display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; margin-bottom:10px; border:1px solid rgba(255,255,255,0.08);">
          <span style="color:var(--text-secondary);">Customer App Status:</span>
          <span class="badge badge-warning">⏳ Handover in Progress (Awaiting Scan)</span>
        </div>

        <div class="camera-scanner" style="height:140px; margin:10px 0;" onclick="document.getElementById('btn-next').click()">
          <div class="scan-line"></div>
          <div style="font-size:2rem;">📦+📸</div>
          <div style="font-weight:700;">Scanning ${selectedProduct.title} IMEI & Customer Photo...</div>
          <div style="font-size:0.75rem; color:var(--bfl-orange); margin-top:4px;">Customer will receive Handover Confirmation OTP once scan is submitted</div>
        </div>
        <button class="btn-primary" onclick="document.getElementById('btn-next').click()">
          📸 Submit Handover Scan & Trigger Customer OTP →
        </button>
      </div>
    `;
  } else if (step === 17) {
    workspace.innerHTML = `
      <div class="card-glass highlight">
        <div class="section-title">Customer Product Handover Confirmation</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h3 style="color:var(--croma-teal); font-size:1rem; margin-bottom:4px;">⏳ Awaiting Customer OTP Confirmation</h3>
            <p style="font-size:0.78rem; color:var(--text-secondary); margin:0;">
              Customer Rahul Sharma is verifying device receipt and entering the 6-digit Handover OTP on PWA...
            </p>
          </div>
          <span class="badge badge-warning">HANDOVER OTP ACTIVE</span>
        </div>

        <div style="background:#0F172A; padding:12px; border-radius:8px; border:1px solid rgba(16,185,129,0.3); font-size:0.75rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="color:var(--text-secondary);">Device Handed:</span>
            <span style="font-weight:700; color:#fff;">${selectedProduct.title} (${selectedProduct.specs})</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="color:var(--text-secondary);">IMEI Barcode:</span>
            <span style="font-weight:700; color:#34D399;">359128091283719 ✅</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-secondary);">Customer Action:</span>
            <span style="color:#FBBF24; font-weight:600;">Validating OTP & Clicking "Product Received" on PWA</span>
          </div>
        </div>
      </div>
    `;
  } else if (step === 18) {
    workspace.innerHTML = `
      <div class="card-glass" style="text-align:center; padding:30px; background:linear-gradient(135deg,#064E3B,#047857);">
        <div style="font-size:3rem; margin-bottom:10px;">🎉</div>
        <h2 style="color:#fff;">Handover & Financing Complete!</h2>
        <p style="font-size:0.85rem; color:#A7F3D0; margin:8px 0 16px;">
          Customer verified product receipt via OTP. Loan Reference Number <strong>#BFL-2026-88923</strong> recorded for ${selectedProduct.title}.
        </p>
        <button class="btn-secondary" style="margin:0 auto;" onclick="alert('Receipt Printed for CROMA Store #442')">
          🖨️ Print CROMA Store Receipt
        </button>
      </div>
    `;
  }
}
