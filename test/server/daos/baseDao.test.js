'use strict';
DAOS_ROOT = '../../daos';

const mockConn = {
    query: jest.fn(),
    release: jest.fn(),
};

const mockDatastore = {
    kind: 'MariaDB',
    getConnection: jest.fn().mockResolvedValue(mockConn),
};

const baseDao = require(`${DAOS_ROOT}/baseDao.js`)(mockDatastore);

describe('Base DAO', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getAll should return an array of rows', async () => {
        const mockData = [{ id: 1, name: 'Test' }];
        mockConn.query.mockResolvedValue(mockData);

        const result = await baseDao.getAll('my_table');

        // expect(mockConn.query).toHaveBeenCalledWith('SELECT * FROM my_table');
        expect(result.ok).toBe(true);
        expect(result.data).toEqual(mockData);
        expect(mockConn.release).toHaveBeenCalled();
    });

    test('getAllByKey should transform rows into a dictionary', async () => {
        const mockData = [
            { id: 101, name: 'Alpha' },
            { id: 102, name: 'Beta' }
        ];
        mockConn.query.mockResolvedValue(mockData);

        // We want to index by the 'id' column
        const result = await baseDao.getAllByKey('my_table', 'id');

        expect(result.ok).toBe(true);
        expect(result.data).toEqual({
            101: { id: 101, name: 'Alpha' },
            102: { id: 102, name: 'Beta' }
        });
        expect(mockConn.release).toHaveBeenCalled();
    });

    test('should return empty collection and release on DB error', async () => {
        mockConn.query.mockRejectedValue(new Error('Query Failed'));

        const result = await baseDao.getAll('my_table');

        expect(result.ok).toBe(false);
        expect(mockConn.release).toHaveBeenCalled();
    });
});