// @desc Get analytics based on user’s portfolio (e.g., total uploads, latest activity)
// @route GET /api/portfolio/analytics
const getPortfolioAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalDocs = await Portfolio.countDocuments({ uploadedBy: userId });
    const latestDoc = await Portfolio.findOne({ uploadedBy: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      totalUploads: totalDocs,
      lastUploadDate: latestDoc?.createdAt || null,
      lastDocumentType: latestDoc?.documentType || null,
    });
  } catch (err) {
    console.error("Analytics Error:", err);
    res.status(500).json({ error: "Failed to fetch portfolio analytics." });
  }
};

// @desc Get portfolio user profile & current badge
// @route GET /api/portfolio/details
const getPortfolioDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("name email badge");

    if (!user) return res.status(404).json({ error: "User not found." });

    res.status(200).json({
      name: user.name,
      email: user.email,
      badge: user.badge,
    });
  } catch (err) {
    console.error("Details Error:", err);
    res.status(500).json({ error: "Failed to get portfolio details." });
  }
};

// @desc Update user profile (e.g., badge reset, manual updates)
// @route PUT /api/portfolio/update
const updatePortfolio = async (req, res) => {
  try {
    const updates = req.body;
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Portfolio updated successfully.",
      updatedUser,
    });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Failed to update portfolio." });
  }
};

module.exports = {
  getPortfolioAnalytics,
  getPortfolioDetails,
  updatePortfolio,
};
