exports.extractBasicFields = async (email = {}) => {

  const body = (email.body || "");
  const subject = (email.subject || "");
  const from = (email.from || "");

  const text = (subject + " " + body)
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  const rawText = subject + " " + body;

  // ------------------------------------------- //
  // 1. APPLIED VIA DETECTION
  // ------------------------------------------- //
  const platformPatterns = [
    { name: "linkedin", patterns: ["linkedin.com", "jobs-noreply@linkedin", "job-alerts@linkedin"] },
    { name: "naukri", patterns: ["naukri.com", "naukrirecruiter", "apply@im.jobs"] },
    { name: "indeed", patterns: ["indeedmail", "indeed.com", "no-reply@indeed"] },
    { name: "foundit", patterns: ["foundit", "monsterindia", "monster.com"] },
    { name: "workday", patterns: [".workday.com"] },
    { name: "greenhouse", patterns: [".greenhouse.io"] },
    { name: "lever", patterns: [".lever.co"] },
    { name: "icims", patterns: [".icims.com"] },
    { name: "company website", patterns: ["career@", "careers@", "jobs@", "apply@"] }
  ];

  let applied_via = "unknown";

  for (const p of platformPatterns) {
    for (const patt of p.patterns) {
      if (from.toLowerCase().includes(patt) || text.includes(patt)) {
        applied_via = p.name;
        break;
      }
    }
    if (applied_via !== "unknown") break;
  }
if (applied_via === "unknown") applied_via = "company website";
  // ------------------------------------------- //
  // 2. COMPANY NAME EXTRACTION
  // ------------------------------------------- //
  let company = "unknown";

function clean(name = "") {
  return name
    .replace(/[^a-zA-Z0-9 .&()'-]/g, " ")
    .replace(/\b(dear|hello|hi|thanks|regards|sincerely)\b/gi, "")
    .replace(/\b(team|hr|support|careers?|noreply|position|profile|soon|applicant|application|talent|recruitment|recruiter|hiring|jobs?)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const strongPatterns = [
  /\bapplying to ([A-Za-z0-9 &().'-]{1,80})/gi,
  /\bapplying at ([A-Za-z0-9 &().'-]{1,80})/gi,
  /\bapplied to ([A-Za-z0-9 &().'-]{1,80})/gi,
  /\bapplied at ([A-Za-z0-9 &().'-]{1,80})/gi,
  /\bapplication (?:submitted|received) (?:to|at) ([A-Za-z0-9 &().'-]{1,80})/gi,
  /\bon behalf of ([A-Za-z0-9 &().'-]{2,80})/gi,
  /\bsubmitted via ([A-Za-z0-9 &().'-]{2,80})/gi,
  /\bsubmitted through ([A-Za-z0-9 &().'-]{2,80})/gi,
  /\bCompany[: ]+([A-Za-z0-9 &().'-]{2,80})/gi,
  /\bfrom ([A-Z][A-Za-z0-9 &().'-]{2,80})/g,
];

for (let r of strongPatterns) {
  let m = r.exec(rawText);
  if (m) {
    company = clean(m[1]);
    break;
  }
}

if (company === "unknown") {
  const mediumPatterns = [
    /\bfrom ([A-Za-z0-9 &().'-]{2,80})(?=[.,\n\s]|$)/gi,
    /\bat ([A-Za-z0-9 &().'-]{2,80})(?=[.,\n\s]|$)/gi,
    /\bwith ([A-Za-z0-9 &().'-]{2,80})(?=[.,\n\s]|$)/gi,
    /\bby ([A-Za-z0-9 &().'-]{2,80})(?=[.,\n\s]|$)/gi,
    /\bopening at ([A-Za-z0-9 &().'-]{2,80})/gi,
    /\bposition at ([A-Za-z0-9 &().'-]{2,80})/gi,
    /\bopportunity at ([A-Za-z0-9 &().'-]{2,80})/gi
  ];

  for (let r of mediumPatterns) {
    let m = r.exec(rawText);
    if (m) {
      company = clean(m[1]);
      break;
    }
  }
}

if (company === "unknown") {
  const businessRegex =
    /\b([A-Z][A-Za-z0-9 &().'-]+ (?:Pvt\.?|Private|Inc\.?|LLC|Ltd\.?|Limited|LLP|PLC|Technologies|Solutions|Systems|Software|Labs|Corporation|Corp\.?|Group|International|Global|Enterprises|Consultancy))\b/gi;
  const m = rawText.match(businessRegex);
  if (m) company = clean(m[0]);
}

if (company === "unknown") {
  const signatureRegex =
    /\b([A-Z][A-Za-z0-9 &()'-]{2,80})\s+(Recruitment|Hiring|Talent|HR|Team|People|Acquisition|Staffing)\b/gi;
  const m = rawText.match(signatureRegex);
  if (m) company = clean(m[0]);
}

if (company === "unknown") {
  const domainMatch = from.match(/@([a-z0-9.-]+)/i);
  if (domainMatch) {
    let host = domainMatch[1].toLowerCase();
    host = host.replace(/^(careers\.|jobs\.|mail\.|no-reply\.|noreply\.|notifications\.|alerts\.)/, "");
    const parts = host.split(".");
    const possible = parts.length > 1 ? parts[0] : host;

    const blacklist = ["gmail","googlemail","outlook","yahoo","hotmail","protonmail","email","mailer","mail","support","info","notify","notification"];
    if (!blacklist.includes(possible)) {
      company = clean(possible);
    }
  }
}

if (company === "unknown") {
  const knownCompanies = ["Google","Microsoft","Amazon","Flipkart","Wipro","Infosys","TCS","Accenture","Capgemini","Nvidia","Adobe","Meta","Zoho","Swiggy","Zomato","Uber","Dell","Oracle","Salesforce","IBM","EY","PwC","KPMG","Cognizant","Mindtree"];
  const roleBased = rawText.match(new RegExp(knownCompanies.join("|"), "i"));
  if (roleBased) company = clean(roleBased[0]);
}

if (!company || company.length < 2) company = "unknown";

// ------------------------------------------- //
// 3. JOB ROLE EXTRACTION (FINAL FIXED VERSION)
// ------------------------------------------- //

let job_role = "unknown";

// Lowercase helper
const lowerText = rawText.toLowerCase();
const lowerSubject = subject.toLowerCase();

// CLEAN ROLE
function cleanRole(name = "") {
  return name
    .replace(/[^a-zA-Z0-9 .,&()'/-]/g, " ")
    .replace(/\b(at|in|with|for)\s+[A-Z][A-Za-z0-9 &().'-]+$/i, "")
    .replace(/\b(dear|hello|hi|thanks|regards|sincerely)\b/gi, "")
    .replace(/\b(team|support|noreply|application|profile)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// STRONG PATTERNS (case-insensitive)
const strongRolePatterns = [
  /\bposition of ([A-Za-z0-9 /&().,'-]{2,80})/i,
  /\brole of ([A-Za-z0-9 /&().,'-]{2,80})/i,
  /\bfor the position of ([A-Za-z0-9 /&().,'-]{2,80})/i,
  /\bfor the role of ([A-Za-z0-9 /&().,'-]{2,80})/i,
  /\bapplying for the ([A-Za-z0-9 /&().,'-]{2,80})/i,
  /\bapplying for ([A-Za-z0-9 /&().,'-]{2,80})/i,
  /\bapplication for ([A-Za-z0-9 /&().,'-]{2,80})/i,
  /\bopening for ([A-Za-z0-9 /&().,'-]{2,80})/i,
  /\bjob title[: ]+([A-Za-z0-9 /&().,'-]{2,80})/i,
  /\bposition[: ]+([A-Za-z0-9 /&().,'-]{2,80})/i,
  /\brole[: ]+([A-Za-z0-9 /&().,'-]{2,80})/i,
  /\bfor the ([A-Za-z0-9 /&().,'-]{2,80}) position\b/i,
  /\breceived your ([A-Za-z0-9 /&().,'-]{2,80})\b/i,
  /\bfor our ([A-Za-z0-9 /&().,'-]{2,80}) opportunity/i
];

// SUBJECT LINE PATTERNS
const subjectRolePatterns = [
  /for (?:the )?([A-Za-z0-9 /&().,'-]{2,80})(?: role| position)/i,
  /\bapplication for ([A-Za-z0-9 /&().,'-]{2,80})/i,
  /\binterview.*?for ([A-Za-z0-9 /&().,'-]{2,80})/i,
  /\bsubmitted.*?for ([A-Za-z0-9 /&().,'-]{2,80})/i,
];

// DELIMITER BASED
const delimiterRolePatterns = [
  /^([A-Za-z0-9 /&().,'-]{2,80})\s*[–—-]\s*[A-Za-z]/m,
  /^([A-Za-z0-9 /&().,'-]{2,80})\s*\|\s*[A-Za-z]/m,
  /^([A-Za-z0-9 /&().,'-]{2,80})\s*\/\s*[A-Za-z]/m
];

// WEAK FALLBACKS
const weakRolePatterns = [
  /\b([A-Za-z0-9 /&().,'-]{2,100})\s+role\b/i,
  /\b([A-Za-z0-9 /&().,'-]{2,100})\s+position\b/i,
  /\bopening[: ]+([A-Za-z0-9 /&().,'-]{2,100})/i,
  /\btitle[: ]+([A-Za-z0-9 /&().,'-]{2,100})/i
];

// Words that indicate recruiter (not job applied for)
const recruiterWords = [
  "recruiter","talent","acquisition","people","hr",
  "staffing","hiring","coordinator","specialist","advisor"
];


// -------------------
// 1. STRONG PATTERNS
// -------------------
for (let r of strongRolePatterns) {
  r.lastIndex = 0;
  const m = r.exec(rawText);
  if (m) { job_role = cleanRole(m[1]); break; }
}

// ----------------------
// 2. SUBJECT PATTERNS
// ----------------------
if (job_role === "unknown") {
  for (let r of subjectRolePatterns) {
    r.lastIndex = 0;
    const m = r.exec(subject);
    if (m) { job_role = cleanRole(m[1]); break; }
  }
}

// ----------------------
// 3. DELIMITER PATTERNS
// ----------------------
if (job_role === "unknown") {
  for (let r of delimiterRolePatterns) {
    r.lastIndex = 0;
    const m = r.exec(rawText);
    if (m) { job_role = cleanRole(m[1]); break; }
  }
}

// ----------------------
// 4. WEAK FALLBACK
// ----------------------
if (job_role === "unknown") {
  for (let r of weakRolePatterns) {
    r.lastIndex = 0;
    const m = r.exec(rawText);
    if (m) { job_role = cleanRole(m[1]); break; }
  }
}

// ----------------------
// 5. FILTER HR / RECRUITER ROLES
// ----------------------
if (job_role !== "unknown") {
  if (recruiterWords.some(w => job_role.toLowerCase().includes(w))) {
    job_role = "unknown";
  }
}

// FINAL TRIM: keep only first 3 words of job role
if (job_role !== "unknown") {
    job_role = job_role.split(/[\s,.-]+/).slice(0, 3).join(" ");
}

// Reject job-role-like company names
if (company !== "unknown") {
  // must contain at least one uppercase letter
  if (!/[A-Z]/.test(company)) {
    company = "unknown";
  }
}

  // ------------------------------------------- //
  // FINAL RETURN
  // ------------------------------------------- //
  return {
  appliedFrom: applied_via,
  companyName: company,
  jobRole: job_role,
  date: null
};
};
