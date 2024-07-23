module.exports = {
    testEnvironment: 'node', 
    moduleFileExtensions: ['js', 'json'],
    transform: {}, 
    testMatch: ['**/tests/**/*.test.js'], 
    testTimeout: 30000,
    setupFiles: ['<rootDir>/jest.setup.js'],
};
