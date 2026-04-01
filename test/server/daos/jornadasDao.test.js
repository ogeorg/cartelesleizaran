'use strict';
DAOS_ROOT = '../../daos';

// 1. Setup Mock Datastore & Connection
const mockConn = {
    beginTransaction: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn(),
    query: jest.fn(),
    release: jest.fn(),
};

const mockDatastore = {
    kind: 'MariaDB',
    getConnection: jest.fn().mockResolvedValue(mockConn),
};

const jornadasDao = require(`${DAOS_ROOT}/jornadasDao.js`)(mockDatastore);

describe('Jornadas DAO', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetch', () => {
        it('should fetch the config and return them as a dict', async () => {
            // Arrange: Simulate DB rows
            const rows = [
                { jorn_id: 1, jorn_name: 'jornada 1', jorn_data: 'data 1' },
                { jorn_id: 2, jorn_name: 'jornada 2', jorn_data: 'data 2' },
            ];
            mockConn.query.mockResolvedValue(rows);

            // When
            const result = await jornadasDao.fetch();
            const expected =
            {
                ok: true,
                data: {
                    1: { name: 'jornada 1', data: 'data 1' },
                    2: { name: 'jornada 2', data: 'data 2' },
                }
            };

            // Then
            expect(mockConn.release).toHaveBeenCalled();
            expect(result).toEqual(expected);
        });
    });

    describe('save', () => {
        it('should save the config', async () => {
            // Given
            const clave = 1;
            const data = { name: 'jornada 1', data: 'data 1' };
            mockConn.query.mockResolvedValue({ affectedRows: 1 });

            // When
            const result = await jornadasDao.save(clave, data);

            // Then
            expect(mockConn.query).toHaveBeenCalledWith(
                expect.any(String),
                [1, 'jornada 1', 'data 1']
            );
            expect(mockConn.release).toHaveBeenCalled();
            expect(result.ok).toBe(true);
            expect(result.affectedRows).toBe(1);
        });
    });
});