import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../utils/errorHandler.js';

// Get sentiment analysis
export const getSentimentAnalysis = catchAsyncErrors(async (req, res, next) => {
  try {
    // Here you would typically integrate with a sentiment analysis API
    // For demo purposes, we'll return mock data
    const mockData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [65, 59, 80, 81, 56, 55],
      overallSentiment: 'positive',
      confidence: 0.85
    };

    res.status(200).json({
      success: true,
      ...mockData
    });
  } catch (error) {
    return next(new ErrorHandler('Error fetching sentiment analysis', 500));
  }
});

// Get AI recommendations
export const getAIRecommendations = catchAsyncErrors(async (req, res, next) => {
  try {
    // Here you would typically integrate with an AI recommendation system
    // For demo purposes, we'll return mock recommendations
    const mockRecommendations = [
      {
        stock: 'AAPL',
        type: 'BUY',
        reason: 'Strong technical indicators and positive market sentiment',
        confidence: 0.89
      },
      {
        stock: 'GOOGL',
        type: 'HOLD',
        reason: 'Stable performance with potential upside',
        confidence: 0.75
      },
      {
        stock: 'TSLA',
        type: 'SELL',
        reason: 'Increasing market volatility and technical resistance',
        confidence: 0.82
      }
    ];

    res.status(200).json({
      success: true,
      recommendations: mockRecommendations
    });
  } catch (error) {
    return next(new ErrorHandler('Error fetching AI recommendations', 500));
  }
}); 