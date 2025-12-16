const { classifyStatusNLP } = require("./nlpClassifier");
const { extractBasicFields } = require("./fieldExtractor");

module.exports = async function classifyHybrid(email = {}) {
  try {
    // email = { body, subject, from }
    const nlpStatus = classifyStatusNLP(email);

    let finalData = {
  companyName: "",
  appliedFrom: "",
  jobRole: "",
  status: nlpStatus.label,
  confidence: nlpStatus.confidence,
  date: null,
};


    // RULE-BASED EXTRACTION (uses subject, body, from)
    const fields = await extractBasicFields(email);

finalData.companyName = fields.companyName;
finalData.appliedFrom = fields.appliedFrom;
finalData.jobRole = fields.jobRole;
finalData.date = fields.date;

    return finalData;

  } catch (err) {
    console.error("❌ hybridClassifier FAILED:", err);
    throw err;
  }
};
