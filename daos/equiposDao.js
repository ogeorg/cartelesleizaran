module.exports = function (datastore) {
    if (datastore.kind == 'GoogleDatastore')
        return GDSEquiposDao(datastore);
    else if (datastore.kind == 'MariaDB')
        return MDBEquiposDao(datastore);
    else
        throw new Error("Not implemented");
}

function GDSEquiposDao(datastore) {
    let daoBase = require('./baseDao.js')(datastore);

    var module = {};

    const KIND_EQUIPOS = 'equipos';

    module.fetch = async function () {
        return await daoBase.getOne(KIND_EQUIPOS);
    }

    module.save = async function (data) {
        console.log("--saveEquipos--");
        const key = datastore.key([KIND_EQUIPOS, 'equipos']);
        const entity = { key, data, excludeFromIndexes: ['equipos'] };
        try {
            var res = await datastore.save(entity);
            return res;
        } catch (err) {
            console.error(err);
        }
    }

    return module;

}

function MDBEquiposDao(datastore) {
    let baseDao = require('./baseDao.js')(datastore);

    var module = {};

    const TABLE = 'equipos';

    module.fetch = async function () {
        // 1) get all equipos (clave, data)
        let result = await baseDao.getAll(TABLE);

        // 2) put into a dict
        if (result.ok) {
            const res = {};
            for(let row of result.data) {
                res[row.equi_name] =  JSON.parse(row.equi_data);
            }
            return { ok: true, data: res };
        } else 
            return result;
    }

    module.save = async function (equipos) {
        console.log("--saveEquipos--");
        let conn;
        try {
            conn = await datastore.getConnection();
            await conn.beginTransaction();

            let changeCount = 0
            for (let name in equipos) {
                let data = JSON.stringify(equipos[name]);
                const query = `INSERT INTO ${TABLE} (equi_name, equi_data) VALUES (?, ?) ON DUPLICATE KEY UPDATE equi_data = VALUES(equi_data);`;
                const result = await conn.query(query, [name, data]);
                changeCount += result.affectedRows;
                console.log(result);
            }

            await conn.commit();
            return {affectedRows: changeCount};
        } catch (err) {
            if (conn) await conn.rollback();
            console.error(err);
            return {affectedRows: 0};
        } finally {
            if (conn) conn.release(); // IMPORTANT: Release connection back to pool
        }
    }

    return module;
}

