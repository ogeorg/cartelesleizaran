'use strict';

const request = require('supertest');
const express = require('express');

// 1. Mock the DAO dependency
const mockDaoJornadas = {
    fetch: jest.fn(),
    save: jest.fn()
};

// 2. Setup a mini Express app for the test
ROUTERS_ROOT = '../../routes';
const jornadasRouter = require(`${ROUTERS_ROOT}/jornadasRouter.js`)(mockDaoJornadas);
const app = express();
app.use(express.json()); // Mock app needs this too!

app.use((err, req, res, next) => {
  res.status(500).json({ error: err });
});

app.use('/jornadas', jornadasRouter);

describe('Jornadas router', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /jornadas/', () => {

        it('should return 200 and a JSON list of jornadas', async () => {
            // Arrange: What the DAO should return
            const daoMockData = {
                ok: true,
                data: {
                    1: { name: 'jornada 1', data: 'data 1' },
                    2: { name: 'jornada 2', data: 'data 2' },
                }
            };
            mockDaoJornadas.fetch.mockResolvedValue(daoMockData);

            // When
            const response = await request(app).get('/jornadas');
            const expectedBody = daoMockData.data;

            // Assert
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/json/);

            // Check if the body matches the mock data
            expect(response.body).toEqual(expectedBody);

            // Verify the DAO was actually called
            expect(mockDaoJornadas.fetch).toHaveBeenCalledTimes(1);
        });
    });
    describe('POST /jornadas/', () => {

        it('should save the jornada', async () => {
            const clave = 1;
            const receivedData = { name: 'jornada 1', data: 'data 1' };

            mockDaoJornadas.save.mockResolvedValue({ ok: true, affectedRows: 1 });

            // When
            const response = await request(app).post('/jornadas/1').send(receivedData);

            // Then
            expect(response.status).toBe(200);
        });

        it('should handle errors and return 500', async () => {
            const clave = 1;
            const receivedData = { name: 'jornada 1', data: 'data 1' };
            mockDaoJornadas.save.mockResolvedValue({ ok: false, error: "error msg" });

            // When
            const response = await request(app).post('/jornadas/1').send(receivedData);

            // Then
            expect(response.status).toBe(500);
            expect(response.body.error).toEqual("error msg");
        });
    });
});
