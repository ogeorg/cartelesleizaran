'use strict';

const request = require('supertest');
const express = require('express');

// 1. Mock the DAO dependency
const mockDaoParams = {
    getAllByKey: jest.fn(),
    saveSet: jest.fn()
};


ROUTERS_ROOT = '../../routes';
const paramsRouter = require(`${ROUTERS_ROOT}/paramsRouter.js`)(mockDaoParams);
const app = express();
app.use(express.json()); // Mock app needs this too!
app.use('/params', paramsRouter);

describe('Test routes de equipos', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('GET /params', () => {
        it('should return 200 and a JSON list of jornadas', async () => {
            // Arrange: What the DAO should return
            const daoMockData = {
                ok: true,
                data: {
                    plantilla1: { usedefault: false, offsetright: 10, offsettop: 20, code: 'Code 1' },
                    plantilla2: { usedefault: true, offsetright: 30, offsettop: 40, code: 'Code 2' }
                }
            };
            mockDaoParams.getAllByKey.mockResolvedValue(daoMockData);

            // When
            const response = await request(app).get('/params');
            const expectedBody = daoMockData.data;

            // Then
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/json/);
            // Check if the body matches the mock data
            expect(response.body).toEqual(expectedBody);
            // Verify the DAO was actually called
            expect(mockDaoParams.getAllByKey).toHaveBeenCalledTimes(1);

        });
    });

    describe('POST /params/<n>', () => {
        it("should save a given param", async () => {
            // Given
            const receivedClave = 'plantilla1';
            const receivedData = { usedefault: false, offsetright: 10, offsettop:20, code:'Code 1' };
            mockDaoParams.saveSet.mockResolvedValue({ ok: true, affectedRows: 1});
            
            // When
            const response = await request(app).post(`/params/${receivedClave}`).send();

            // Then
            expect(response.status).toEqual(200);
            expect(response.body.message).toBeDefined();
        });

        it("should return 500 on error", async () => {
            // Given
            const receivedClave = 'plantilla1';
            const receivedData = { usedefault: false, offsetright: 10, offsettop:20, code:'Code 1' };
            mockDaoParams.saveSet.mockResolvedValue({ ok: false, error: "msg" });

            // When
            const response = await request(app).post(`/params/${receivedClave}`).send();

            // Then
            expect(response.status).toEqual(500);
        });
    });


});