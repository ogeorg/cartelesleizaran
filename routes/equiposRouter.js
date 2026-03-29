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
            res.status(400);
        }
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