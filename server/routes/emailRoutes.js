const express = require('express');
const router = express.Router();
const { showHome, createEmail, addEmailQueue, classifyEmailById, getAllEmails } = require("../controllers/emailController");

router.get("/", showHome);

router.post("/create", createEmail);

router.post("/add-email", addEmailQueue);

router.post("/classify/:id", classifyEmailById);

router.get("/all", getAllEmails);

module.exports = router;