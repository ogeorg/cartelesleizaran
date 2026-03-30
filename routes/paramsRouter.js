'use strict'
const express = require('express');

module.exports = function (daoParams) {
    const router = express.Router();

    /**
     * 
     */
    router.get('/', async (req, res, next) => {
        console.log("get /paramssets: getting all paramssets...");
        var daoRes = await daoParams.getAllByKey();
        if (daoRes.ok) {
            console.log("data has length", JSON.stringify(daoRes.data).length);
            res.json(daoRes.data);
        } else {
            res.status(500);
        }

    });

    router.post('/:clave', async (req, res, next) => {
        const { clave } = req.params;
        const paramssets = req.body;
        console.log(`post /paramssets, con clave = ${clave}`);
        if (!clave) {
            res.status(400).json({ error: 'The "clave" property is required.' });
            return;
        }
        const daoRes = await daoParams.saveSet(clave, paramssets);

        if (daoRes.ok) {
            res.status(200).json({ message: 'Data saved successfully!', clave });
        } else {
            res.status(500).json({ error: daoRes.error });
        }
    });

    return router;
}