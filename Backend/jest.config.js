module.exports = {
    testEnvironment: 'node', 
    moduleFileExtensions: ['js', 'json'],
    transform: {}, 
    testMatch: ['**/__tests__/**/*.test.js'],
    testTimeout: 30000,
    setupFiles: ['<rootDir>/jest.setup.js'],
};
