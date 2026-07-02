/* ===================================================================
   MEC CA Study Buddy — Frontend SPA (Apps Script edition)
   24x7 AI Education Agent | Class Diary | Multi-file Upload | Exam Prep
   =================================================================== */

const DEFAULT_BACKEND_URL = "https://script.google.com/macros/s/AKfycbxLTvO6v7h-c_PBoDozByo4FOAJ7Gk7WqbsroObPXLnAkNvExbJ-Fc6rMCNHlSyxx-I/exec";
const FETCH_TIMEOUT = 25000;
const MAX_CHAT_HISTORY = 100;
const MAX_RETRIES = 2;

// ---------- i18n ----------
const I18N = {
  en: {
    appName: "MEC Study Buddy", tagline: "Your 24x7 CA Professor — always with you",
    nav: { home: "Home", subjects: "Subjects", today: "Today", exam: "Exams", chat: "Chat", tricks: "Tricks" },
    greetMorning: "Good morning", greetAfternoon: "Good afternoon", greetEvening: "Good evening",
    welcome: "Ready to study, future CA? 🎓",
    quickAsk: "Ask the Professor", logToday: "Log today's class", myNotes: "My Notes", examPrep: "Exam Prep",
    todayTitle: "Today's Class Diary", todayHint: "Tell me what you studied today — I'll remember and guide you.",
    subject: "Subject", topic: "Topic / Chapter", note: "What did you learn? (notes, doubts)",
    save: "Save", saved: "Saved ✓", recent: "Recent classes", noLogs: "No classes logged yet.",
    subjectsTitle: "Your MEC Subjects", openChat: "Ask about this",
    examTitle: "Exam & Test Preparation", examHint: "Get a study plan, important questions & revision tips.",
    makePlan: "Make my plan", chatTitle: "24x7 AI Professor",
    chatPlaceholder: "Type your doubt… (Maths, Eco, Accounts)", clearMem: "Clear chat",
    streak: "Day streak", classesLogged: "Classes logged", topicsCovered: "Topics covered",
    uploadPhoto: "Upload notes / diagram photo", photoSaved: "Photo backed up ✓", uploading: "Uploading…",
    micTip: "Speak your doubt", listening: "Listening…", diagramTip: "Make a diagram",
    papersTitle: "Model & Previous Papers", papersHint: "Generate a model paper or find previous papers.",
    genPaper: "Generate model paper", findPrev: "Find previous papers", selectSubjFirst: "Select a subject first",
    diagramOf: "Diagram of…", makeDiagram: "Make a labelled diagram for this topic",
    setupTitle: "First-time Setup", step: "Step",
    s1Title: "Connect your backend", s1Hint: "Paste the Google Apps Script Web App URL you deployed.",
    urlPh: "https://script.google.com/macros/s/..../exec", testBtn: "Test connection",
    testing: "Testing…", connected: "Connected ✓", connectFail: "Could not connect. Check the URL.",
    s2Title: "Backup locations", s2Hint: "Optional — where your photos & notes get saved.",
    driveIdLabel: "Google Drive Folder ID", photosIdLabel: "Google Photos Album ID (optional)",
    groqLabel: "Groq API key (free AI)", groqHint: "Get it free at console.groq.com",
    langLabel: "Language", s3Title: "Set a PIN", s3Hint: "You'll use this PIN to open the app on any device.",
    createPin: "Create PIN (4–6 digits)", confirmPin: "Confirm PIN", finishBtn: "Finish setup",
    next: "Next", back: "Back", pinMismatch: "PINs don't match", pinLen: "PIN must be 4–6 digits",
    lockTitle: "Enter your PIN", unlock: "Unlock", wrongPin: "Wrong PIN, try again",
    existingFound: "This backend is already set up. Enter your PIN to connect this device.",
    reset: "Reset / use different backend", optional: "optional", saving: "Saving…",
    networkErr: "Network issue — check your connection.",
    offline: "You're offline. Some features may not work.",
    nameLabel: "Your name",
    camera: "Camera", attachFiles: "Attach Files", filesSelected: "file(s) selected",
    removeFile: "Remove", uploadComplete: "All files uploaded ✓", askAI: "Ask Professor",
    tricksTitle: "MEC & CA Tricks & Tips", tricksHint: "Quick formulas, shortcuts and motivation for your CA journey",
    trickFormula: "Formula", trickTip: "Pro Tip", trickExample: "Example",
    dailyMotivation: "Daily Motivation", tricksCount: "tricks", studyTips: "Study Tips",
    tip1: "Do 5 problems daily — consistency works better than intensity",
    tip2: "Write formulas 3 times to memorize them — muscle memory works wonders!",
    tip3: "Trigonometry: memorize basic identities first, derive the rest",
    tip4: "Calculus: understand 'rate of change' — the rest comes with practice",
    tip5: "Economics graphs: draw them for 5 mins daily — you'll never forget",
    tip6: "Commerce terms: create a short story around each term to remember",
    tip7: "Accounting: keep the double-entry rule clear — every debit has an equal credit",
  },

  hi: {
    appName: "MEC Study Buddy", tagline: "Aapke 24x7 CA Professor — hamesha saath",
    nav: { home: "Home", subjects: "Subjects", today: "Aaj", exam: "Exam", chat: "Chat", tricks: "Tricks" },
    greetMorning: "Good morning", greetAfternoon: "Good afternoon", greetEvening: "Good evening",
    welcome: "Padhne ke liye ready ho, future CA? 🎓",
    quickAsk: "Professor se pucho", logToday: "Aaj ki class likho", myNotes: "Mere Notes", examPrep: "Exam Prep",
    todayTitle: "Aaj ki Class Diary", todayHint: "Batao aaj kya padha — main yaad rakhunga aur guide karunga.",
    subject: "Subject", topic: "Topic / Chapter", note: "Kya seekha? (notes, doubts)",
    save: "Save karo", saved: "Save ho gaya ✓", recent: "Recent classes", noLogs: "Abhi koi class log nahi hui.",
    subjectsTitle: "Aapke MEC Subjects", openChat: "Iske baare me pucho",
    examTitle: "Exam & Test ki Taiyari", examHint: "Study plan, important questions aur revision tips lo.",
    makePlan: "Mera plan banao", chatTitle: "24x7 AI Professor",
    chatPlaceholder: "Apna doubt likho… (Maths, Eco, Accounts)", clearMem: "Chat clear karo",
    streak: "Din ka streak", classesLogged: "Classes logged", topicsCovered: "Topics cover hue",
    uploadPhoto: "Notes / diagram photo upload karo", photoSaved: "Photo backup ho gaya ✓", uploading: "Upload ho raha…",
    micTip: "Bol ke doubt pucho", listening: "Sun raha hun…", diagramTip: "Diagram banao",
    papersTitle: "Model & Previous Papers", papersHint: "Model paper banwao ya previous papers dhoondo.",
    genPaper: "Model paper banao", findPrev: "Previous papers dhoondo", selectSubjFirst: "Pehle subject choose karo",
    diagramOf: "Diagram banao…", makeDiagram: "Is topic ka ek labelled diagram banao",
    setupTitle: "Pehli baar Setup", step: "Step",
    s1Title: "Apna backend connect karo", s1Hint: "Jo Google Apps Script Web App URL deploy kiya woh paste karo.",
    urlPh: "https://script.google.com/macros/s/..../exec", testBtn: "Connection test karo",
    testing: "Test ho raha…", connected: "Connect ho gaya ✓", connectFail: "Connect nahi hua. URL check karo.",
    s2Title: "Backup jagah", s2Hint: "Optional — photos & notes kahan save honge.",
    driveIdLabel: "Google Drive Folder ID", photosIdLabel: "Google Photos Album ID (optional)",
    groqLabel: "Groq API key (free AI)", groqHint: "console.groq.com se free milti hai",
    langLabel: "Bhasha", s3Title: "PIN set karo", s3Hint: "Is PIN se kisi bhi device pe app khulega.",
    createPin: "PIN banao (4–6 digit)", confirmPin: "PIN confirm karo", finishBtn: "Setup poora karo",
    next: "Aage", back: "Peeche", pinMismatch: "PIN match nahi hua", pinLen: "PIN 4–6 digit ka ho",
    lockTitle: "Apna PIN daalo", unlock: "Unlock", wrongPin: "Galat PIN, dubara try karo",
    existingFound: "Ye backend pehle se setup hai. Is device ko connect karne ke liye PIN daalo.",
    reset: "Reset / dusra backend", optional: "optional", saving: "Save ho raha…",
    networkErr: "Network issue — backend se connect nahi ho paya.",
    offline: "Aap offline hain. Kuch features kaam nahi karenge.",
    nameLabel: "Aapka naam",
    camera: "Camera", attachFiles: "Files Attach karo", filesSelected: "file(s) chune gaye",
    removeFile: "Hatao", uploadComplete: "Saare files upload ho gaye ✓", askAI: "Professor se pucho",
    tricksTitle: "Maths Tricks & Tips", tricksHint: "Jaldi formulas, shortcuts aur motivation apni CA journey ke liye",
    trickFormula: "Formula", trickTip: "Pro Tip", trickExample: "Udaharn",
    dailyMotivation: "Aaj ki Prerna", tricksCount: "tricks", studyTips: "Padhai ke Tips",
    tip1: "Roz 5 problems karo — consistency intensity se zyada kaam karti hai",
    tip2: "Formulas 3 baar likh ke yaad karo — muscle memory kaam karegi!",
    tip3: "Trigonometry: pehle basic identities yaad karo, baaki derive kar lo",
    tip4: "Calculus: 'rate of change' samjho — baaki practice se aayega",
    tip5: "Economics graphs: roz 5 mins draw karo — hamesha yaad rahega",
    tip6: "Commerce terms: har term ke around chhoti story banao, yaad rahega",
    tip7: "Accounting: double entry rule clear rakho — har debit ka ek credit hota hai",
    trickM1: "Logarithm Power Rule: log(aᵇ) = b·log(a) — exponent neeche aata hai",
    trickM2: "Matrix Multiplication: row × column — pehle row, phir column, add karo",
    trickM3: "Differentiation: d/dx(xⁿ) = nxⁿ⁻¹ — power neeche aata hai, power ek kam",
    trickM4: "Integration: ∫xⁿdx = xⁿ⁺¹/(n+1) + C — power ek badhao, usi se divide",
    trickM5: "Trig Identity: sin²θ + cos²θ = 1 — yaad rahe hamesha",
    trickM6: "Limits: (sin x)/x → 1 jab x → 0 — standard limit hai, yaad rakho",
    trickM7: "Straight Line: slope m = (y₂-y₁)/(x₂-x₁) — rise over run",
    trickM8: "Vectors: dot product = |a||b|cosθ — magnitude × cos of angle",
    trickM9: "Functions: composite fog means f(g(x)) — andar se bahar",
    trickM10: "Probability: P(A∪B) = P(A)+P(B)-P(A∩B) — dono ko add, common subtract",
  }
};

// ---------- MATHS TRICKS DATA (Hinglish, simple, accurate) ----------
const MATH_TRICKS = [
  { id: "ia", subject: "Maths Paper-IA", color: "from-orange-500 to-amber-600", icon: "📐",
    tricks: [
      { title: "Functions — Domain & Range", formula: "f(x) = √(x) → domain x≥0, range y≥0",
        tip: "Denominator zero na ho, andar ka negative na ho — yahi domain ka rule hai",
        example: "f(x)=1/(x-2) → domain: x≠2" },
      { title: "Matrices — Multiplication", formula: "(m×n) × (n×p) = (m×p)",
        tip: "Row × Column multiply + add karo. Inner dimensions must match!",
        example: "2×3 matrix × 3×2 = 2×2 result" },
      { title: "Determinants — 2×2", formula: "det[a b; c d] = ad - bc",
        tip: "Cross multiply karo: (a×d) - (b×c). Yaad rakho: diagonal multiply minus cross",
        example: "det[2 3; 4 5] = 2×5 - 3×4 = 10-12 = -2" },
      { title: "Vectors — Dot Product", formula: "a·b = |a||b|cosθ = a₁b₁ + a₂b₂ + a₃b₃",
        tip: "Angle nikalna ho to: cosθ = (a·b)/(|a||b|). Dot product = 0 means perpendicular",
        example: "a=(1,2), b=(3,4) → a·b = 1×3 + 2×4 = 11" },
      { title: "Trigonometry — sin²θ + cos²θ = 1", formula: "sin²θ + cos²θ = 1, sec²θ - tan²θ = 1",
        tip: "Ye teen identities hamesha TRUE hain. Kisi bhi θ ke liye!",
        example: "sinθ=3/5, to cosθ = √(1-9/25) = 4/5" },
      { title: "Trig — sin(A+B) Formula", formula: "sin(A+B) = sinA·cosB + cosA·sinB",
        tip: "sin(A-B) = sinA·cosB - cosA·sinB. Plus for +, minus for -",
        example: "sin(90°+θ) = sin90·cosθ + cos90·sinθ = cosθ" },
      { title: "Hyperbolic Functions", formula: "sinh x = (eˣ - e⁻ˣ)/2, cosh x = (eˣ + e⁻ˣ)/2",
        tip: "Hyperbolic = normal trig ka 'imaginary' version. cosh²x - sinh²x = 1",
        example: "sinh(0) = (1-1)/2 = 0, cosh(0) = (1+1)/2 = 1" },
      { title: "Properties of Triangles", formula: "A = ½bc·sinA, sine rule: a/sinA = b/sinB = c/sinC",
        tip: "Area nikalne ke 3 formulas: ½×base×height, ½ab·sinC, Heron's formula",
        example: "Triangle with sides a=7,b=8,c=9 → semi-perimeter s=12 → Area = √(12×5×4×3)" },
    ] },
  { id: "ib", subject: "Maths Paper-IB", color: "from-rose-500 to-red-600", icon: "📊",
    tricks: [
      { title: "Straight Line — Slope", formula: "m = (y₂-y₁)/(x₂-x₁), line: y - y₁ = m(x - x₁)",
        tip: "Parallel lines: m₁ = m₂. Perpendicular: m₁·m₂ = -1",
        example: "(1,2) aur (3,6) se slope = (6-2)/(3-1) = 4/2 = 2" },
      { title: "Distance Formula", formula: "d = √[(x₂-x₁)² + (y₂-y₁)²]",
        tip: "Pythagoras ka formula hai — aajao distance nikal lo",
        example: "(1,2) to (4,6): d = √(9+16) = √25 = 5" },
      { title: "Differentiation — Power Rule", formula: "d/dx(xⁿ) = n·xⁿ⁻¹",
        tip: "Power neeche aata hai, power ek kam ho jata hai. Simple!",
        example: "d/dx(x⁵) = 5x⁴, d/dx(√x) = d/dx(x^½) = ½x^(-½)" },
      { title: "Differentiation — Product Rule", formula: "(uv)' = u'v + uv'",
        tip: "Pehle ka derivative × dusra + pehla × dusre ka derivative",
        example: "d/dx(x²·sinx) = 2x·sinx + x²·cosx" },
      { title: "Limits — Standard Limit", formula: "lim(x→0) sin x / x = 1",
        tip: "Ye standard limit hai. x→0 tab hi use karo, x→π pe nahi!",
        example: "lim(x→0) sin(2x)/(3x) = lim(2·sin(2x)/(2x))/3 = 2/3" },
      { title: "Continuity Check", formula: "lim(x→a⁻) f(x) = lim(x→a⁺) f(x) = f(a)",
        tip: "Teeno equal honge tabhi function continuous hai. Warna discontinuity!",
        example: "f(x) = {x² if x<2, 4 if x=2, 3x-2 if x>2} → check at x=2" },
      { title: "3D — Direction Cosines", formula: "l² + m² + n² = 1",
        tip: "Direction cosines hamesha yahi satisfy karte hain. Sum of squares = 1",
        example: "l=½, m=½, n=√(1-¼-¼) = 1/√2" },
    ] },
  { id: "eco", subject: "Economics", color: "from-teal-500 to-emerald-600", icon: "💰",
    tricks: [
      { title: "Demand & Supply Equilibrium", formula: "Qd = Qs → Equilibrium price+quantity",
        tip: "Demand curve = buyer's willingness. Supply curve = seller's willingness. Dono milte hain equilibrium pe",
        example: "Qd = 100-2P, Qs = 3P → 100-2P = 3P → P=20, Q=60" },
      { title: "Elasticity of Demand", formula: "Ed = %ΔQd / %ΔP",
        tip: "Ed > 1 = elastic (luxury). Ed < 1 = inelastic (necessity). Revenue = P × Q",
        example: "Price 10 se 12 (20%↑), demand 100 se 80 (20%↓) → Ed = 1" },
      { title: "National Income — GDP", formula: "GDP = C + I + G + (X-M)",
        tip: "Consumption + Investment + Govt Spending + Net Exports. Yhi economy ka size hai",
        example: "C=500, I=200, G=300, X=150, M=100 → GDP = 1050" },
      { title: "Money Multiplier", formula: "Money Multiplier = 1 / CRR",
        tip: "CRR jitna kam, utna zyada money creation. Banks lend karte hain, money multiply hota hai",
        example: "CRR=10% → Multiplier=10. ₹100 deposit creates ₹1000 money" },
      { title: "Inflation — CPI & WPI", formula: "Inflation Rate = (CPI₂-CPI₁)/CPI₁ × 100",
        tip: "CPI = consumer basket. WPI = wholesale. RBI inflation target = 4% (±2%)",
        example: "CPI 120 se 126 → Inflation = 6/120 × 100 = 5%" },
    ] },
  { id: "commerce", subject: "Commerce", color: "from-blue-500 to-indigo-600", icon: "🏦",
    tricks: [
      { title: "Forms of Business Organisation", formula: "Sole Proprietor (1) | Partnership (2-50) | Company (Joint Stock)",
        tip: "Sole Proprietorship features unlimited liability. Joint Stock Company features a separate legal entity and limited liability.",
        example: "Local retail store = Sole Proprietorship. Tata Motors = Joint Stock Company" },
      { title: "Trade Classification", formula: "Trade = Home Trade (Wholesale, Retail) + Foreign Trade (Import, Export, Entrepot)",
        tip: "Entrepot trade means importing goods from one country to export them to another country.",
        example: "Importing raw materials from Dubai, processing in India, and exporting to UK" },
      { title: "Business Finance Sources", formula: "Long Term (Equity, Debentures) | Short Term (Bank Overdraft, Trade Credit)",
        tip: "Equity shares carry voting rights but no fixed dividend. Debentures carry fixed interest but no voting rights.",
        example: "Issuing equity shares to construct a new corporate office (Long-term)" },
      { title: "MSME Classification", formula: "Micro (Inv ≤ 1cr, T/O ≤ 5cr) | Small (Inv ≤ 10cr, T/O ≤ 50cr) | Medium (Inv ≤ 50cr, T/O ≤ 250cr)",
        tip: "MSME criteria are now uniform for both manufacturing and services sector based on investment and turnover.",
        example: "A firm with ₹80 Lakh investment and ₹3 Crore turnover is a Micro enterprise" },
      { title: "E-Commerce Types", formula: "B2B (Business-to-Business) | B2C (Business-to-Consumer) | C2C (Consumer-to-Consumer)",
        tip: "C2C involves direct transaction between consumers, usually facilitated by an online marketplace.",
        example: "Amazon = B2C. Alibaba = B2B. OLX/eBay = C2C" },
    ] },
  { id: "accounts", subject: "Accountancy", color: "from-fuchsia-500 to-purple-600", icon: "🧮",
    tricks: [
      { title: "Accounting Equation", formula: "Assets = Liabilities + Capital",
        tip: "Dono sides hamesha equal hone chahiye. Business transaction se is balance pe koi farq nahi padta.",
        example: "Started business with cash ₹50,000 → Cash (Asset) +50,000 & Capital +50,000" },
      { title: "Golden Rules of Accounting", formula: "Real: Debit what comes in, Credit what goes out\nPersonal: Debit the receiver, Credit the giver\nNominal: Debit expenses & losses, Credit incomes & gains",
        tip: "Rule pehle identify karo (Asset = Real, Person = Personal, Expense/Income = Nominal) phir entry banao.",
        example: "Paid salary ₹5,000 → Salary (Nominal - Debit) & Cash (Real - Credit)" },
      { title: "Bank Reconciliation Statement (BRS)", formula: "Cash Book Balance +/- Adjustments = Pass Book Balance",
        tip: "Agar Cash Book se shuru kar rahe ho: jo items Pass Book ko badhate hain unhe (+) karo, jo kam karte hain unhe (-) karo.",
        example: "Cheque issued but not presented → Add (+) to Cash Book balance to reach Pass Book balance" },
      { title: "Depreciation — Straight Line Method (SLM)", formula: "Annual Depreciation = (Asset Cost - Scrap Value) / Useful Life",
        tip: "SLM me har saal depreciation ki amount SAME rehti hai. Depreciation rate = (Depreciation / Cost) * 100",
        example: "Cost ₹1,00,000, Scrap ₹10,000, Life 10 years → Depreciation = ₹9,000 per year" },
      { title: "Bills of Exchange — Due Date Calculation", formula: "Due Date = Date of Drawing + Bill Term + 3 Days of Grace",
        tip: "Hamesha 3 days of grace add karna mat bhoolna, chahe koi bhi scenario ho (unless public holiday)!",
        example: "Bill drawn on Jan 1 for 2 months → Due Date is March 1 + 3 days = March 4" }
    ] },
];

// ---------- MOTIVATIONAL QUOTES (Hinglish / English) ----------
const MOTIVATIONS = [
  { en: "Success is the sum of small efforts repeated day in and day out.", hi: "Safalta chhoti chhoti mehnat ka collection hai jo har roz karte ho." },
  { en: "The expert in anything was once a beginner. Keep going!", hi: "Har expert kabhi beginner tha. Chalo mat ruko!" },
  { en: "CA is not just a degree — it's a mindset of discipline and persistence.", hi: "CA sirf degree nahi — ye discipline aur persistence ka mindset hai." },
  { en: "Your only competition is the person you were yesterday. Be better today!", hi: "Sirf apne kal se compete karo. Aaj aur better bano!" },
  { en: "Mathematics is not about numbers — it's about the patterns of thinking.", hi: "Maths numbers ke baare me nahi — sochne ke patterns ke baare me hai." },
  { en: "Every problem has a solution. You just need the right approach.", hi: "Har problem ka solution hai. Bas sahi tarike se approach karo." },
  { en: "Study hard, stay humble, let your success make the noise.", hi: "Mehnat karo, humble raho, apni safalta ko shor karne do." },
  { en: "The difference between ordinary and extraordinary is that little EXTRA.", hi: "Ordinary aur extraordinary me farq hai — thoda sa EXTRA." },
  { en: "Don't count the days, make the days count. — Mike Tyson", hi: "Gin mat ki kitne din bache — har din ko worth it banao." },
  { en: "You don't have to be great to start, but you have to start to be great.", hi: "Great hone ke liye start karna zaroori hai, start karne ke liye great hona nahi." },
];

// ---------- STATE ----------
const SUBJECTS = [
  { id: "maths1a", name: "Maths Paper-IA", icon: "📐", color: "from-orange-500 to-amber-600",
    tag: "Algebra · Vector Algebra · Trigonometry",
    chapters: ["Functions","Mathematical Induction","Matrices","Addition of Vectors","Product of Vectors",
               "Trigonometric Ratios upto Transformations","Trigonometric Equations","Inverse Trigonometric Functions",
               "Hyperbolic Functions","Properties of Triangles"] },
  { id: "maths1b", name: "Maths Paper-IB", icon: "📊", color: "from-rose-500 to-red-600",
    tag: "Coordinate Geometry · Calculus",
    chapters: ["Locus","Transformation of Axes","The Straight Line","Pair of Straight Lines",
               "Three Dimensional Coordinates","Direction Cosines & Direction Ratios","The Plane",
               "Limits & Continuity","Differentiation","Applications of Derivatives"] },
  { id: "eco", name: "Economics", icon: "💰", color: "from-teal-500 to-emerald-600",
    tag: "Micro & Macro Economics",
    chapters: ["Introduction to Economics","Theories of Consumer Behaviour","Demand Analysis","Production Analysis",
               "Market Analysis","Theories of Distribution","National Income Analysis",
               "Theories of Employment & Public Finance","Money, Banking & Inflation","Basic Statistics for Economics"] },
  { id: "commerce", name: "Commerce", icon: "🏦", color: "from-blue-500 to-indigo-600",
    tag: "Business Organisation & Finance",
    chapters: ["Concept of Business","Business Activities & Functions",
               "Sole Proprietorship, Joint Hindu Family Business & Co-operative Societies","Partnership",
               "Joint Stock Company","Formation of a Company","Commencement of Business","Business Finance",
               "Sources of Business Finance","Micro, Small & Medium Enterprises (MSME)",
               "Multinational Companies (MNCs)","Current Trends in Business (E-business)"] },
  { id: "accounts", name: "Accountancy", icon: "🧮", color: "from-fuchsia-500 to-purple-600",
    tag: "Principles of Accounting · Ledger · Final Accounts",
    chapters: ["Introduction to Accounting", "Journal and Ledger", "Subsidiary Books", "Cash Book",
               "Bank Reconciliation Statement (BRS)", "Trial Balance and Rectification of Errors",
               "Depreciation Accounting", "Bills of Exchange", "Final Accounts of Sole Trader",
               "Computerised Accounting"] },
];

// ---------- STATE ----------
const LS = {
  cfg: "mec_cfg", logs: "mec_logs", chat: "mec_chat",
  streak: "mec_streak", lastDay: "mec_lastday",
  // NEW FEATURE storage keys (v2)
  flashcards: "mec_flashcards_v2",
  bookmarks: "mec_bookmarks_v2",
  quizResults: "mec_quiz_results_v2",
  syllabus: "mec_syllabus_v2",
  pomoStats: "mec_pomo_stats_v2",
  examGoal: "mec_exam_goal_v2",
};
let cfg = JSON.parse(localStorage.getItem(LS.cfg) || "null");
let session = { pinHash: sessionStorage.getItem("mec_pin") || null, unlocked: false };
let state = {
  lang: (cfg && cfg.lang) || "hi", view: "home", online: navigator.onLine,
  logs: JSON.parse(localStorage.getItem(LS.logs) || "[]"),
  chat: JSON.parse(localStorage.getItem(LS.chat) || "[]"),
  pendingFiles: [],
  // NEW FEATURE state (v2)
  flashcards: JSON.parse(localStorage.getItem(LS.flashcards) || "[]"),
  bookmarks: JSON.parse(localStorage.getItem(LS.bookmarks) || "[]"),
  quizResults: JSON.parse(localStorage.getItem(LS.quizResults) || "[]"),
  syllabus: JSON.parse(localStorage.getItem(LS.syllabus) || "{}"),
  pomoStats: JSON.parse(localStorage.getItem(LS.pomoStats) || "{\"sessions\":[],\"todayMinutes\":0,\"todayDate\":\"\"}"),
  examGoal: JSON.parse(localStorage.getItem(LS.examGoal) || "null"),
};
const t = () => I18N[state.lang];
const saveLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// ---------- helpers ----------
const el = (html) => { const d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstElementChild; };
async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}
function greet() { const h = new Date().getHours(); return h < 12 ? t().greetMorning : h < 17 ? t().greetAfternoon : t().greetEvening; }
function mdToHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.*)$/gm, "<h3>$1</h3>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code>$1</code>").replace(/^\s*[-*] (.*)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>").replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br>")
    .replace(/^(.*)$/s, "<p>$1</p>");
}
function getStudentName() {
  return cfg && cfg.studentName ? cfg.studentName : "Yeshaswini";
}
function sanitize(str) {
  return String(str || "").replace(/[<>]/g, "").trim();
}
function formatDate(d) {
  return d ? new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "";
}

// ---------- fetch with timeout + retry ----------
async function fetchWithTimeout(url, options, retries = MAX_RETRIES) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    if (retries > 0 && err.name !== "AbortError") {
      await new Promise(r => setTimeout(r, 1000));
      return fetchWithTimeout(url, options, retries - 1);
    }
    throw err;
  }
}

// ---------- Apps Script API ----------
async function api(action, payload = {}) {
  const body = JSON.stringify(Object.assign({ action, pinHash: session.pinHash }, payload));
  const res = await fetchWithTimeout(cfg.url, {
    method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
    body, redirect: "follow",
  });
  return res.json();
}
async function apiStatus(url) {
  const res = await fetchWithTimeout(url + (url.includes("?") ? "&" : "?") + "action=status");
  return res.json();
}

// ---------- Offline detection ----------
window.addEventListener("online", () => { state.online = true; if (session.unlocked) render(); });
window.addEventListener("offline", () => { state.online = false; if (session.unlocked) render(); });

// ===================================================================
//  BOOT
// ===================================================================
async function boot() {
  const baked = DEFAULT_BACKEND_URL && !DEFAULT_BACKEND_URL.startsWith("PASTE_");
  if (!cfg || !cfg.url) {
    if (baked) {
      try {
        const st = await apiStatus(DEFAULT_BACKEND_URL);
        cfg = { url: DEFAULT_BACKEND_URL, lang: (st && st.lang) || "hi" };
        state.lang = cfg.lang;
        if (st && st.pinSet) { saveLS(LS.cfg, cfg); return renderLock(); }
        wiz = { step: 2, url: DEFAULT_BACKEND_URL, status: st, driveId: "", photosId: "", groqKey: "",
                lang: "hi", pin: "", pin2: "", studentName: "" };
        return renderSetup();
      } catch (e) { return renderSetup(); }
    }
    return renderSetup();
  }
  if (!session.pinHash) return renderLock();
  try {
    const r = await api("verify");
    if (r && r.ok) { session.unlocked = true; await loadServerLogs(); render(); }
    else { sessionStorage.removeItem("mec_pin"); session.pinHash = null; renderLock(t().wrongPin); }
  } catch (e) { render(); }
}

async function loadServerLogs() {
  try {
    const r = await api("logs");
    if (r && r.logs) {
      state.logs = r.logs.filter(x => x.topic || x.subject);
      saveLS(LS.logs, state.logs);
    }
  } catch (e) {}
}

// ===================================================================
//  SETUP WIZARD
// ===================================================================
let wiz = { step: 1, url: "", status: null, driveId: "", photosId: "", groqKey: "",
            lang: "hi", pin: "", pin2: "", studentName: "" };

function shell(inner) {
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.appendChild(el(`
    <div class="min-h-dvh flex flex-col items-center justify-center px-4 py-8">
      <div class="w-full max-w-md">
        <div class="mb-6 text-center">
          <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-teal-500 to-indigo-600 text-3xl text-white shadow-lg">🎓</div>
          <h1 class="mt-3 text-xl font-bold">MEC CA Study Buddy</h1>
        </div>
        <div id="card" class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xl"></div>
      </div>
    </div>`));
  document.getElementById("card").appendChild(inner);
}

function field(label, id, ph, type = "text", val = "", hint = "") {
  const safeVal = String(val).replace(/"/g, "&quot;");
  return `<label class="mb-1 mt-3 block text-xs font-semibold">${label}</label>
    <input id="${id}" type="${type}" value="${safeVal}" placeholder="${ph}"
      class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2.5 outline-none focus:border-teal-500">
    ${hint ? `<p class="mt-1 text-[11px] text-slate-400">${hint}</p>` : ""}`;
}

function renderSetup(msg = "") {
  const T = t();
  if (wiz.step === 1) {
    const inner = el(`<div>
      <p class="text-[11px] font-semibold uppercase tracking-wide text-teal-600">${T.step} 1 / 3</p>
      <h2 class="mt-1 text-lg font-bold">${T.s1Title}</h2>
      <p class="mt-1 text-xs text-slate-500">${T.s1Hint}</p>
      ${field("Apps Script URL", "wUrl", T.urlPh, "url", wiz.url)}
      <p id="msg" class="mt-2 text-xs ${msg.includes("✓") ? "text-emerald-600" : "text-rose-500"}">${msg}</p>
      <button id="testBtn" class="mt-3 w-full rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 py-2.5 font-semibold text-white">${T.testBtn}</button>
    </div>`);
    inner.querySelector("#testBtn").onclick = async () => {
      const url = inner.querySelector("#wUrl").value.trim();
      if (!url) return;
      wiz.url = url;
      const btn = inner.querySelector("#testBtn"); btn.textContent = T.testing; btn.disabled = true;
      try {
        const st = await apiStatus(url);
        if (!st || !st.ok) throw new Error("bad");
        wiz.status = st;
        if (st.pinSet) { wiz.step = "existing"; renderSetup(); }
        else { wiz.step = 2; renderSetup(T.connected); }
      } catch (e) { renderSetup(T.connectFail); btn.disabled = false; btn.textContent = T.testBtn; }
    };
    return shell(inner);
  }

  if (wiz.step === 2) {
    const inner = el(`<div>
      <p class="text-[11px] font-semibold uppercase tracking-wide text-teal-600">${T.step} 2 / 3</p>
      <h2 class="mt-1 text-lg font-bold">${T.s2Title}</h2>
      <p class="mt-1 text-xs text-slate-500">${T.s2Hint}</p>
      ${field(T.nameLabel, "wName", "Yeshaswini", "text", wiz.studentName)}
      ${field(T.driveIdLabel, "wDrive", "1AbC...", "text", wiz.driveId)}
      ${field(T.photosIdLabel, "wPhotos", T.optional, "text", wiz.photosId)}
      ${field(T.groqLabel, "wGroq", "gsk_...", "text", wiz.groqKey, T.groqHint)}
      <label class="mb-1 mt-3 block text-xs font-semibold">${T.langLabel}</label>
      <select id="wLang" class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2.5">
        <option value="hi" ${wiz.lang === "hi" ? "selected" : ""}>🇮🇳 Hinglish</option>
        <option value="en" ${wiz.lang === "en" ? "selected" : ""}>🇬🇧 English</option>
      </select>
      <div class="mt-4 flex gap-2">
        <button id="back" class="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 font-semibold">${T.back}</button>
        <button id="next" class="flex-1 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 py-2.5 font-semibold text-white">${T.next}</button>
      </div>
    </div>`);
    inner.querySelector("#back").onclick = () => { wiz.step = 1; renderSetup(); };
    inner.querySelector("#next").onclick = () => {
      wiz.studentName = inner.querySelector("#wName").value.trim() || "Yeshaswini";
      wiz.driveId = inner.querySelector("#wDrive").value.trim();
      wiz.photosId = inner.querySelector("#wPhotos").value.trim();
      wiz.groqKey = inner.querySelector("#wGroq").value.trim();
      wiz.lang = inner.querySelector("#wLang").value;
      wiz.step = 3; renderSetup();
    };
    return shell(inner);
  }

  if (wiz.step === 3) {
    const inner = el(`<div>
      <p class="text-[11px] font-semibold uppercase tracking-wide text-teal-600">${T.step} 3 / 3</p>
      <h2 class="mt-1 text-lg font-bold">${T.s3Title}</h2>
      <p class="mt-1 text-xs text-slate-500">${T.s3Hint}</p>
      ${field(T.createPin, "wPin", "••••", "password")}
      ${field(T.confirmPin, "wPin2", "••••", "password")}
      <p id="msg" class="mt-2 text-xs text-rose-500">${msg}</p>
      <div class="mt-4 flex gap-2">
        <button id="back" class="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 font-semibold">${T.back}</button>
        <button id="fin" class="flex-1 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 py-2.5 font-semibold text-white">${T.finishBtn}</button>
      </div>
    </div>`);
    inner.querySelectorAll('input[type=password]').forEach(i => { i.inputMode = "numeric"; });
    inner.querySelector("#back").onclick = () => { wiz.step = 2; renderSetup(); };
    inner.querySelector("#fin").onclick = async () => {
      const p1 = inner.querySelector("#wPin").value.trim(), p2 = inner.querySelector("#wPin2").value.trim();
      if (!/^\d{4,6}$/.test(p1)) return renderSetup3msg(T.pinLen);
      if (p1 !== p2) return renderSetup3msg(T.pinMismatch);
      const btn = inner.querySelector("#fin"); btn.textContent = T.saving; btn.disabled = true;
      const pinHash = await sha256(p1);
      session.pinHash = pinHash;
      cfg = { url: wiz.url, lang: wiz.lang, studentName: wiz.studentName || "Yeshaswini" };
      try {
        const r = await fetchWithTimeout(cfg.url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ action: "setup", pinHash, driveId: wiz.driveId, photosId: wiz.photosId,
            groqKey: wiz.groqKey, lang: wiz.lang, studentName: wiz.studentName }) }).then(x => x.json());
        if (!r || !r.ok) throw new Error(r && r.error || "setup failed");
        finishUnlock();
      } catch (e) { renderSetup3msg(String(e.message || e)); btn.disabled = false; btn.textContent = T.finishBtn; }
    };
    return shell(inner);
  }

  if (wiz.step === "existing") {
    return renderLock(T.existingFound, true);
  }
}
function renderSetup3msg(m) { const e = document.getElementById("msg"); if (e) e.textContent = m; }

// ===================================================================
//  PIN LOCK
// ===================================================================
function renderLock(msg = "", fromWizard = false) {
  const T = t();
  const inner = el(`<div class="text-center">
    <div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-2xl">🔒</div>
    <h2 class="mt-3 text-lg font-bold">${T.lockTitle}</h2>
    <p class="mt-1 text-xs text-slate-500">${msg || ""}</p>
    <input id="pinInp" type="password" inputmode="numeric" maxlength="6" placeholder="••••"
      class="mx-auto mt-4 block w-40 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-3 text-center text-2xl tracking-[0.4em] outline-none focus:border-teal-500">
    <p id="lmsg" class="mt-2 text-xs text-rose-500"></p>
    <button id="unlock" class="mt-3 w-full rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 py-2.5 font-semibold text-white">${T.unlock}</button>
    <button id="reset" class="mt-3 text-[11px] text-slate-400 hover:underline">${T.reset}</button>
  </div>`);
  const tryUnlock = async () => {
    const pin = inner.querySelector("#pinInp").value.trim();
    if (!/^\d{4,6}$/.test(pin)) { inner.querySelector("#lmsg").textContent = T.pinLen; return; }
    const btn = inner.querySelector("#unlock"); btn.disabled = true; btn.textContent = "…";
    const pinHash = await sha256(pin);
    session.pinHash = pinHash;
    if (!cfg) cfg = { url: wiz.url, lang: wiz.lang || "hi" };
    try {
      const r = await api("verify");
      if (r && r.ok) { finishUnlock(); }
      else { session.pinHash = null; inner.querySelector("#lmsg").textContent = T.wrongPin; btn.disabled = false; btn.textContent = T.unlock; }
    } catch (e) { inner.querySelector("#lmsg").textContent = T.networkErr; btn.disabled = false; btn.textContent = T.unlock; }
  };
  inner.querySelector("#unlock").onclick = tryUnlock;
  inner.querySelector("#pinInp").addEventListener("keydown", e => { if (e.key === "Enter") tryUnlock(); });
  inner.querySelector("#reset").onclick = () => {
    if (confirm("Reset this device's connection?")) {
      localStorage.removeItem(LS.cfg); sessionStorage.removeItem("mec_pin");
      cfg = null; session = { pinHash: null, unlocked: false }; wiz = { step: 1, url: "", lang: "hi", studentName: "" }; renderSetup();
    }
  };
  shell(inner);
  setTimeout(() => inner.querySelector("#pinInp").focus(), 50);
}

async function finishUnlock() {
  sessionStorage.setItem("mec_pin", session.pinHash);
  state.lang = cfg.lang || "hi";
  saveLS(LS.cfg, cfg);
  session.unlocked = true;
  await loadServerLogs();
  render();
}

// ===================================================================
//  MAIN APP RENDER
// ===================================================================
function updateStreak() {
  const today = new Date().toDateString(); const last = localStorage.getItem(LS.lastDay);
  let streak = parseInt(localStorage.getItem(LS.streak) || "0", 10);
  if (last !== today) {
    const y = new Date(Date.now() - 864e5).toDateString();
    streak = (last === y) ? Math.min(streak + 1, 365) : 1;
    localStorage.setItem(LS.streak, streak); localStorage.setItem(LS.lastDay, today);
  }
  return streak || 1;
}

function render() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.appendChild(Header());
  const main = el(`<main class="view-enter mx-auto w-full max-w-3xl px-4 pb-28 pt-4"></main>`);
  if (!state.online) {
    main.appendChild(el(`<div class="mb-3 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-center text-xs text-amber-700 dark:text-amber-300">📡 ${t().offline}</div>`));
  }
  const views = { home: HomeView, subjects: SubjectsView, today: TodayView, exam: ExamView, chat: ChatView, tricks: TricksView, focus: FocusView, flashcards: FlashcardsView, quiz: QuizView, analytics: AnalyticsView, bookmarks: BookmarksView };
  main.appendChild((views[state.view] || HomeView)());
  app.appendChild(main);
  app.appendChild(AIAgentFAB());
  app.appendChild(BottomNav());
  if (state.view === "chat") { scrollChat(); runMermaid(); }
}

function Header() {
  const h = el(`
    <header class="safe-top sticky top-0 z-20 border-b border-slate-200/70 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur">
      <div class="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3">
        <div class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-teal-500 to-indigo-600 text-white text-lg shadow">🎓</div>
        <div class="min-w-0 flex-1"><h1 class="truncate text-base font-bold leading-tight">${t().appName}</h1>
          <p class="truncate text-[11px] text-slate-500 dark:text-slate-400">${t().tagline}</p></div>
        <button id="moreBtn" class="shrink-0 rounded-full border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800" title="More features">⚡ More</button>
        <button id="langBtn" class="shrink-0 rounded-full border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800">
          ${state.lang === "hi" ? "🇮🇳 Hinglish" : "🇬🇧 English"}</button>
      </div></header>`);
  h.querySelector("#langBtn").onclick = () => {
    state.lang = state.lang === "hi" ? "en" : "hi"; cfg.lang = state.lang; saveLS(LS.cfg, cfg); render();
  };
  h.querySelector("#moreBtn").onclick = () => openMoreSheet();
  return h;
}

// ===================================================================
//  24x7 FLOATING AI AGENT
// ===================================================================
function AIAgentFAB() {
  const fab = el(`<div id="aiFab" class="fixed bottom-20 right-4 z-30 flex flex-col items-end gap-2">
    <button id="fabBtn" class="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-teal-500 to-indigo-600 text-2xl text-white shadow-lg shadow-teal-500/30 hover:scale-110 active:scale-95 transition-all duration-200 animate-bounce-slow"
      title="${t().askAI}">
      🤖
    </button>
    <span class="rounded-full bg-white dark:bg-slate-800 px-2.5 py-1 text-[10px] font-semibold shadow-md border border-slate-200 dark:border-slate-700">${t().askAI} 💬</span>
  </div>`);
  const btn = fab.querySelector("#fabBtn");
  btn.addEventListener("click", () => {
    if (state.view === "chat") { scrollChat(); return; }
    go("chat");
  });
  return fab;
}

function StatCard(label, value, icon) {
  return `<div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-center">
    <div class="text-2xl">${icon}</div><div class="mt-1 text-xl font-extrabold">${value}</div>
    <div class="text-[11px] text-slate-500 dark:text-slate-400">${label}</div></div>`;
}

function HomeView() {
  const streak = updateStreak();
  const topics = new Set(state.logs.map(l => l.subject + "|" + l.topic)).size;
  const name = getStudentName();
  const wrap = el(`<div class="space-y-5"></div>`);
  wrap.appendChild(el(`<section class="rounded-3xl bg-gradient-to-br from-teal-500 via-cyan-600 to-indigo-600 p-5 text-white shadow-lg">
      <p class="text-sm opacity-90">${greet()}, ${sanitize(name)} 👋</p>
      <h2 class="mt-1 text-xl font-bold">${t().welcome}</h2>
      <button id="goChat" class="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/30">💬 ${t().quickAsk}</button>
    </section>`));
  wrap.appendChild(el(`<div class="grid grid-cols-3 gap-3">
      ${StatCard(t().streak, streak, "🔥")}${StatCard(t().classesLogged, state.logs.length, "📚")}${StatCard(t().topicsCovered, topics, "✅")}</div>`));
  const motIdx = Math.floor(Math.abs(new Date().toDateString().split("").reduce((a,c)=>a+c.charCodeAt(0),0)) % MOTIVATIONS.length);
  const mot = MOTIVATIONS[motIdx];
  const acts = [
    { v: "today", icon: "📝", label: t().logToday, c: "from-orange-400 to-amber-500" },
    { v: "subjects", icon: "📖", label: t().myNotes, c: "from-teal-400 to-emerald-500" },
    { v: "tricks", icon: "🧠", label: t().nav.tricks, c: "from-purple-400 to-pink-500" },
    { v: "exam", icon: "🎯", label: t().examPrep, c: "from-rose-400 to-red-500" },
    { v: "chat", icon: "🤖", label: t().nav.chat, c: "from-indigo-400 to-violet-500" }];
  const grid = el(`<div class="grid grid-cols-2 gap-3 sm:grid-cols-5"></div>`);
  acts.forEach(a => { const b = el(`<button class="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:shadow-md transition">
        <span class="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${a.c} text-2xl text-white">${a.icon}</span>
        <span class="text-xs font-semibold text-center">${a.label}</span></button>`); b.onclick = () => go(a.v); grid.appendChild(b); });
  wrap.appendChild(grid);
  const motQuote = el(`<section class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
    <div class="flex items-start gap-3"><span class="text-2xl">💪</span>
      <div><p class="text-[11px] font-semibold text-teal-600 dark:text-teal-400">${t().dailyMotivation}</p>
        <p class="mt-1 text-sm leading-relaxed">"${state.lang === "hi" ? mot.hi : mot.en}"</p></div></div></section>`);
  wrap.appendChild(motQuote);
  const recent = el(`<section><h3 class="mb-2 px-1 text-sm font-bold">${t().recent}</h3></section>`);
  recent.appendChild(LogList(state.logs.slice(0, 3))); wrap.appendChild(recent);
  wrap.querySelector("#goChat").onclick = () => go("chat");
  return wrap;
}

function SubjectsView() {
  const wrap = el(`<div class="space-y-4"><h2 class="px-1 text-lg font-bold">${t().subjectsTitle}</h2></div>`);
  const grid = el(`<div class="grid grid-cols-1 gap-3 sm:grid-cols-2"></div>`);
  SUBJECTS.forEach(s => {
    const card = el(`<div class="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div class="flex items-center gap-3 bg-gradient-to-r ${s.color} p-4 text-white"><span class="text-3xl">${s.icon}</span>
          <div><h3 class="font-bold">${s.name}</h3><p class="text-xs opacity-90">${s.tag} · ${s.chapters.length} chapters</p></div></div>
        <div class="p-4"><div class="flex flex-wrap gap-1.5">
            ${s.chapters.slice(0, 6).map(c => `<span class="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px]">${c}</span>`).join("")}
            ${s.chapters.length > 6 ? `<span class="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px]">+${s.chapters.length - 6} more</span>` : ""}</div>
          <div class="mt-3 flex gap-2">
            <button class="askSub flex-1 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 py-2 text-xs font-semibold text-white">${t().openChat}</button>
            <button class="tricksSub flex-1 rounded-xl border border-slate-300 dark:border-slate-700 py-2 text-xs font-semibold">🧠 ${t().nav.tricks}</button>
          </div></div></div>`);
    card.querySelector(".askSub").onclick = () => { go("chat"); setTimeout(() => sendMessage(state.lang === "hi"
        ? `${s.name} ka ek important chapter samjhao aur 3 exam questions do.`
        : `Explain an important chapter of ${s.name} and give 3 exam questions.`), 60); };
    const trBtn = card.querySelector(".tricksSub");
    if (trBtn) trBtn.onclick = () => go("tricks");
    grid.appendChild(card);
  });
  wrap.appendChild(grid); return wrap;
}

// ===================================================================
//  TODAY VIEW — with multi-file upload (camera OR files)
// ===================================================================
let _fileList = [];

function TodayView() {
  _fileList = [];
  const wrap = el(`<div class="space-y-4"><div><h2 class="px-1 text-lg font-bold">📝 ${t().todayTitle}</h2>
      <p class="px-1 text-xs text-slate-500 dark:text-slate-400">${t().todayHint}</p></div></div>`);
  const opts = SUBJECTS.map(s => `<option value="${s.name}">${s.icon} ${s.name}</option>`).join("");
  const form = el(`<form id="logForm" class="space-y-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <div><label class="mb-1 block text-xs font-semibold">${t().subject}</label>
        <select name="subject" class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2">${opts}</select></div>
      <div><label class="mb-1 block text-xs font-semibold">${t().topic}</label>
        <input name="topic" required class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2" placeholder="e.g. Demand Analysis"></div>
      <div><label class="mb-1 block text-xs font-semibold">${t().note}</label>
        <textarea name="note" rows="3" class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2"></textarea></div>

      <!-- File attach area -->
      <div class="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-3">
        <p class="mb-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">📎 ${t().uploadPhoto}</p>
        <div class="flex gap-2">
          <button type="button" id="cameraBtn" class="flex-1 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 py-2 text-xs font-semibold text-white">📷 ${t().camera}</button>
          <button type="button" id="filesBtn" class="flex-1 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 py-2 text-xs font-semibold text-white">📁 ${t().attachFiles}</button>
        </div>
        <!-- Hidden inputs -->
        <input id="cameraInp" type="file" accept="image/*" capture="environment" class="hidden">
        <input id="filesInp" type="file" accept="image/*,application/pdf,.doc,.docx,.ppt,.pptx,.txt" multiple class="hidden">
        <!-- Preview gallery -->
        <div id="filePreview" class="mt-2 flex flex-wrap gap-2"></div>
        <p id="fileMsg" class="mt-1 text-center text-[11px] text-slate-400"></p>
      </div>

      <button class="w-full rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 py-2.5 font-semibold text-white">${t().save}</button>
    </form>`);

  // Camera button
  const camBtn = form.querySelector("#cameraBtn");
  const camInp = form.querySelector("#cameraInp");
  camBtn.onclick = () => camInp.click();
  camInp.onchange = (e) => {
    for (const f of e.target.files) addFile(f);
    camInp.value = "";
    renderFilePreview(form);
  };

  // Files button (multiple)
  const filesBtn = form.querySelector("#filesBtn");
  const filesInp = form.querySelector("#filesInp");
  filesBtn.onclick = () => filesInp.click();
  filesInp.onchange = (e) => {
    for (const f of e.target.files) addFile(f);
    filesInp.value = "";
    renderFilePreview(form);
  };

  // File preview helpers
  function addFile(f) {
    if (f.size > 5 * 1024 * 1024) { alert(`File too large: ${f.name} (max 5 MB)`); return; }
    _fileList.push(f);
  }

  function renderFilePreview(ctx) {
    const container = ctx.querySelector("#filePreview");
    const msg = ctx.querySelector("#fileMsg");
    container.innerHTML = "";
    if (!_fileList.length) { msg.textContent = ""; return; }
    msg.textContent = `${_fileList.length} ${t().filesSelected}`;
    _fileList.forEach((f, i) => {
      const card = el(`<div class="group relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div class="flex h-full w-full items-center justify-center text-lg font-bold text-slate-400">${f.type.startsWith("image/") ? "🖼" : "📄"}</div>
        <button type="button" data-idx="${i}" class="remove-file absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-rose-500 text-[10px] text-white shadow opacity-0 group-hover:opacity-100 transition">✕</button>
      </div>`);
      card.querySelector(".remove-file").onclick = () => { _fileList.splice(i, 1); renderFilePreview(ctx); };
      container.appendChild(card);
    });
  }

  // Submit
  form.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const topic = sanitize(fd.get("topic") || "");
    if (!topic) return;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = t().saving;

    // Upload files first
    const uploaded = [];
    for (const f of _fileList) {
      const fr = new FileReader();
      const result = await new Promise((resolve) => {
        fr.onload = () => resolve(fr.result);
        fr.readAsDataURL(f);
      });
      try {
        const r = await api("upload", { filename: f.name, mime: f.type, data: result });
        if (r && r.ok && r.link) uploaded.push(r.link);
      } catch (er) {}
    }

    const entry = {
      subject: fd.get("subject"), topic,
      note: sanitize(fd.get("note") || ""),
      date: new Date().toISOString(),
      files: uploaded,
    };
    state.logs.unshift(entry); saveLS(LS.logs, state.logs);
    try { await api("log", { entry }); } catch (e2) {}
    _fileList = [];
    btn.textContent = t().saved;
    setTimeout(() => go("today"), 700);
  };

  wrap.appendChild(form);

  // Recent classes
  const list = el(`<section><h3 class="mb-2 px-1 text-sm font-bold">${t().recent}</h3></section>`);
  list.appendChild(LogList(state.logs)); wrap.appendChild(list);
  return wrap;
}

function LogList(logs) {
  if (!logs.length) return el(`<p class="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-center text-xs text-slate-500">${t().noLogs}</p>`);
  const box = el(`<div class="space-y-2"></div>`);
  logs.forEach(l => {
    const sub = SUBJECTS.find(s => s.name === l.subject);
    const d = l.date ? formatDate(l.date) : "";
    const files = (l.files && l.files.length) ? l.files : [];
    box.appendChild(el(`<div class="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
        <span class="text-xl">${sub ? sub.icon : "📘"}</span>
        <div class="min-w-0 flex-1"><div class="flex items-center justify-between gap-2">
            <p class="truncate font-semibold">${sanitize(l.topic || "")}</p><span class="shrink-0 text-[11px] text-slate-400">${d}</span></div>
          <p class="text-[11px] text-slate-500">${l.subject || ""}</p>
          ${l.note ? `<p class="mt-1 text-xs text-slate-600 dark:text-slate-300">${sanitize(l.note)}</p>` : ""}
          ${files.length ? `<div class="mt-1 flex flex-wrap gap-1">${files.map(url => `<a href="${url}" target="_blank" class="inline-flex items-center gap-0.5 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] text-teal-600 dark:text-teal-400 hover:underline">📎 file</a>`).join("")}</div>` : ""}
        </div></div>`));
  });
  return box;
}

function ExamView() {
  const wrap = el(`<div class="space-y-4"><div><h2 class="px-1 text-lg font-bold">${t().examTitle}</h2>
      <p class="px-1 text-xs text-slate-500 dark:text-slate-400">${t().examHint}</p></div></div>`);
  const opts = SUBJECTS.map(s => `<label class="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
      <input type="checkbox" value="${s.name}" class="examSub h-4 w-4 accent-teal-600"><span>${s.icon} ${s.name}</span></label>`).join("");
  const card = el(`<div class="space-y-3"><div class="grid grid-cols-1 gap-2 sm:grid-cols-2">${opts}</div>
      <div class="flex items-center gap-2"><input id="examDays" type="number" min="1" max="365" value="7" class="w-20 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-center"><span class="text-xs text-slate-500">days left</span></div>
      <button id="planBtn" class="w-full rounded-xl bg-gradient-to-r from-rose-500 to-red-600 py-2.5 font-semibold text-white">🎯 ${t().makePlan}</button></div>`);
  card.querySelector("#planBtn").onclick = () => {
    const subs = [...card.querySelectorAll(".examSub:checked")].map(c => c.value);
    const days = Math.min(Math.max(parseInt(card.querySelector("#examDays").value) || 7, 1), 365);
    const list = subs.length ? subs.join(", ") : "all MEC subjects";
    go("chat"); setTimeout(() => sendMessage(state.lang === "hi"
      ? `Mere exam me ${days} din bache hain. ${list} ke liye day-wise study plan banao with important questions aur revision tips.`
      : `My exam is in ${days} days. Make a day-wise study plan for ${list} with important questions and revision tips.`), 60);
  };
  wrap.appendChild(card);

  const papers = el(`<div class="space-y-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <div><h3 class="text-sm font-bold">📄 ${t().papersTitle}</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">${t().papersHint}</p></div>
      <select id="paperSub" class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2">
        ${SUBJECTS.map(s => `<option value="${s.name}">${s.icon} ${s.name}</option>`).join("")}</select>
      <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button id="genPaper" class="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-2.5 text-sm font-semibold text-white">📝 ${t().genPaper}</button>
        <button id="findPrev" class="rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 text-sm font-semibold">🔎 ${t().findPrev}</button>
      </div></div>`);
  papers.querySelector("#genPaper").onclick = () => {
    const sub = papers.querySelector("#paperSub").value;
    go("chat"); setTimeout(() => sendMessage(state.lang === "hi"
      ? `${sub} ka ek full MODEL QUESTION PAPER banao TSBIE Intermediate 1st year exam pattern ke hisaab se — sections, marks aur important questions ke saath.`
      : `Create a full MODEL QUESTION PAPER for ${sub} as per the TSBIE Intermediate 1st year exam pattern — with sections, marks and important questions.`), 60);
  };
  papers.querySelector("#findPrev").onclick = () => {
    const sub = papers.querySelector("#paperSub").value;
    const q = encodeURIComponent(`TS Inter 1st year ${sub} previous question papers TSBIE`);
    window.open(`https://www.google.com/search?q=${q}`, "_blank");
  };
  wrap.appendChild(papers);
  return wrap;
}

// ===================================================================
//  TRICKS VIEW — Maths Tricks, Study Tips & Daily Motivation
// ===================================================================
function TricksView() {
  const todayKey = new Date().toDateString();
  const motIdx = Math.floor(Math.abs(todayKey.split("").reduce((a,c)=>a+c.charCodeAt(0),0)) % MOTIVATIONS.length);
  const mot = MOTIVATIONS[motIdx];
  const T = t();
  const wrap = el(`<div class="space-y-4"></div>`);

  // Header
  wrap.appendChild(el(`<div><h2 class="px-1 text-lg font-bold">🧠 ${T.tricksTitle}</h2>
    <p class="px-1 text-xs text-slate-500 dark:text-slate-400">${T.tricksHint}</p></div>`));

  // Daily Motivation
  wrap.appendChild(el(`<section class="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-4 text-white shadow-lg">
    <p class="text-[10px] font-semibold uppercase tracking-wide opacity-80">💪 ${T.dailyMotivation}</p>
    <p class="mt-2 text-sm leading-relaxed font-medium">"${state.lang === "hi" ? mot.hi : mot.en}"</p>
  </section>`));

  // Study Tips section
  const tips = [T.tip1, T.tip2, T.tip3, T.tip4, T.tip5, T.tip6];
  const tipsCard = el(`<section class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
    <h3 class="mb-2 flex items-center gap-2 text-sm font-bold">📘 ${T.studyTips}</h3>
    <div class="space-y-1.5"></div></section>`);
  const tipsBox = tipsCard.querySelector("div");
  tips.forEach((tip, i) => {
    tipsBox.appendChild(el(`<div class="flex items-start gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-2.5">
      <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-teal-500 to-indigo-600 text-[11px] text-white font-bold">${i+1}</span>
      <p class="text-xs leading-relaxed">${tip}</p></div>`));
  });
  wrap.appendChild(tipsCard);

  // Tricks by subject — accordion style
  const tricksWrap = el(`<section class="space-y-2"></section>`);
  MATH_TRICKS.forEach((subj, si) => {
    const subCard = el(`<div class="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <button data-si="${si}" class="subj-trigger flex w-full items-center gap-3 bg-gradient-to-r ${subj.color} p-3.5 text-white">
        <span class="text-2xl">${subj.icon}</span>
        <div class="flex-1 text-left"><p class="font-bold text-sm">${subj.subject}</p>
          <p class="text-[11px] opacity-80">${subj.tricks.length} ${T.tricksCount}</p></div>
        <span class="arrow text-lg transition-transform duration-200">▾</span>
      </button>
      <div class="tricks-body hidden space-y-2 p-3"></div></div>`);
    const body = subCard.querySelector(".tricks-body");
    const arrow = subCard.querySelector(".arrow");

    subj.tricks.forEach((tr, ti) => {
      const trCard = el(`<div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 p-3 space-y-1.5">
        <p class="text-xs font-bold text-teal-600 dark:text-teal-400">${tr.title}</p>
        <div class="rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2">
          <code class="text-[12px] font-mono leading-relaxed">${tr.formula}</code>
        </div>
        <div class="flex items-start gap-1.5"><span class="shrink-0 text-[10px] font-bold text-amber-500">💡</span>
          <p class="text-[11px] text-slate-600 dark:text-slate-300">${tr.tip}</p></div>
        ${tr.example ? `<div class="flex items-start gap-1.5"><span class="shrink-0 text-[10px] font-bold text-emerald-500">📝</span>
          <p class="text-[11px] text-slate-500 dark:text-slate-400">${tr.example}</p></div>` : ""}
      </div>`);
      body.appendChild(trCard);
    });

    subCard.querySelector(".subj-trigger").onclick = () => {
      const isOpen = !body.classList.contains("hidden");
      body.classList.toggle("hidden");
      arrow.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
    };
    tricksWrap.appendChild(subCard);
  });
  wrap.appendChild(tricksWrap);

  // Quick ask button
  wrap.appendChild(el(`<button id="tricksAskBtn" class="w-full rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 py-3 font-semibold text-white text-sm">🤖 ${T.quickAsk}</button>`));
  wrap.querySelector("#tricksAskBtn").onclick = () => { go("chat"); setTimeout(() => sendMessage(state.lang === "hi"
    ? "Mujhe Maths me help chahiye — koi bhi chapter se ek important concept + trick + example do"
    : "I need help with Maths — give me an important concept + trick + example from any chapter"), 60); };

  return wrap;
}

// ---------- CHAT ----------
function ChatView() {
  const wrap = el(`<div class="flex h-[calc(100dvh-9.5rem)] flex-col"></div>`);
  const head = el(`<div class="mb-2 flex items-center justify-between px-1"><h2 class="text-lg font-bold">🤖 ${t().chatTitle}</h2>
      <button id="clearMem" class="text-[11px] text-rose-500 hover:underline">${t().clearMem}</button></div>`);
  head.querySelector("#clearMem").onclick = () => { if (confirm("Clear chat?")) { state.chat = []; saveLS(LS.chat, state.chat); render(); } };
  wrap.appendChild(head);
  const scroll = el(`<div id="chatScroll" class="no-sb flex-1 space-y-3 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3"></div>`);
  if (!state.chat.length) scroll.appendChild(el(`<div class="grid h-full place-items-center text-center text-slate-400">
      <div><div class="text-4xl">🎓</div><p class="mt-2 text-xs">${state.lang === "hi" ? "Apna pehla doubt pucho! Main 24x7 available hoon!" : "Ask your first doubt! I'm 24x7 available!"}</p></div></div>`));
  else state.chat.forEach(m => scroll.appendChild(Bubble(m.role, m.content)));
  wrap.appendChild(scroll);
  const bar = el(`<form id="chatForm" class="safe-bottom mt-2 flex items-end gap-1.5">
      <button type="button" id="micBtn" title="${t().micTip}" class="grid h-11 w-9 shrink-0 place-items-center rounded-2xl border border-slate-300 dark:border-slate-700 text-lg">🎤</button>
      <textarea id="chatInput" rows="1" placeholder="${t().chatPlaceholder}" class="max-h-28 flex-1 resize-none rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5"></textarea>
      <button type="button" id="diagBtn" title="${t().diagramTip}" class="grid h-11 w-9 shrink-0 place-items-center rounded-2xl border border-slate-300 dark:border-slate-700 text-lg">📊</button>
      <button type="submit" class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-600 text-white">➤</button></form>`);
  const inp = bar.querySelector("#chatInput");
  inp.addEventListener("input", () => { inp.style.height = "auto"; inp.style.height = Math.min(inp.scrollHeight, 112) + "px"; });
  inp.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); bar.requestSubmit(); } });
  bar.onsubmit = e => { e.preventDefault(); const v = inp.value.trim(); if (!v) return; inp.value = ""; inp.style.height = "auto"; sendMessage(v); };
  bar.querySelector("#micBtn").onclick = () => startVoice(inp, bar.querySelector("#micBtn"));
  bar.querySelector("#diagBtn").onclick = () => {
    const v = inp.value.trim(); if (!v) { inp.focus(); return; }
    inp.value = ""; inp.style.height = "auto";
    sendMessage((state.lang === "hi" ? "Is topic ka ek labelled Mermaid diagram banao: " : "Make a labelled Mermaid diagram for: ") + v);
  };
  wrap.appendChild(bar); return wrap;
}

function startVoice(inp, btn) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { alert(state.lang === "hi" ? "Is browser me voice support nahi hai." : "Voice not supported in this browser."); return; }
  if (window.__rec) { window.__rec.stop(); return; }
  const rec = new SR();
  rec.lang = state.lang === "hi" ? "hi-IN" : "en-IN";
  rec.interimResults = true; rec.continuous = false;
  window.__rec = rec;
  btn.classList.add("animate-pulse", "text-rose-500");
  rec.onresult = (e) => {
    let txt = "";
    for (let i = e.resultIndex; i < e.results.length; i++) txt += e.results[i][0].transcript;
    inp.value = txt;
    inp.dispatchEvent(new Event("input"));
  };
  rec.onerror = () => {};
  rec.onend = () => { btn.classList.remove("animate-pulse", "text-rose-500"); window.__rec = null; };
  rec.start();
}

function renderAssistant(content) {
  const blocks = [];
  let s = content.replace(/```mermaid\s*([\s\S]*?)```/g, (m, code) => {
    const i = blocks.length; blocks.push(code.trim()); return `\u0000M${i}\u0000`;
  });
  let html = mdToHtml(s);
  html = html.replace(/\u0000M(\d+)\u0000/g, (m, i) =>
    `<div class="mermaid my-2 rounded-xl bg-white p-2 overflow-x-auto text-center">${blocks[i].replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div>`);
  return html;
}
function runMermaid() {
  const nodes = document.querySelectorAll('.mermaid:not([data-processed])');
  if (!nodes.length) return;
  if (window.mermaid && window.mermaid.run) {
    try { nodes.forEach(n => n.setAttribute('data-processed', 'true')); window.mermaid.run({ nodes }); } catch (e) {}
  } else { setTimeout(runMermaid, 300); }
}

function Bubble(role, content) {
  const me = role === "user";
  // For assistant bubbles, add a small bookmark button so students can save important explanations
  const bookmarkBtn = !me
    ? `<button class="bmBtn mt-1.5 rounded-md bg-slate-200/60 dark:bg-slate-700/60 px-2 py-0.5 text-[10px] text-slate-600 dark:text-slate-300 hover:bg-amber-200 dark:hover:bg-amber-900/40" title="Save to Doubt Bookmarks">⭐ Save</button>`
    : "";
  return el(`<div class="flex ${me ? "justify-end" : "justify-start"}"><div class="max-w-[88%] rounded-2xl px-3.5 py-2.5 ${me
      ? "bg-gradient-to-br from-teal-500 to-indigo-600 text-white rounded-br-sm" : "bg-slate-100 dark:bg-slate-800 rounded-bl-sm"}">
      <div class="msg-body text-[13px] leading-relaxed">${me ? sanitize(content) : renderAssistant(content)}</div>${bookmarkBtn}</div></div>`);
}

// Wire up bookmark buttons after each render — delegated
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".bmBtn");
  if (!btn) return;
  const bubble = btn.closest(".flex");
  const body = bubble && bubble.querySelector(".msg-body");
  if (!body) return;
  const text = body.innerText || body.textContent || "";
  if (!text.trim()) return;
  // Avoid duplicates by content hash (first 80 chars)
  const key = text.trim().slice(0, 80);
  const exists = state.bookmarks.some(b => (b.text || "").slice(0, 80) === key);
  if (exists) { btn.textContent = "✓ Saved"; return; }
  state.bookmarks.unshift({ text: text.trim(), date: new Date().toISOString(), subject: "" });
  if (state.bookmarks.length > 200) state.bookmarks = state.bookmarks.slice(0, 200);
  saveLS(LS.bookmarks, state.bookmarks);
  btn.textContent = "✓ Saved";
  btn.classList.add("bg-amber-200", "dark:bg-amber-900/40");
});
function scrollChat() { const s = document.getElementById("chatScroll"); if (s) s.scrollTop = s.scrollHeight; }

async function sendMessage(text) {
  if (state.view !== "chat") go("chat");
  state.chat.push({ role: "user", content: text });
  if (state.chat.length > MAX_CHAT_HISTORY) state.chat = state.chat.slice(-MAX_CHAT_HISTORY);
  saveLS(LS.chat, state.chat);
  const scroll = document.getElementById("chatScroll");
  if (scroll && scroll.querySelector(".place-items-center")) scroll.innerHTML = "";
  scroll && scroll.appendChild(Bubble("user", text));
  const typing = el(`<div class="flex justify-start"><div class="typing rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-3"><span></span><span></span><span></span></div></div>`);
  scroll && scroll.appendChild(typing); scrollChat();
  let reply;
  try {
    const r = await api("chat", { lang: state.lang, message: text, history: state.chat.slice(-10), memory: state.logs.slice(0, 20) });
    reply = (r && r.reply) || ("⚠️ " + ((r && r.error) || "no reply"));
  } catch (e) {
    reply = state.lang === "hi" ? "⚠️ " + t().networkErr : "⚠️ " + t().networkErr;
  }
  if (typing.parentNode) typing.remove();
  state.chat.push({ role: "assistant", content: reply });
  if (state.chat.length > MAX_CHAT_HISTORY) state.chat = state.chat.slice(-MAX_CHAT_HISTORY);
  saveLS(LS.chat, state.chat);
  scroll && scroll.appendChild(Bubble("assistant", reply)); scrollChat(); runMermaid();
}

// ---------- BOTTOM NAV ----------
function BottomNav() {
  const items = [
    { v: "home", icon: "🏠", label: t().nav.home }, { v: "subjects", icon: "📚", label: t().nav.subjects },
    { v: "tricks", icon: "🧠", label: t().nav.tricks }, { v: "today", icon: "📝", label: t().nav.today },
    { v: "exam", icon: "🎯", label: t().nav.exam }, { v: "chat", icon: "💬", label: t().nav.chat }];
  const nav = el(`<nav class="safe-bottom fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
      <div class="mx-auto flex w-full max-w-3xl items-stretch justify-around px-1 pt-1.5"></div></nav>`);
  const row = nav.firstElementChild;
  items.forEach(it => { const active = state.view === it.v;
    const b = el(`<button class="flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 ${active ? "nav-active" : "text-slate-500 dark:text-slate-400"}">
        <span class="text-base ${active ? "scale-110" : ""} transition">${it.icon}</span><span class="text-[9px] font-semibold leading-tight text-center">${it.label}</span></button>`);
    b.onclick = () => go(it.v); row.appendChild(b); });
  return nav;
}
function go(v) { state.view = v; render(); window.scrollTo({ top: 0 }); }

// ---------- GLOBAL ERROR BOUNDARY ----------
window.addEventListener("error", (e) => {
  console.error("Global error:", e.error || e.message);
});
window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled rejection:", e.reason);
});

// ===================================================================
//  NEW FEATURES (v2) — Pomodoro, Flashcards, Mock Test, Analytics, Bookmarks, Syllabus Tracker
// ===================================================================

// ---------- "More" sheet (header button) ----------
function openMoreSheet() {
  const items = [
    { v: "focus", icon: "🍅", label: state.lang === "hi" ? "Pomodoro Timer" : "Pomodoro Timer", desc: state.lang === "hi" ? "25 min focus + 5 min break" : "25 min focus + 5 min break" },
    { v: "flashcards", icon: "🃏", label: state.lang === "hi" ? "Flashcards" : "Flashcards", desc: state.lang === "hi" ? "Formulas & definitions yaad karo" : "Memorize formulas & definitions" },
    { v: "quiz", icon: "❓", label: state.lang === "hi" ? "Mock Test (MCQ)" : "Mock Test (MCQ)", desc: state.lang === "hi" ? "Self-scoring quiz banao" : "Self-scored AI quiz" },
    { v: "bookmarks", icon: "⭐", label: state.lang === "hi" ? "Doubt Bookmarks" : "Doubt Bookmarks", desc: state.lang === "hi" ? "Saved AI explanations" : "Saved AI explanations" },
    { v: "analytics", icon: "📊", label: state.lang === "hi" ? "Performance Analytics" : "Performance Analytics", desc: state.lang === "hi" ? "Progress + syllabus tracker" : "Progress + syllabus tracker" },
  ];
  const overlay = el(`<div id="moreSheet" class="fixed inset-0 z-40 flex items-end justify-center bg-black/40">
    <div class="w-full max-w-md rounded-t-3xl bg-white dark:bg-slate-900 p-5 pb-8 shadow-2xl view-enter">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-lg font-bold">${state.lang === "hi" ? "📋 More Features" : "📋 More Features"}</h3>
        <button id="closeMore" class="grid h-8 w-8 place-items-center rounded-full bg-slate-100 dark:bg-slate-800 text-lg">✕</button>
      </div>
      <div class="space-y-2"></div>
    </div>
  </div>`);
  const list = overlay.querySelector("div.space-y-2");
  items.forEach(it => {
    const row = el(`<button class="flex w-full items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800">
      <span class="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-teal-500 to-indigo-600 text-xl text-white">${it.icon}</span>
      <div class="flex-1"><p class="text-sm font-semibold">${it.label}</p><p class="text-[11px] text-slate-500">${it.desc}</p></div>
      <span class="text-slate-400">›</span>
    </button>`);
    row.onclick = () => { overlay.remove(); go(it.v); };
    list.appendChild(row);
  });
  overlay.querySelector("#closeMore").onclick = () => overlay.remove();
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

// ===================================================================
//  1. POMODORO FOCUS TIMER
// ===================================================================
let _pomo = { running: false, mode: "work", remaining: 25 * 60, timer: null };

function fmtTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function FocusView() {
  const wrap = el(`<div class="space-y-4"></div>`);
  wrap.appendChild(el(`<div><h2 class="px-1 text-lg font-bold">🍅 ${state.lang === "hi" ? "Pomodoro Focus Timer" : "Pomodoro Focus Timer"}</h2>
    <p class="px-1 text-xs text-slate-500 dark:text-slate-400">${state.lang === "hi" ? "25 minute focus, 5 minute break. Consistency = top marks." : "25 min focus, 5 min break. Consistency = top marks."}</p></div>`));

  // Timer card
  const card = el(`<div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center">
    <p id="pomoMode" class="text-xs font-semibold uppercase tracking-wide ${_pomo.mode === "work" ? "text-rose-500" : "text-emerald-500"}">${_pomo.mode === "work" ? (state.lang === "hi" ? "🎯 Focus Time" : "🎯 Focus Time") : (state.lang === "hi" ? "☕ Break Time" : "☕ Break Time")}</p>
    <div id="pomoTime" class="my-4 font-mono text-6xl font-bold tracking-tight">${fmtTime(_pomo.remaining)}</div>
    <div class="flex justify-center gap-2">
      <button id="pomoStart" class="rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 px-6 py-2.5 font-semibold text-white">${_pomo.running ? (state.lang === "hi" ? "⏸ Pause" : "⏸ Pause") : (state.lang === "hi" ? "▶ Start" : "▶ Start")}</button>
      <button id="pomoReset" class="rounded-xl border border-slate-300 dark:border-slate-700 px-5 py-2.5 font-semibold">${state.lang === "hi" ? "↺ Reset" : "↺ Reset"}</button>
      <button id="pomoSkip" class="rounded-xl border border-slate-300 dark:border-slate-700 px-5 py-2.5 font-semibold">${state.lang === "hi" ? "⏭ Skip" : "⏭ Skip"}</button>
    </div>
  </div>`);
  wrap.appendChild(card);

  // Stats card
  const stats = state.pomoStats || { sessions: [], todayMinutes: 0, todayDate: "" };
  const today = new Date().toDateString();
  if (stats.todayDate !== today) { stats.todayDate = today; stats.todayMinutes = 0; }
  const todaySessions = stats.sessions.filter(s => new Date(s.date).toDateString() === today).length;
  const totalSessions = stats.sessions.length;
  const totalMinutes = stats.sessions.reduce((a, s) => a + (s.minutes || 0), 0);

  wrap.appendChild(el(`<div class="grid grid-cols-3 gap-3">
    ${StatCard(state.lang === "hi" ? "Aaj ke sessions" : "Today's sessions", todaySessions, "🎯")}
    ${StatCard(state.lang === "hi" ? "Aaj ke minutes" : "Today's minutes", stats.todayMinutes, "⏱")}
    ${StatCard(state.lang === "hi" ? "Total sessions" : "Total sessions", totalSessions, "🏆")}
  </div>`));

  wrap.appendChild(el(`<div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-xs text-slate-600 dark:text-slate-300">
    <p class="font-semibold text-slate-800 dark:text-slate-100 mb-1">💡 ${state.lang === "hi" ? "Pomodoro Trick" : "Pomodoro Trick"}</p>
    ${state.lang === "hi"
      ? "25 minute me sirf EK topic par dhyaan do. Phone ko door rakho. Har session ke baad 5 minute break lo — paani pio, chhodo, walk karo. 4 sessions ke baad 20 minute ka long break lo. Aise 4 ghante me 8 topics cover ho jayenge."
      : "Focus on ONE topic for 25 minutes. Keep phone away. After each session, take a 5-min break — drink water, walk. After 4 sessions, take a 20-min long break. This way you can cover 8 topics in 4 hours."}
  </div>`));

  // Wire up
  const startBtn = card.querySelector("#pomoStart");
  const resetBtn = card.querySelector("#pomoReset");
  const skipBtn = card.querySelector("#pomoSkip");
  const timeEl = card.querySelector("#pomoTime");
  const modeEl = card.querySelector("#pomoMode");

  function updateUI() {
    timeEl.textContent = fmtTime(_pomo.remaining);
    modeEl.textContent = _pomo.mode === "work" ? (state.lang === "hi" ? "🎯 Focus Time" : "🎯 Focus Time") : (state.lang === "hi" ? "☕ Break Time" : "☕ Break Time");
    modeEl.className = `text-xs font-semibold uppercase tracking-wide ${_pomo.mode === "work" ? "text-rose-500" : "text-emerald-500"}`;
    startBtn.textContent = _pomo.running ? (state.lang === "hi" ? "⏸ Pause" : "⏸ Pause") : (state.lang === "hi" ? "▶ Start" : "▶ Start");
  }

  function tick() {
    if (!_pomo.running) return;
    _pomo.remaining--;
    if (_pomo.remaining <= 0) {
      // Session complete
      if (_pomo.mode === "work") {
        // Log session
        stats.sessions.push({ date: new Date().toISOString(), minutes: 25, mode: "work" });
        stats.todayMinutes = (stats.todayMinutes || 0) + 25;
        if (stats.sessions.length > 500) stats.sessions = stats.sessions.slice(-500);
        state.pomoStats = stats;
        saveLS(LS.pomoStats, stats);
        _pomo.mode = "break";
        _pomo.remaining = 5 * 60;
        try { navigator.vibrate && navigator.vibrate(200); } catch (e) {}
        alert(state.lang === "hi" ? "🎯 25 minute ho gaye! 5 minute break lo." : "🎯 25 min done! Take a 5-min break.");
      } else {
        _pomo.mode = "work";
        _pomo.remaining = 25 * 60;
        try { navigator.vibrate && navigator.vibrate([100, 50, 100]); } catch (e) {}
        alert(state.lang === "hi" ? "☕ Break khatam! Wapas focus karo." : "☕ Break over! Back to focus.");
      }
    }
    updateUI();
  }

  startBtn.onclick = () => {
    if (_pomo.running) {
      _pomo.running = false;
      clearInterval(_pomo.timer);
    } else {
      _pomo.running = true;
      _pomo.timer = setInterval(tick, 1000);
    }
    updateUI();
  };
  resetBtn.onclick = () => {
    _pomo.running = false; clearInterval(_pomo.timer);
    _pomo.mode = "work"; _pomo.remaining = 25 * 60;
    updateUI();
  };
  skipBtn.onclick = () => {
    _pomo.remaining = 1; tick();
  };

  return wrap;
}

// ===================================================================
//  2. FLASHCARDS
// ===================================================================
function FlashcardsView() {
  const wrap = el(`<div class="space-y-4"></div>`);
  wrap.appendChild(el(`<div><h2 class="px-1 text-lg font-bold">🃏 ${state.lang === "hi" ? "Flashcards" : "Flashcards"}</h2>
    <p class="px-1 text-xs text-slate-500 dark:text-slate-400">${state.lang === "hi" ? "Formulas & definitions yaad karo — flip karke check karo." : "Memorize formulas & definitions — flip to check."}</p></div>`));

  // Add new card form
  const addForm = el(`<form class="space-y-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-bold">➕ ${state.lang === "hi" ? "Naya card banao" : "Add new card"}</h3>
      <button type="button" id="aiFillBtn" class="rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[10px] font-semibold">🤖 AI se bharo</button>
    </div>
    <select id="fcSubj" class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-xs">
      ${SUBJECTS.map(s => `<option value="${s.name}">${s.icon} ${s.name}</option>`).join("")}
    </select>
    <textarea id="fcFront" rows="2" placeholder="${state.lang === "hi" ? "Front (sawal / term)" : "Front (question / term)"}" class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-xs"></textarea>
    <textarea id="fcBack" rows="3" placeholder="${state.lang === "hi" ? "Back (jawab / formula)" : "Back (answer / formula)"}" class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-xs"></textarea>
    <button type="submit" class="w-full rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 py-2 text-xs font-semibold text-white">${state.lang === "hi" ? "Save card" : "Save card"}</button>
  </form>`);
  wrap.appendChild(addForm);

  // AI fill button — generates 3 flashcards for selected subject
  addForm.querySelector("#aiFillBtn").onclick = () => {
    const sub = addForm.querySelector("#fcSubj").value;
    go("chat");
    setTimeout(() => sendMessage(state.lang === "hi"
      ? `${sub} ke liye 5 flashcards banao — har card ka front (term/sawal) aur back (formula/short answer) clearly mention karo. Format: "CARD 1\\nFront: ...\\nBack: ..."`
      : `Create 5 flashcards for ${sub} — for each card clearly mention front (term/question) and back (formula/short answer). Format: "CARD 1\\nFront: ...\\nBack: ..."`), 60);
  };

  addForm.onsubmit = (e) => {
    e.preventDefault();
    const subj = addForm.querySelector("#fcSubj").value;
    const front = (addForm.querySelector("#fcFront").value || "").trim();
    const back = (addForm.querySelector("#fcBack").value || "").trim();
    if (!front || !back) return;
    state.flashcards.unshift({ id: Date.now(), subject: subj, front, back, known: false, reviewed: 0, lastReview: null });
    saveLS(LS.flashcards, state.flashcards);
    render();
  };

  // Study mode — show one card at a time
  if (state.flashcards.length === 0) {
    wrap.appendChild(el(`<div class="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center text-xs text-slate-500">
      ${state.lang === "hi" ? "Abhi koi flashcard nahi. Pehla card banao 👆" : "No flashcards yet. Create your first one above 👆"}
    </div>`));
    return wrap;
  }

  // Filter: show unknown cards first
  const unknown = state.flashcards.filter(c => !c.known);
  const queue = unknown.length ? unknown : state.flashcards;
  const current = queue[0];

  const studyCard = el(`<div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
    <div class="mb-2 flex items-center justify-between">
      <span class="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px]">${current.subject || "General"}</span>
      <span class="text-[11px] text-slate-400">${state.lang === "hi" ? "Tap karo flip karne ke liye" : "Tap to flip"}</span>
    </div>
    <div id="flipCard" class="cursor-pointer rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-8 min-h-[180px] flex items-center justify-center text-center">
      <div>
        <p class="text-[10px] font-semibold uppercase text-slate-400 mb-2">${state.lang === "hi" ? "Sawal" : "Front"}</p>
        <p class="text-lg font-bold leading-snug">${sanitize(current.front)}</p>
      </div>
    </div>
    <div class="mt-3 flex gap-2">
      <button id="fcKnown" class="flex-1 rounded-xl bg-emerald-500 py-2.5 text-xs font-semibold text-white">✓ ${state.lang === "hi" ? "Yaad hai" : "I knew it"}</button>
      <button id="fcUnknown" class="flex-1 rounded-xl bg-rose-500 py-2.5 text-xs font-semibold text-white">✗ ${state.lang === "hi" ? "Phir dekhna" : "Need review"}</button>
      <button id="fcDelete" class="rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-xs font-semibold">🗑</button>
    </div>
  </div>`);

  let flipped = false;
  const flipEl = studyCard.querySelector("#flipCard");
  flipEl.onclick = () => {
    flipped = !flipped;
    if (flipped) {
      flipEl.innerHTML = `<div><p class="text-[10px] font-semibold uppercase text-slate-400 mb-2">${state.lang === "hi" ? "Jawab" : "Back"}</p><p class="text-base leading-relaxed">${sanitize(current.back)}</p></div>`;
    } else {
      flipEl.innerHTML = `<div><p class="text-[10px] font-semibold uppercase text-slate-400 mb-2">${state.lang === "hi" ? "Sawal" : "Front"}</p><p class="text-lg font-bold leading-snug">${sanitize(current.front)}</p></div>`;
    }
  };
  studyCard.querySelector("#fcKnown").onclick = () => {
    current.known = true; current.reviewed = (current.reviewed || 0) + 1; current.lastReview = new Date().toISOString();
    saveLS(LS.flashcards, state.flashcards); render();
  };
  studyCard.querySelector("#fcUnknown").onclick = () => {
    current.known = false; current.reviewed = (current.reviewed || 0) + 1; current.lastReview = new Date().toISOString();
    saveLS(LS.flashcards, state.flashcards); render();
  };
  studyCard.querySelector("#fcDelete").onclick = () => {
    if (confirm(state.lang === "hi" ? "Card delete karein?" : "Delete this card?")) {
      state.flashcards = state.flashcards.filter(c => c.id !== current.id);
      saveLS(LS.flashcards, state.flashcards); render();
    }
  };
  wrap.appendChild(studyCard);

  // Progress stats
  const known = state.flashcards.filter(c => c.known).length;
  wrap.appendChild(el(`<div class="rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-600 p-4 text-white text-center">
    <p class="text-xs opacity-80">${state.lang === "hi" ? "Cards mastered" : "Cards mastered"}</p>
    <p class="text-3xl font-bold">${known} / ${state.flashcards.length}</p>
    <div class="mt-2 h-2 rounded-full bg-white/20 overflow-hidden">
      <div class="h-full bg-white" style="width: ${state.flashcards.length ? Math.round(known * 100 / state.flashcards.length) : 0}%"></div>
    </div>
  </div>`));

  return wrap;
}

// ===================================================================
//  3. MCQ MOCK TEST (AI-generated, self-scored)
// ===================================================================
let _quiz = { questions: [], current: 0, answers: [], loading: false };

function QuizView() {
  const wrap = el(`<div class="space-y-4"></div>`);
  wrap.appendChild(el(`<div><h2 class="px-1 text-lg font-bold">❓ ${state.lang === "hi" ? "Mock Test (MCQ)" : "Mock Test (MCQ)"}</h2>
    <p class="px-1 text-xs text-slate-500 dark:text-slate-400">${state.lang === "hi" ? "AI se 5 MCQ generate karwao, self-score karo, weak spots dhoondo." : "Generate 5 MCQs from AI, self-score, find weak spots."}</p></div>`));

  // Setup form
  const setup = el(`<div class="space-y-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
    <div><label class="mb-1 block text-xs font-semibold">${state.lang === "hi" ? "Subject" : "Subject"}</label>
      <select id="qSubj" class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2">
        ${SUBJECTS.map(s => `<option value="${s.name}">${s.icon} ${s.name}</option>`).join("")}
      </select></div>
    <div><label class="mb-1 block text-xs font-semibold">${state.lang === "hi" ? "Topic (optional)" : "Topic (optional)"}</label>
      <input id="qTopic" placeholder="${state.lang === "hi" ? "e.g. Differentiation" : "e.g. Differentiation"}" class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2"></div>
    <div><label class="mb-1 block text-xs font-semibold">${state.lang === "hi" ? "Number of questions" : "Number of questions"}</label>
      <select id="qCount" class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2">
        <option value="5">5</option><option value="10">10</option><option value="15">15</option>
      </select></div>
    <button id="genQuiz" class="w-full rounded-xl bg-gradient-to-r from-rose-500 to-red-600 py-2.5 font-semibold text-white">📝 ${state.lang === "hi" ? "Quiz generate karo" : "Generate quiz"}</button>
  </div>`);
  wrap.appendChild(setup);

  // Recent quiz results
  if (state.quizResults.length) {
    const last = state.quizResults[0];
    wrap.appendChild(el(`<div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <p class="text-xs font-semibold text-slate-500 mb-1">📊 ${state.lang === "hi" ? "Last quiz result" : "Last quiz result"}</p>
      <p class="text-sm"><strong>${last.score}/${last.total}</strong> • ${last.subject} ${last.topic ? "· " + last.topic : ""} • ${new Date(last.date).toLocaleDateString()}</p>
    </div>`));
  }

  setup.querySelector("#genQuiz").onclick = async () => {
    const subj = setup.querySelector("#qSubj").value;
    const topic = (setup.querySelector("#qTopic").value || "").trim();
    const count = parseInt(setup.querySelector("#qCount").value) || 5;
    const btn = setup.querySelector("#genQuiz"); btn.disabled = true; btn.textContent = "⏳ Generating...";
    _quiz.loading = true; _quiz.questions = []; _quiz.current = 0; _quiz.answers = [];
    const prompt = state.lang === "hi"
      ? `Mujhe ${subj}${topic ? " (" + topic + ")" : ""} se ${count} MCQ (multiple choice questions) do. Har question ke 4 options (A, B, C, D) ho aur end me sahi answer bhi batao. Strict format use karo:\n\nQ1. question text\nA) option1\nB) option2\nC) option3\nD) option4\nAnswer: B\n\nQ2. ...\n\nBas isi format me, koi extra explanation nahi.`
      : `Give me ${count} MCQ (multiple choice questions) from ${subj}${topic ? " (" + topic + ")" : ""}. Each question must have 4 options (A, B, C, D) and the correct answer at the end. Use this strict format:\n\nQ1. question text\nA) option1\nB) option2\nC) option3\nD) option4\nAnswer: B\n\nQ2. ...\n\nOnly this format, no extra explanation.`;
    try {
      const r = await api("chat", { lang: state.lang, message: prompt, history: [], memory: [] });
      const text = (r && r.reply) || "";
      _quiz.questions = parseQuiz(text);
      _quiz.meta = { subject: subj, topic, total: _quiz.questions.length, date: new Date().toISOString() };
      render();
    } catch (e) {
      alert(state.lang === "hi" ? "Quiz generate nahi hua. Network check karo." : "Quiz generation failed. Check network.");
    } finally {
      _quiz.loading = false;
      btn.disabled = false; btn.textContent = state.lang === "hi" ? "📝 Quiz generate karo" : "📝 Generate quiz";
    }
  };

  // If quiz is active, render questions
  if (_quiz.questions.length) {
    return renderQuizActive(wrap);
  }

  if (_quiz.loading) {
    wrap.appendChild(el(`<div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center">
      <div class="text-3xl mb-2">⏳</div>
      <p class="text-sm">${state.lang === "hi" ? "AI quiz bana raha hai..." : "AI is preparing your quiz..."}</p>
    </div>`));
  }

  return wrap;
}

function parseQuiz(text) {
  // Parse strict-format MCQ text into structured questions
  const qs = [];
  const blocks = text.split(/\n(?=Q\d+\.)/i).filter(b => b.trim());
  blocks.forEach(b => {
    const qMatch = b.match(/^Q\d+\.\s*(.+)/i);
    if (!qMatch) return;
    const question = qMatch[1].trim();
    const opts = {};
    const optMatches = [...b.matchAll(/([A-D])\)\s*(.+)/g)];
    optMatches.forEach(m => { opts[m[1]] = m[2].trim(); });
    const ansMatch = b.match(/Answer\s*:\s*([A-D])/i);
    if (!question || Object.keys(opts).length < 4 || !ansMatch) return;
    qs.push({ question, options: opts, answer: ansMatch[1].toUpperCase() });
  });
  return qs;
}

function renderQuizActive(wrap) {
  const q = _quiz.questions[_quiz.current];
  const total = _quiz.questions.length;
  const answered = _quiz.answers.filter(a => a).length;
  const isLast = _quiz.current === total - 1;

  wrap.innerHTML = "";
  wrap.appendChild(el(`<div class="flex items-center justify-between">
    <h2 class="text-lg font-bold">❓ ${state.lang === "hi" ? "Mock Test" : "Mock Test"}</h2>
    <span class="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold">${_quiz.current + 1} / ${total}</span>
  </div>`));

  // Progress bar
  wrap.appendChild(el(`<div class="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
    <div class="h-full bg-gradient-to-r from-teal-500 to-indigo-600 transition-all" style="width: ${Math.round(answered * 100 / total)}%"></div>
  </div>`));

  // Question card
  const userAns = _quiz.answers[_quiz.current];
  const card = el(`<div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
    <p class="mb-3 text-sm font-semibold leading-relaxed">${_quiz.current + 1}. ${sanitize(q.question)}</p>
    <div class="space-y-2"></div>
  </div>`);
  const optsBox = card.querySelector("div.space-y-2");
  ["A", "B", "C", "D"].forEach(letter => {
    const opt = q.options[letter];
    if (!opt) return;
    const selected = userAns === letter;
    const b = el(`<button data-letter="${letter}" class="flex w-full items-center gap-3 rounded-xl border ${selected ? "border-teal-500 bg-teal-50 dark:bg-teal-900/30" : "border-slate-200 dark:border-slate-700"} p-3 text-left text-sm">
      <span class="grid h-7 w-7 shrink-0 place-items-center rounded-full ${selected ? "bg-teal-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"} font-bold text-xs">${letter}</span>
      <span>${sanitize(opt)}</span>
    </button>`);
    b.onclick = () => { _quiz.answers[_quiz.current] = letter; render(); };
    optsBox.appendChild(b);
  });
  wrap.appendChild(card);

  // Nav buttons
  const nav = el(`<div class="flex gap-2">
    <button id="qPrev" class="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 text-sm font-semibold ${_quiz.current === 0 ? "opacity-40" : ""}">← ${state.lang === "hi" ? "Pichla" : "Previous"}</button>
    ${isLast
      ? `<button id="qSubmit" class="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-2.5 text-sm font-semibold text-white">✓ ${state.lang === "hi" ? "Submit quiz" : "Submit quiz"}</button>`
      : `<button id="qNext" class="flex-1 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 py-2.5 text-sm font-semibold text-white">${state.lang === "hi" ? "Agla" : "Next"} →</button>`}
  </div>`);
  if (_quiz.current > 0) nav.querySelector("#qPrev").onclick = () => { _quiz.current--; render(); };
  if (isLast) {
    nav.querySelector("#qSubmit").onclick = () => {
      const unanswered = _quiz.questions.length - _quiz.answers.filter(a => a).length;
      if (unanswered > 0 && !confirm(state.lang === "hi" ? `${unanswered} question bache hain. Submit karein?` : `${unanswered} questions unanswered. Submit anyway?`)) return;
      submitQuiz();
    };
  } else {
    nav.querySelector("#qNext").onclick = () => { _quiz.current++; render(); };
  }
  wrap.appendChild(nav);
  return wrap;
}

function submitQuiz() {
  let score = 0;
  _quiz.questions.forEach((q, i) => { if (_quiz.answers[i] === q.answer) score++; });
  const result = {
    date: _quiz.meta.date,
    subject: _quiz.meta.subject,
    topic: _quiz.meta.topic,
    total: _quiz.questions.length,
    score,
    answers: _quiz.answers.slice(),
    questions: _quiz.questions.map(q => ({ q: q.question, options: q.options, answer: q.answer })),
  };
  state.quizResults.unshift(result);
  if (state.quizResults.length > 50) state.quizResults = state.quizResults.slice(0, 50);
  saveLS(LS.quizResults, state.quizResults);
  // Show result view
  state.view = "analytics";
  _quiz.questions = []; _quiz.current = 0; _quiz.answers = [];
  render();
}

// ===================================================================
//  4. DOUBT BOOKMARKS VIEW
// ===================================================================
function BookmarksView() {
  const wrap = el(`<div class="space-y-4"></div>`);
  wrap.appendChild(el(`<div class="flex items-center justify-between">
    <h2 class="px-1 text-lg font-bold">⭐ ${state.lang === "hi" ? "Doubt Bookmarks" : "Doubt Bookmarks"}</h2>
    ${state.bookmarks.length ? `<button id="clearBm" class="text-[11px] text-rose-500 hover:underline">${state.lang === "hi" ? "Clear all" : "Clear all"}</button>` : ""}
  </div>
  <p class="px-1 text-xs text-slate-500 dark:text-slate-400">${state.lang === "hi" ? "Exam se pehle yahan se sabhi important doubts revise karo." : "Revise all important doubts here before exam."}</p>`));

  if (state.bookmarks.length === 0) {
    wrap.appendChild(el(`<div class="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center text-xs text-slate-500">
      ${state.lang === "hi" ? "Abhi koi bookmark nahi. Chat me AI ke jawab par ⭐ Save button dabaao." : "No bookmarks yet. In chat, tap ⭐ Save on any AI reply."}
    </div>`));
    return wrap;
  }

  const list = el(`<div class="space-y-2"></div>`);
  state.bookmarks.forEach((b, i) => {
    const card = el(`<div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
      <div class="flex items-start justify-between gap-2">
        <p class="text-xs leading-relaxed flex-1">${sanitize(b.text).slice(0, 280)}${b.text.length > 280 ? "..." : ""}</p>
        <button data-i="${i}" class="delBm shrink-0 rounded-md bg-rose-100 dark:bg-rose-900/40 px-2 py-1 text-[10px] text-rose-600 dark:text-rose-300">✕</button>
      </div>
      <div class="mt-1.5 flex items-center justify-between">
        <span class="text-[10px] text-slate-400">${b.date ? new Date(b.date).toLocaleDateString() : ""}</span>
        <button data-i="${i}" class="askBm rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[10px] text-teal-600 dark:text-teal-300">💬 ${state.lang === "hi" ? "Aur pucho" : "Ask more"}</button>
      </div>
    </div>`);
    list.appendChild(card);
  });
  list.querySelectorAll(".delBm").forEach(b => b.onclick = () => {
    const i = parseInt(b.dataset.i);
    state.bookmarks.splice(i, 1); saveLS(LS.bookmarks, state.bookmarks); render();
  });
  list.querySelectorAll(".askBm").forEach(b => b.onclick = () => {
    const i = parseInt(b.dataset.i);
    const text = state.bookmarks[i].text;
    go("chat");
    setTimeout(() => sendMessage(state.lang === "hi"
      ? `Is topic par aur detail samjhao aur 3 practice questions do: "${text.slice(0, 200)}"`
      : `Explain this in more detail and give 3 practice questions: "${text.slice(0, 200)}"`), 60);
  });
  wrap.appendChild(list);

  const clrBtn = wrap.querySelector("#clearBm");
  if (clrBtn) clrBtn.onclick = () => {
    if (confirm(state.lang === "hi" ? "Saare bookmarks clear karein?" : "Clear all bookmarks?")) {
      state.bookmarks = []; saveLS(LS.bookmarks, state.bookmarks); render();
    }
  };
  return wrap;
}

// ===================================================================
//  5. ANALYTICS + SYLLABUS TRACKER
// ===================================================================
function AnalyticsView() {
  const wrap = el(`<div class="space-y-4"></div>`);
  wrap.appendChild(el(`<div><h2 class="px-1 text-lg font-bold">📊 ${state.lang === "hi" ? "Performance Analytics" : "Performance Analytics"}</h2>
    <p class="px-1 text-xs text-slate-500 dark:text-slate-400">${state.lang === "hi" ? "Apni progress dekho — kahan strong, kahan weak." : "Track your progress — where you're strong, where weak."}</p></div>`));

  // Quiz score trend
  if (state.quizResults.length) {
    const recent = state.quizResults.slice(0, 10).reverse();
    const avgPct = Math.round(recent.reduce((a, r) => a + (r.score * 100 / r.total), 0) / recent.length);
    const best = Math.max(...recent.map(r => r.score * 100 / r.total));
    const worst = Math.min(...recent.map(r => r.score * 100 / r.total));
    wrap.appendChild(el(`<div class="rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-600 p-5 text-white">
      <p class="text-xs opacity-80">${state.lang === "hi" ? "Quiz performance (last 10)" : "Quiz performance (last 10)"}</p>
      <div class="mt-2 grid grid-cols-3 gap-3 text-center">
        <div><p class="text-2xl font-bold">${avgPct}%</p><p class="text-[10px] opacity-80">${state.lang === "hi" ? "Average" : "Average"}</p></div>
        <div><p class="text-2xl font-bold">${Math.round(best)}%</p><p class="text-[10px] opacity-80">${state.lang === "hi" ? "Best" : "Best"}</p></div>
        <div><p class="text-2xl font-bold">${Math.round(worst)}%</p><p class="text-[10px] opacity-80">${state.lang === "hi" ? "Lowest" : "Lowest"}</p></div>
      </div>
    </div>`));

    // Bar chart of recent scores
    const chartCard = el(`<div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <p class="mb-2 text-sm font-bold">📈 ${state.lang === "hi" ? "Recent quiz scores" : "Recent quiz scores"}</p>
      <div class="flex items-end justify-between gap-1 h-32"></div>
    </div>`);
    const bars = chartCard.querySelector("div.flex");
    const maxPct = 100;
    recent.forEach(r => {
      const pct = Math.round(r.score * 100 / r.total);
      bars.appendChild(el(`<div class="flex-1 flex flex-col items-center gap-1">
        <span class="text-[9px] font-semibold">${pct}%</span>
        <div class="w-full rounded-t-md bg-gradient-to-t from-teal-500 to-indigo-500" style="height: ${pct}%"></div>
        <span class="text-[9px] text-slate-400">${new Date(r.date).toLocaleDateString(undefined, { day: "numeric", month: "numeric" })}</span>
      </div>`));
    });
    wrap.appendChild(chartCard);

    // Subject-wise breakdown
    const bySubj = {};
    state.quizResults.forEach(r => {
      if (!bySubj[r.subject]) bySubj[r.subject] = { total: 0, score: 0 };
      bySubj[r.subject].total += r.total;
      bySubj[r.subject].score += r.score;
    });
    const subCard = el(`<div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <p class="mb-2 text-sm font-bold">🎯 ${state.lang === "hi" ? "Subject-wise accuracy" : "Subject-wise accuracy"}</p>
      <div class="space-y-2"></div>
    </div>`);
    const subList = subCard.querySelector("div.space-y-2");
    Object.entries(bySubj).forEach(([subj, d]) => {
      const pct = Math.round(d.score * 100 / d.total);
      const color = pct >= 75 ? "from-emerald-500 to-teal-600" : pct >= 50 ? "from-amber-500 to-orange-600" : "from-rose-500 to-red-600";
      subList.appendChild(el(`<div>
        <div class="flex justify-between text-[11px] mb-1"><span>${subj}</span><span class="font-semibold">${pct}%</span></div>
        <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div class="h-full bg-gradient-to-r ${color}" style="width: ${pct}%"></div>
        </div>
      </div>`));
    });
    wrap.appendChild(subCard);
  } else {
    wrap.appendChild(el(`<div class="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-center text-xs text-slate-500">
      ${state.lang === "hi" ? "Abhi koi quiz nahi diya. Mock Test tab se quiz generate karo." : "No quizzes yet. Generate one from Mock Test tab."}
    </div>`));
  }

  // Pomodoro stats summary
  const pomo = state.pomoStats || { sessions: [], todayMinutes: 0, todayDate: "" };
  const totalPomoMin = pomo.sessions.reduce((a, s) => a + (s.minutes || 0), 0);
  wrap.appendChild(el(`<div class="grid grid-cols-2 gap-3">
    ${StatCard(state.lang === "hi" ? "Total focus minutes" : "Total focus minutes", totalPomoMin, "⏱")}
    ${StatCard(state.lang === "hi" ? "Total focus sessions" : "Total focus sessions", pomo.sessions.length, "🎯")}
  </div>`));

  // ===== SYLLABUS PROGRESS TRACKER =====
  wrap.appendChild(el(`<div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
    <h3 class="mb-2 text-sm font-bold">📚 ${state.lang === "hi" ? "Syllabus Progress Tracker" : "Syllabus Progress Tracker"}</h3>
    <p class="text-[11px] text-slate-500 mb-3">${state.lang === "hi" ? "Har chapter ka status update karo — Not Started / Studying / Revised / Mastered." : "Update each chapter's status — Not Started / Studying / Revised / Mastered."}</p>
    <div class="space-y-3"></div>
  </div>`));
  const tracker = wrap.querySelector("div.space-y-3");

  const STATUS = [
    { id: 0, label: state.lang === "hi" ? "Not Started" : "Not Started", color: "bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-200" },
    { id: 1, label: state.lang === "hi" ? "Studying" : "Studying", color: "bg-amber-400 text-amber-900" },
    { id: 2, label: state.lang === "hi" ? "Revised" : "Revised", color: "bg-blue-400 text-blue-900" },
    { id: 3, label: state.lang === "hi" ? "Mastered" : "Mastered", color: "bg-emerald-500 text-white" },
  ];

  SUBJECTS.forEach(s => {
    if (!state.syllabus[s.id]) state.syllabus[s.id] = {};
    const subData = state.syllabus[s.id];
    const total = s.chapters.length;
    const mastered = s.chapters.filter(c => subData[c] === 3).length;
    const pct = Math.round(mastered * 100 / total);

    const subCard = el(`<div class="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
      <div class="flex items-center justify-between mb-1">
        <p class="text-xs font-semibold">${s.icon} ${s.name}</p>
        <span class="text-[10px] font-bold ${pct >= 75 ? "text-emerald-500" : pct >= 40 ? "text-amber-500" : "text-rose-500"}">${mastered}/${total} (${pct}%)</span>
      </div>
      <div class="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-2">
        <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-600" style="width: ${pct}%"></div>
      </div>
      <div class="space-y-1 chapters-list"></div>
    </div>`);
    const chapList = subCard.querySelector(".chapters-list");
    s.chapters.forEach(c => {
      const sid = subData[c] || 0;
      const row = el(`<div class="flex items-center gap-1 text-[11px]">
        <span class="flex-1 truncate">${c}</span>
        <select data-subj="${s.id}" data-chap="${c.replace(/"/g, "&quot;")}" class="rounded-md border border-slate-200 dark:border-slate-700 bg-transparent px-1 py-0.5 text-[10px]">
          ${STATUS.map(st => `<option value="${st.id}" ${sid === st.id ? "selected" : ""}>${st.label}</option>`).join("")}
        </select>
      </div>`);
      chapList.appendChild(row);
    });
    tracker.appendChild(subCard);
  });

  // Wire up chapter status changes
  tracker.querySelectorAll("select").forEach(sel => {
    sel.onchange = () => {
      const subjId = sel.dataset.subj;
      const chap = sel.dataset.chap;
      const val = parseInt(sel.value);
      if (!state.syllabus[subjId]) state.syllabus[subjId] = {};
      state.syllabus[subjId][chap] = val;
      saveLS(LS.syllabus, state.syllabus);
      render();
    };
  });

  // Overall progress
  const totalChapters = SUBJECTS.reduce((a, s) => a + s.chapters.length, 0);
  const totalMastered = SUBJECTS.reduce((a, s) => a + s.chapters.filter(c => (state.syllabus[s.id] || {})[c] === 3).length, 0);
  const overallPct = Math.round(totalMastered * 100 / totalChapters);
  wrap.appendChild(el(`<div class="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-5 text-white text-center">
    <p class="text-xs opacity-80">${state.lang === "hi" ? "Overall syllabus mastery" : "Overall syllabus mastery"}</p>
    <p class="text-4xl font-bold">${overallPct}%</p>
    <p class="text-xs opacity-80">${totalMastered} / ${totalChapters} ${state.lang === "hi" ? "chapters mastered" : "chapters mastered"}</p>
  </div>`));

  return wrap;
}

// ---------- BOOT ----------
boot();