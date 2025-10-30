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

const KIND = 'jornada';

async function saveJornada(clave, data) {
    const key = datastore.key([KIND, clave]);
    const entity = { key, data, };
    try {
        var res = await datastore.save(entity);
        return res;
    } catch (err) {
        console.error(err);
    }
}

async function getJornadas() {
    const query = datastore.createQuery(KIND);
    // console.log("query: ", query);
    try {
        var res = await datastore.runQuery(query);
        var list = res[0];
        var lines = {};
        for (var e of list) {
            var text = e.text;
            var key = e[datastore.KEY];
            lines[key.name] = text;
        }
        return lines;
    } catch (err) {
        console.error(err);
    }
}

async function deleteJornada(clave) {
    const key = datastore.key([KIND, clave]);
    try {
        var res = await datastore.delete(key);
        return res;
    } catch (err) {
        console.error(err);
    }
}

app.get('/', async (req, res, next) => {
    console.log("get /");
    res.render('editor', { layout: false });
});

app.get('/jornadas', async (req, res, next) => {
    console.log("getting all lines...");
    var data = await getJornadas();
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data, null, 4));
});

app.post('/jornada/:clave/rename', async (req, res, next) => {
    try {
        const { clave } = req.params;
        const data = req.body;
        const newkey = data.newkey;
        if (!newkey) {
            res.status(400).json({ error: 'La nueva clave es necesaria' });
            return;
        }
        // TODO datastore operations
        res.status(200).json({ message: `Renamed successfully to !`, clave });
    } catch (error) {
        next(error);
    }
});

app.post('/jornada/:clave', async (req, res, next) => {
    try {
        const { clave } = req.params;
        const data = req.body;
        console.log(`post /jornada, con clave = ${clave} y data = ${data}`);
        if (!clave) {
            res.status(400).json({ error: 'The "clave" property is required.' });
            return;
        }
        await saveJornada(clave, data);
        console.log("saved!")
        res.status(200).json({ message: 'Data saved successfully!', clave });
    } catch (error) {
        next(error);
    }
});

app.delete('/jornada/:clave', async (req, res, next) => {
    try {
        const { clave } = req.params;
        if (!clave) {
            res.status(400).json({ error: 'Se necesita una clave de jornada' });
            return;
        }
        console.log("delete key", clave);
        deleteJornada(clave);
        console.log("key deleted", clave);
        res.status(200).json({ message: 'Data deleted successfully!', id: clave });
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
