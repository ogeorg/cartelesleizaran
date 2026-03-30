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

const paramsDao = require(`${DAOS_ROOT}/paramsDao.js`)(mockDatastore);

describe('Parameters DAO', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getAllByKey should transform rows into a dictionary', async () => {
        const mockData = [
            { prms_name : 'plantilla1', prms_usedefault: false, prms_offsetright: 10, prms_offsettop:20, prms_code:'Code 1' },
            { prms_name : 'plantilla2', prms_usedefault: true, prms_offsetright: 30, prms_offsettop:40, prms_code:'Code 2' },
        ];
        mockConn.query.mockResolvedValue(mockData);

        // We want to index by the 'id' column
        const result = await paramsDao.getAllByKey('params', 'prms_name');

        expect(result.ok).toBe(true);
        expect(result.data).toEqual({
            plantilla1: { usedefault: false, offsetright: 10, offsettop:20, code:'Code 1'  },
            plantilla2: { usedefault: true, offsetright: 30, offsettop:40, code:'Code 2' }
        });
        expect(mockConn.release).toHaveBeenCalled();
    });

    test('save params', async () => {
        // Given
        const clave = 'plantilla1';
        const data =  { usedefault: false, code:'Code 1', offsetright: 10, offsettop:20  };
        mockConn.query.mockResolvedValue({ affectedRows: 1 });

        // When
        const result = await paramsDao.saveSet(clave, data);
        const expectedResult = { ok: true, affectedRows: 1 };

        // Then
        expect(mockConn.query).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Array),
            );
        expect(mockConn.release).toHaveBeenCalled();
        expect(result).toEqual(expectedResult);
        const sentParams = mockConn.query.mock.calls[0];
        const sentData = sentParams[1];
        expect(sentData[0]).toBe(clave);
        expect(sentData[1]).toBe(false);
        expect(sentData[2]).toBe('Code 1');
        expect(sentData[3]).toBe(10);
        expect(sentData[4]).toBe(20);
    });


    

    module.save = async function (params) {
        console.log("-- save params --");
        let conn;
        try {
            conn = await datastore.getConnection();
            await conn.beginTransaction();

            /*
            prms_name VARCHAR(20) PRIMARY KEY,
            prms_usedefault BOOLEAN,
            prms_code TEXT,
            prms_offsetright VARCHAR(100),
            prms_offsettop VARCHAR(100)
            */

            let changeCount = 0
            for (let param in params) {
                const query = `
                    INSERT INTO ${TABLE} 
                        (prms_name, prms_usedefault, prms_code, prms_offsetright, prms_offsettop) 
                        VALUES (?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE 
                        prms_usedefault = VALUES(prms_usedefault), 
                        prms_code = VALUES(prms_code), 
                        prms_offsetright = VALUES(prms_offsetright), 
                        prms_offsettop = VALUES(prms_offsettop);`;
                const result = await conn.query(query, [param, data]);
                changeCount += result.affectedRows;
                console.log(result);
            }

            await conn.commit();
            return changeCount;
        } catch (err) {
            if (conn) await conn.rollback();
            console.error(err);
            return 0;
        }
    }

});