// controllers/portfolioController.js

const Portfolio = require("../models/Portfolio");
const User = require("../models/User");

// @desc Upload a financial document (e.g., trade receipt, investment proof)
// @route POST /api/portfolio/upload
exports.uploadDocument = async (req, res) => {
  try {
    const { documentType, description } = req.body;
    const file = req.file; // file handled by multer

    if (!file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const newDocument = new Portfolio({
      documentType,
      description,
      filePath: file.path,
      uploadedBy: req.user._id,
    });

    await newDocument.save();

    res.status(201).json({
      message: "Financial document uploaded successfully.",
      document: newDocument,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Error uploading financial document." });
  }
};

// @desc Get all uploaded financial documents by a specific user
// @route GET /api/portfolio/user/:userId
exports.getUserDocuments = async (req, res) => {
  try {
    const { userId } = req.params;

    const documents = await Portfolio.find({ uploadedBy: userId }).sort({ createdAt: -1 });

    res.status(200).json(documents);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch financial documents for user." });
  }
};

// @desc Award badges based on user's financial activity
// @route POST /api/portfolio/award-badge
exports.awardUserBadge = async (req, res) => {
  try {
    const { userId } = req.body;

    const documentCount = await Portfolio.countDocuments({ uploadedBy: userId });

    let badge = null;
    if (documentCount >= 10) badge = "💼 Financial Pro";
    else if (documentCount >= 5) badge = "📈 Smart Investor";
    else if (documentCount >= 1) badge = "📥 Getting Started";

    if (!badge) {
      return res.status(200).json({ message: "No badge earned yet." });
    }

    await User.findByIdAndUpdate(userId, { badge });

    res.status(200).json({ message: `Badge '${badge}' awarded successfully.` });
  } catch (err) {
    console.error("Badge Error:", err);
    res.status(500).json({ error: "Error assigning badge to user." });
  }
};
