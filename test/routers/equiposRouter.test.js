'use strict';

const request = require('supertest');
const express = require('express');

// 1. Mock the DAO dependency
const mockDaoEquipos = {
    fetch: jest.fn()
};

ROUTERS_ROOT = '../../routes';
const equiposRouter = require(`${ROUTERS_ROOT}/equiposRouter.js`)(mockDaoEquipos);
const app = express();
app.use('/equipos', equiposRouter);

describe('Jornadas router', () => {

    describe('GET /equipos/', () => {

        afterEach(() => {
            jest.clearAllMocks();
        });

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

});