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
// const { Datastore } = require('@google-cloud/datastore');
const Datastore = require('./datastores/datastore.js')
const datastore = new Datastore({
    projectId: 'leizarangamesmgr',
});

// HOME PAGE
app.get('/', async (req, res, next) => {
    console.log("get /");
    res.render('editor', { layout: false });
});

// JORNADAS
let daoJornadas = require('./daos/jornadasDao.js')(datastore);
const jornadasRouter = require('./routes/jornadasRouter.js')(daoJornadas);
app.use('/jornadas', jornadasRouter);

// EQUIPOS
let daoEquipos = require('./daos/equiposDao.js')(datastore);
const equiposRouter = require('./routes/equiposRouter.js')(daoEquipos);
app.use('/equipos', equiposRouter);

// PARAMS SETS
let daoParams = require('./daos/paramsDao.js')(datastore);
const paramsRouter = require('./routes/paramsRouter.js')(daoParams);
app.use('/paramssets', paramsRouter);

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

module.exports = app;
