'use strict';

const Datastore = require('../datastores/datastore.js')
const datastore = new Datastore({
    projectId: 'leizarangamesmgr',
});

let daoJornadas = require('../daos/jornadas.js')(datastore);

async function testFetchJornadas() {
    let jornadas = await daoJornadas.fetch();
    console.log(jornadas);
}

async function testUpsertJornada(data) {
    let result = await daoJornadas.save(2, data);
    console.log(result);
}

async function testDeleteJornada() {
    let result = await daoJornadas.delete(2);
    console.log(result);
}

async function testJornadas() {
    await testUpsertJornada("abc");
    await testFetchJornadas();
    await testUpsertJornada("def");
    await testFetchJornadas();
    await testDeleteJornada();
    await testFetchJornadas();
}

let daoEquipos = require('../daos/equipos.js')(datastore);

async function testFetchEquipos() {
    let equipos = await daoEquipos.fetch();
    console.log(equipos);
    return equipos;
}

async function testSaveEquipos(equipos) {
    let res = await daoEquipos.save(equipos);
    console.log("RES", res);
}

async function testEquipos() {
    let equipos = await testFetchEquipos();
    let senMul = equipos['sen:mut:1'];
    senMul.name = "ERNIO"; // "Leizaran Ernio Inmobiliaria"
    await testSaveEquipos(equipos);
}

(async () => {
    try {
        // testJornadas();
        await testEquipos();
    } catch (err) {
        console.error("Error in test:", err);
    } finally {
        // This ensures the pool closes even if an error occurs
        console.log("will end");
        await datastore.end();
        console.log("Connection pool closed. Script exiting...");
    }
})();