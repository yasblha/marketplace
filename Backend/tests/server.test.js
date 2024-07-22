const request = require('supertest');
const app = require('../server'); // Assurez-vous que le chemin vers server.js est correct

describe('GET /', () => {
    it('should return status 200 and welcome message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('Welcome to my server!');
    });
});
