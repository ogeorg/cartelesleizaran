module.exports = function (datastore) {
    let daoBase = require('./base.js')(datastore);

    var module = {};

    const KIND_EQUIPOS = 'equipos';

    module.fetch = async function () {
        return await daoBase.getOne(KIND_EQUIPOS);
    }

    module.save = async function(data) {
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