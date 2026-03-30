'use strict'
const express = require('express');

module.exports = function (daoEquipos) {
    const router = express.Router();

    router.get('/', async (req, res, next) => {
        console.log("get /equipos: getting all equipos...");
        var daoRes = await daoEquipos.fetch();
        if (daoRes.ok) {
            console.log("data has length", JSON.stringify(daoRes.data).length);
            res.json(daoRes.data);
        } else {
            res.status(500);
        }
    });

    router.post('/', async (req, res, next) => {
        const data = req.body;
        console.log(`post /equipos, con keys = ${Object.keys(data)}`);

        const daoRes = await daoEquipos.save({ equipos: data });
        if (daoRes.ok) {
            console.log("===200===");
            res.status(200).json({ message: 'Equipos saved successfully!' });
        } else {
            console.log("===500===", daoRes.error);
            res.status(500).json({ error: daoRes.error });
        }
    });

    return router;
}