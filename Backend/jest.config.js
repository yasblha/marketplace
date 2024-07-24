module.exports = {
    testEnvironment: 'node', 
    moduleFileExtensions: ['js', 'json'],
    transform: {}, 
    testMatch: ['**/tests/**/*.test.js'],
    testTimeout: 60000,
    setupFiles: ['<rootDir>/jest.setup.js'],
};
