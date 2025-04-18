import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { User } from '../models/userModel.js';

// Mock the User model
jest.mock('../models/userModel.js', () => ({
  User: {
    findById: jest.fn()
  }
}));

// Mock the ErrorHandler
jest.mock('../middlewares/errorMiddlewares.js', () => {
  return jest.fn().mockImplementation((message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
  });
});

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup mock request, response, and next function
    mockReq = {
      cookies: {}
    };
    mockRes = {};
    mockNext = jest.fn();
  });

  test('should return error if no token is provided', async () => {
    // Call the middleware
    await isAuthenticated(mockReq, mockRes, mockNext);
    
    // Check if next was called with an error
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    expect(mockNext.mock.calls[0][0].message).toBe('User is not authenticated,');
    expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
  });

  test('should return error if token is invalid', async () => {
    // Setup mock request with token
    mockReq.cookies.token = 'invalid_token';
    
    // Mock jwt.verify to throw an error
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });
    
    // Call the middleware
    await isAuthenticated(mockReq, mockRes, mockNext);
    
    // Check if next was called with an error
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  test('should set user in request if token is valid', async () => {
    // Setup mock request with token
    mockReq.cookies.token = 'valid_token';
    
    // Mock jwt.verify to return a decoded token
    const mockDecodedToken = { id: 'user_id' };
    jwt.verify.mockReturnValue(mockDecodedToken);
    
    // Mock User.findById to return a user
    const mockUser = { _id: 'user_id', name: 'Test User' };
    User.findById.mockResolvedValue(mockUser);
    
    // Call the middleware
    await isAuthenticated(mockReq, mockRes, mockNext);
    
    // Check if user was set in request
    expect(mockReq.user).toEqual(mockUser);
    
    // Check if next was called without arguments
    expect(mockNext).toHaveBeenCalledWith();
  });

  test('should return error if user is not found', async () => {
    // Setup mock request with token
    mockReq.cookies.token = 'valid_token';
    
    // Mock jwt.verify to return a decoded token
    const mockDecodedToken = { id: 'user_id' };
    jwt.verify.mockReturnValue(mockDecodedToken);
    
    // Mock User.findById to return null
    User.findById.mockResolvedValue(null);
    
    // Call the middleware
    await isAuthenticated(mockReq, mockRes, mockNext);
    
    // Check if next was called with an error
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });
}); 