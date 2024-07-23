const config = require('../../config/config.json');
require('dotenv').config();

describe('config.json', () => {
  it('should have development configuration', () => {
    expect(config.development).toHaveProperty('username', 'user');
    expect(config.development).toHaveProperty('password', 'admin');
    expect(config.development).toHaveProperty('database', 'marketplace');
    expect(config.development).toHaveProperty('host', 'localhost');
    expect(config.development).toHaveProperty('dialect', 'postgres');
  });

  it('should have test configuration', () => {
    expect(config.test).toHaveProperty('username', 'user');
    expect(config.test).toHaveProperty('password', 'admin');
    expect(config.test).toHaveProperty('database', 'marketplace_test');
    expect(config.test).toHaveProperty('host', 'localhost');
    expect(config.test).toHaveProperty('dialect', 'postgres');
  });

  it('should have production configuration', () => {
    expect(config.production).toHaveProperty('username', 'user');
    expect(config.production).toHaveProperty('password', 'admin');
    expect(config.production).toHaveProperty('database', 'marketplace');
    expect(config.production).toHaveProperty('host', 'localhost');
    expect(config.production).toHaveProperty('dialect', 'postgres');
  });
});
