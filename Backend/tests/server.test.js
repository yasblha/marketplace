const request = require('supertest');
const { app, server } = require('../server');

describe('Server', () => {
    afterAll((done) => {
        server.close(done);
    });

    it('should return a welcome message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Welcome to my server!');
    });
});
