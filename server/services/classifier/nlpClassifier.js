const natural = require("natural");
const fs = require("fs");
const path = require("path");

const MODEL_PATH = path.join(__dirname, "..", "..", "models", "statusClassifier.json");

let classifier = null;

function loadClassifier() {
  if (classifier) return classifier;

  if (fs.existsSync(MODEL_PATH)) {
    const json = JSON.parse(fs.readFileSync(MODEL_PATH, "utf8"));
    classifier = natural.BayesClassifier.restore(json);  // FIXED
    console.log("📌 Loaded trained status classifier");
    return classifier;
  }

  console.log("⚠️ No trained model found → using fallback rule-based NLP");
  return null;
}

exports.classifyStatusNLP = (email = {}) => {
  const text = ((email.subject || "") + "\n" + (email.body || "")).toLowerCase();

  const clf = loadClassifier();

  if (clf) {
    const predictions = clf.getClassifications(text);
    const top = predictions[0];
    return { label: top.label, confidence: top.value };
  }

  // FALLBACK
  const t = text;

  const rules = [
    { label: "spam", confidence: 0.85, keywords: ["register now", "click here", "invoice", "payment", "otp", "promo"] },
    { label: "applied", confidence: 0.95, keywords: ["application received", "thanks for applying", "successfully applied"] },
    { label: "selected", confidence: 0.95, keywords: ["you have been selected", "offer extended", "welcome to the team"] },
    { label: "shortlisted", confidence: 0.9, keywords: ["shortlisted", "moved forward", "next stage"] },
    { label: "interview", confidence: 0.9, keywords: ["interview", "call", "assessment test"] },
    { label: "rejected", confidence: 0.85, keywords: ["regret to inform", "not selected", "unfortunately"] }
  ];

  for (let rule of rules) {
    for (let k of rule.keywords) {
      if (t.includes(k)) return { label: rule.label, confidence: rule.confidence };
    }
  }

  return { label: "other", confidence: 0.5 };
};
