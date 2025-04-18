import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import Charity from '../models/charityModel.js';
import ErrorHandler from '../utils/errorHandler.js';

// Get charity analytics
export const getCharityAnalytics = catchAsyncErrors(async (req, res, next) => {
  const charity = await Charity.findOne({ user: req.user._id });
  
  if (!charity) {
    return next(new ErrorHandler('Charity data not found', 404));
  }

  // Calculate distribution
  const distribution = [
    charity.medical,
    charity.education,
    charity.environment,
    charity.other
  ];

  res.status(200).json({
    success: true,
    distribution,
    totalDonated: charity.totalDonated,
    impact: charity.impact
  });
});

// Get charity details
export const getCharityDetails = catchAsyncErrors(async (req, res, next) => {
  const charity = await Charity.findOne({ user: req.user._id });
  
  if (!charity) {
    return next(new ErrorHandler('Charity data not found', 404));
  }

  res.status(200).json({
    success: true,
    charity
  });
});

// Update charity allocation
export const updateCharityAllocation = catchAsyncErrors(async (req, res, next) => {
  const { medical, education, environment, other } = req.body;
  
  let charity = await Charity.findOne({ user: req.user._id });
  
  if (!charity) {
    charity = await Charity.create({
      user: req.user._id,
      medical: 0,
      education: 0,
      environment: 0,
      other: 0,
      totalDonated: 0,
      impact: {
        livesImpacted: 0,
        projectsSupported: 0
      }
    });
  }

  // Update allocation
  charity.medical = medical || charity.medical;
  charity.education = education || charity.education;
  charity.environment = environment || charity.environment;
  charity.other = other || charity.other;

  // Calculate total donated
  charity.totalDonated = charity.medical + charity.education + charity.environment + charity.other;

  // Update impact metrics (simplified example)
  charity.impact = {
    livesImpacted: Math.floor(charity.totalDonated / 100),
    projectsSupported: Math.floor(charity.totalDonated / 1000)
  };

  await charity.save();

  res.status(200).json({
    success: true,
    charity
  });
}); 