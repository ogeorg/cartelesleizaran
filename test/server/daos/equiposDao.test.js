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

const equiposDao = require(`${DAOS_ROOT}/equiposDao.js`)(mockDatastore);

describe('Equipos DAO', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetch', () => {
        it('should fetch rows and parse them into a dictionary', async () => {
            // Arrange: Simulate DB rows
            const rows = [
                { equi_name: 'sen:nes:1', equi_data: '{"name": "Neskak", "urls": ["url nes"]}' },
                { equi_name: 'sen:mut:1', equi_data: '{"name": "Mutilak", "urls": ["url mut"]}' }
            ];
            mockConn.query.mockResolvedValue(rows);

            // Act
            const result = await equiposDao.fetch();

            // Assert
            // expect(mockDaoBase.getAll).toHaveBeenCalledWith('equipos');
            expect(result.ok).toBe(true);
            expect(result.data).toEqual({
                'sen:nes:1': {"name": "Neskak", "urls": ["url nes"]},
                'sen:mut:1': {"name": "Mutilak", "urls": ["url mut"]}
            });
            expect(mockConn.release).toHaveBeenCalled();
        });
    });

    describe('save', () => {
        it('should insert data and commit transaction on success', async () => {
            // Arrange
            const inputData = {
                'sen:nes:1': {"name": "Neskak", "urls": ["url nes"]},
                'sen:mut:1': {"name": "Mutilak", "urls": ["url mut"]}
            };
            mockConn.query.mockResolvedValue({ affectedRows: 1 });

            // Act
            const result = await equiposDao.save(inputData);

            // Assert
            expect(mockConn.beginTransaction).toHaveBeenCalled();
            expect(mockConn.query).toHaveBeenNthCalledWith(1,
                expect.any(String),
                ['sen:nes:1', '{"name":"Neskak","urls":["url nes"]}']
            );
            expect(mockConn.query).toHaveBeenNthCalledWith(2,
                expect.any(String),
                ['sen:mut:1', '{"name":"Mutilak","urls":["url mut"]}']
            );
            expect(mockConn.commit).toHaveBeenCalled();
            expect(mockConn.release).toHaveBeenCalled();
            expect(result.ok).toBe(true);
            expect(result.affectedRows).toBe(2);
        });

        it('should rollback and return 0 if a query fails', async () => {
            // Arrange
            const inputData = {
                'sen:nes:1': {"name": "Neskak", "urls": ["url nes"]},
                'sen:mut:1': {"name": "Mutilak", "urls": ["url mut"]}
            };
            mockConn.query.mockRejectedValue(new Error('DB Error'));

            // Act
            const result = await equiposDao.save(inputData);

            // Assert
            expect(mockConn.rollback).toHaveBeenCalled();
            expect(mockConn.release).toHaveBeenCalled();
            expect(result.ok).toBe(false);
            expect(result.error).toBeDefined();
        });
    });
});