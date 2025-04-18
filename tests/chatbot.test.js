import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import { chatWithBot } from '../controllers/chatbotController.js';
import { WebTracker } from '../utils/webTracker.js';

// Mock the WebTracker
jest.mock('../utils/webTracker.js', () => {
  return {
    WebTracker: jest.fn().mockImplementation(() => {
      return {
        trackQuery: jest.fn().mockResolvedValue(undefined),
        trackResponse: jest.fn().mockResolvedValue(undefined),
        getRelevantContent: jest.fn().mockResolvedValue({
          content: [
            {
              text: 'This is a test response',
              source: 'https://example.com',
              relevance: 0.8
            }
          ],
          sources: ['https://example.com']
        })
      };
    })
  };
});

// Mock OpenAI
jest.mock('openai', () => {
  return {
    default: jest.fn().mockImplementation(() => {
      return {
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [
                {
                  message: {
                    content: 'This is an AI-generated response based on the provided context.'
                  }
                }
              ]
            })
          }
        }
      };
    })
  };
});

// Create a test app
const app = express();
app.use(express.json());
app.post('/api/v1/chatbot/chat', chatWithBot);

describe('Chatbot API', () => {
  let webTracker;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create a new instance of WebTracker
    webTracker = new WebTracker();
  });

  test('should return a response when a valid message is provided', async () => {
    // Mock the getRelevantContent method
    webTracker.getRelevantContent.mockResolvedValue({
      content: [
        {
          text: 'This is a test response',
          source: 'https://example.com',
          relevance: 0.8
        }
      ],
      sources: ['https://example.com']
    });

    // Make a request to the chatbot API
    const response = await request(app)
      .post('/api/v1/chatbot/chat')
      .send({ message: 'What is web development?' });

    // Check the response
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.query).toBe('What is web development?');
    expect(response.body.data.response).toContain('AI-generated response');
    expect(response.body.data.sources).toContain('https://example.com');
  });

  test('should return an error when no message is provided', async () => {
    // Make a request to the chatbot API without a message
    const response = await request(app)
      .post('/api/v1/chatbot/chat')
      .send({});

    // Check the response
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Message is required');
  });

  test('should handle errors gracefully', async () => {
    // Mock the getRelevantContent method to throw an error
    webTracker.getRelevantContent.mockRejectedValue(new Error('Test error'));

    // Make a request to the chatbot API
    const response = await request(app)
      .post('/api/v1/chatbot/chat')
      .send({ message: 'What is web development?' });

    // Check the response
    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Test error');
  });
}); 