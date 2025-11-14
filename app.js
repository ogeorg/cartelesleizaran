'use strict';

const express = require('express');
const path = require('path');
const cors = require('cors');
const { engine } = require('express-handlebars');

const app = express();
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());
// Enable pre-flight for all routes
app.options('*', cors());

const { Datastore } = require('@google-cloud/datastore');

// Instantiate a datastore client
const datastore = new Datastore({
    projectId: 'leizarangamesmgr',
});

/*************/
/* HOME PAGE */
/*************/

app.get('/', async (req, res, next) => {
    console.log("get /");
    res.render('editor', { layout: false });
});

/*******************/
/* GENERAL GET/SET */
/*******************/

async function getAllByKey(kind) {
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


async function getAll(kind) {
    const query = datastore.createQuery(kind);
    try {
        var res = await datastore.runQuery(query);
        var list = res[0];
        return list;
    } catch (err) {
        console.error(err);
    }
}

async function getOne(kind) {
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

/************/
/* JORNADAS */
/************/

const KIND_JORNADA = 'jornada';

async function saveJornada(clave, data) {
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
async function fetchJornadas() {
    const query = datastore.createQuery(KIND_JORNADA);
    var res;
    try {
        res = await datastore.runQuery(query);
    } catch (err) {
        console.log("Error, returning empty dict");
        return {};
    }

    try {
        var list = res[0];
        var configs = {};
        for (var entity of list) {
            var key = entity[datastore.KEY];
            configs[key.name] = { name: entity.name, data: entity.data };
        }
        return configs;
    } catch (err) {
        console.error(err);
    }
}

async function deleteJornada(clave) {
    const key = datastore.key([KIND_JORNADA, clave]);
    try {
        var res = await datastore.delete(key);
        return res;
    } catch (err) {
        console.error(err);
    }
}


app.get('/jornadas', async (req, res, next) => {
    console.log("getting all jornadas...");
    var data = JSON.stringify(await fetchJornadas())
    console.log("data has length", data.length);
    res.setHeader('Content-Type', 'application/json');
    res.end(data, null, 4);
});

/**
 * Guarda una jornada
 */
app.post('/jornada/:clave', async (req, res, next) => {
    try {
        const { clave } = req.params;
        const data = req.body;
        console.log(`post /jornada/${clave}, guarda la jornada con clave = ${clave}`);
        if (!clave) {
            res.status(400).json({ error: 'The "clave" property is required.' });
            return;
        }
        await saveJornada(clave, data);
        res.status(200).json({ message: 'Data saved successfully!', clave });
    } catch (error) {
        next(error);
    }
});

app.delete('/jornada/:clave', async (req, res, next) => {
    try {
        const { clave } = req.params;
        console.log(`delete /jornada, elimina la jornada con clave = ${clave}`);
        if (!clave) {
            res.status(400).json({ error: 'Se necesita una clave de jornada' });
            return;
        }
        deleteJornada(clave);
        res.status(200).json({ message: 'Data deleted successfully!', id: clave });
    } catch (error) {
        next(error);
    }
});

/***********/
/* EQUIPOS */
/***********/

const KIND_EQUIPOS = 'equipos';

async function saveEquipos(data) {
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

app.get('/equipos', async (req, res, next) => {
    console.log("get /equipos: getting all equipos...");
    var data = await getOne(KIND_EQUIPOS);

    var equipos = data.equipos;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(equipos, null, 4));
});

app.post('/equipos', async (req, res, next) => {
    try {
        const data = req.body;
        console.log(`post /equipos, con keys = ${Object.keys(data)}`);
        await saveEquipos({ equipos: data });
        res.status(200).json({ message: 'Equipos saved successfully!' });
    } catch (error) {
        next(error);
    }
});

/***************/
/* PARAMS SETS */
/***************/

const KIND_PARAMS = 'params';

async function saveParamsSet(clave, data) {
    const key = datastore.key([KIND_PARAMS, clave]);
    const entity = { key, data, excludeFromIndexes: ['code'] };
    try {
        var res = await datastore.save(entity);
        return res;
    } catch (err) {
        console.error(err);
    }
}

app.get('/paramssets', async (req, res, next) => {
    console.log("get /paramssets: getting all paramssets...");
    var map = await getAllByKey(KIND_PARAMS);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(map, null, 4));
});

app.post('/paramsset/:clave', async (req, res, next) => {
    try {
        const { clave } = req.params;
        const paramsset = req.body;
        console.log(`post /paramsset, con clave = ${clave}`);
        if (!clave) {
            res.status(400).json({ error: 'The "clave" property is required.' });
            return;
        }
        await saveParamsSet(clave, paramsset);
        res.status(200).json({ message: 'Data saved successfully!', clave });
    } catch (error) {
        next(error);
    }
});

const PORT = parseInt(parseInt(process.env.PORT)) || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
// [END gae_flex_datastore_app]

module.exports = app;
