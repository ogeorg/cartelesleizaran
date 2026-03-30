'use strict';

const request = require('supertest');
const express = require('express');

// 1. Mock the DAO dependency
const mockDaoEquipos = {
    fetch: jest.fn(),
    save: jest.fn()
};

ROUTERS_ROOT = '../../routes';
const equiposRouter = require(`${ROUTERS_ROOT}/equiposRouter.js`)(mockDaoEquipos);
const app = express();
app.use(express.json()); // Mock app needs this too!
app.use('/equipos', equiposRouter);

describe('Test routes de equipos', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /equipos/', () => {

        it('should return 200 and a JSON list of jornadas', async () => {
            // Arrange: What the DAO should return
            const daoMockData = {
                ok: true,
                data: {
                    1: { name: 'jornada 1', data: 'data 1' },
                    2: { name: 'jornada 2', data: 'data 2' },
                }
            };
            mockDaoEquipos.fetch.mockResolvedValue(daoMockData);

            // When
            const response = await request(app).get('/equipos');
            const expectedBody = daoMockData.data;

            // Then
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/json/);
            // Check if the body matches the mock data
            expect(response.body).toEqual(expectedBody);
            // Verify the DAO was actually called
            expect(mockDaoEquipos.fetch).toHaveBeenCalledTimes(1);

        });
    });

    describe('POST /equipos/', () => {

        it("should save all equipos", async () => {
            // Given
            const receivedData = {
                1: { name: 'jornada 1', data: 'data 1' },
                2: { name: 'jornada 2', data: 'data 2' },
            };
            mockDaoEquipos.save.mockResolvedValue({ ok: true, affectedRows: 2 });

            // When
            const response = await request(app).post('/equipos').send(receivedData);

            // Then
            expect(response.status).toBe(200);
            expect(response.body.message).toBeDefined();
        });


        it("should return 500 if an error", async () => {
            // Given
            const receivedData = {
                1: { name: 'jornada 1', data: 'data 1' },
                2: { name: 'jornada 2', data: 'data 2' },
            };
            mockDaoEquipos.save.mockResolvedValue({ ok: false, error: "error msg" });

            // When
            const response = await request(app).post('/equipos').send(receivedData);

            // Then
            expect(response.status).toBe(500);
            expect(response.body.error).toEqual("error msg");
        });
    });
});
