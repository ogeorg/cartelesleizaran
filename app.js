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

/************/
/* JORNADAS */
/************/

let daoJornadas = require('./daos/jornadas.js')(datastore);
const jornadasRouter = require('./routes/jornadas.js')(daoJornadas);
app.use('/jornadas', jornadasRouter);

/***********/
/* EQUIPOS */
/***********/

let daoEquipos = require('./daos/equipos.js')(datastore);
const equiposRouter = require('./routes/equipos.js')(daoEquipos);
app.use('/equipos', equiposRouter);

/***************/
/* PARAMS SETS */
/***************/

let daoParams = require('./daos/params.js')(datastore);

app.get('/paramssets', async (req, res, next) => {
    console.log("get /paramssets: getting all paramssets...");
    var map = await daoParams.getAllByKey();
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
        await daoParams.saveSet(clave, paramsset);
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

module.exports = app;
