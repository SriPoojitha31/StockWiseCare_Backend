import fetch from 'node-fetch';  // Assuming you use node-fetch to fetch data
import ErrorHandler from '../utils/errorHandler.js';

// Fetch AI-driven news or insights for the browser extension
export const getExtensionInsights = async (req, res, next) => {
  try {
    // Here, we'll mock fetching data from an external API or AI service
    const apiUrl = 'https://api.example.com/ai-news';  // Replace with your actual endpoint

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || data.length === 0) {
      throw new BadRequestError('No AI news found.');
    }

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
