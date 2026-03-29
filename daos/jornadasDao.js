module.exports = function (datastore) {
    if (datastore.kind == 'GoogleDatastore')
        return GDSJornadasDao(datastore);
    else if (datastore.kind == 'MariaDB')
        return MDBJornadasDao(datastore);
    else
        throw new Error("Not implemented");
}

function GDSJornadasDao(datastore) {
    var module = {};

    const KIND_JORNADA = 'jornada';

    module.save = async function (clave, data) {
        console.log(datastore.options.projectId);
        const key = datastore.key([KIND_JORNADA, clave]);
        const entity = { key, data, excludeFromIndexes: ['data'] };
        try {
            var res = await datastore.save(entity);
            return res;
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Devuelve todas las jornadas
     * @returns las jornadas en la forma [clave: {name: "nombre", data: "datos de una jornada"}, ...]
     */
    module.fetch = async function () {
        console.log("fetch jornadas with kind ", KIND_JORNADA);
        console.log(datastore.options.projectId);
        const query = datastore.createQuery(KIND_JORNADA);
        var res;
        try {
            res = await datastore.runQuery(query);
        } catch (err) {
            console.log("Error, returning empty dict");
            return {};
        }

        console.log(`fetched ${res.length} values in res`);
        try {
            var list = res[0];
            var configs = {};
            console.log(`fetched ${list.length} values in list`);
            for (var entity of list) {
                var key = entity[datastore.KEY];
                configs[key.name] = { name: entity.name, data: entity.data };
            }
            return configs;
        } catch (err) {
            console.error(err);
        }
    }

    module.delete = async function (clave) {
        const key = datastore.key([KIND_JORNADA, clave]);
        try {
            var res = await datastore.delete(key);
            return res;
        } catch (err) {
            console.error(err);
        }
    }

    return module;
}

function MDBJornadasDao(datastore) {
    var module = {};
    const TABLE_JORNADA = 'jornadas';

    module.save = async function (clave, data) {
        console.log("--saveEquipos--");
        console.log("Data", data)
        let conn;
        try {
            conn = await datastore.getConnection();
            const query = `INSERT INTO ${TABLE_JORNADA} (jorn_id, jorn_name, jorn_data) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE jorn_name = VALUES(jorn_name), jorn_data = VALUES(jorn_data);`
            const result = await conn.query(query, [clave, data['name'], data['data']]);
            return { ok: true, affectedRows: result.affectedRows };
        } catch (err) {
            console.error(err);
            return { ok: false, error: "Could not insert jornada" };
        } finally {
            if (conn) conn.release(); // Releases connection back to the pool
        }
    }

    /**
     * Devuelve todas las jornadas
     * @returns las jornadas en la forma [clave: {name: "nombre", data: "datos de una jornada"}, ...]
     */
    module.fetch = async function () {
        let conn, result;
        try {
            conn = await datastore.getConnection();
            const query = `SELECT * FROM ${TABLE_JORNADA} ORDER BY jorn_name DESC`;
            console.log(query);
            result = await conn.query(query);
        } catch (err) {
            console.log("Error, returning empty dict", err);
            return { ok: false, error: "Could not get jornadas" };
        } finally {
            if (conn) conn.release(); // Releases connection back to the pool
        }

        console.log(`fetched ${result.length} values in result`);
        try {
            var jornadas = {};
            for (var row of result) {
                jornadas[row.jorn_id] = { name: row.jorn_name, data: row.jorn_data };
            }
            return { ok: true, data: jornadas };
        } catch (err) {
            console.error(err);
            return { ok: false, error: "Could not process jornadas" };
        }
    }

    module.delete = async function (clave) {
        let conn;
        try {
            conn = await datastore.getConnection();
            const query = `DELETE FROM ${TABLE_JORNADA} WHERE jorn_id = ?`
            const result = await conn.query(query, [clave]);
            return result;
        } catch (err) {
            console.error(err);
        } finally {
            if (conn) conn.release(); // Releases connection back to the pool
        }
    }

    return module;
}
