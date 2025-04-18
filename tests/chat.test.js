import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import { chatHandler, getChatHistory } from '../controllers/chatController.js';
import { User } from '../models/userModel.js';
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

// Mock User model
jest.mock('../models/userModel.js', () => {
  return {
    User: {
      findById: jest.fn().mockResolvedValue({
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com'
      })
    }
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
app.post('/api/v1/chat', chatHandler);
app.get('/api/v1/chat/history', getChatHistory);

describe('Chat API', () => {
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

    // Make a request to the chat API
    const response = await request(app)
      .post('/api/v1/chat')
      .send({ message: 'What is web development?', userId: 'user123' });

    // Check the response
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.userMessage.text).toBe('What is web development?');
    expect(response.body.data.botMessage.text).toContain('AI-generated response');
    expect(response.body.data.sources).toContain('https://example.com');
  });

  test('should return an error when no message is provided', async () => {
    // Make a request to the chat API without a message
    const response = await request(app)
      .post('/api/v1/chat')
      .send({ userId: 'user123' });

    // Check the response
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Message is required');
  });

  test('should return an error when user is not found', async () => {
    // Mock User.findById to return null
    User.findById.mockResolvedValueOnce(null);

    // Make a request to the chat API with an invalid user ID
    const response = await request(app)
      .post('/api/v1/chat')
      .send({ message: 'What is web development?', userId: 'invalid_user' });

    // Check the response
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('User not found');
  });

  test('should handle errors gracefully', async () => {
    // Mock the getRelevantContent method to throw an error
    webTracker.getRelevantContent.mockRejectedValue(new Error('Test error'));

    // Make a request to the chat API
    const response = await request(app)
      .post('/api/v1/chat')
      .send({ message: 'What is web development?', userId: 'user123' });

    // Check the response
    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Test error');
  });

  test('should return chat history', async () => {
    // Make a request to get chat history
    const response = await request(app)
      .get('/api/v1/chat/history');

    // Check the response
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.messages)).toBe(true);
  });
}); 