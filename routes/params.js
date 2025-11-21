'use strict'
const express = require('express');

module.exports = function (daoParams) {
    const router = express.Router();

    router.get('/', async (req, res, next) => {
        console.log("get /paramssets: getting all paramssets...");
        var map = await daoParams.getAllByKey();
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(map, null, 4));
    });

    router.post('/:clave', async (req, res, next) => {
        try {
            const { clave } = req.params;
            const paramssets = req.body;
            console.log(`post /paramssets, con clave = ${clave}`);
            if (!clave) {
                res.status(400).json({ error: 'The "clave" property is required.' });
                return;
            }
            await daoParams.saveSet(clave, paramssets);
            res.status(200).json({ message: 'Data saved successfully!', clave });
        } catch (error) {
            next(error);
        }
    });

    return router;
}