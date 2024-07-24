const express = require('express');
const bodyParser = require('body-parser');
const SectionService = require('../services/MenuService');
const menuRoutes = require('../routes/api/menuRoute');
const request = require('supertest');
const app = express();

app.use(bodyParser.json());
app.use('/api/menu', menuRoutes);

let server;

beforeAll(() => {
    server = app.listen(3001, () => {
        console.log('Test server running on port 3001');
    });
});

afterAll(done => {
    server.close(() => {
        console.log('Test server closed');
        done();
    });
});

describe('Menu Controller', () => {
    it('should get all sections', async () => {
        const sections = [{ id: 1, name: 'Section 1' }];
        jest.spyOn(SectionService, 'getSections').mockResolvedValue(sections);

        const res = await request(app).get('/api/menu/').expect(200);
        expect(res.body).toEqual(sections);
    });

    it('should create a section', async () => {
        const newSection = { id: 2, name: 'New Section' };
        jest.spyOn(SectionService, 'createSection').mockResolvedValue(newSection);

        const res = await request(app)
            .post('/api/menu/')
            .send({ name: 'New Section' })
            .expect(200);

        expect(res.body).toEqual(newSection);
    });

    it('should update a section', async () => {
        const updatedSection = { id: 1, name: 'Updated Section' };
        jest.spyOn(SectionService, 'updateSection').mockResolvedValue(updatedSection);

        const res = await request(app)
            .put('/api/menu/1')
            .send({ name: 'Updated Section' })
            .expect(200);

        expect(res.body).toEqual(updatedSection);
    });

    it('should delete a section', async () => {
        jest.spyOn(SectionService, 'deleteSection').mockResolvedValue(true);

        const res = await request(app).delete('/api/menu/1').expect(200);
        expect(res.body).toEqual({ success: true });
    });
});
