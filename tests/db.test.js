import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import connectDB from '../database/db.js';

// Mock mongoose
jest.mock('mongoose', () => {
  const originalModule = jest.requireActual('mongoose');
  return {
    ...originalModule,
    connect: jest.fn().mockResolvedValue({}),
    disconnect: jest.fn().mockResolvedValue({}),
  };
});

describe('Database Connection', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('should connect to the database successfully', async () => {
    // Mock console.log to verify it's called
    const consoleSpy = jest.spyOn(console, 'log');
    
    // Call the connectDB function
    await connectDB();
    
    // Verify mongoose.connect was called with the correct parameters
    expect(mongoose.connect).toHaveBeenCalledWith(
      process.env.MONGO_URI,
      { dbName: "Aurora" }
    );
    
    // Verify success message was logged
    expect(consoleSpy).toHaveBeenCalledWith("Database connected successfully.");
  });

  test('should handle database connection errors', async () => {
    // Mock console.log to verify it's called
    const consoleSpy = jest.spyOn(console, 'log');
    
    // Mock mongoose.connect to throw an error
    mongoose.connect.mockRejectedValueOnce(new Error('Connection failed'));
    
    // Call the connectDB function
    await connectDB();
    
    // Verify error message was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error connecting to database",
      expect.any(Error)
    );
  });
}); 