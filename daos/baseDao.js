module.exports = function (datastore) {
    if (datastore.kind == 'GoogleDatastore')
        return GDSBaseDao(datastore);
    else if (datastore.kind == 'MariaDB')
        return MDBBaseDao(datastore);
    else
        throw new Error("Not implemented");
}

function GDSBaseDao(datastore) {
    var module = {};
    console.log("Loading base");

    module.getAll = async function (kind) {
        const query = datastore.createQuery(kind);
        try {
            var res = await datastore.runQuery(query);
            var list = res[0];
            return list;
        } catch (err) {
            console.error(err);
        }
    }

    module.getOne = async function (kind) {
        console.log("===getOne===", kind);
        const query = datastore.createQuery(kind);
        try {
            var res = await datastore.runQuery(query);
            var list = res[0];
            var item = list[0];
            return item;
        } catch (err) {
            console.error(err);
        }
    }

    module.getAllByKey = async function (kind) {
        const query = datastore.createQuery(kind);
        try {
            var res = await datastore.runQuery(query);
        } catch (err) {
            console.log("Error, returning empty dict");
            return {};
        }
        try {
            var list = res[0];
            var map = {};
            for (var entity of list) {
                var key = entity[datastore.KEY];
                delete entity[datastore.KEY];
                map[key.name] = entity;
            }
            return map;
        } catch (err) {
            console.error(err);
        }
    }

    return module;
}

function MDBBaseDao(datastore) {
    var module = {};

    module.getAll = async function (tabla) {
        let conn;
        try {
            conn = await datastore.getConnection();
            const rows = await conn.query(`select * from ${tabla}`);
            return { ok: true, data: rows }
        } catch (err) {
            console.error(err);
            return { ok: false, error: err };
        } finally {
            if (conn) conn.release(); // Releases connection back to the pool
        }
    }

    /**
     * Devuelve las filas como dict, indexados por la clave key
     * 
     * @param {*} tabla 
     * @param {*} key 
     * @returns 
     */
    module.getAllByKey = async function (tabla, key) {
        let conn, rows;
        try {
            conn = await datastore.getConnection();
            rows = await conn.query(`select * from ${tabla}`);
        } catch (err) {
            console.log("Error, returning empty dict");
            return { ok: false, error: err };
        } finally {
            if (conn) conn.release(); // Releases connection back to the pool
        }

        try {
            var map = {};
            for (var row of rows) {
                var keyValue = row[key];
                map[keyValue] = row;
            }
            return { ok: true, data: map };
        } catch (err) {
            console.error(err);
            return { ok: false, error: err };
        }
    }
    return module;
}