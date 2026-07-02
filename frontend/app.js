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
    nav: { home: "Home", subjects: "Subjects", today: "Today", exam: "Exams", chat: "Chat", tricks: "Tricks", tools: "Tools" },
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
    // MCQ Quiz
    mcqTitle: "MCQ Practice Tests", mcqHint: "Test your knowledge with subject-wise MCQs. Get instant feedback.",
    mcqStart: "Start Quiz", mcqScore: "Score", mcqCorrect: "Correct", mcqWrong: "Wrong",
    mcqNext: "Next", mcqResult: "Quiz Complete!", mcqSelectSubj: "Select Subject",
    mcqAccuracy: "Accuracy", mcqRetry: "Try Again", mcqTotal: "Total Questions",
    mcqExplain: "Explanation", mcqGenByAI: "Generate AI Questions",
    // Flashcards
    fcTitle: "Flashcards", fcHint: "Master formulas & concepts with spaced repetition",
    fcFront: "Front", fcBack: "Back", fcFlip: "Flip", fcEasy: "Easy (3 days)",
    fcMedium: "Medium (1 day)", fcHard: "Hard (now)", fcBox: "Box", fcNewCard: "New Flashcard",
    fcReview: "Review Cards", fcDone: "Done for now!", fcDue: "Due for review",
    fcAddNew: "Add New Card", fcSubject: "Subject", fcFrontLabel: "Question / Formula",
    fcBackLabel: "Answer / Explanation", fcAdd: "Add Card", fcEmpty: "No flashcards yet. Add your first!",
    // Pomodoro Timer
    pomTitle: "Focus Timer", pomHint: "Study with Pomodoro technique — 25 min focus, 5 min break",
    pomWork: "Focus", pomBreak: "Break", pomStart: "Start", pomPause: "Pause",
    pomReset: "Reset", pomSessions: "Sessions today", pomFocusTime: "Total focus time",
    pomComplete: "Time's up! Take a break 🎉", pomBreakComplete: "Break over! Back to work 💪",
    // Progress Dashboard
    progTitle: "My Progress", progHint: "Track your study journey — stay motivated!",
    progStreak: "Streak", progLogs: "Diary Entries", progTopics: "Topics",
    progQuizScore: "Quiz Avg", progFocusHours: "Focus Hours", progThisWeek: "This Week",
    progNoData: "Start studying to see your progress!",
    // Doubt Library
    doubtTitle: "Doubt Library", doubtHint: "Search previously asked doubts and AI answers",
    doubtSearch: "Search doubts…", doubtEmpty: "No doubts found. Ask the Professor!",
    doubtClear: "Clear search",
    // Voice Notes
    recordNote: "Record Voice Note", recording: "Recording… tap to stop",
    stopRecording: "Stop", playback: "Playback", saveNote: "Save Note",
    // Tools nav
    tools: "Tools",
  },

  hi: {
    appName: "MEC Study Buddy", tagline: "Aapke 24x7 CA Professor — hamesha saath",
    nav: { home: "Home", subjects: "Subjects", today: "Aaj", exam: "Exam", chat: "Chat", tricks: "Tricks", tools: "Tools" },
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
    // MCQ Quiz
    mcqTitle: "MCQ Practice Test", mcqHint: "Subject-wise MCQs se apni knowledge test karo. Instant feedback milega.",
    mcqStart: "Quiz Start karo", mcqScore: "Score", mcqCorrect: "Sahi", mcqWrong: "Galat",
    mcqNext: "Agla", mcqResult: "Quiz Complete!", mcqSelectSubj: "Subject chuno",
    mcqAccuracy: "Accuracy", mcqRetry: "Phir se try karo", mcqTotal: "Total Questions",
    mcqExplain: "Explanation", mcqGenByAI: "AI se questions banao",
    // Flashcards
    fcTitle: "Flashcards", fcHint: "Spaced repetition se formulas aur concepts yaad karo",
    fcFront: "Aage", fcBack: "Peeche", fcFlip: "Palat do", fcEasy: "Easy (3 din)",
    fcMedium: "Medium (1 din)", fcHard: "Hard (abhi)", fcBox: "Box", fcNewCard: "Naya Flashcard",
    fcReview: "Review karo", fcDone: "Abhi ke liye ho gaya!", fcDue: "Review due hai",
    fcAddNew: "Naya Card Add karo", fcSubject: "Subject", fcFrontLabel: "Sawaal / Formula",
    fcBackLabel: "Jawaab / Explanation", fcAdd: "Card Add karo", fcEmpty: "Abhi koi flashcard nahi. Pehla add karo!",
    // Pomodoro Timer
    pomTitle: "Focus Timer", pomHint: "Pomodoro technique se padho — 25 min focus, 5 min break",
    pomWork: "Focus", pomBreak: "Break", pomStart: "Shuru", pomPause: "Ruko",
    pomReset: "Reset", pomSessions: "Aaj ke sessions", pomFocusTime: "Total focus time",
    pomComplete: "Time ho gaya! Break lo 🎉", pomBreakComplete: "Break khatam! Padhai karo 💪",
    // Progress Dashboard
    progTitle: "Meri Progress", progHint: "Apni study journey track karo — motivated raho!",
    progStreak: "Streak", progLogs: "Diary Entries", progTopics: "Topics",
    progQuizScore: "Quiz Avg", progFocusHours: "Focus Hours", progThisWeek: "Is hafte",
    progNoData: "Progress dekhne ke liye padhai shuru karo!",
    // Doubt Library
    doubtTitle: "Doubt Library", doubtHint: "Pehle puchhe gaye doubts aur AI answers search karo",
    doubtSearch: "Doubts search karo…", doubtEmpty: "Koi doubt nahi mila. Professor se pucho!",
    doubtClear: "Search clear karo",
    // Voice Notes
    recordNote: "Voice Note Record karo", recording: "Record ho raha… tap karo rukne ke liye",
    stopRecording: "Ruko", playback: "Sunno", saveNote: "Note Save karo",
    // Tools nav
    tools: "Tools",
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

// ---------- MCQ QUESTION BANK (5 per subject) ----------
const MCQ_BANK = [
  { subject: "Maths Paper-IA", q: "What is the domain of f(x) = 1/(x-3)?", opts: ["All real numbers", "x ≠ 3", "x > 3", "x < 3"], ans: 1, exp: "Denominator cannot be zero, so x-3 ≠ 0 → x ≠ 3" },
  { subject: "Maths Paper-IA", q: "det[2 3; 4 5] = ?", opts: ["-2", "2", "10-12= -2", "22"], ans: 0, exp: "det = (2×5) - (3×4) = 10-12 = -2" },
  { subject: "Maths Paper-IA", q: "sin²θ + cos²θ = ?", opts: ["0", "1", "-1", "sinθ"], ans: 1, exp: "This is the fundamental trig identity — always equals 1" },
  { subject: "Maths Paper-IA", q: "Which is NOT a scalar quantity?", opts: ["Mass", "Speed", "Velocity", "Temperature"], ans: 2, exp: "Velocity has both magnitude and direction — it's a vector" },
  { subject: "Maths Paper-IA", q: "What is the order of a 2×3 matrix?", opts: ["2", "3", "2×3", "3×2"], ans: 2, exp: "Order is rows × columns = 2×3" },
  { subject: "Maths Paper-IB", q: "Slope of line through (1,2) and (3,6) is:", opts: ["1", "2", "4", "1/2"], ans: 1, exp: "m = (6-2)/(3-1) = 4/2 = 2" },
  { subject: "Maths Paper-IB", q: "d/dx(x⁵) = ?", opts: ["5x⁴", "x⁴", "5x⁵", "4x⁵"], ans: 0, exp: "Power rule: d/dx(xⁿ) = n·xⁿ⁻¹ → 5x⁴" },
  { subject: "Maths Paper-IB", q: "Distance between (1,2) and (4,6) is:", opts: ["5", "4", "7", "25"], ans: 0, exp: "d = √[(4-1)²+(6-2)²] = √(9+16)=√25=5" },
  { subject: "Maths Paper-IB", q: "lim(x→0) sin x / x = ?", opts: ["0", "1", "∞", "undefined"], ans: 1, exp: "Standard limit: lim(x→0) sin x / x = 1" },
  { subject: "Maths Paper-IB", q: "Which is a scalar quantity?", opts: ["Force", "Velocity", "Speed", "Acceleration"], ans: 2, exp: "Speed has only magnitude, no direction" },
  { subject: "Economics", q: "GDP = ?", opts: ["C+I+G+(X-M)", "C+I+G", "C+I", "C+G+X"], ans: 0, exp: "GDP = Consumption + Investment + Govt Spending + Net Exports" },
  { subject: "Economics", q: "When Ed > 1, demand is:", opts: ["Inelastic", "Elastic", "Unit elastic", "Perfectly inelastic"], ans: 1, exp: "Ed > 1 means demand changes more than price → elastic" },
  { subject: "Economics", q: "CRR = 10% → Money Multiplier = ?", opts: ["10", "5", "20", "1"], ans: 0, exp: "Multiplier = 1/CRR = 1/0.10 = 10" },
  { subject: "Economics", q: "Who gave the 'Law of Demand'?", opts: ["Marshall", "Keynes", "Adam Smith", "Ricardo"], ans: 0, exp: "Alfred Marshall propounded the Law of Demand" },
  { subject: "Economics", q: "Inflation target of RBI is:", opts: ["2%", "4%", "6%", "8%"], ans: 1, exp: "RBI inflation target is 4% with ±2% tolerance band" },
  { subject: "Commerce", q: "Sole Proprietorship has:", opts: ["Limited liability", "Unlimited liability", "Separate legal entity", "Perpetual succession"], ans: 1, exp: "Sole proprietor has unlimited personal liability" },
  { subject: "Commerce", q: "Which is NOT a type of trade?", opts: ["Wholesale", "Retail", "Export", "Production"], ans: 3, exp: "Production is not a type of trade; trade involves buying/selling" },
  { subject: "Commerce", q: "MSME: Micro enterprise investment limit:", opts: ["≤ ₹1 cr", "≤ ₹10 cr", "≤ ₹50 cr", "≤ ₹5 cr"], ans: 0, exp: "Micro: Investment ≤ ₹1 crore" },
  { subject: "Commerce", q: "E-commerce B2C example:", opts: ["Amazon", "Alibaba", "OLX", "eBay"], ans: 0, exp: "Amazon sells to consumers → B2C" },
  { subject: "Commerce", q: "Joint Stock Company features:", opts: ["Unlimited liability", "No separate entity", "Separate legal entity", "Only 5 members"], ans: 2, exp: "Company has separate legal entity distinct from its members" },
  { subject: "Accountancy", q: "Accounting Equation: Assets = ?", opts: ["Liabilities + Capital", "Liabilities - Capital", "Capital - Liabilities", "Expenses + Income"], ans: 0, exp: "Assets = Liabilities + Capital (fundamental equation)" },
  { subject: "Accountancy", q: "Paid salary ₹5000. Which account rule?", opts: ["Real", "Personal", "Nominal", "None"], ans: 2, exp: "Salary is an expense → Nominal account: Debit expenses" },
  { subject: "Accountancy", q: "Depreciation SLM: Cost ₹1L, Scrap ₹10K, Life 10 yrs → Annual Dep = ?", opts: ["₹10,000", "₹9,000", "₹11,000", "₹5,000"], ans: 1, exp: "(1,00,000 - 10,000)/10 = ₹9,000 per year" },
  { subject: "Accountancy", q: "BRS: Cheque issued but not presented →", opts: ["Add to Cash Book", "Subtract from Cash Book", "Add to Pass Book", "No adjustment"], ans: 0, exp: "Add to Cash Book balance to reach Pass Book balance" },
  { subject: "Accountancy", q: "Bills of Exchange: Days of grace = ?", opts: ["1", "2", "3", "7"], ans: 2, exp: "3 days of grace are added to the bill term" },
];

// ---------- FLASHCARD HELPERS ----------
const FC_BOXES = [1, 2, 3];
const FC_INTERVALS = [0, 1, 3, 7];

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
const LS = { cfg: "mec_cfg", logs: "mec_logs", chat: "mec_chat", streak: "mec_streak", lastDay: "mec_lastday",
  flashcards: "mec_fc", quizScores: "mec_quiz", pomodoros: "mec_pomo", focusTotal: "mec_focus", voiceNotes: "mec_voice" };
let cfg = JSON.parse(localStorage.getItem(LS.cfg) || "null");
let session = { pinHash: sessionStorage.getItem("mec_pin") || null, unlocked: false };
let state = {
  lang: (cfg && cfg.lang) || "hi", view: "home", online: navigator.onLine,
  logs: JSON.parse(localStorage.getItem(LS.logs) || "[]"),
  chat: JSON.parse(localStorage.getItem(LS.chat) || "[]"),
  pendingFiles: [],
  flashcards: JSON.parse(localStorage.getItem(LS.flashcards) || "[]"),
  quizScores: JSON.parse(localStorage.getItem(LS.quizScores) || "[]"),
  pomodoros: parseInt(localStorage.getItem(LS.pomodoros) || "0"),
  focusTotal: parseInt(localStorage.getItem(LS.focusTotal) || "0"),
  voiceNotes: JSON.parse(localStorage.getItem(LS.voiceNotes) || "[]"),
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
  return cfg && cfg.studentName ? cfg.studentName : "Student";
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
  const app = document.getElementById("app");
  app.innerHTML = `<div class="flex min-h-dvh items-center justify-center"><div class="text-center"><div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-600 text-3xl text-white shadow-lg animate-pulse">🎓</div><p class="mt-4 text-sm text-slate-500">Loading MEC Study Buddy...</p></div></div>`;
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
  const views = { home: HomeView, subjects: SubjectsView, today: TodayView, exam: ExamView, chat: ChatView, tricks: TricksView, mcq: MCQView, flashcards: FlashcardsView, pomodoro: PomodoroView, progress: ProgressView, doubts: DoubtsView, tools: ToolsView };
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
        <button id="langBtn" class="shrink-0 rounded-full border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800">
          ${state.lang === "hi" ? "🇮🇳 Hinglish" : "🇬🇧 English"}</button>
      </div></header>`);
  h.querySelector("#langBtn").onclick = () => {
    state.lang = state.lang === "hi" ? "en" : "hi"; cfg.lang = state.lang; saveLS(LS.cfg, cfg); render();
  };
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

// ===================================================================
//  MCQ QUIZ VIEW
// ===================================================================
function MCQView() {
  const T = t();
  const wrap = el(`<div class="space-y-4"><div><h2 class="px-1 text-lg font-bold">📝 ${T.mcqTitle}</h2>
    <p class="px-1 text-xs text-slate-500 dark:text-slate-400">${T.mcqHint}</p></div></div>`);

  const saved = state.quizScores || [];
  const avg = saved.length ? Math.round(saved.reduce((a,b)=>a+b,0)/saved.length) : 0;

  wrap.appendChild(el(`<div class="grid grid-cols-3 gap-2">${StatCard(T.mcqTotal, saved.length, "📋")}${StatCard(T.mcqAccuracy, avg + "%", "🎯")}${StatCard(T.classesLogged, saved.filter(s=>s>=80).length, "🏆")}</div>`));

  const subjGrid = el(`<div class="grid grid-cols-2 gap-2"></div>`);
  SUBJECTS.forEach(s => {
    const prev = saved.filter(sc => sc.subject === s.name).length;
    const card = el(`<button class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-center hover:shadow-md transition">
      <span class="text-2xl">${s.icon}</span><p class="mt-1 text-xs font-bold">${s.name}</p>
      <p class="text-[10px] text-slate-400">${prev} tests done</p></button>`);
    card.onclick = () => startMCQ(s.name);
    subjGrid.appendChild(card);
  });
  wrap.appendChild(subjGrid);

  // AI Question Generator
  const aiBtn = el(`<button class="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 py-2.5 text-sm font-semibold text-white">🤖 ${T.mcqGenByAI}</button>`);
  aiBtn.onclick = () => { go("chat"); setTimeout(() => sendMessage(state.lang === "hi"
    ? "Mujhe MEC subjects ke 10 MCQ questions do with answers and explanation"
    : "Give me 10 MCQ questions on MEC subjects with answers and explanation"), 60); };
  wrap.appendChild(aiBtn);

  return wrap;
}

function startMCQ(subject) {
  const T = t();
  const questions = MCQ_BANK.filter(q => q.subject === subject);
  if (!questions.length) { alert("No questions for this subject yet!"); return; }
  let idx = 0, correct = 0, wrong = 0, answered = false;
  const wrap = el(`<div class="space-y-4"></div>`);
  const card = el(`<div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3"></div>`);

  function renderQuestion() {
    card.innerHTML = "";
    if (idx >= questions.length) return showResult();
    const q = questions[idx];
    card.appendChild(el(`<div class="flex items-center justify-between"><span class="text-[11px] font-semibold text-teal-600">${subject}</span><span class="text-[11px] text-slate-400">${idx+1}/${questions.length}</span></div>`));
    card.appendChild(el(`<p class="text-sm font-bold">${q.q}</p>`));
    const optsDiv = el(`<div class="space-y-1.5"></div>`);
    q.opts.forEach((o, i) => {
      const btn = el(`<button class="opt-btn w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition">${String.fromCharCode(65+i)}. ${o}</button>`);
      btn.onclick = () => {
        if (answered) return;
        answered = true;
        document.querySelectorAll(".opt-btn").forEach(b => b.style.pointerEvents = "none");
        if (i === q.ans) { correct++; btn.classList.replace("border-slate-200", "border-emerald-500"); btn.classList.add("bg-emerald-50","dark:bg-emerald-900/30"); }
        else { wrong++; btn.classList.replace("border-slate-200", "border-rose-500"); btn.classList.add("bg-rose-50","dark:bg-rose-900/30");
          const correctBtn = document.querySelectorAll(".opt-btn")[q.ans];
          if (correctBtn) { correctBtn.classList.replace("border-slate-200", "border-emerald-500"); correctBtn.classList.add("bg-emerald-50","dark:bg-emerald-900/30"); } }
        const expDiv = el(`<div class="rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 p-2.5"><p class="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">💡 ${T.mcqExplain}</p><p class="text-[11px] mt-0.5 text-slate-600 dark:text-slate-300">${q.exp}</p></div>`);
        card.appendChild(expDiv);
        nextBtn.classList.remove("hidden");
      };
      optsDiv.appendChild(btn);
    });
    card.appendChild(optsDiv);
    const nextBtn = el(`<button class="next-btn hidden w-full rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 py-2.5 text-sm font-semibold text-white">${idx < questions.length-1 ? T.mcqNext : T.mcqResult}</button>`);
    nextBtn.onclick = () => { idx++; answered = false; renderQuestion(); };
    card.appendChild(nextBtn);
  }

  function showResult() {
    const pct = Math.round(correct/questions.length*100);
    const grade = pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "💪";
    card.innerHTML = `<div class="text-center py-4 space-y-3"><div class="text-5xl">${grade}</div>
      <h3 class="text-lg font-bold">${T.mcqResult}</h3>
      <div class="grid grid-cols-3 gap-2">${StatCard(T.mcqCorrect, correct, "✅")}${StatCard(T.mcqWrong, wrong, "❌")}${StatCard(T.mcqAccuracy, pct+"%", "🎯")}</div>
      <button class="retry-btn w-full rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 py-2.5 text-sm font-semibold text-white">${T.mcqRetry}</button>
      <button class="back-btn w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 text-sm font-semibold">← ${T.back}</button></div>`;
    card.querySelector(".retry-btn").onclick = () => { state.view = "mcq"; startMCQ(subject); };
    card.querySelector(".back-btn").onclick = () => go("mcq");
    const scores = state.quizScores || [];
    scores.push({ subject, score: pct, date: new Date().toISOString() });
    state.quizScores = scores;
    saveLS(LS.quizScores, scores);
  }

  renderQuestion();
  const app = document.getElementById("app");
  const main = app.querySelector("main") || app;
  const backBtn = el(`<button class="mb-2 text-xs text-slate-500 hover:underline" onclick="go('mcq')">← ${T.mcqTitle}</button>`);
  main.innerHTML = ""; main.appendChild(backBtn); main.appendChild(card);
  window.scrollTo({ top: 0 });
}

// ===================================================================
//  FLASHCARDS VIEW
// ===================================================================
function FlashcardsView() {
  const T = t();
  const wrap = el(`<div class="space-y-4"><div><h2 class="px-1 text-lg font-bold">🃏 ${T.fcTitle}</h2>
    <p class="px-1 text-xs text-slate-500 dark:text-slate-400">${T.fcHint}</p></div></div>`);

  const cards = state.flashcards || [];
  const due = cards.filter(c => new Date(c.nextReview) <= new Date());
  const total = cards.length;

  // Stats
  wrap.appendChild(el(`<div class="grid grid-cols-3 gap-2">${StatCard(T.fcDue, due.length, "📖")}${StatCard(T.fcBox+" 1", cards.filter(c=>c.box===1).length, "🟢")}${StatCard(T.mcqTotal, total, "🃏")}</div>`));

  // Review section
  const reviewSec = el(`<div class="space-y-2"></div>`);
  if (due.length) {
    let dueIdx = 0;
    const reviewCard = el(`<div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-center space-y-3 min-h-[200px] flex flex-col items-center justify-center"></div>`);

    function showCard() {
      if (dueIdx >= due.length) { reviewCard.innerHTML = `<div class="py-6 text-center"><div class="text-4xl">🎉</div><p class="mt-2 text-sm font-bold">${T.fcDone}</p></div>`; return; }
      const c = due[dueIdx];
      reviewCard.innerHTML = `<p class="text-[11px] font-semibold text-teal-600">${c.subject} · ${T.fcBox} ${c.box}</p>
        <p class="text-sm font-bold mt-1" id="fcFront">${c.front}</p>
        <div id="fcBack" class="hidden mt-1"><div class="rounded-xl bg-slate-100 dark:bg-slate-800 p-3"><p class="text-xs">${c.back}</p></div></div>
        <button id="fcFlipBtn" class="rounded-full bg-gradient-to-r from-teal-500 to-indigo-600 px-6 py-2 text-xs font-semibold text-white">${T.fcFlip}</button>
        <div id="fcRating" class="hidden flex gap-2 mt-2">
          <button data-days="7" class="flex-1 rounded-xl bg-emerald-500 py-2 text-xs font-semibold text-white">${T.fcEasy}</button>
          <button data-days="1" class="flex-1 rounded-xl bg-amber-500 py-2 text-xs font-semibold text-white">${T.fcMedium}</button>
          <button data-days="0" class="flex-1 rounded-xl bg-rose-500 py-2 text-xs font-semibold text-white">${T.fcHard}</button>
        </div>`;
      reviewCard.querySelector("#fcFlipBtn").onclick = () => {
        document.getElementById("fcBack").classList.remove("hidden");
        document.getElementById("fcFlipBtn").classList.add("hidden");
        document.getElementById("fcRating").classList.remove("hidden");
      };
      reviewCard.querySelectorAll("#fcRating button").forEach(b => {
        b.onclick = () => {
          const days = parseInt(b.dataset.days);
          const c2 = state.flashcards.find(x => x.id === c.id);
          if (c2) {
            c2.box = days === 0 ? 1 : Math.min(c2.box + 1, 3);
            c2.nextReview = new Date(Date.now() + (days || FC_INTERVALS[c2.box] || 1) * 86400000).toISOString();
            c2.timesReviewed = (c2.timesReviewed || 0) + 1;
          }
          saveLS(LS.flashcards, state.flashcards);
          dueIdx++;
          showCard();
        };
      });
    }
    showCard();
    reviewSec.appendChild(reviewCard);
  } else {
    reviewSec.appendChild(el(`<div class="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 text-center"><div class="text-4xl">✅</div><p class="mt-2 text-sm font-bold">${T.fcDone}</p><p class="text-xs text-slate-400">${total ? "Come back later!" : T.fcEmpty}</p></div>`));
  }
  wrap.appendChild(reviewSec);

  // Add new card form
  const addSec = el(`<div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
    <h3 class="text-sm font-bold">➕ ${T.fcAddNew}</h3>
    <select id="fcSubj" class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2">${SUBJECTS.map(s => `<option value="${s.name}">${s.icon} ${s.name}</option>`).join("")}</select>
    <input id="fcFrontInp" placeholder="${T.fcFrontLabel}" class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2">
    <textarea id="fcBackInp" rows="2" placeholder="${T.fcBackLabel}" class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2"></textarea>
    <button id="fcAddBtn" class="w-full rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 py-2.5 text-sm font-semibold text-white">${T.fcAdd}</button></div>`);
  addSec.querySelector("#fcAddBtn").onclick = () => {
    const subj = addSec.querySelector("#fcSubj").value;
    const front = addSec.querySelector("#fcFrontInp").value.trim();
    const back = addSec.querySelector("#fcBackInp").value.trim();
    if (!front || !back) return;
    state.flashcards.push({ id: Date.now(), subject: subj, front, back, box: 1, nextReview: new Date().toISOString(), timesReviewed: 0 });
    saveLS(LS.flashcards, state.flashcards);
    addSec.querySelector("#fcFrontInp").value = ""; addSec.querySelector("#fcBackInp").value = "";
    go("flashcards");
  };
  wrap.appendChild(addSec);

  // All cards list
  if (total) {
    const list = el(`<div class="space-y-1"><h3 class="px-1 text-xs font-semibold text-slate-400">${T.mcqTotal}: ${total}</h3></div>`);
    cards.forEach(c => {
      list.appendChild(el(`<div class="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5">
        <span class="shrink-0 text-lg">${(SUBJECTS.find(s=>s.name===c.subject)||{}).icon||"📘"}</span>
        <div class="min-w-0 flex-1"><p class="truncate text-xs font-semibold">${c.front}</p><p class="text-[10px] text-slate-400">${T.fcBox} ${c.box} · ${new Date(c.nextReview) <= new Date() ? "🔴 Due" : "✅ Reviewed"}</p></div>
        <button class="del-fc text-[10px] text-rose-400 hover:text-rose-600" data-id="${c.id}">✕</button></div>`));
    });
    list.querySelectorAll(".del-fc").forEach(b => b.onclick = () => {
      state.flashcards = state.flashcards.filter(x => x.id !== parseInt(b.dataset.id));
      saveLS(LS.flashcards, state.flashcards); go("flashcards");
    });
    wrap.appendChild(list);
  }

  return wrap;
}

// ===================================================================
//  POMODORO TIMER VIEW
// ===================================================================
let _pomoInterval = null;
const POMO_WORK = 25 * 60;
const POMO_BREAK = 5 * 60;

function PomodoroView() {
  const T = t();
  let timeLeft = POMO_WORK, isWork = true, running = false;

  const wrap = el(`<div class="space-y-4"><div><h2 class="px-1 text-lg font-bold">⏱ ${T.pomTitle}</h2>
    <p class="px-1 text-xs text-slate-500 dark:text-slate-400">${T.pomHint}</p></div></div>`);

  // Stats
  wrap.appendChild(el(`<div class="grid grid-cols-2 gap-2">${StatCard(T.pomSessions, state.pomodoros, "🍅")}${StatCard(T.progFocusHours, Math.floor(state.focusTotal/60)+"h "+state.focusTotal%60+"m", "🔥")}</div>`));

  const timerCard = el(`<div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center space-y-4">
    <p id="pomoPhase" class="text-xs font-semibold text-teal-600 uppercase tracking-wide">${T.pomWork}</p>
    <div id="pomoDisplay" class="text-6xl font-extrabold tabular-nums">25:00</div>
    <div class="flex justify-center gap-3">
      <button id="pomoStart" class="rounded-full bg-gradient-to-r from-teal-500 to-indigo-600 px-8 py-2.5 text-sm font-semibold text-white">${T.pomStart}</button>
      <button id="pomoReset" class="rounded-full border border-slate-300 dark:border-slate-700 px-6 py-2.5 text-sm font-semibold">${T.pomReset}</button>
    </div></div>`);

  function updateDisplay() {
    const m = String(Math.floor(timeLeft/60)).padStart(2, "0");
    const s = String(timeLeft%60).padStart(2, "0");
    const d = timerCard.querySelector("#pomoDisplay");
    if (d) d.textContent = `${m}:${s}`;
    const ph = timerCard.querySelector("#pomoPhase");
    if (ph) ph.textContent = isWork ? T.pomWork : T.pomBreak;
  }

  timerCard.querySelector("#pomoStart").onclick = () => {
    if (running) {
      running = false;
      clearInterval(_pomoInterval);
      timerCard.querySelector("#pomoStart").textContent = T.pomStart;
      document.title = "MEC Study Buddy";
      return;
    }
    running = true;
    timerCard.querySelector("#pomoStart").textContent = T.pomPause;
    _pomoInterval = setInterval(() => {
      timeLeft--;
      updateDisplay();
      document.title = `${Math.floor(timeLeft/60)}:${String(timeLeft%60).padStart(2,"0")} - Study Buddy`;
      if (timeLeft <= 0) {
        clearInterval(_pomoInterval); running = false;
        if (isWork) {
          state.pomodoros++; localStorage.setItem(LS.pomodoros, state.pomodoros);
          state.focusTotal += POMO_WORK/60; localStorage.setItem(LS.focusTotal, state.focusTotal);
          alert(T.pomComplete);
          isWork = false; timeLeft = POMO_BREAK;
        } else {
          alert(T.pomBreakComplete);
          isWork = true; timeLeft = POMO_WORK;
        }
        updateDisplay();
        timerCard.querySelector("#pomoStart").textContent = T.pomStart;
        document.title = "MEC Study Buddy";
      }
    }, 1000);
  };

  timerCard.querySelector("#pomoReset").onclick = () => {
    clearInterval(_pomoInterval); running = false;
    isWork = true; timeLeft = POMO_WORK;
    updateDisplay();
    timerCard.querySelector("#pomoStart").textContent = T.pomStart;
    document.title = "MEC Study Buddy";
  };

  wrap.appendChild(timerCard);
  return wrap;
}

// ===================================================================
//  PROGRESS DASHBOARD VIEW
// ===================================================================
function ProgressView() {
  const T = t();
  const wrap = el(`<div class="space-y-4"><div><h2 class="px-1 text-lg font-bold">📊 ${T.progTitle}</h2>
    <p class="px-1 text-xs text-slate-500 dark:text-slate-400">${T.progHint}</p></div></div>`);

  const streak = updateStreak();
  const topics = new Set(state.logs.map(l => l.subject + "|" + l.topic)).size;
  const savedScores = state.quizScores || [];
  const avg = savedScores.length ? Math.round(savedScores.reduce((a,b)=>a.score+b.score,0)/savedScores.length) : 0;

  // Stats row
  wrap.appendChild(el(`<div class="grid grid-cols-2 gap-2 sm:grid-cols-4">${StatCard(T.progStreak, streak+" 🔥", "📅")}${StatCard(T.progLogs, state.logs.length, "📚")}${StatCard(T.progTopics, topics, "✅")}${StatCard(T.progQuizScore, avg+"%", "🎯")}</div>`));

  // Focus time
  const focusH = Math.floor(state.focusTotal/60);
  const focusM = state.focusTotal%60;
  wrap.appendChild(el(`<div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
    <h3 class="text-xs font-semibold text-slate-500 mb-2">🔥 ${T.progFocusHours}</h3>
    <p class="text-2xl font-extrabold">${focusH}h ${focusM}m</p>
    <p class="text-[11px] text-slate-400">${T.pomSessions}: ${state.pomodoros}</p></div>`));

  // Weekly activity (simple bar chart)
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const weekData = days.map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6-i));
    return state.logs.filter(l => l.date && new Date(l.date).toDateString() === d.toDateString()).length;
  });
  const maxVal = Math.max(...weekData, 1);
  const chart = el(`<div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
    <h3 class="mb-3 text-xs font-semibold text-slate-500">📊 ${T.progThisWeek}</h3>
    <div class="flex items-end gap-1.5" style="height:80px">${weekData.map((v, i) => `<div class="flex flex-1 flex-col items-center justify-end gap-1"><div class="w-full rounded-t-md bg-gradient-to-t from-teal-500 to-indigo-600 transition-all" style="height:${Math.max(2, (v/maxVal)*70)}px;opacity:${0.4+(v/maxVal)*0.6}"></div><span class="text-[8px] text-slate-400">${days[i].slice(0,2)}</span></div>`).join("")}</div></div>`);
  wrap.appendChild(chart);

  if (!state.logs.length && !savedScores.length && !state.pomodoros) {
    wrap.appendChild(el(`<div class="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center"><div class="text-4xl">📈</div><p class="mt-2 text-sm text-slate-500">${T.progNoData}</p></div>`));
  }

  return wrap;
}

// ===================================================================
//  DOUBT LIBRARY VIEW
// ===================================================================
function DoubtsView() {
  const T = t();
  const wrap = el(`<div class="space-y-4"><div><h2 class="px-1 text-lg font-bold">💡 ${T.doubtTitle}</h2>
    <p class="px-1 text-xs text-slate-500 dark:text-slate-400">${T.doubtHint}</p></div></div>`);

  const chat = state.chat || [];
  const pairs = [];
  for (let i = 0; i < chat.length-1; i += 2) {
    if (chat[i].role === "user" && chat[i+1].role === "assistant") {
      pairs.push({ q: chat[i].content, a: chat[i+1].content, i });
    }
  }

  const searchBox = el(`<div class="flex gap-2"><input id="doubtSearch" placeholder="${T.doubtSearch}" class="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2">
    <button id="doubtClear" class="shrink-0 rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs">✕</button></div>`);
  wrap.appendChild(searchBox);

  const list = el(`<div id="doubtList" class="space-y-2"></div>`);
  function renderDoubts(filter = "") {
    list.innerHTML = "";
    const filtered = filter ? pairs.filter(p => p.q.toLowerCase().includes(filter.toLowerCase()) || p.a.toLowerCase().includes(filter.toLowerCase())) : pairs;
    if (!filtered.length) {
      list.appendChild(el(`<div class="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center"><div class="text-3xl">🔍</div><p class="mt-1 text-xs text-slate-500">${T.doubtEmpty}</p></div>`));
      return;
    }
    filtered.slice(-20).reverse().forEach(p => {
      const card = el(`<div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 space-y-1.5">
        <div class="flex items-start gap-2"><span class="shrink-0 mt-0.5 text-xs">💬</span><p class="text-xs font-semibold">${sanitize(p.q.slice(0,200))}</p></div>
        <div class="flex items-start gap-2 pl-5"><span class="shrink-0 mt-0.5 text-xs">🤖</span><div class="msg-body text-[11px] text-slate-600 dark:text-slate-300">${renderAssistant(p.a.slice(0,300))}</div></div>
      </div>`);
      list.appendChild(card);
    });
  }
  renderDoubts();
  wrap.appendChild(list);

  searchBox.querySelector("#doubtSearch").oninput = (e) => renderDoubts(e.target.value);
  searchBox.querySelector("#doubtClear").onclick = () => {
    searchBox.querySelector("#doubtSearch").value = "";
    renderDoubts();
  };

  return wrap;
}

// ===================================================================
//  TOOLS HUB VIEW
// ===================================================================
function ToolsView() {
  const T = t();
  const wrap = el(`<div class="space-y-4"><div><h2 class="px-1 text-lg font-bold">🧰 ${T.tools}</h2>
    <p class="px-1 text-xs text-slate-500 dark:text-slate-400">All study tools at your fingertips</p></div></div>`);

  const toolCards = [
    { id: "mcq", icon: "📝", label: T.mcqTitle, desc: T.mcqHint, color: "from-orange-500 to-amber-600" },
    { id: "flashcards", icon: "🃏", label: T.fcTitle, desc: T.fcHint, color: "from-teal-500 to-emerald-600" },
    { id: "pomodoro", icon: "⏱", label: T.pomTitle, desc: T.pomHint, color: "from-rose-500 to-red-600" },
    { id: "progress", icon: "📊", label: T.progTitle, desc: T.progHint, color: "from-indigo-500 to-violet-600" },
    { id: "doubts", icon: "💡", label: T.doubtTitle, desc: T.doubtHint, color: "from-purple-500 to-pink-600" },
    { id: "chat", icon: "🤖", label: T.chatTitle, desc: "24x7 AI Professor — ask anything!", color: "from-cyan-500 to-blue-600" },
  ];

  const grid = el(`<div class="grid grid-cols-1 gap-3 sm:grid-cols-2"></div>`);
  toolCards.forEach(t => {
    const card = el(`<div class="cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-md transition">
      <div class="bg-gradient-to-r ${t.color} p-3.5 text-white"><span class="text-2xl">${t.icon}</span><h3 class="mt-1 text-sm font-bold">${t.label}</h3></div>
      <div class="p-3"><p class="text-[11px] text-slate-500 dark:text-slate-400">${t.desc}</p></div></div>`);
    card.onclick = () => { if (t.id === "chat") { go("chat"); return; } go(t.id); };
    grid.appendChild(card);
  });
  wrap.appendChild(grid);

  return wrap;
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

  // Study Tools section
  const toolItems = [
    { v: "mcq", icon: "📝", label: t().mcqTitle, c: "from-orange-400 to-amber-500" },
    { v: "flashcards", icon: "🃏", label: t().fcTitle, c: "from-teal-400 to-emerald-500" },
    { v: "pomodoro", icon: "⏱", label: t().pomTitle, c: "from-rose-400 to-red-500" },
    { v: "progress", icon: "📊", label: t().progTitle, c: "from-indigo-400 to-violet-500" },
    { v: "doubts", icon: "💡", label: t().doubtTitle, c: "from-purple-400 to-pink-500" },
  ];
  const toolsSec = el(`<section><h3 class="mb-2 px-1 text-sm font-bold">🧰 ${t().tools}</h3><div class="grid grid-cols-3 gap-2 sm:grid-cols-5"></div></section>`);
  const tGrid = toolsSec.querySelector("div");
  toolItems.forEach(a => { const b = el(`<button class="flex flex-col items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 hover:shadow-sm transition">
      <span class="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br ${a.c} text-sm text-white">${a.icon}</span>
      <span class="text-[9px] font-semibold text-center leading-tight">${a.label}</span></button>`); b.onclick = () => go(a.v); tGrid.appendChild(b); });
  wrap.appendChild(toolsSec);

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
  _fileList = state.pendingFiles || [];
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
    state.pendingFiles = _fileList;
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
      } catch (er) { console.error("Upload failed:", er); }
    }

    const entry = {
      subject: fd.get("subject"), topic,
      note: sanitize(fd.get("note") || ""),
      date: new Date().toISOString(),
      files: uploaded,
    };
    state.logs.unshift(entry); saveLS(LS.logs, state.logs);
    try { await api("log", { entry }); } catch (e2) {}
    _fileList = []; state.pendingFiles = [];
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
  bar.onsubmit = e => { e.preventDefault(); const v = inp.value.trim(); if (!v) return; inp.value = ""; inp.style.height = "auto"; inp.blur(); sendMessage(v); };
  bar.querySelector("#micBtn").onclick = () => startVoice(inp, bar.querySelector("#micBtn"));
  bar.querySelector("#diagBtn").onclick = () => {
    const v = inp.value.trim(); if (!v) { inp.focus(); return; }
    inp.value = ""; inp.style.height = "auto";
    sendMessage((state.lang === "hi" ? "Is topic ka ek labelled Mermaid diagram banao: " : "Make a labelled Mermaid diagram for: ") + v);
  };
  wrap.appendChild(bar);

  // Send pending message from other views
  if (_pendingSend) { const ps = _pendingSend; _pendingSend = null; setTimeout(() => sendMessage(ps), 100); }

  return wrap;
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
    try { nodes.forEach(n => n.setAttribute('data-processed', 'true')); window.mermaid.run({ nodes }); } catch (e) { console.error("Mermaid render error:", e); }
  } else { setTimeout(runMermaid, 300); }
}

function Bubble(role, content) {
  const me = role === "user";
  return el(`<div class="flex ${me ? "justify-end" : "justify-start"}"><div class="max-w-[88%] rounded-2xl px-3.5 py-2.5 ${me
      ? "bg-gradient-to-br from-teal-500 to-indigo-600 text-white rounded-br-sm" : "bg-slate-100 dark:bg-slate-800 rounded-bl-sm"}">
      <div class="msg-body text-[13px] leading-relaxed">${me ? sanitize(content) : renderAssistant(content)}</div></div></div>`);
}
function scrollChat() { const s = document.getElementById("chatScroll"); if (s) s.scrollTop = s.scrollHeight; }

let _pendingSend = null;

async function sendMessage(text) {
  state.chat.push({ role: "user", content: text });
  if (state.chat.length > MAX_CHAT_HISTORY) state.chat = state.chat.slice(-MAX_CHAT_HISTORY);
  saveLS(LS.chat, state.chat);
  if (state.view !== "chat") { _pendingSend = text; go("chat"); return; }
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
    { v: "today", icon: "📝", label: t().nav.today }, { v: "exam", icon: "🎯", label: t().nav.exam },
    { v: "tools", icon: "🧰", label: t().tools }, { v: "chat", icon: "💬", label: t().nav.chat }];
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

// ---------- BOOT ----------
boot();