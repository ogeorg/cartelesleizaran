'use strict'
const express = require('express');

module.exports = function (daoEquipos) {
    const router = express.Router();

    router.get('/', async (req, res, next) => {
        console.log("get /equipos: getting all equipos...");
        var data = await daoEquipos.fetch();
        var equipos = data.equipos;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(equipos, null, 4));
    });

    router.post('/', async (req, res, next) => {
        try {
            const data = req.body;
            console.log(`post /equipos, con keys = ${Object.keys(data)}`);
            await daoEquipos.save({ equipos: data });
            res.status(200).json({ message: 'Equipos saved successfully!' });
        } catch (error) {
            next(error);
        }
    });

    return router;
}