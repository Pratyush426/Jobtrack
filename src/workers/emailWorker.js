const emailQueue = require("../queue/queue");
const Email = require("../models/email");
const hybridClassifier = require("../services/classifier/hybridClassifier");
const connectDB = require("../config/db");

// Connect to MongoDB
connectDB();

const { pipeline } = require("@xenova/transformers");

let nerModel = null;

(async () => {
  console.log("⏳ Loading NER model (this will take 5–10 seconds)...");
  nerModel = await pipeline("ner", "Xenova/bert-base-NER");
  global.nerModel = nerModel;
  console.log("✅ NER model loaded and ready!");
})();


console.log("🔥 Worker ready…");
emailQueue.process(async (job) => {
  try {
    const { emailId, emailData } = job.data;

    console.log("📬 Job received:", emailId);

    const result = await hybridClassifier({
    body: emailData.body,
    subject: emailData.subject,
    from: emailData.from
});


    console.log("🧠 Classified:", result);

    await Email.findByIdAndUpdate(
  emailId,
  {
    companyName: result.companyName,
    appliedFrom: result.appliedFrom,
    jobRole: result.jobRole || result.jobrole,
    status: result.status,
    extractDate: result.date,
    confidence: result.confidence,
  },
  { new: true }
);



    console.log("✅ Updated MongoDB for:", emailId);
    return result;

  } catch (err) {
    console.error("❌ ERROR IN WORKER:", err);
    throw err;
  }
});
