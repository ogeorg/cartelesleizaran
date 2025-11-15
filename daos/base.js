module.exports = function (datastore) {
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