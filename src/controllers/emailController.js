const fs = require("fs");
const Email = require("../models/email");
const emailQueue = require("../queue/queue");
const hybridClassifier = require("../services/classifier/hybridClassifier");


exports.showHome = (req, res) => {
  res.render("index", {
    CLIENT_ID: process.env.CLIENT_ID,
    API_KEY: process.env.API_KEY
  });
};

exports.createEmail = async (req, res) => {
  try {
    const { MessageId, from, date, subject, body } = req.body;

    // 1. Store raw email
    const email = await Email.create({
      MessageId,
      from,
      date,
      subject,
      body,
    });

    // 2. Send job to worker
    await emailQueue.add({
    emailId: email._id,
    emailData: { 
        body,
        subject,
        from
    }
});


    console.log("Email sent to NLP queue:", email._id);

    res.status(200).json({ success: true, email });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.addEmailQueue = async (req, res) => {
  const { emailText } = req.body;

  await emailQueue.add({ emailText });

  res.json({ message: "Email added to queue" });
};

exports.classifyEmailById = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) return res.status(404).json({ message: "Email not found" });

    const result = await hybridClassifier({
  subject: emailData.subject,
  body: emailData.body,
  from: emailData.from
});

    email.companyName = result.companyName;
    email.appliedFrom = result.appliedFrom;
    email.status = result.status;
    email.extractDate = result.date;
    email.confidence = result.confidence;

    await email.save();

    res.json({ success: true, email });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

