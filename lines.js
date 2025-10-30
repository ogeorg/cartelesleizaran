'use strict';

const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');

const app = express();
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

const { Datastore } = require('@google-cloud/datastore');

// Instantiate a datastore client
const datastore = new Datastore({
  projectId: 'leizarangamesmgr',
});

const KIND = 'line';

async function saveLine(clave, valor) {
  console.log(`post /line, con clave = ${clave} y valor = ${valor}`);
  const key = datastore.key([KIND, clave]);
  const entity = {
    key: key,
    data: { valor, updated: new Date() },
  };
  var res = await datastore.save(entity);
  console.log(res);
}

async function getLines() {
  const query = datastore
    .createQuery(KIND)
    .order('updated', { descending: true });

  var res = await datastore.runQuery(query);
  var list = res[0];
  var lines = [];
  for (var e of list) {
    var valor = e.valor ?? e.value;
    var key = e[datastore.KEY];
    lines.push({ id: key.name, valor });
    console.log(" ", key.name, ":", valor);
  }
  return lines;
}

async function deleteLine(clave) {
  const key = datastore.key([KIND, clave]);
  console.log("delete key", key);
  var res = await datastore.delete(key);
}

app.get('/', async (req, res, next) => {
  console.log("get /");
  res.render('index', { layout: false });
});

app.get('/lines', async (req, res, next) => {
  var data = await getLines();
  console.log("getting all lines: ", data);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data, null, 4));
});

app.post('/line/:id', async (req, res, next) => {
  try {
    const { clave2, valor } = req.body;
    const { clave } = req.params;
    if (!clave) {
      res.status(400).json({ error: 'The "clave" property is required.' });
      return;
    }
    await saveLine(clave, valor);
    res.status(200).json({ message: 'Data saved successfully!', clave, valor });
  } catch (error) {
    next(error);
  }
});

app.delete('/line/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'The "id" property is required.' });
      return;

    }
    console.log(`delete /line, con clave = ${clave}`);
    deleteLine(clave);
    res.status(200).json({ message: 'Data deleted successfully!', id });
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
