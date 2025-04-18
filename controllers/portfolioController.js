import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import Portfolio from '../models/portfolioModel.js';
import ErrorHandler from '../utils/errorHandler.js';

// Get portfolio analytics
export const getPortfolioAnalytics = catchAsyncErrors(async (req, res, next) => {
  const portfolio = await Portfolio.findOne({ user: req.user._id });
  
  if (!portfolio) {
    return next(new ErrorHandler('Portfolio not found', 404));
  }

  // Calculate portfolio analytics
  const labels = portfolio.history.map(item => item.date);
  const values = portfolio.history.map(item => item.value);

  res.status(200).json({
    success: true,
    labels,
    values,
    totalValue: portfolio.totalValue,
    returns: portfolio.returns
  });
});

// Get portfolio details
export const getPortfolioDetails = catchAsyncErrors(async (req, res, next) => {
  const portfolio = await Portfolio.findOne({ user: req.user._id });
  
  if (!portfolio) {
    return next(new ErrorHandler('Portfolio not found', 404));
  }

  res.status(200).json({
    success: true,
    portfolio
  });
});

// Update portfolio
export const updatePortfolio = catchAsyncErrors(async (req, res, next) => {
  const { stocks, totalValue, returns } = req.body;
  
  let portfolio = await Portfolio.findOne({ user: req.user._id });
  
  if (!portfolio) {
    portfolio = await Portfolio.create({
      user: req.user._id,
      stocks: [],
      totalValue: 0,
      returns: 0,
      history: []
    });
  }

  // Update portfolio data
  portfolio.stocks = stocks || portfolio.stocks;
  portfolio.totalValue = totalValue || portfolio.totalValue;
  portfolio.returns = returns || portfolio.returns;
  
  // Add to history
  portfolio.history.push({
    date: new Date(),
    value: portfolio.totalValue
  });

  await portfolio.save();

  res.status(200).json({
    success: true,
    portfolio
  });
}); 