module.exports = function (datastore) {
    let daoBase = require('./base.js')(datastore);

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