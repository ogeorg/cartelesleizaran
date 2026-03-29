module.exports = function (datastore) {
    if (datastore.kind == 'GoogleDatastore')
        return GDSParamsDao(datastore);
    else if (datastore.kind == 'MariaDB')
        return MDBParamsDao(datastore);
    else
        throw new Error("Not implemented");
}

function GDSParamsDao(datastore) {
    let daoBase = require('./baseDao.js')(datastore);

    let module = {};

    const KIND_PARAMS = 'params';

    module.saveSet = async function (clave, data) {
        const key = datastore.key([KIND_PARAMS, clave]);
        const entity = { key, data, excludeFromIndexes: ['code'] };
        try {
            let res = await datastore.save(entity);
            return res;
        } catch (err) {
            console.error(err);
        }
    }

    module.getAllByKey = async function () {
        return await daoBase.getAllByKey(KIND_PARAMS);
    }

    return module;
}

function MDBParamsDao(datastore) {
    let baseDao = require('./baseDao.js')(datastore);
    let module = {};
    const TABLE = 'params';


    module.saveSet = async function (clave, data) {
        console.log("-- save params --");
        let conn;
        try {
            conn = await datastore.getConnection();

            /*
            prms_name VARCHAR(20) PRIMARY KEY,
            prms_usedefault BOOLEAN,
            prms_code TEXT,
            prms_offsetright VARCHAR(100),
            prms_offsettop VARCHAR(100)
            */

            const query = `
                INSERT INTO ${TABLE} 
                    (prms_name, prms_usedefault, prms_code, prms_offsetright, prms_offsettop) 
                    VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    prms_usedefault = VALUES(prms_usedefault), 
                    prms_code = VALUES(prms_code), 
                    prms_offsetright = VALUES(prms_offsetright), 
                    prms_offsettop = VALUES(prms_offsettop);`;
            const result = await conn.query(query,
                [clave, data['usedefault'], data['code'], data['offsetright'], data['offsettop']]);
            console.log(result);

            return result;
        } catch (err) {
            console.error(err);
            return { affectedRows: 0 };
        } finally {
            if (conn) conn.release(); // IMPORTANT: Release connection back to pool
        }
    }

    module.getAllByKey = async function () {
        let baseRes = await baseDao.getAllByKey(TABLE, 'prms_name');
        if (baseRes.ok) {
            const newdata = {};
            for (plantilla in baseRes.data) {
                data = baseRes.data[plantilla];
                newdata[plantilla] = {
                    usedefault: data.prms_usedefault,
                    code: data.prms_code,
                    offsetright: data.prms_offsetright,
                    offsettop: data.prms_offsettop,
                };
            }
            return { ok: true, data: newdata };
        }
        else {
            return baseRes;
        }
    }

    return module;
}
