const allowedOrigins = require('../../config/allowedOrigins');
require('dotenv').config();

describe('allowedOrigins', () => {
    it('should contain localhost and 127.0.0.1', () => {
      expect(allowedOrigins).toContain('http://localhost:3000');
      expect(allowedOrigins).toContain('http://127.0.0.1:8080');
    });
  });