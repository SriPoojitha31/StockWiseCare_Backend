import OpenAI from "openai";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { WebTracker } from "../utils/webTracker.js";

// Initialize WebTracker
const webTracker = new WebTracker();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // If using OpenRouter, uncomment and modify the following:
  // baseURL: "https://openrouter.ai/api/v1",
  // defaultHeaders: {
  //   "HTTP-Referer": process.env.APP_URL || "http://localhost:5000",
  //   "X-Title": "Aurora Web Assistant"
  // }
});

export const chatWithBot = catchAsyncErrors(async (req, res, next) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return next(new ErrorHandler("Message is required", 400));
    }

    // Track the user's query
    await webTracker.trackQuery(message);

    // Get relevant web content based on the query
    const relevantContent = await webTracker.getRelevantContent(message);

    // Generate a response based on the relevant content using OpenAI
    const response = await generateResponse(message, relevantContent);

    // Track the response
    await webTracker.trackResponse(message, response);

    res.status(200).json({
      success: true,
      message: "Chat response generated successfully",
      data: {
        query: message,
        response: response,
        sources: relevantContent.sources
      }
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Function to generate a response based on relevant content using OpenAI
async function generateResponse(query, relevantContent) {
  try {
    // Prepare context from relevant content
    let context = "";
    if (relevantContent.content && relevantContent.content.length > 0) {
      context = relevantContent.content.map(item => item.text).join("\n\n");
    }

    // Create a system message that sets the context
    const systemMessage = {
      role: "system",
      content: `You are a helpful web assistant that provides information based on web content. 
      Use the following information to answer the user's question. 
      If the information is not sufficient, acknowledge that and provide a general response.
      
      Context information:
      ${context}`
    };

    // Create the user message
    const userMessage = {
      role: "user",
      content: query
    };

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [systemMessage, userMessage],
      temperature: 0.7,
      max_tokens: 500
    });

    // Extract the response
    const response = completion.choices[0].message.content;

    return response;
  } catch (error) {
    console.error("Error generating response with OpenAI:", error);
    
    // Fallback to a simple response if OpenAI fails
    if (relevantContent.content && relevantContent.content.length > 0) {
      return `Based on the information I found: ${relevantContent.content[0].text}`;
    } else {
      return "I'm having trouble processing your request. Please try again later.";
    }
  }
} 