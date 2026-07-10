/* ===================================================================
   MEC CA Study Buddy — Frontend SPA (Apps Script edition)
   ---------------------------------------------------------------
   24x7 AI Education Agent for Indian Intermediate 1st-year MEC
   students preparing for CA.
   Features: AI Chat, Class Diary, Multi-file Upload, Exam Prep,
   Maths Tricks, Pomodoro Timer, Flashcards, MCQ Mock Test,
   Doubt Bookmarks, Performance Analytics, Syllabus Tracker.
   ---------------------------------------------------------------
   Version: 2.1.0 (cleaned-up release)
   =================================================================== */

// ── Config ─────────────────────────────────────────────────────
const DEFAULT_BACKEND_URL = "https://script.google.com/macros/s/AKfycbxLTvO6v7h-c_PBoDozByo4FOAJ7Gk7WqbsroObPXLnAkNvExbJ-Fc6rMCNHlSyxx-I/exec";
const FETCH_TIMEOUT = 25000;
const MAX_CHAT_HISTORY = 100;
const MAX_RETRIES = 2;
const POMO_WORK_SEC = 25 * 60;
const POMO_BREAK_SEC = 5 * 60;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_BOOKMARKS = 200;
const MAX_QUIZ_HISTORY = 50;
const MAX_POMO_SESSIONS = 500;

// ── i18n (Hinglish + English) ──────────────────────────────────
const I18N = {
  en: {
    appName: "MEC Study Buddy", tagline: "Your 24×7 CA Professor — always with you",
    nav: { home: "Home", subjects: "Subjects", today: "Today", exam: "Exams", chat: "Chat", tricks: "Tricks" },
    greetMorning: "Good morning", greetAfternoon: "Good afternoon", greetEvening: "Good evening",
    welcome: "Ready to study, future CA? 🎓",
    quickAsk: "Ask the Professor", logToday: "Log today's class", myNotes: "My Notes", examPrep: "Exam Prep",
    todayTitle: "Today's Class Diary", todayHint: "Tell me what you studied today — I'll remember and guide you.",
    subject: "Subject", topic: "Topic / Chapter", note: "What did you learn? (notes, doubts)",
    save: "Save", saved: "Saved ✓", recent: "Recent classes", noLogs: "No classes logged yet.",
    subjectsTitle: "Your MEC Subjects", openChat: "Ask about this",
    examTitle: "Exam & Test Preparation", examHint: "Get a study plan, important questions & revision tips.",
    makePlan: "Make my plan", chatTitle: "24×7 AI Professor",
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
    removeFile: "Remove", uploadComplete: "All files uploaded ✓",
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
    // v2.1 new strings (only add keys actually used)
    more: "More", moreTitle: "📋 More Features",
    focus: "Pomodoro Timer", focusHint: "25 min focus + 5 min break. Consistency = top marks.",
    focusTime: "🎯 Focus Time", breakTime: "☕ Break Time",
    start: "▶ Start", pause: "⏸ Pause", resetLbl: "↺ Reset", skip: "⏭ Skip",
    pomoTrickTitle: "💡 Pomodoro Trick",
    pomoTrickBody: "Focus on ONE topic for 25 minutes. Keep phone away. After each session, take a 5-min break — drink water, walk. After 4 sessions, take a 20-min long break. This way you can cover 8 topics in 4 hours.",
    workDone: "🎯 25 min done! Take a 5-min break.", breakOver: "☕ Break over! Back to focus.",
    todaySessions: "Today's sessions", todayMinutes: "Today's minutes", totalSessions: "Total sessions",
    flashcards: "Flashcards", flashcardsHint: "Memorize formulas & definitions — flip to check.",
    addCard: "Add new card", aiFill: "🤖 AI se bharo",
    frontLabel: "Front (question / term)", backLabel: "Back (answer / formula)",
    saveCard: "Save card", tapToFlip: "Tap to flip", front: "Front", back: "Back",
    knewIt: "✓ I knew it", needReview: "✗ Need review",
    noFlashcards: "No flashcards yet. Create your first one above 👆",
    cardsMastered: "Cards mastered", deleteCard: "Delete this card?",
    mockTest: "Mock Test (MCQ)", mockHint: "Generate 5 MCQs from AI, self-score, find weak spots.",
    subjectLbl: "Subject", topicOptional: "Topic (optional)", numQuestions: "Number of questions",
    genQuiz: "Generate quiz", generating: "⏳ Generating...", quizLoading: "AI is preparing your quiz...",
    lastQuiz: "Last quiz result", prev: "Previous", nextLbl: "Next", submitQuiz: "Submit quiz",
    unansweredConfirm: "questions unanswered. Submit anyway?", quizGenFail: "Quiz generation failed. Check network.",
    bookmarks: "Doubt Bookmarks", bookmarksHint: "Revise all important doubts here before exam.",
    noBookmarks: "No bookmarks yet. In chat, tap ⭐ Save on any AI reply.",
    clearAll: "Clear all", clearAllConfirm: "Clear all bookmarks?", askMore: "Ask more",
    analytics: "Performance Analytics", analyticsHint: "Track your progress — where you're strong, where weak.",
    quizPerf: "Quiz performance (last 10)", avg: "Average", best: "Best", lowest: "Lowest",
    recentScores: "Recent quiz scores", subjectAcc: "Subject-wise accuracy",
    noQuizzes: "No quizzes yet. Generate one from Mock Test tab.",
    totalFocusMin: "Total focus minutes", totalFocusSess: "Total focus sessions",
    syllabusTracker: "Syllabus Progress Tracker",
    syllabusHint: "Update each chapter's status — Not Started / Studying / Revised / Mastered.",
    notStarted: "Not Started", studying: "Studying", revised: "Revised", mastered: "Mastered",
    overallMastery: "Overall syllabus mastery", chaptersMastered: "chapters mastered",
  },
  hi: {
    appName: "MEC Study Buddy", tagline: "Aapke 24×7 CA Professor — hamesha saath",
    nav: { home: "Home", subjects: "Subjects", today: "Aaj", exam: "Exam", chat: "Chat", tricks: "Tricks" },
    greetMorning: "Good morning", greetAfternoon: "Good afternoon", greetEvening: "Good evening",
    welcome: "Padhne ke liye ready ho, future CA? 🎓",
    quickAsk: "Professor se pucho", logToday: "Aaj ki class likho", myNotes: "Mere Notes", examPrep: "Exam Prep",
    todayTitle: "Aaj ki Class Diary", todayHint: "Batao aaj kya padha — main yaad rakhunga aur guide karunga.",
    subject: "Subject", topic: "Topic / Chapter", note: "Kya seekha? (notes, doubts)",
    save: "Save karo", saved: "Save ho gaya ✓", recent: "Recent classes", noLogs: "Abhi koi class log nahi hui.",
    subjectsTitle: "Aapke MEC Subjects", openChat: "Iske baare me pucho",
    examTitle: "Exam & Test ki Taiyari", examHint: "Study plan, important questions aur revision tips lo.",
    makePlan: "Mera plan banao", chatTitle: "24×7 AI Professor",
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
    removeFile: "Hatao", uploadComplete: "Saare files upload ho gaye ✓",
    tricksTitle: "Maths Tricks & Tips", tricksHint: "Jaldi formulas, shortcuts aur motivation apni CA journey ke liye",
    trickFormula: "Formula", trickTip: "Pro Tip", trickExample: "Udaharan",
    dailyMotivation: "Aaj ki Prerna", tricksCount: "tricks", studyTips: "Padhai ke Tips",
    tip1: "Roz 5 problems karo — consistency intensity se zyada kaam karti hai",
    tip2: "Formulas 3 baar likh ke yaad karo — muscle memory kaam karegi!",
    tip3: "Trigonometry: pehle basic identities yaad karo, baaki derive kar lo",
    tip4: "Calculus: 'rate of change' samjho — baaki practice se aayega",
    tip5: "Economics graphs: roz 5 mins draw karo — hamesha yaad rahega",
    tip6: "Commerce terms: har term ke around chhoti story banao, yaad rahega",
    tip7: "Accounting: double entry rule clear rakho — har debit ka ek credit hota hai",
    more: "More", moreTitle: "📋 More Features",
    focus: "Pomodoro Timer", focusHint: "25 minute focus, 5 minute break. Consistency = top marks.",
    focusTime: "🎯 Focus Time", breakTime: "☕ Break Time",
    start: "▶ Start", pause: "⏸ Pause", resetLbl: "↺ Reset", skip: "⏭ Skip",
    pomoTrickTitle: "💡 Pomodoro Trick",
    pomoTrickBody: "25 minute me sirf EK topic par dhyaan do. Phone ko door rakho. Har session ke baad 5 minute break lo — paani pio, walk karo. 4 sessions ke baad 20 minute ka long break lo. Aise 4 ghante me 8 topics cover ho jayenge.",
    workDone: "🎯 25 minute ho gaye! 5 minute break lo.", breakOver: "☕ Break khatam! Wapas focus karo.",
    todaySessions: "Aaj ke sessions", todayMinutes: "Aaj ke minutes", totalSessions: "Total sessions",
    flashcards: "Flashcards", flashcardsHint: "Formulas & definitions yaad karo — flip karke check karo.",
    addCard: "Naya card banao", aiFill: "🤖 AI se bharo",
    frontLabel: "Front (sawal / term)", backLabel: "Back (jawab / formula)",
    saveCard: "Save card", tapToFlip: "Tap karo flip karne ke liye", front: "Sawal", back: "Jawab",
    knewIt: "✓ Yaad hai", needReview: "✗ Phir dekhna",
    noFlashcards: "Abhi koi flashcard nahi. Pehla card banao 👆",
    cardsMastered: "Cards mastered", deleteCard: "Card delete karein?",
    mockTest: "Mock Test (MCQ)", mockHint: "AI se 5 MCQ generate karwao, self-score karo, weak spots dhoondo.",
    subjectLbl: "Subject", topicOptional: "Topic (optional)", numQuestions: "Number of questions",
    genQuiz: "Quiz generate karo", generating: "⏳ Generating...", quizLoading: "AI quiz bana raha hai...",
    lastQuiz: "Last quiz result", prev: "Pichla", nextLbl: "Agla", submitQuiz: "Submit quiz",
    unansweredConfirm: "question bache hain. Submit karein?", quizGenFail: "Quiz generate nahi hua. Network check karo.",
    bookmarks: "Doubt Bookmarks", bookmarksHint: "Exam se pehle yahan se sabhi important doubts revise karo.",
    noBookmarks: "Abhi koi bookmark nahi. Chat me AI ke jawab par ⭐ Save button dabaao.",
    clearAll: "Clear all", clearAllConfirm: "Saare bookmarks clear karein?", askMore: "Aur pucho",
    analytics: "Performance Analytics", analyticsHint: "Apni progress dekho — kahan strong, kahan weak.",
    quizPerf: "Quiz performance (last 10)", avg: "Average", best: "Best", lowest: "Lowest",
    recentScores: "Recent quiz scores", subjectAcc: "Subject-wise accuracy",
    noQuizzes: "Abhi koi quiz nahi diya. Mock Test tab se quiz generate karo.",
    totalFocusMin: "Total focus minutes", totalFocusSess: "Total focus sessions",
    syllabusTracker: "Syllabus Progress Tracker",
    syllabusHint: "Har chapter ka status update karo — Not Started / Studying / Revised / Mastered.",
    notStarted: "Not Started", studying: "Studying", revised: "Revised", mastered: "Mastered",
    overallMastery: "Overall syllabus mastery", chaptersMastered: "chapters mastered",
  }
};

// ── Maths Tricks Data ──────────────────────────────────────────
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

// ── Motivational Quotes (Hinglish + English) ───────────────────
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

// ── Subject Catalog ────────────────────────────────────────────
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

// ── State & Storage ────────────────────────────────────────────
const LS = {
  cfg: "mec_cfg", logs: "mec_logs", chat: "mec_chat",
  streak: "mec_streak", lastDay: "mec_lastday",
  flashcards: "mec_flashcards_v2",
  bookmarks: "mec_bookmarks_v2",
  quizResults: "mec_quiz_results_v2",
  syllabus: "mec_syllabus_v2",
  pomoStats: "mec_pomo_stats_v2",
};

let cfg = JSON.parse(localStorage.getItem(LS.cfg) || "null");
let session = { pinHash: sessionStorage.getItem("mec_pin") || null, unlocked: false };
let state = {
  lang: (cfg && cfg.lang) || "hi",
  view: "home",
  online: navigator.onLine,
  theme: localStorage.getItem("mec_theme_v3") || "system",
  logs: JSON.parse(localStorage.getItem(LS.logs) || "[]"),
  chat: JSON.parse(localStorage.getItem(LS.chat) || "[]"),
  flashcards: JSON.parse(localStorage.getItem(LS.flashcards) || "[]"),
  bookmarks: JSON.parse(localStorage.getItem(LS.bookmarks) || "[]"),
  quizResults: JSON.parse(localStorage.getItem(LS.quizResults) || "[]"),
  syllabus: JSON.parse(localStorage.getItem(LS.syllabus) || "{}"),
  pomoStats: JSON.parse(localStorage.getItem(LS.pomoStats) || '{"sessions":[],"todayMinutes":0,"todayDate":""}'),
};

const t = () => I18N[state.lang] || I18N.en;
const saveLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// Translation helper: pick Hinglish or English string inline
const tr = (hi, en) => (state.lang === "hi" ? hi : en);

// ── Theme management (premium dark/light/system) ───────────────
function effectiveTheme() {
  if (state.theme === "dark") return "dark";
  if (state.theme === "light") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function applyTheme() {
  const eff = effectiveTheme();
  document.documentElement.classList.toggle("dark", eff === "dark");
  // Update meta theme-color for mobile status bar
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", eff === "dark" ? "#13152a" : "#e8ebf5");
  // Re-init mermaid theme if available
  if (window.__updateMermaidTheme) window.__updateMermaidTheme(eff === "dark");
}
function cycleTheme() {
  // system → light → dark → system
  state.theme = state.theme === "system" ? "light" : state.theme === "light" ? "dark" : "system";
  localStorage.setItem("mec_theme_v3", state.theme);
  applyTheme();
  render();
}
function themeIcon() {
  return state.theme === "dark" ? "🌙" : state.theme === "light" ? "☀️" : "🖥️";
}
function themeLabel() {
  return state.theme === "dark" ? "Dark" : state.theme === "light" ? "Light" : "Auto";
}
// React to system theme changes when in "system" mode
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (state.theme === "system") { applyTheme(); if (session.unlocked) render(); }
});

// ── Generic helpers ────────────────────────────────────────────
const el = (html) => {
  const d = document.createElement("div");
  d.innerHTML = html.trim();
  return d.firstElementChild;
};

async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function greet() {
  const h = new Date().getHours();
  return h < 12 ? t().greetMorning : h < 17 ? t().greetAfternoon : t().greetEvening;
}

function getStudentName() {
  return (cfg && cfg.studentName) ? cfg.studentName : "Yeshaswini";
}

// Strip angle brackets to prevent HTML injection from user/AI text
function sanitize(str) {
  return String(str || "").replace(/[<>]/g, "").trim();
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "";
}

// Minimal markdown → HTML (paragraphs, bold, code, lists, headings)
function mdToHtml(s) {
  return s
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/^\s*[-*] (.*)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/\n/g, "<br>")
    .replace(/^(.*)$/s, "<p>$1</p>");
}

// Daily-stable motivation index — same quote shown all day
function dailyIndex(arr) {
  const seed = new Date().toDateString().split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return Math.floor(Math.abs(seed) % arr.length);
}

// ── Network: fetch with timeout + retry ────────────────────────
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

async function api(action, payload = {}) {
  if (!cfg || !cfg.url) throw new Error("no backend configured");
  const body = JSON.stringify(Object.assign({ action, pinHash: session.pinHash }, payload));
  const res = await fetchWithTimeout(cfg.url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body,
    redirect: "follow",
  });
  return res.json();
}

async function apiStatus(url) {
  const res = await fetchWithTimeout(url + (url.includes("?") ? "&" : "?") + "action=status");
  return res.json();
}

// ── Offline detection ──────────────────────────────────────────
window.addEventListener("online", () => { state.online = true; if (session.unlocked) render(); });
window.addEventListener("offline", () => { state.online = false; if (session.unlocked) render(); });

// Global error boundary — keeps app alive on a single render bug
window.addEventListener("error", (e) => {
  console.error("Global error:", e.error || e.message);
});
window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled rejection:", e.reason);
});

// ===================================================================
//  BOOT
// ===================================================================
async function boot() {
  applyTheme(); // ensure theme is applied even before any view renders
  const baked = DEFAULT_BACKEND_URL && !DEFAULT_BACKEND_URL.startsWith("PASTE_");
  if (!cfg || !cfg.url) {
    if (baked) {
      try {
        const st = await apiStatus(DEFAULT_BACKEND_URL);
        cfg = { url: DEFAULT_BACKEND_URL, lang: (st && st.lang) || "hi" };
        state.lang = cfg.lang;
        if (st && st.pinSet) { saveLS(LS.cfg, cfg); return renderLock(); }
        wiz = newWizard();
        wiz.step = 2; wiz.url = DEFAULT_BACKEND_URL; wiz.status = st;
        return renderSetup();
      } catch (e) {
        return renderSetup();
      }
    }
    return renderSetup();
  }
  if (!session.pinHash) return renderLock();
  try {
    const r = await api("verify");
    if (r && r.ok) { session.unlocked = true; await loadServerLogs(); render(); }
    else { sessionStorage.removeItem("mec_pin"); session.pinHash = null; renderLock(t().wrongPin); }
  } catch (e) {
    // Network failed — still render cached state if possible
    session.unlocked = true;
    render();
  }
}

async function loadServerLogs() {
  try {
    const r = await api("logs");
    if (r && r.logs) {
      state.logs = r.logs.filter(x => x.topic || x.subject);
      saveLS(LS.logs, state.logs);
    }
  } catch (e) { /* silent — use cached */ }
}

// ===================================================================
//  SETUP WIZARD
// ===================================================================
function newWizard() {
  return { step: 1, url: "", status: null, driveId: "", photosId: "",
           groqKey: "", lang: "hi", pin: "", pin2: "", studentName: "" };
}
let wiz = newWizard();

function shell(inner) {
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.appendChild(el(`
    <div class="min-h-dvh flex flex-col items-center justify-center px-4 py-8">
      <div class="w-full max-w-md">
        <div class="mb-6 text-center">
          <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl text-3xl text-white" style="background: var(--gradient-brand); box-shadow: var(--clay-shadow-lg);">🎓</div>
          <h1 class="mt-3 text-xl font-bold text-gradient">MEC CA Study Buddy</h1>
        </div>
        <div id="card" class="clay-card" style="padding: 1.5rem;"></div>
      </div>
    </div>`));
  document.getElementById("card").appendChild(inner);
}

function field(label, id, ph, type = "text", val = "", hint = "") {
  const safeVal = String(val).replace(/"/g, "&quot;");
  return `<label class="mb-1 mt-3 block text-xs font-semibold" style="color: var(--text);">${label}</label>
    <input id="${id}" type="${type}" value="${safeVal}" placeholder="${ph}" autocomplete="off" class="clay-input">
    ${hint ? `<p class="mt-1 text-[11px]" style="color: var(--text-mute);">${hint}</p>` : ""}`;
}

function renderSetup(msg = "") {
  const T = t();

  // Step 1 — connect backend
  if (wiz.step === 1) {
    const inner = el(`<div>
      <p class="text-[11px] font-semibold uppercase tracking-wide" style="color: var(--brand);">${T.step} 1 / 3</p>
      <h2 class="mt-1 text-lg font-bold" style="color: var(--text);">${T.s1Title}</h2>
      <p class="mt-1 text-xs" style="color: var(--text-soft);">${T.s1Hint}</p>
      ${field("Apps Script URL", "wUrl", T.urlPh, "url", wiz.url)}
      <p id="msg" class="mt-2 text-xs" style="color: ${msg.includes("✓") ? "var(--success)" : "var(--danger)"};">${msg}</p>
      <button id="testBtn" class="clay-btn clay-btn-primary w-full">${T.testBtn}</button>
    </div>`);
    inner.querySelector("#testBtn").onclick = async () => {
      const url = inner.querySelector("#wUrl").value.trim();
      if (!url) return;
      wiz.url = url;
      const btn = inner.querySelector("#testBtn");
      btn.textContent = T.testing; btn.disabled = true;
      try {
        const st = await apiStatus(url);
        if (!st || !st.ok) throw new Error("bad");
        wiz.status = st;
        if (st.pinSet) { wiz.step = "existing"; renderSetup(); }
        else { wiz.step = 2; renderSetup(T.connected); }
      } catch (e) {
        renderSetup(T.connectFail);
        btn.disabled = false; btn.textContent = T.testBtn;
      }
    };
    return shell(inner);
  }

  // Step 2 — backup + AI key + language
  if (wiz.step === 2) {
    const inner = el(`<div>
      <p class="text-[11px] font-semibold uppercase tracking-wide" style="color: var(--brand);">${T.step} 2 / 3</p>
      <h2 class="mt-1 text-lg font-bold" style="color: var(--text);">${T.s2Title}</h2>
      <p class="mt-1 text-xs" style="color: var(--text-soft);">${T.s2Hint}</p>
      ${field(T.nameLabel, "wName", "Yeshaswini", "text", wiz.studentName)}
      ${field(T.driveIdLabel, "wDrive", "1AbC...", "text", wiz.driveId)}
      ${field(T.photosIdLabel, "wPhotos", T.optional, "text", wiz.photosId)}
      ${field(T.groqLabel, "wGroq", "gsk_...", "text", wiz.groqKey, T.groqHint)}
      <label class="mb-1 mt-3 block text-xs font-semibold" style="color: var(--text);">${T.langLabel}</label>
      <select id="wLang" class="clay-select">
        <option value="hi" ${wiz.lang === "hi" ? "selected" : ""}>🇮🇳 Hinglish</option>
        <option value="en" ${wiz.lang === "en" ? "selected" : ""}>🇬🇧 English</option>
      </select>
      <div class="mt-4 flex gap-2">
        <button id="back" class="clay-btn clay-btn-ghost flex-1">${T.back}</button>
        <button id="next" class="clay-btn clay-btn-primary flex-1">${T.next}</button>
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

  // Step 3 — set PIN
  if (wiz.step === 3) {
    const inner = el(`<div>
      <p class="text-[11px] font-semibold uppercase tracking-wide" style="color: var(--brand);">${T.step} 3 / 3</p>
      <h2 class="mt-1 text-lg font-bold" style="color: var(--text);">${T.s3Title}</h2>
      <p class="mt-1 text-xs" style="color: var(--text-soft);">${T.s3Hint}</p>
      ${field(T.createPin, "wPin", "••••", "password")}
      ${field(T.confirmPin, "wPin2", "••••", "password")}
      <p id="msg" class="mt-2 text-xs" style="color: var(--danger);">${msg}</p>
      <div class="mt-4 flex gap-2">
        <button id="back" class="clay-btn clay-btn-ghost flex-1">${T.back}</button>
        <button id="fin" class="clay-btn clay-btn-primary flex-1">${T.finishBtn}</button>
      </div>
    </div>`);
    inner.querySelectorAll('input[type=password]').forEach(i => { i.inputMode = "numeric"; });
    inner.querySelector("#back").onclick = () => { wiz.step = 2; renderSetup(); };
    inner.querySelector("#fin").onclick = async () => {
      const p1 = inner.querySelector("#wPin").value.trim();
      const p2 = inner.querySelector("#wPin2").value.trim();
      if (!/^\d{4,6}$/.test(p1)) return renderSetup3msg(T.pinLen);
      if (p1 !== p2) return renderSetup3msg(T.pinMismatch);
      const btn = inner.querySelector("#fin");
      btn.textContent = T.saving; btn.disabled = true;
      const pinHash = await sha256(p1);
      session.pinHash = pinHash;
      cfg = { url: wiz.url, lang: wiz.lang, studentName: wiz.studentName || "Yeshaswini" };
      try {
        const r = await fetchWithTimeout(cfg.url, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            action: "setup", pinHash,
            driveId: wiz.driveId, photosId: wiz.photosId,
            groqKey: wiz.groqKey, lang: wiz.lang, studentName: wiz.studentName,
          }),
        }).then(x => x.json());
        if (!r || !r.ok) throw new Error((r && r.error) || "setup failed");
        finishUnlock();
      } catch (e) {
        renderSetup3msg(String(e.message || e));
        btn.disabled = false; btn.textContent = T.finishBtn;
      }
    };
    return shell(inner);
  }

  // Existing backend → ask PIN
  if (wiz.step === "existing") {
    return renderLock(T.existingFound);
  }
}

function renderSetup3msg(m) {
  const e = document.getElementById("msg");
  if (e) e.textContent = m;
}

// ===================================================================
//  PIN LOCK
// ===================================================================
function renderLock(msg = "") {
  const T = t();
  const inner = el(`<div class="text-center">
    <div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl text-2xl" style="background: var(--surface); box-shadow: var(--clay-shadow-sm); color: var(--brand);">🔒</div>
    <h2 class="mt-3 text-lg font-bold" style="color: var(--text);">${T.lockTitle}</h2>
    <p class="mt-1 text-xs" style="color: var(--text-soft);">${msg || ""}</p>
    <input id="pinInp" type="password" inputmode="numeric" maxlength="6" placeholder="••••" autocomplete="off"
      class="clay-input mx-auto mt-4 block w-40 text-center text-2xl tracking-[0.4em]" style="letter-spacing: 0.4em;">
    <p id="lmsg" class="mt-2 text-xs" style="color: var(--danger);"></p>
    <button id="unlock" class="clay-btn clay-btn-primary w-full">${T.unlock}</button>
    <button id="reset" class="mt-3 text-[11px] hover:underline" style="color: var(--text-mute); background: none; border: none; cursor: pointer;">${T.reset}</button>
  </div>`);

  const tryUnlock = async () => {
    const pin = inner.querySelector("#pinInp").value.trim();
    if (!/^\d{4,6}$/.test(pin)) { inner.querySelector("#lmsg").textContent = T.pinLen; return; }
    const btn = inner.querySelector("#unlock");
    btn.disabled = true; btn.textContent = "…";
    const pinHash = await sha256(pin);
    session.pinHash = pinHash;
    if (!cfg) cfg = { url: wiz.url, lang: wiz.lang || "hi" };
    try {
      const r = await api("verify");
      if (r && r.ok) { finishUnlock(); }
      else {
        session.pinHash = null;
        inner.querySelector("#lmsg").textContent = T.wrongPin;
        btn.disabled = false; btn.textContent = T.unlock;
      }
    } catch (e) {
      inner.querySelector("#lmsg").textContent = T.networkErr;
      btn.disabled = false; btn.textContent = T.unlock;
    }
  };

  inner.querySelector("#unlock").onclick = tryUnlock;
  inner.querySelector("#pinInp").addEventListener("keydown", e => { if (e.key === "Enter") tryUnlock(); });
  inner.querySelector("#reset").onclick = () => {
    if (confirm("Reset this device's connection?")) {
      localStorage.removeItem(LS.cfg); sessionStorage.removeItem("mec_pin");
      cfg = null; session = { pinHash: null, unlocked: false };
      wiz = newWizard(); renderSetup();
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
  const today = new Date().toDateString();
  const last = localStorage.getItem(LS.lastDay);
  let streak = parseInt(localStorage.getItem(LS.streak) || "0", 10);
  if (last !== today) {
    const yesterday = new Date(Date.now() - 864e5).toDateString();
    streak = (last === yesterday) ? Math.min(streak + 1, 365) : 1;
    localStorage.setItem(LS.streak, streak);
    localStorage.setItem(LS.lastDay, today);
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
  const views = {
    home: HomeView, subjects: SubjectsView, today: TodayView, exam: ExamView,
    chat: ChatView, tricks: TricksView,
    focus: FocusView, flashcards: FlashcardsView, quiz: QuizView,
    analytics: AnalyticsView, bookmarks: BookmarksView,
  };
  try {
    main.appendChild((views[state.view] || HomeView)());
  } catch (err) {
    console.error("Render error in view", state.view, err);
    main.appendChild(el(`<div class="rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 p-4 text-xs text-rose-700 dark:text-rose-300">
      ⚠️ ${tr("View load nahi hua. Network check karo aur dobara try karo.", "View failed to load. Check network and try again.")}<br>
      <button id="errBack" class="mt-2 rounded-lg bg-rose-500 px-3 py-1 text-white">Home</button>
    </div>`));
    main.querySelector("#errBack").onclick = () => go("home");
  }
  app.appendChild(main);
  app.appendChild(BottomNav());
  if (state.view === "chat") { scrollChat(); runMermaid(); }
}

function Header() {
  const h = el(`
    <header class="clay-header safe-top sticky top-0 z-20">
      <div class="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3">
        <div class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-white text-lg" style="background: var(--gradient-brand); box-shadow: var(--clay-shadow-sm);">🎓</div>
        <div class="min-w-0 flex-1">
          <h1 class="truncate text-base font-bold leading-tight" style="color: var(--text);">${t().appName}</h1>
          <p class="truncate text-[11px]" style="color: var(--text-soft);">${t().tagline}</p>
        </div>
        <button id="themeBtn" class="clay-toggle shrink-0" title="Theme: ${themeLabel()}" aria-label="Toggle theme">
          <span>${themeIcon()}</span><span class="hidden sm:inline">${themeLabel()}</span>
        </button>
        <button id="moreBtn" class="clay-toggle shrink-0" title="${t().more}">⚡ <span class="hidden sm:inline">${t().more}</span></button>
        <button id="langBtn" class="clay-toggle shrink-0" aria-label="Change language">
          ${state.lang === "hi" ? "🇮🇳" : "🇬🇧"}<span class="hidden sm:inline">${state.lang === "hi" ? "Hinglish" : "English"}</span>
        </button>
      </div>
    </header>`);
  h.querySelector("#langBtn").onclick = () => {
    state.lang = state.lang === "hi" ? "en" : "hi";
    if (cfg) { cfg.lang = state.lang; saveLS(LS.cfg, cfg); }
    render();
  };
  h.querySelector("#moreBtn").onclick = () => openMoreSheet();
  h.querySelector("#themeBtn").onclick = () => cycleTheme();
  return h;
}

// ── Stat card helper (claymorphism) ─────────────────────────────
function StatCard(label, value, icon) {
  return `<div class="stat-card">
    <div class="stat-icon">${icon}</div>
    <div class="stat-value">${value}</div>
    <div class="stat-label">${label}</div>
  </div>`;
}

// ===================================================================
//  HOME VIEW
// ===================================================================
function HomeView() {
  const streak = updateStreak();
  const topics = new Set(state.logs.map(l => l.subject + "|" + l.topic)).size;
  const name = getStudentName();
  const mot = MOTIVATIONS[dailyIndex(MOTIVATIONS)];

  const wrap = el(`<div class="space-y-5"></div>`);

  // Premium greeting card (gradient clay)
  wrap.appendChild(el(`<section class="clay-card-gradient" style="background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 50%, #ff7eb6 100%); padding: 1.5rem;">
      <p class="text-sm opacity-90">${greet()}, ${escapeHtml(name)} 👋</p>
      <h2 class="mt-1 text-xl font-bold">${t().welcome}</h2>
      <button id="goChat" class="mt-4 clay-btn" style="background: rgba(255,255,255,0.2); color: #fff; backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.25);">💬 ${t().quickAsk}</button>
    </section>`));

  // Stats row
  wrap.appendChild(el(`<div class="grid grid-cols-3 gap-3">
      ${StatCard(t().streak, streak, "🔥")}
      ${StatCard(t().classesLogged, state.logs.length, "📚")}
      ${StatCard(t().topicsCovered, topics, "✅")}
    </div>`));

  // Quick action grid — clay tiles with colorful icon wraps
  const acts = [
    { v: "today", icon: "📝", label: t().logToday, grad: "linear-gradient(135deg, #ffa94d, #ff7eb6)" },
    { v: "subjects", icon: "📖", label: t().myNotes, grad: "linear-gradient(135deg, #00d4a3, #00b894)" },
    { v: "tricks", icon: "🧠", label: t().nav.tricks, grad: "linear-gradient(135deg, #a29bfe, #6c5ce7)" },
    { v: "exam", icon: "🎯", label: t().examPrep, grad: "linear-gradient(135deg, #ff5fa2, #ff6b81)" },
    { v: "chat", icon: "🤖", label: t().nav.chat, grad: "linear-gradient(135deg, #54a0ff, #6c5ce7)" },
  ];
  const grid = el(`<div class="grid grid-cols-2 gap-3 sm:grid-cols-5"></div>`);
  acts.forEach(a => {
    const b = el(`<button class="action-tile">
        <span class="action-icon-wrap" style="background: ${a.grad};">${a.icon}</span>
        <span class="action-label">${a.label}</span>
      </button>`);
    b.onclick = () => go(a.v);
    grid.appendChild(b);
  });
  wrap.appendChild(grid);

  // Daily motivation card
  wrap.appendChild(el(`<section class="clay-card">
    <div class="flex items-start gap-3">
      <span class="text-2xl">💪</span>
      <div>
        <p class="text-[11px] font-semibold" style="color: var(--brand);">${t().dailyMotivation}</p>
        <p class="mt-1 text-sm leading-relaxed" style="color: var(--text);">"${state.lang === "hi" ? mot.hi : mot.en}"</p>
      </div>
    </div>
  </section>`));

  // Recent classes
  const recent = el(`<section><h3 class="mb-2 px-1 text-sm font-bold" style="color: var(--text);">${t().recent}</h3></section>`);
  recent.appendChild(LogList(state.logs.slice(0, 3)));
  wrap.appendChild(recent);

  wrap.querySelector("#goChat").onclick = () => go("chat");
  return wrap;
}

// ===================================================================
//  SUBJECTS VIEW
// ===================================================================
function SubjectsView() {
  const wrap = el(`<div class="space-y-4"><h2 class="px-1 text-lg font-bold" style="color: var(--text);">${t().subjectsTitle}</h2></div>`);
  const grid = el(`<div class="grid grid-cols-1 gap-4 sm:grid-cols-2"></div>`);

  // Map original Tailwind gradient names to our premium gradients
  const gradMap = {
    "from-orange-500 to-amber-600": "linear-gradient(135deg, #ffa94d, #ff7eb6)",
    "from-rose-500 to-red-600": "linear-gradient(135deg, #ff5fa2, #ff6b81)",
    "from-teal-500 to-emerald-600": "linear-gradient(135deg, #00d4a3, #00b894)",
    "from-blue-500 to-indigo-600": "linear-gradient(135deg, #54a0ff, #6c5ce7)",
    "from-fuchsia-500 to-purple-600": "linear-gradient(135deg, #a29bfe, #6c5ce7)",
  };

  SUBJECTS.forEach(s => {
    const grad = gradMap[s.color] || "linear-gradient(135deg, #6c5ce7, #a29bfe)";
    const card = el(`<div class="subject-card">
        <div class="subject-header" style="background: ${grad};">
          <span class="text-3xl">${s.icon}</span>
          <div><h3 class="font-bold">${s.name}</h3><p class="text-xs opacity-90">${s.tag} · ${s.chapters.length} chapters</p></div>
        </div>
        <div class="subject-body">
          <div class="flex flex-wrap gap-1.5">
            ${s.chapters.slice(0, 6).map(c => `<span class="clay-pill">${escapeHtml(c)}</span>`).join("")}
            ${s.chapters.length > 6 ? `<span class="clay-pill">+${s.chapters.length - 6} more</span>` : ""}
          </div>
          <div class="mt-3 flex gap-2">
            <button class="askSub clay-btn clay-btn-primary flex-1" style="padding: 0.5rem 0.75rem; font-size: 0.75rem;">${t().openChat}</button>
            <button class="tricksSub clay-btn clay-btn-ghost flex-1" style="padding: 0.5rem 0.75rem; font-size: 0.75rem;">🧠 ${t().nav.tricks}</button>
          </div>
        </div>
      </div>`);
    card.querySelector(".askSub").onclick = () => {
      go("chat");
      setTimeout(() => sendMessage(tr(
        `${s.name} ka ek important chapter samjhao aur 3 exam questions do.`,
        `Explain an important chapter of ${s.name} and give 3 exam questions.`
      )), 60);
    };
    card.querySelector(".tricksSub").onclick = () => go("tricks");
    grid.appendChild(card);
  });

  wrap.appendChild(grid);
  return wrap;
}

// ===================================================================
//  TODAY VIEW — class diary + multi-file upload
// ===================================================================
let _fileList = [];

function TodayView() {
  _fileList = [];
  const wrap = el(`<div class="space-y-4">
    <div>
      <h2 class="px-1 text-lg font-bold" style="color: var(--text);">📝 ${t().todayTitle}</h2>
      <p class="px-1 text-xs" style="color: var(--text-soft);">${t().todayHint}</p>
    </div>
  </div>`);

  const opts = SUBJECTS.map(s => `<option value="${s.name}">${s.icon} ${s.name}</option>`).join("");
  const form = el(`<form id="logForm" class="clay-card space-y-3">
      <div>
        <label class="mb-1 block text-xs font-semibold" style="color: var(--text);">${t().subject}</label>
        <select name="subject" class="clay-select">${opts}</select>
      </div>
      <div>
        <label class="mb-1 block text-xs font-semibold" style="color: var(--text);">${t().topic}</label>
        <input name="topic" required class="clay-input" placeholder="e.g. Demand Analysis">
      </div>
      <div>
        <label class="mb-1 block text-xs font-semibold" style="color: var(--text);">${t().note}</label>
        <textarea name="note" rows="3" class="clay-textarea"></textarea>
      </div>
      <div class="clay-inset">
        <p class="mb-2 text-center text-xs font-semibold" style="color: var(--text-soft);">📎 ${t().uploadPhoto}</p>
        <div class="flex gap-2">
          <button type="button" id="cameraBtn" class="clay-btn clay-btn-success flex-1" style="padding: 0.5rem; font-size: 0.75rem;">📷 ${t().camera}</button>
          <button type="button" id="filesBtn" class="clay-btn clay-btn-primary flex-1" style="padding: 0.5rem; font-size: 0.75rem;">📁 ${t().attachFiles}</button>
        </div>
        <input id="cameraInp" type="file" accept="image/*" capture="environment" class="hidden">
        <input id="filesInp" type="file" accept="image/*,application/pdf,.doc,.docx,.ppt,.pptx,.txt" multiple class="hidden">
        <div id="filePreview" class="mt-2 flex flex-wrap gap-2"></div>
        <p id="fileMsg" class="mt-1 text-center text-[11px]" style="color: var(--text-mute);"></p>
      </div>
      <button class="clay-btn clay-btn-primary w-full">${t().save}</button>
    </form>`);

  // Wire up file pickers
  const camInp = form.querySelector("#cameraInp");
  const filesInp = form.querySelector("#filesInp");
  form.querySelector("#cameraBtn").onclick = () => camInp.click();
  form.querySelector("#filesBtn").onclick = () => filesInp.click();
  camInp.onchange = (e) => { ingestFiles(e.target.files); camInp.value = ""; renderFilePreview(form); };
  filesInp.onchange = (e) => { ingestFiles(e.target.files); filesInp.value = ""; renderFilePreview(form); };

  form.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const topic = sanitize(fd.get("topic") || "");
    if (!topic) return;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = t().saving;

    // Upload files first (each in parallel for speed)
    const uploaded = await Promise.all(_fileList.map(async (f) => {
      const dataUrl = await readFileAsDataURL(f);
      try {
        const r = await api("upload", { filename: f.name, mime: f.type, data: dataUrl });
        return (r && r.ok && r.link) ? r.link : null;
      } catch (e) { return null; }
    }));
    const validLinks = uploaded.filter(Boolean);

    const entry = {
      subject: fd.get("subject"),
      topic,
      note: sanitize(fd.get("note") || ""),
      date: new Date().toISOString(),
      files: validLinks,
    };
    state.logs.unshift(entry);
    saveLS(LS.logs, state.logs);
    try { await api("log", { entry }); } catch (e) { /* silent — saved locally */ }

    _fileList = [];
    btn.textContent = t().saved;
    setTimeout(() => go("today"), 700);
  };

  wrap.appendChild(form);

  const list = el(`<section><h3 class="mb-2 px-1 text-sm font-bold" style="color: var(--text);">${t().recent}</h3></section>`);
  list.appendChild(LogList(state.logs));
  wrap.appendChild(list);
  return wrap;
}

function ingestFiles(fileList) {
  for (const f of fileList) {
    if (f.size > MAX_FILE_BYTES) {
      alert(`File too large: ${f.name} (max 5 MB)`);
      continue;
    }
    _fileList.push(f);
  }
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = () => reject(fr.error);
    fr.readAsDataURL(file);
  });
}

function renderFilePreview(ctx) {
  const container = ctx.querySelector("#filePreview");
  const msg = ctx.querySelector("#fileMsg");
  container.innerHTML = "";
  if (!_fileList.length) { msg.textContent = ""; return; }
  msg.textContent = `${_fileList.length} ${t().filesSelected}`;
  _fileList.forEach((f, i) => {
    const card = el(`<div class="file-tile group relative h-16 w-16 shrink-0">
      <div class="flex h-full w-full items-center justify-center text-lg font-bold" style="color: var(--text-mute);">${f.type.startsWith("image/") ? "🖼" : "📄"}</div>
      <button type="button" data-idx="${i}" class="remove-file absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full text-[10px] text-white shadow opacity-0 group-hover:opacity-100 transition" style="background: var(--gradient-warm);">✕</button>
    </div>`);
    card.querySelector(".remove-file").onclick = () => {
      _fileList.splice(i, 1);
      renderFilePreview(ctx);
    };
    container.appendChild(card);
  });
}

function LogList(logs) {
  if (!logs.length) return el(`<p class="clay-card-flat p-4 text-center text-xs" style="color: var(--text-mute); border-style: dashed;">${t().noLogs}</p>`);
  const box = el(`<div class="space-y-2"></div>`);
  logs.forEach(l => {
    const sub = SUBJECTS.find(s => s.name === l.subject);
    const d = l.date ? formatDate(l.date) : "";
    const files = (l.files && l.files.length) ? l.files : [];
    box.appendChild(el(`<div class="clay-card-soft flex items-start gap-3" style="padding: 0.75rem;">
        <span class="text-xl">${sub ? sub.icon : "📘"}</span>
        <div class="min-w-0 flex-1"><div class="flex items-center justify-between gap-2">
            <p class="truncate font-semibold" style="color: var(--text);">${escapeHtml(l.topic || "")}</p><span class="shrink-0 text-[11px]" style="color: var(--text-mute);">${d}</span></div>
          <p class="text-[11px]" style="color: var(--text-soft);">${escapeHtml(l.subject || "")}</p>
          ${l.note ? `<p class="mt-1 text-xs" style="color: var(--text-soft);">${escapeHtml(l.note)}</p>` : ""}
          ${files.length ? `<div class="mt-1 flex flex-wrap gap-1">${files.map(url => `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="clay-pill" style="text-decoration: none; color: var(--brand);">📎 file</a>`).join("")}</div>` : ""}
        </div></div>`));
  });
  return box;
}

// ===================================================================
//  EXAM VIEW
// ===================================================================
function ExamView() {
  const wrap = el(`<div class="space-y-4"><div><h2 class="px-1 text-lg font-bold" style="color: var(--text);">${t().examTitle}</h2>
      <p class="px-1 text-xs" style="color: var(--text-soft);">${t().examHint}</p></div></div>`);

  const opts = SUBJECTS.map(s => `<label class="clay-card-soft flex cursor-pointer items-center gap-2" style="padding: 0.65rem 0.85rem;">
      <input type="checkbox" value="${s.name}" class="examSub h-4 w-4" style="accent-color: var(--brand);"><span style="color: var(--text);">${s.icon} ${s.name}</span></label>`).join("");

  const card = el(`<div class="space-y-3"><div class="grid grid-cols-1 gap-2 sm:grid-cols-2">${opts}</div>
      <div class="flex items-center gap-2"><input id="examDays" type="number" min="1" max="365" value="7" class="clay-input" style="width: 5rem; text-align: center;"><span class="text-xs" style="color: var(--text-soft);">days left</span></div>
      <button id="planBtn" class="clay-btn clay-btn-danger w-full">🎯 ${t().makePlan}</button></div>`);

  card.querySelector("#planBtn").onclick = () => {
    const subs = [...card.querySelectorAll(".examSub:checked")].map(c => c.value);
    const days = Math.min(Math.max(parseInt(card.querySelector("#examDays").value) || 7, 1), 365);
    const list = subs.length ? subs.join(", ") : "all MEC subjects";
    go("chat");
    setTimeout(() => sendMessage(tr(
      `Mere exam me ${days} din bache hain. ${list} ke liye day-wise study plan banao with important questions aur revision tips.`,
      `My exam is in ${days} days. Make a day-wise study plan for ${list} with important questions and revision tips.`
    )), 60);
  };
  wrap.appendChild(card);

  // Model paper generator
  const papers = el(`<div class="clay-card space-y-3">
      <div><h3 class="text-sm font-bold" style="color: var(--text);">📄 ${t().papersTitle}</h3>
        <p class="text-xs" style="color: var(--text-soft);">${t().papersHint}</p></div>
      <select id="paperSub" class="clay-select">
        ${SUBJECTS.map(s => `<option value="${s.name}">${s.icon} ${s.name}</option>`).join("")}</select>
      <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button id="genPaper" class="clay-btn clay-btn-primary">📝 ${t().genPaper}</button>
        <button id="findPrev" class="clay-btn clay-btn-ghost">🔎 ${t().findPrev}</button>
      </div></div>`);
  papers.querySelector("#genPaper").onclick = () => {
    const sub = papers.querySelector("#paperSub").value;
    go("chat");
    setTimeout(() => sendMessage(tr(
      `${sub} ka ek full MODEL QUESTION PAPER banao TSBIE Intermediate 1st year exam pattern ke hisaab se — sections, marks aur important questions ke saath.`,
      `Create a full MODEL QUESTION PAPER for ${sub} as per the TSBIE Intermediate 1st year exam pattern — with sections, marks and important questions.`
    )), 60);
  };
  papers.querySelector("#findPrev").onclick = () => {
    const sub = papers.querySelector("#paperSub").value;
    const q = encodeURIComponent(`TS Inter 1st year ${sub} previous question papers TSBIE`);
    window.open(`https://www.google.com/search?q=${q}`, "_blank", "noopener");
  };
  wrap.appendChild(papers);
  return wrap;
}

// ===================================================================
//  TRICKS VIEW — formula vault + study tips
// ===================================================================
function TricksView() {
  const mot = MOTIVATIONS[dailyIndex(MOTIVATIONS)];
  const T = t();
  const wrap = el(`<div class="space-y-4"></div>`);

  wrap.appendChild(el(`<div><h2 class="px-1 text-lg font-bold" style="color: var(--text);">🧠 ${T.tricksTitle}</h2>
    <p class="px-1 text-xs" style="color: var(--text-soft);">${T.tricksHint}</p></div>`));

  // Daily motivation — accent gradient clay card
  wrap.appendChild(el(`<section class="clay-card-accent" style="background: linear-gradient(135deg, #a29bfe 0%, #ff7eb6 100%);">
    <p class="text-[10px] font-semibold uppercase tracking-wide opacity-80">💪 ${T.dailyMotivation}</p>
    <p class="mt-2 text-sm leading-relaxed font-medium">"${state.lang === "hi" ? mot.hi : mot.en}"</p>
  </section>`));

  // Study tips card
  const tips = [T.tip1, T.tip2, T.tip3, T.tip4, T.tip5, T.tip6];
  const tipsCard = el(`<section class="clay-card">
    <h3 class="mb-2 flex items-center gap-2 text-sm font-bold" style="color: var(--text);">📘 ${T.studyTips}</h3>
    <div class="space-y-1.5"></div></section>`);
  const tipsBox = tipsCard.querySelector("div");
  tips.forEach((tip, i) => {
    tipsBox.appendChild(el(`<div class="clay-inset flex items-start gap-2" style="padding: 0.65rem;">
      <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] text-white font-bold" style="background: var(--gradient-brand);">${i + 1}</span>
      <p class="text-xs leading-relaxed" style="color: var(--text);">${tip}</p></div>`));
  });
  wrap.appendChild(tipsCard);

  // Tricks accordion (subject cards)
  const gradMap = {
    "from-orange-500 to-amber-600": "linear-gradient(135deg, #ffa94d, #ff7eb6)",
    "from-rose-500 to-red-600": "linear-gradient(135deg, #ff5fa2, #ff6b81)",
    "from-teal-500 to-emerald-600": "linear-gradient(135deg, #00d4a3, #00b894)",
    "from-blue-500 to-indigo-600": "linear-gradient(135deg, #54a0ff, #6c5ce7)",
    "from-fuchsia-500 to-purple-600": "linear-gradient(135deg, #a29bfe, #6c5ce7)",
  };

  const tricksWrap = el(`<section class="space-y-3"></section>`);
  MATH_TRICKS.forEach((subj) => {
    const grad = gradMap[subj.color] || "linear-gradient(135deg, #6c5ce7, #a29bfe)";
    const subCard = el(`<div class="subject-card">
      <button class="subj-trigger flex w-full items-center gap-3 p-3.5 text-white" style="background: ${grad}; border: none; cursor: pointer;">
        <span class="text-2xl">${subj.icon}</span>
        <div class="flex-1 text-left"><p class="font-bold text-sm">${subj.subject}</p>
          <p class="text-[11px] opacity-80">${subj.tricks.length} ${T.tricksCount}</p></div>
        <span class="arrow text-lg transition-transform duration-200">▾</span>
      </button>
      <div class="tricks-body hidden space-y-2 p-3"></div></div>`);
    const body = subCard.querySelector(".tricks-body");
    const arrow = subCard.querySelector(".arrow");

    subj.tricks.forEach((trItem) => {
      body.appendChild(el(`<div class="clay-inset space-y-1.5" style="padding: 0.75rem;">
        <p class="text-xs font-bold" style="color: var(--brand);">${trItem.title}</p>
        <div class="clay-card-flat" style="padding: 0.5rem;">
          <code class="text-[12px] font-mono leading-relaxed whitespace-pre-wrap" style="color: var(--text);">${escapeHtml(trItem.formula)}</code>
        </div>
        <div class="flex items-start gap-1.5"><span class="shrink-0 text-[10px] font-bold" style="color: var(--warning);">💡</span>
          <p class="text-[11px]" style="color: var(--text-soft);">${trItem.tip}</p></div>
        ${trItem.example ? `<div class="flex items-start gap-1.5"><span class="shrink-0 text-[10px] font-bold" style="color: var(--success);">📝</span>
          <p class="text-[11px]" style="color: var(--text-mute);">${trItem.example}</p></div>` : ""}
      </div>`));
    });

    subCard.querySelector(".subj-trigger").onclick = () => {
      const isOpen = !body.classList.contains("hidden");
      body.classList.toggle("hidden");
      arrow.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
    };
    tricksWrap.appendChild(subCard);
  });
  wrap.appendChild(tricksWrap);

  wrap.appendChild(el(`<button id="tricksAskBtn" class="clay-btn clay-btn-primary w-full">🤖 ${T.quickAsk}</button>`));
  wrap.querySelector("#tricksAskBtn").onclick = () => {
    go("chat");
    setTimeout(() => sendMessage(tr(
      "Mujhe Maths me help chahiye — koi bhi chapter se ek important concept + trick + example do",
      "I need help with Maths — give me an important concept + trick + example from any chapter"
    )), 60);
  };

  return wrap;
}

// ===================================================================
//  CHAT VIEW
// ===================================================================
function ChatView() {
  const wrap = el(`<div class="flex h-[calc(100dvh-9.5rem)] flex-col"></div>`);

  const head = el(`<div class="mb-2 flex items-center justify-between px-1">
      <h2 class="text-lg font-bold" style="color: var(--text);">🤖 ${t().chatTitle}</h2>
      <button id="clearMem" class="clay-toggle" style="padding: 0.35rem 0.7rem; font-size: 0.7rem; color: var(--danger);">${t().clearMem}</button>
    </div>`);
  head.querySelector("#clearMem").onclick = () => {
    if (confirm("Clear chat?")) { state.chat = []; saveLS(LS.chat, state.chat); render(); }
  };
  wrap.appendChild(head);

  const scroll = el(`<div id="chatScroll" class="no-sb clay-card flex-1 space-y-3 overflow-y-auto" style="padding: 0.85rem;"></div>`);
  if (!state.chat.length) {
    scroll.appendChild(el(`<div class="grid h-full place-items-center text-center" style="color: var(--text-mute);">
      <div><div class="text-4xl">🎓</div><p class="mt-2 text-xs">${tr("Apna pehla doubt pucho! Main 24×7 available hoon!", "Ask your first doubt! I'm 24×7 available!")}</p></div></div>`));
  } else {
    state.chat.forEach(m => scroll.appendChild(Bubble(m.role, m.content)));
  }
  wrap.appendChild(scroll);

  const bar = el(`<form id="chatForm" class="safe-bottom mt-2 flex items-end gap-1.5">
      <button type="button" id="micBtn" title="${t().micTip}" aria-label="${t().micTip}" class="clay-btn clay-btn-icon" style="width: 2.75rem; height: 2.75rem;">🎤</button>
      <textarea id="chatInput" rows="1" placeholder="${t().chatPlaceholder}" class="clay-textarea" style="max-height: 7rem; resize: none; padding: 0.65rem 0.9rem;"></textarea>
      <button type="button" id="diagBtn" title="${t().diagramTip}" aria-label="${t().diagramTip}" class="clay-btn clay-btn-icon" style="width: 2.75rem; height: 2.75rem;">📊</button>
      <button type="submit" aria-label="Send" class="clay-btn clay-btn-primary clay-btn-icon" style="width: 2.75rem; height: 2.75rem;">➤</button>
    </form>`);

  const inp = bar.querySelector("#chatInput");
  inp.addEventListener("input", () => {
    inp.style.height = "auto";
    inp.style.height = Math.min(inp.scrollHeight, 112) + "px";
  });
  inp.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); bar.requestSubmit(); }
  });
  bar.onsubmit = e => {
    e.preventDefault();
    const v = inp.value.trim();
    if (!v) return;
    inp.value = ""; inp.style.height = "auto";
    sendMessage(v);
  };
  bar.querySelector("#micBtn").onclick = () => startVoice(inp, bar.querySelector("#micBtn"));
  bar.querySelector("#diagBtn").onclick = () => {
    const v = inp.value.trim();
    if (!v) { inp.focus(); return; }
    inp.value = ""; inp.style.height = "auto";
    sendMessage(tr("Is topic ka ek labelled Mermaid diagram banao: ", "Make a labelled Mermaid diagram for: ") + v);
  };

  wrap.appendChild(bar);
  return wrap;
}

function startVoice(inp, btn) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    alert(tr("Is browser me voice support nahi hai.", "Voice not supported in this browser."));
    return;
  }
  if (window.__rec) { window.__rec.stop(); return; }
  const rec = new SR();
  rec.lang = state.lang === "hi" ? "hi-IN" : "en-IN";
  rec.interimResults = true;
  rec.continuous = false;
  window.__rec = rec;
  btn.classList.add("animate-pulse", "text-rose-500");
  rec.onresult = (e) => {
    let txt = "";
    for (let i = e.resultIndex; i < e.results.length; i++) txt += e.results[i][0].transcript;
    inp.value = txt;
    inp.dispatchEvent(new Event("input"));
  };
  rec.onerror = () => {};
  rec.onend = () => {
    btn.classList.remove("animate-pulse", "text-rose-500");
    window.__rec = null;
  };
  rec.start();
}

function renderAssistant(content) {
  // Extract fenced mermaid code blocks before md processing, then re-inject as <div class="mermaid">
  const blocks = [];
  const s = content.replace(/```mermaid\s*([\s\S]*?)```/g, (m, code) => {
    const i = blocks.length;
    blocks.push(code.trim());
    return `\u0000M${i}\u0000`;
  });
  let html = mdToHtml(s);
  html = html.replace(/\u0000M(\d+)\u0000/g, (m, i) =>
    `<div class="mermaid my-2 rounded-xl bg-white p-2 overflow-x-auto text-center">${blocks[i].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`);
  return html;
}

function runMermaid() {
  const nodes = document.querySelectorAll('.mermaid:not([data-processed])');
  if (!nodes.length) return;
  if (window.mermaid && window.mermaid.run) {
    try {
      nodes.forEach(n => n.setAttribute('data-processed', 'true'));
      window.mermaid.run({ nodes });
    } catch (e) { /* silent — diagram fails shouldn't crash chat */ }
  } else {
    setTimeout(runMermaid, 300);
  }
}

function Bubble(role, content) {
  const me = role === "user";
  const bookmarkBtn = !me
    ? `<button class="bmBtn clay-pill mt-1.5" style="padding: 0.2rem 0.55rem; font-size: 0.65rem;" title="Save to Doubt Bookmarks">⭐ Save</button>`
    : "";
  return el(`<div class="flex ${me ? "justify-end" : "justify-start"}"><div class="${me ? "bubble-user" : "bubble-ai"} max-w-[88%]">
      <div class="msg-body text-[13px] leading-relaxed">${me ? escapeHtml(content) : renderAssistant(content)}</div>${bookmarkBtn}</div></div>`);
}

// Delegated click handler for bookmark buttons
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".bmBtn");
  if (!btn) return;
  const bubble = btn.closest(".flex");
  const body = bubble && bubble.querySelector(".msg-body");
  if (!body) return;
  const text = (body.innerText || body.textContent || "").trim();
  if (!text) return;
  const key = text.slice(0, 80);
  const exists = state.bookmarks.some(b => (b.text || "").slice(0, 80) === key);
  if (exists) { btn.textContent = "✓ Saved"; return; }
  state.bookmarks.unshift({ text, date: new Date().toISOString(), subject: "" });
  if (state.bookmarks.length > MAX_BOOKMARKS) state.bookmarks = state.bookmarks.slice(0, MAX_BOOKMARKS);
  saveLS(LS.bookmarks, state.bookmarks);
  btn.textContent = "✓ Saved";
  btn.classList.add("bg-amber-200", "dark:bg-amber-900/40");
});

function scrollChat() {
  const s = document.getElementById("chatScroll");
  if (s) s.scrollTop = s.scrollHeight;
}

async function sendMessage(text) {
  if (state.view !== "chat") go("chat");
  state.chat.push({ role: "user", content: text });
  if (state.chat.length > MAX_CHAT_HISTORY) state.chat = state.chat.slice(-MAX_CHAT_HISTORY);
  saveLS(LS.chat, state.chat);

  const scroll = document.getElementById("chatScroll");
  if (scroll && scroll.querySelector(".place-items-center")) scroll.innerHTML = "";
  if (scroll) scroll.appendChild(Bubble("user", text));

  const typing = el(`<div class="flex justify-start"><div class="bubble-ai typing"><span></span><span></span><span></span></div></div>`);
  if (scroll) scroll.appendChild(typing);
  scrollChat();

  let reply;
  try {
    const r = await api("chat", {
      lang: state.lang,
      message: text,
      history: state.chat.slice(-10),
      memory: state.logs.slice(0, 20),
    });
    reply = (r && r.reply) || ("⚠️ " + ((r && r.error) || "no reply"));
  } catch (e) {
    reply = "⚠️ " + t().networkErr;
  }

  if (typing.parentNode) typing.remove();
  state.chat.push({ role: "assistant", content: reply });
  if (state.chat.length > MAX_CHAT_HISTORY) state.chat = state.chat.slice(-MAX_CHAT_HISTORY);
  saveLS(LS.chat, state.chat);
  if (scroll) scroll.appendChild(Bubble("assistant", reply));
  scrollChat();
  runMermaid();
}

// ===================================================================
//  BOTTOM NAV
// ===================================================================
function BottomNav() {
  const items = [
    { v: "home", icon: "🏠", label: t().nav.home },
    { v: "subjects", icon: "📚", label: t().nav.subjects },
    { v: "tricks", icon: "🧠", label: t().nav.tricks },
    { v: "today", icon: "📝", label: t().nav.today },
    { v: "exam", icon: "🎯", label: t().nav.exam },
    { v: "chat", icon: "💬", label: t().nav.chat },
  ];
  const nav = el(`<nav class="clay-nav safe-bottom fixed inset-x-0 bottom-0 z-20">
      <div class="mx-auto flex w-full max-w-3xl items-stretch justify-around px-1 pt-1.5"></div></nav>`);
  const row = nav.firstElementChild;
  items.forEach(it => {
    const active = state.view === it.v;
    const b = el(`<button class="nav-btn ${active ? "active" : ""}" aria-label="${it.label}" aria-current="${active ? "page" : "false"}">
        <span class="nav-icon">${it.icon}</span><span>${it.label}</span></button>`);
    b.onclick = () => go(it.v);
    row.appendChild(b);
  });
  return nav;
}

function go(v) {
  state.view = v;
  render();
  window.scrollTo({ top: 0 });
}

// ===================================================================
//  ⚡ MORE SHEET (header button)
// ===================================================================
function openMoreSheet() {
  const items = [
    { v: "focus", icon: "🍅", label: t().focus, desc: tr("25 min focus + 5 min break", "25 min focus + 5 min break") },
    { v: "flashcards", icon: "🃏", label: t().flashcards, desc: tr("Formulas & definitions yaad karo", "Memorize formulas & definitions") },
    { v: "quiz", icon: "❓", label: t().mockTest, desc: tr("Self-scoring quiz banao", "Self-scored AI quiz") },
    { v: "bookmarks", icon: "⭐", label: t().bookmarks, desc: tr("Saved AI explanations", "Saved AI explanations") },
    { v: "analytics", icon: "📊", label: t().analytics, desc: tr("Progress + syllabus tracker", "Progress + syllabus tracker") },
  ];
  const overlay = el(`<div id="moreSheet" class="clay-sheet-overlay fixed inset-0 z-40 flex items-end justify-center">
    <div class="clay-sheet w-full max-w-md p-5 pb-8 view-enter">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-lg font-bold" style="color: var(--text);">${t().moreTitle}</h3>
        <button id="closeMore" aria-label="Close" class="clay-btn clay-btn-icon" style="width: 2rem; height: 2rem; font-size: 0.85rem;">✕</button>
      </div>
      <div class="space-y-2"></div>
    </div>
  </div>`);
  const list = overlay.querySelector("div.space-y-2");
  items.forEach(it => {
    const row = el(`<button class="clay-card-soft flex w-full items-center gap-3" style="padding: 0.75rem; text-align: left;">
      <span class="grid h-10 w-10 place-items-center rounded-xl text-xl text-white" style="background: var(--gradient-brand); box-shadow: var(--clay-shadow-sm);">${it.icon}</span>
      <div class="flex-1"><p class="text-sm font-semibold" style="color: var(--text);">${it.label}</p><p class="text-[11px]" style="color: var(--text-soft);">${it.desc}</p></div>
      <span style="color: var(--text-mute);">›</span>
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
let _pomo = { running: false, mode: "work", remaining: POMO_WORK_SEC, timer: null };

function fmtTime(sec) {
  const safeSec = Math.max(0, sec | 0);
  const m = Math.floor(safeSec / 60).toString().padStart(2, "0");
  const s = (safeSec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function FocusView() {
  const wrap = el(`<div class="space-y-4"></div>`);
  wrap.appendChild(el(`<div><h2 class="px-1 text-lg font-bold" style="color: var(--text);">🍅 ${t().focus}</h2>
    <p class="px-1 text-xs" style="color: var(--text-soft);">${t().focusHint}</p></div>`));

  const card = el(`<div class="clay-card text-center" style="padding: 1.5rem;">
    <p id="pomoMode" class="text-xs font-semibold uppercase tracking-wide" style="color: ${_pomo.mode === "work" ? "var(--danger)" : "var(--success)"};">${_pomo.mode === "work" ? t().focusTime : t().breakTime}</p>
    <div id="pomoTime" class="my-4 font-mono text-6xl font-bold tracking-tight text-gradient">${fmtTime(_pomo.remaining)}</div>
    <div class="flex justify-center gap-2 flex-wrap">
      <button id="pomoStart" class="clay-btn clay-btn-primary">${_pomo.running ? t().pause : t().start}</button>
      <button id="pomoReset" class="clay-btn clay-btn-ghost">${t().resetLbl}</button>
      <button id="pomoSkip" class="clay-btn clay-btn-ghost">${t().skip}</button>
    </div>
  </div>`);
  wrap.appendChild(card);

  // Stats — ensure pomoStats object is well-formed
  const stats = state.pomoStats || { sessions: [], todayMinutes: 0, todayDate: "" };
  if (!Array.isArray(stats.sessions)) stats.sessions = [];
  const today = new Date().toDateString();
  if (stats.todayDate !== today) { stats.todayDate = today; stats.todayMinutes = 0; }

  const todaySessions = stats.sessions.filter(s => new Date(s.date).toDateString() === today).length;
  const totalSessions = stats.sessions.length;
  const totalMinutes = stats.sessions.reduce((a, s) => a + (s.minutes || 0), 0);

  wrap.appendChild(el(`<div class="grid grid-cols-3 gap-3">
    ${StatCard(t().todaySessions, todaySessions, "🎯")}
    ${StatCard(t().todayMinutes, stats.todayMinutes, "⏱")}
    ${StatCard(t().totalSessions, totalSessions, "🏆")}
  </div>`));

  wrap.appendChild(el(`<div class="clay-card text-xs" style="color: var(--text-soft);">
    <p class="font-semibold mb-1" style="color: var(--text);">${t().pomoTrickTitle}</p>
    ${t().pomoTrickBody}
  </div>`));

  // Wire up
  const startBtn = card.querySelector("#pomoStart");
  const resetBtn = card.querySelector("#pomoReset");
  const skipBtn = card.querySelector("#pomoSkip");
  const timeEl = card.querySelector("#pomoTime");
  const modeEl = card.querySelector("#pomoMode");

  function updateUI() {
    timeEl.textContent = fmtTime(_pomo.remaining);
    modeEl.textContent = _pomo.mode === "work" ? t().focusTime : t().breakTime;
    modeEl.style.color = _pomo.mode === "work" ? "var(--danger)" : "var(--success)";
    startBtn.textContent = _pomo.running ? t().pause : t().start;
  }

  function completeSession() {
    if (_pomo.mode === "work") {
      stats.sessions.push({ date: new Date().toISOString(), minutes: 25, mode: "work" });
      stats.todayMinutes = (stats.todayMinutes || 0) + 25;
      if (stats.sessions.length > MAX_POMO_SESSIONS) stats.sessions = stats.sessions.slice(-MAX_POMO_SESSIONS);
      state.pomoStats = stats;
      saveLS(LS.pomoStats, stats);
      _pomo.mode = "break";
      _pomo.remaining = POMO_BREAK_SEC;
      try { navigator.vibrate && navigator.vibrate(200); } catch (e) {}
      alert(t().workDone);
    } else {
      _pomo.mode = "work";
      _pomo.remaining = POMO_WORK_SEC;
      try { navigator.vibrate && navigator.vibrate([100, 50, 100]); } catch (e) {}
      alert(t().breakOver);
    }
  }

  function tick() {
    if (!_pomo.running) return;
    _pomo.remaining--;
    if (_pomo.remaining <= 0) {
      completeSession();
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
    _pomo.running = false;
    clearInterval(_pomo.timer);
    _pomo.mode = "work";
    _pomo.remaining = POMO_WORK_SEC;
    updateUI();
  };
  skipBtn.onclick = () => {
    _pomo.remaining = 0;
    completeSession();
    updateUI();
  };

  return wrap;
}

// ===================================================================
//  2. FLASHCARDS
// ===================================================================
function FlashcardsView() {
  const wrap = el(`<div class="space-y-4"></div>`);
  wrap.appendChild(el(`<div><h2 class="px-1 text-lg font-bold" style="color: var(--text);">🃏 ${t().flashcards}</h2>
    <p class="px-1 text-xs" style="color: var(--text-soft);">${t().flashcardsHint}</p></div>`));

  // Add new card form
  const addForm = el(`<form class="clay-card space-y-2" style="padding: 1rem;">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-bold" style="color: var(--text);">➕ ${t().addCard}</h3>
      <button type="button" id="aiFillBtn" class="clay-pill" style="cursor: pointer;">${t().aiFill}</button>
    </div>
    <select id="fcSubj" class="clay-select" style="font-size: 0.75rem;">
      ${SUBJECTS.map(s => `<option value="${s.name}">${s.icon} ${s.name}</option>`).join("")}
    </select>
    <textarea id="fcFront" rows="2" placeholder="${t().frontLabel}" class="clay-textarea" style="font-size: 0.75rem;"></textarea>
    <textarea id="fcBack" rows="3" placeholder="${t().backLabel}" class="clay-textarea" style="font-size: 0.75rem;"></textarea>
    <button type="submit" class="clay-btn clay-btn-primary w-full" style="font-size: 0.75rem; padding: 0.5rem;">${t().saveCard}</button>
  </form>`);
  wrap.appendChild(addForm);

  // AI auto-fill — send to chat with strict format
  addForm.querySelector("#aiFillBtn").onclick = () => {
    const sub = addForm.querySelector("#fcSubj").value;
    go("chat");
    setTimeout(() => sendMessage(tr(
      `${sub} ke liye 5 flashcards banao — har card ka front (term/sawal) aur back (formula/short answer) clearly mention karo. Format: "CARD 1\\nFront: ...\\nBack: ..."`,
      `Create 5 flashcards for ${sub} — for each card clearly mention front (term/question) and back (formula/short answer). Format: "CARD 1\\nFront: ...\\nBack: ..."`
    )), 60);
  };

  addForm.onsubmit = (e) => {
    e.preventDefault();
    const subj = addForm.querySelector("#fcSubj").value;
    const front = (addForm.querySelector("#fcFront").value || "").trim();
    const back = (addForm.querySelector("#fcBack").value || "").trim();
    if (!front || !back) return;
    state.flashcards.unshift({
      id: Date.now(),
      subject: subj,
      front,
      back,
      known: false,
      reviewed: 0,
      lastReview: null,
    });
    saveLS(LS.flashcards, state.flashcards);
    render();
  };

  // Empty state
  if (state.flashcards.length === 0) {
    wrap.appendChild(el(`<div class="clay-card-flat p-6 text-center text-xs" style="color: var(--text-mute); border-style: dashed;">
      ${t().noFlashcards}
    </div>`));
    return wrap;
  }

  // Study card — unknown cards first (spaced repetition principle)
  const unknown = state.flashcards.filter(c => !c.known);
  const queue = unknown.length ? unknown : state.flashcards;
  const current = queue[0];

  const studyCard = el(`<div class="clay-card" style="padding: 1.25rem;">
    <div class="mb-2 flex items-center justify-between">
      <span class="clay-pill">${escapeHtml(current.subject || "General")}</span>
      <span class="text-[11px]" style="color: var(--text-mute);">${t().tapToFlip}</span>
    </div>
    <div id="flipCard" class="cursor-pointer clay-inset p-8 min-h-[180px] flex items-center justify-center text-center" style="padding: 1.5rem;">
      <div>
        <p class="text-[10px] font-semibold uppercase mb-2" style="color: var(--text-mute);">${t().front}</p>
        <p class="text-lg font-bold leading-snug" style="color: var(--text);">${escapeHtml(current.front)}</p>
      </div>
    </div>
    <div class="mt-3 flex gap-2">
      <button id="fcKnown" class="clay-btn clay-btn-success flex-1" style="font-size: 0.75rem;">${t().knewIt}</button>
      <button id="fcUnknown" class="clay-btn clay-btn-danger flex-1" style="font-size: 0.75rem;">${t().needReview}</button>
      <button id="fcDelete" class="clay-btn clay-btn-ghost" style="padding: 0.5rem 0.75rem;">🗑</button>
    </div>
  </div>`);

  let flipped = false;
  const flipEl = studyCard.querySelector("#flipCard");
  flipEl.onclick = () => {
    flipped = !flipped;
    flipEl.innerHTML = flipped
      ? `<div><p class="text-[10px] font-semibold uppercase mb-2" style="color: var(--text-mute);">${t().back}</p><p class="text-base leading-relaxed" style="color: var(--text);">${escapeHtml(current.back)}</p></div>`
      : `<div><p class="text-[10px] font-semibold uppercase mb-2" style="color: var(--text-mute);">${t().front}</p><p class="text-lg font-bold leading-snug" style="color: var(--text);">${escapeHtml(current.front)}</p></div>`;
  };
  studyCard.querySelector("#fcKnown").onclick = () => {
    current.known = true;
    current.reviewed = (current.reviewed || 0) + 1;
    current.lastReview = new Date().toISOString();
    saveLS(LS.flashcards, state.flashcards);
    render();
  };
  studyCard.querySelector("#fcUnknown").onclick = () => {
    current.known = false;
    current.reviewed = (current.reviewed || 0) + 1;
    current.lastReview = new Date().toISOString();
    saveLS(LS.flashcards, state.flashcards);
    render();
  };
  studyCard.querySelector("#fcDelete").onclick = () => {
    if (confirm(t().deleteCard)) {
      state.flashcards = state.flashcards.filter(c => c.id !== current.id);
      saveLS(LS.flashcards, state.flashcards);
      render();
    }
  };
  wrap.appendChild(studyCard);

  // Mastery progress
  const known = state.flashcards.filter(c => c.known).length;
  const pct = state.flashcards.length ? Math.round(known * 100 / state.flashcards.length) : 0;
  wrap.appendChild(el(`<div class="clay-card-gradient text-center" style="background: linear-gradient(135deg, #00d4a3, #6c5ce7); padding: 1rem;">
    <p class="text-xs opacity-80">${t().cardsMastered}</p>
    <p class="text-3xl font-bold">${known} / ${state.flashcards.length}</p>
    <div class="clay-progress-track mt-2" style="background: rgba(255,255,255,0.25); height: 8px;">
      <div class="clay-progress-fill" style="background: rgba(255,255,255,0.95); width: ${pct}%"></div>
    </div>
  </div>`));

  return wrap;
}

// ===================================================================
//  3. MCQ MOCK TEST (AI-generated, self-scored)
// ===================================================================
let _quiz = { questions: [], current: 0, answers: [], loading: false, meta: null };

function QuizView() {
  const wrap = el(`<div class="space-y-4"></div>`);

  // If quiz is active, render the active test view
  if (_quiz.questions.length) {
    return renderQuizActive(wrap);
  }

  // Otherwise show setup form
  wrap.appendChild(el(`<div><h2 class="px-1 text-lg font-bold" style="color: var(--text);">❓ ${t().mockTest}</h2>
    <p class="px-1 text-xs" style="color: var(--text-soft);">${t().mockHint}</p></div>`));

  const setup = el(`<div class="clay-card space-y-3" style="padding: 1rem;">
    <div><label class="mb-1 block text-xs font-semibold" style="color: var(--text);">${t().subjectLbl}</label>
      <select id="qSubj" class="clay-select">
        ${SUBJECTS.map(s => `<option value="${s.name}">${s.icon} ${s.name}</option>`).join("")}
      </select></div>
    <div><label class="mb-1 block text-xs font-semibold" style="color: var(--text);">${t().topicOptional}</label>
      <input id="qTopic" placeholder="${tr("e.g. Differentiation", "e.g. Differentiation")}" class="clay-input"></div>
    <div><label class="mb-1 block text-xs font-semibold" style="color: var(--text);">${t().numQuestions}</label>
      <select id="qCount" class="clay-select">
        <option value="5">5</option><option value="10">10</option><option value="15">15</option>
      </select></div>
    <button id="genQuiz" class="clay-btn clay-btn-danger w-full">📝 ${t().genQuiz}</button>
  </div>`);
  wrap.appendChild(setup);

  if (state.quizResults.length) {
    const last = state.quizResults[0];
    wrap.appendChild(el(`<div class="clay-card-soft" style="padding: 0.85rem;">
      <p class="text-xs font-semibold mb-1" style="color: var(--text-soft);">📊 ${t().lastQuiz}</p>
      <p class="text-sm" style="color: var(--text);"><strong style="color: var(--brand);">${last.score}/${last.total}</strong> • ${escapeHtml(last.subject)} ${last.topic ? "· " + escapeHtml(last.topic) : ""} • ${new Date(last.date).toLocaleDateString()}</p>
    </div>`));
  }

  if (_quiz.loading) {
    wrap.appendChild(el(`<div class="clay-card p-6 text-center">
      <div class="text-3xl mb-2">⏳</div>
      <p class="text-sm" style="color: var(--text);">${t().quizLoading}</p>
    </div>`));
  }

  setup.querySelector("#genQuiz").onclick = async () => {
    const subj = setup.querySelector("#qSubj").value;
    const topic = (setup.querySelector("#qTopic").value || "").trim();
    const count = parseInt(setup.querySelector("#qCount").value) || 5;
    const btn = setup.querySelector("#genQuiz");
    btn.disabled = true; btn.textContent = t().generating;
    _quiz.loading = true;
    _quiz.questions = []; _quiz.current = 0; _quiz.answers = [];
    render();

    const prompt = tr(
      `Mujhe ${subj}${topic ? " (" + topic + ")" : ""} se ${count} MCQ (multiple choice questions) do. Har question ke 4 options (A, B, C, D) ho aur end me sahi answer bhi batao. Strict format use karo:\n\nQ1. question text\nA) option1\nB) option2\nC) option3\nD) option4\nAnswer: B\n\nQ2. ...\n\nBas isi format me, koi extra explanation nahi.`,
      `Give me ${count} MCQ (multiple choice questions) from ${subj}${topic ? " (" + topic + ")" : ""}. Each question must have 4 options (A, B, C, D) and the correct answer at the end. Use this strict format:\n\nQ1. question text\nA) option1\nB) option2\nC) option3\nD) option4\nAnswer: B\n\nQ2. ...\n\nOnly this format, no extra explanation.`
    );
    try {
      const r = await api("chat", { lang: state.lang, message: prompt, history: [], memory: [] });
      const text = (r && r.reply) || "";
      _quiz.questions = parseQuiz(text);
      _quiz.meta = { subject: subj, topic, total: _quiz.questions.length, date: new Date().toISOString() };
      if (!_quiz.questions.length) {
        alert(t().quizGenFail);
      }
    } catch (e) {
      alert(t().quizGenFail);
    } finally {
      _quiz.loading = false;
      btn.disabled = false; btn.textContent = "📝 " + t().genQuiz;
      render();
    }
  };

  return wrap;
}

function parseQuiz(text) {
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
  const answered = _quiz.answers.filter(Boolean).length;
  const isLast = _quiz.current === total - 1;

  wrap.appendChild(el(`<div class="flex items-center justify-between">
    <h2 class="text-lg font-bold" style="color: var(--text);">❓ ${t().mockTest}</h2>
    <span class="clay-pill clay-pill-brand">${_quiz.current + 1} / ${total}</span>
  </div>`));

  wrap.appendChild(el(`<div class="clay-progress-track">
    <div class="clay-progress-fill" style="width: ${Math.round(answered * 100 / total)}%"></div>
  </div>`));

  const userAns = _quiz.answers[_quiz.current];
  const card = el(`<div class="clay-card" style="padding: 1.25rem;">
    <p class="mb-3 text-sm font-semibold leading-relaxed" style="color: var(--text);">${_quiz.current + 1}. ${escapeHtml(q.question)}</p>
    <div class="space-y-2"></div>
  </div>`);
  const optsBox = card.querySelector("div.space-y-2");
  ["A", "B", "C", "D"].forEach(letter => {
    const opt = q.options[letter];
    if (!opt) return;
    const selected = userAns === letter;
    const b = el(`<button class="quiz-option ${selected ? "selected" : ""}">
      <span class="opt-letter">${letter}</span>
      <span>${escapeHtml(opt)}</span>
    </button>`);
    b.onclick = () => { _quiz.answers[_quiz.current] = letter; render(); };
    optsBox.appendChild(b);
  });
  wrap.appendChild(card);

  // Navigation
  const nav = el(`<div class="flex gap-2">
    <button id="qPrev" class="clay-btn clay-btn-ghost flex-1 ${_quiz.current === 0 ? "opacity-40 pointer-events-none" : ""}">← ${t().prev}</button>
    ${isLast
      ? `<button id="qSubmit" class="clay-btn clay-btn-success flex-1">✓ ${t().submitQuiz}</button>`
      : `<button id="qNext" class="clay-btn clay-btn-primary flex-1">${t().nextLbl} →</button>`}
  </div>`);
  if (_quiz.current > 0) {
    nav.querySelector("#qPrev").onclick = () => { _quiz.current--; render(); };
  }
  if (isLast) {
    nav.querySelector("#qSubmit").onclick = () => {
      const unanswered = _quiz.questions.length - _quiz.answers.filter(Boolean).length;
      if (unanswered > 0 && !confirm(`${unanswered} ${t().unansweredConfirm}`)) return;
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
  if (state.quizResults.length > MAX_QUIZ_HISTORY) state.quizResults = state.quizResults.slice(0, MAX_QUIZ_HISTORY);
  saveLS(LS.quizResults, state.quizResults);
  // Reset quiz state and show analytics with results
  _quiz.questions = []; _quiz.current = 0; _quiz.answers = []; _quiz.meta = null;
  state.view = "analytics";
  render();
}

// ===================================================================
//  4. DOUBT BOOKMARKS VIEW
// ===================================================================
function BookmarksView() {
  const wrap = el(`<div class="space-y-4"></div>`);
  wrap.appendChild(el(`<div class="flex items-center justify-between">
    <h2 class="px-1 text-lg font-bold" style="color: var(--text);">⭐ ${t().bookmarks}</h2>
    ${state.bookmarks.length ? `<button id="clearBm" class="clay-toggle" style="padding: 0.35rem 0.7rem; font-size: 0.7rem; color: var(--danger);">${t().clearAll}</button>` : ""}
  </div>
  <p class="px-1 text-xs" style="color: var(--text-soft);">${t().bookmarksHint}</p>`));

  if (state.bookmarks.length === 0) {
    wrap.appendChild(el(`<div class="clay-card-flat p-6 text-center text-xs" style="color: var(--text-mute); border-style: dashed;">
      ${t().noBookmarks}
    </div>`));
    return wrap;
  }

  const list = el(`<div class="space-y-2"></div>`);
  state.bookmarks.forEach((b, i) => {
    const preview = b.text.slice(0, 280);
    const ellipsis = b.text.length > 280 ? "..." : "";
    list.appendChild(el(`<div class="clay-card-soft" style="padding: 0.75rem;">
      <div class="flex items-start justify-between gap-2">
        <p class="text-xs leading-relaxed flex-1" style="color: var(--text);">${escapeHtml(preview)}${ellipsis}</p>
        <button data-i="${i}" class="delBm shrink-0 clay-btn clay-btn-icon" style="width: 1.75rem; height: 1.75rem; font-size: 0.7rem; background: var(--gradient-warm); color: #fff;">✕</button>
      </div>
      <div class="mt-1.5 flex items-center justify-between">
        <span class="text-[10px]" style="color: var(--text-mute);">${b.date ? new Date(b.date).toLocaleDateString() : ""}</span>
        <button data-i="${i}" class="askBm clay-pill" style="cursor: pointer; color: var(--brand);">💬 ${t().askMore}</button>
      </div>
    </div>`));
  });

  list.querySelectorAll(".delBm").forEach(b => {
    b.onclick = () => {
      const i = parseInt(b.dataset.i);
      state.bookmarks.splice(i, 1);
      saveLS(LS.bookmarks, state.bookmarks);
      render();
    };
  });
  list.querySelectorAll(".askBm").forEach(b => {
    b.onclick = () => {
      const i = parseInt(b.dataset.i);
      const text = state.bookmarks[i].text;
      go("chat");
      setTimeout(() => sendMessage(tr(
        `Is topic par aur detail samjhao aur 3 practice questions do: "${text.slice(0, 200)}"`,
        `Explain this in more detail and give 3 practice questions: "${text.slice(0, 200)}"`
      )), 60);
    };
  });
  wrap.appendChild(list);

  const clrBtn = wrap.querySelector("#clearBm");
  if (clrBtn) clrBtn.onclick = () => {
    if (confirm(t().clearAllConfirm)) {
      state.bookmarks = [];
      saveLS(LS.bookmarks, state.bookmarks);
      render();
    }
  };
  return wrap;
}

// ===================================================================
//  5. ANALYTICS + SYLLABUS TRACKER
// ===================================================================
function AnalyticsView() {
  const wrap = el(`<div class="space-y-4"></div>`);
  wrap.appendChild(el(`<div><h2 class="px-1 text-lg font-bold" style="color: var(--text);">📊 ${t().analytics}</h2>
    <p class="px-1 text-xs" style="color: var(--text-soft);">${t().analyticsHint}</p></div>`));

  // Quiz performance summary
  if (state.quizResults.length) {
    const recent = state.quizResults.slice(0, 10).reverse();
    const avgPct = Math.round(recent.reduce((a, r) => a + (r.score * 100 / r.total), 0) / recent.length);
    const best = Math.max(...recent.map(r => r.score * 100 / r.total));
    const worst = Math.min(...recent.map(r => r.score * 100 / r.total));

    wrap.appendChild(el(`<div class="clay-card-gradient" style="background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%); padding: 1.25rem;">
      <p class="text-xs opacity-80">${t().quizPerf}</p>
      <div class="mt-2 grid grid-cols-3 gap-3 text-center">
        <div><p class="text-2xl font-bold">${avgPct}%</p><p class="text-[10px] opacity-80">${t().avg}</p></div>
        <div><p class="text-2xl font-bold">${Math.round(best)}%</p><p class="text-[10px] opacity-80">${t().best}</p></div>
        <div><p class="text-2xl font-bold">${Math.round(worst)}%</p><p class="text-[10px] opacity-80">${t().lowest}</p></div>
      </div>
    </div>`));

    // Bar chart of recent scores
    const chartCard = el(`<div class="clay-card">
      <p class="mb-2 text-sm font-bold" style="color: var(--text);">📈 ${t().recentScores}</p>
      <div class="flex items-end justify-between gap-1 h-32"></div>
    </div>`);
    const bars = chartCard.querySelector("div.flex");
    recent.forEach(r => {
      const pct = Math.round(r.score * 100 / r.total);
      bars.appendChild(el(`<div class="flex-1 flex flex-col items-center gap-1">
        <span class="text-[9px] font-semibold" style="color: var(--text-soft);">${pct}%</span>
        <div class="bar-fill w-full" style="height: ${pct}%"></div>
        <span class="text-[9px]" style="color: var(--text-mute);">${new Date(r.date).toLocaleDateString(undefined, { day: "numeric", month: "numeric" })}</span>
      </div>`));
    });
    wrap.appendChild(chartCard);

    // Subject-wise accuracy bars
    const bySubj = {};
    state.quizResults.forEach(r => {
      if (!bySubj[r.subject]) bySubj[r.subject] = { total: 0, score: 0 };
      bySubj[r.subject].total += r.total;
      bySubj[r.subject].score += r.score;
    });
    const subCard = el(`<div class="clay-card">
      <p class="mb-2 text-sm font-bold" style="color: var(--text);">🎯 ${t().subjectAcc}</p>
      <div class="space-y-2"></div>
    </div>`);
    const subList = subCard.querySelector("div.space-y-2");
    Object.entries(bySubj).forEach(([subj, d]) => {
      const pct = Math.round(d.score * 100 / d.total);
      const color = pct >= 75 ? "linear-gradient(90deg, #00d4a3, #00b894)" : pct >= 50 ? "linear-gradient(90deg, #ffa94d, #ff7eb6)" : "linear-gradient(90deg, #ff5fa2, #ff6b81)";
      subList.appendChild(el(`<div>
        <div class="flex justify-between text-[11px] mb-1"><span style="color: var(--text);">${escapeHtml(subj)}</span><span class="font-semibold" style="color: var(--text);">${pct}%</span></div>
        <div class="clay-progress-track">
          <div class="clay-progress-fill" style="background: ${color}; width: ${pct}%"></div>
        </div>
      </div>`));
    });
    wrap.appendChild(subCard);
  } else {
    wrap.appendChild(el(`<div class="clay-card-flat p-4 text-center text-xs" style="color: var(--text-mute); border-style: dashed;">
      ${t().noQuizzes}
    </div>`));
  }

  // Pomodoro stats summary
  const pomo = state.pomoStats || { sessions: [], todayMinutes: 0, todayDate: "" };
  const totalPomoMin = (pomo.sessions || []).reduce((a, s) => a + (s.minutes || 0), 0);
  wrap.appendChild(el(`<div class="grid grid-cols-2 gap-3">
    ${StatCard(t().totalFocusMin, totalPomoMin, "⏱")}
    ${StatCard(t().totalFocusSess, (pomo.sessions || []).length, "🎯")}
  </div>`));

  // Syllabus Progress Tracker
  wrap.appendChild(el(`<div class="clay-card">
    <h3 class="mb-2 text-sm font-bold" style="color: var(--text);">📚 ${t().syllabusTracker}</h3>
    <p class="text-[11px] mb-3" style="color: var(--text-soft);">${t().syllabusHint}</p>
    <div class="space-y-3" id="syllabusList"></div>
  </div>`));
  const tracker = wrap.querySelector("#syllabusList");

  const STATUS = [
    { id: 0, label: t().notStarted },
    { id: 1, label: t().studying },
    { id: 2, label: t().revised },
    { id: 3, label: t().mastered },
  ];

  SUBJECTS.forEach(s => {
    if (!state.syllabus[s.id]) state.syllabus[s.id] = {};
    const subData = state.syllabus[s.id];
    const total = s.chapters.length;
    const mastered = s.chapters.filter(c => subData[c] === 3).length;
    const pct = Math.round(mastered * 100 / total);

    const subCard = el(`<div class="clay-card-soft" style="padding: 0.75rem;">
      <div class="flex items-center justify-between mb-1">
        <p class="text-xs font-semibold" style="color: var(--text);">${s.icon} ${s.name}</p>
        <span class="text-[10px] font-bold" style="color: ${pct >= 75 ? "var(--success)" : pct >= 40 ? "var(--warning)" : "var(--danger)"};">${mastered}/${total} (${pct}%)</span>
      </div>
      <div class="clay-progress-track mb-2" style="height: 6px;">
        <div class="clay-progress-fill" style="background: linear-gradient(90deg, #00d4a3, #00b894); width: ${pct}%"></div>
      </div>
      <div class="space-y-1 chapters-list"></div>
    </div>`);
    const chapList = subCard.querySelector(".chapters-list");
    s.chapters.forEach(c => {
      const sid = subData[c] || 0;
      const row = el(`<div class="flex items-center gap-1 text-[11px]">
        <span class="flex-1 truncate" style="color: var(--text);">${escapeHtml(c)}</span>
        <select data-subj="${s.id}" data-chap="${escapeHtml(c)}" class="clay-select-mini">
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
  wrap.appendChild(el(`<div class="clay-card-gradient text-center" style="background: linear-gradient(135deg, #a29bfe 0%, #ff7eb6 100%); padding: 1.25rem;">
    <p class="text-xs opacity-80">${t().overallMastery}</p>
    <p class="text-4xl font-bold">${overallPct}%</p>
    <p class="text-xs opacity-80">${totalMastered} / ${totalChapters} ${t().chaptersMastered}</p>
  </div>`));

  return wrap;
}

// ===================================================================
//  BOOT — kick off the app
// ===================================================================
boot();
