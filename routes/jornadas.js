'use strict';

const express = require('express');

function createJornadasRouter(daoJornadas) {
    const router = express.Router();

    router.get('/', async (req, res, next) => {
        console.log("getting all jornadas...");
        var data = JSON.stringify(await daoJornadas.fetch())
        console.log("data has length", data.length);
        res.setHeader('Content-Type', 'application/json');
        res.end(data, null, 4);
    });

    /**
     * Guarda una jornada
     */
    router.post('/:clave', async (req, res, next) => {
        try {
            const { clave } = req.params;
            const data = req.body;
            console.log(`post /jornadas/${clave}, guarda la jornada con clave = ${clave}`);
            if (!clave) {
                res.status(400).json({ error: 'The "clave" property is required.' });
                return;
            }
            await daoJornadas.save(clave, data);
            res.status(200).json({ message: 'Data saved successfully!', clave });
        } catch (error) {
            next(error);
        }
    });

    router.delete('/:clave', async (req, res, next) => {
        // ... implementation from app.js
    });

    return router;
}

module.exports = createJornadasRouter;