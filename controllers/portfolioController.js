// controllers/portfolioController.js

const Portfolio = require("../models/Portfolio");
const User = require("../models/User");

// @desc Upload financial document (e.g., trade receipt, investment proof)
// @route POST /api/portfolio/upload
exports.uploadDocument = async (req, res) => {
  try {
    const { documentType, description } = req.body;
    const file = req.file; // e.g., using multer

    const newDocument = new Portfolio({
      documentType,
      description,
      filePath: file.path,
      uploadedBy: req.user._id,
    });

    await newDocument.save();
    res.status(201).json({ message: "Financial document uploaded successfully", document: newDocument });
  } catch (err) {
    res.status(500).json({ error: "Error uploading financial document." });
  }
};

// @desc Get all uploaded financial documents by a user
// @route GET /api/portfolio/user/:userId
exports.getUserDocuments = async (req, res) => {
  try {
    const { userId } = req.params;
    const documents = await Portfolio.find({ uploadedBy: userId });
    res.status(200).json(documents);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user financial documents." });
  }
};

// @desc Award badges based on financial activity (e.g., uploads, interactions)
// @route POST /api/portfolio/award-badge
exports.awardUserBadge = async (req, res) => {
  try {
    const { userId } = req.body;
    const documentCount = await Portfolio.countDocuments({ uploadedBy: userId });

    let badge = null;
    if (documentCount >= 10) badge = "Financial Pro";
    else if (documentCount >= 5) badge = "Smart Investor";
    else if (documentCount >= 1) badge = "Getting Started";

    await User.findByIdAndUpdate(userId, { badge });

    res.status(200).json({ message: `Badge '${badge}' awarded successfully.` });
  } catch (err) {
    res.status(500).json({ error: "Error assigning badge to user." });
  }
};
