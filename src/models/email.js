const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  MessageId: { type: String, required: true },
  from: String,
  date: String,
  subject: String,
  body: String,

  // Hybrid classifier fields
  companyName: { type: String, default: "unknown" },
  appliedFrom: { type: String, default: "unknown" },
  status: { type: String, default: "unknown" },

  extractDate: { type: String, default: null },
  confidence: { type: Number, default: 0 },

  // Optional (keep if needed

  jobRole: { type: String, default: "unknown" }

});

module.exports = mongoose.model("Email", emailSchema);
