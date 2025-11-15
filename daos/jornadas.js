module.exports = function (datastore) {
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