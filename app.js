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

// Datastore
const { Datastore } = require('@google-cloud/datastore');
const datastore = new Datastore({
    projectId: 'leizarangamesmgr',
});

// HOME PAGE
app.get('/', async (req, res, next) => {
    console.log("get /");
    res.render('editor', { layout: false });
});

// JORNADAS
let daoJornadas = require('./daos/jornadas.js')(datastore);
const jornadasRouter = require('./routes/jornadas.js')(daoJornadas);
app.use('/jornadas', jornadasRouter);

// EQUIPOS
let daoEquipos = require('./daos/equipos.js')(datastore);
const equiposRouter = require('./routes/equipos.js')(daoEquipos);
app.use('/equipos', equiposRouter);

// PARAMS SETS
let daoParams = require('./daos/params.js')(datastore);
const paramsRouter = require('./routes/params.js')(daoParams);
app.use('/paramssets', paramsRouter);

const PORT = parseInt(parseInt(process.env.PORT)) || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

module.exports = app;
