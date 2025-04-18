import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load test environment variables
dotenv.config({ path: path.join(__dirname, '..', 'config', '.env.test') });

describe('Environment Variables', () => {
  test('should have all required environment variables', () => {
    // Check for required environment variables
    const requiredEnvVars = [
      'PORT',
      'MONGO_URI',
      'JWT_SECRET_KEY',
      'JWT_EXPIRE',
      'COOKIE_EXPIRE',
      'SMTP_HOST',
      'SMTP_SERVICE',
      'SMTP_PORT',
      'SMTP_MAIL',
      'SMTP_PASSWORD'
    ];

    requiredEnvVars.forEach(envVar => {
      expect(process.env[envVar]).toBeDefined();
      expect(process.env[envVar]).not.toBe('');
    });
  });

  test('should have correct test environment values', () => {
    // Check for test environment values
    expect(process.env.PORT).toBe('5001');
    expect(process.env.MONGO_URI).toContain('test_db');
    expect(process.env.JWT_SECRET_KEY).toBe('test_jwt_secret_key');
    expect(process.env.JWT_EXPIRE).toBe('1h');
    expect(process.env.COOKIE_EXPIRE).toBe('1');
    expect(process.env.SMTP_MAIL).toBe('test@example.com');
  });

  test('should have valid port number', () => {
    const port = parseInt(process.env.PORT, 10);
    expect(port).toBeGreaterThan(0);
    expect(port).toBeLessThan(65536);
  });

  test('should have valid MongoDB URI', () => {
    expect(process.env.MONGO_URI).toMatch(/^mongodb:\/\//);
  });
}); 