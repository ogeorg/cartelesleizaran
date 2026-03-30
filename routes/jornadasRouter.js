'use strict';

const express = require('express');

function createJornadasRouter(daoJornadas) {
    const router = express.Router();

    router.get('/', async (req, res, next) => {
        console.log("getting all jornadas...");
        const daoRes = await daoJornadas.fetch();
        if (daoRes.ok) {
            console.log("data has length", JSON.stringify(daoRes.data).length);
            res.json(daoRes.data);
        } else {
            res.status(500);
        }
    });

    /**
     * Guarda una jornada
     */
    router.post('/:clave', async (req, res, next) => {
        const { clave } = req.params;
        const data = req.body;
        console.log(`post /jornadas/${clave}, guarda la jornada con clave = ${clave}`);
        if (!clave) {
            res.status(400).json({ error: 'The "clave" property is required.' });
            return;
        }
        const daoRes = await daoJornadas.save(clave, data);
        if (daoRes.ok) {
            res.status(200).json({ message: 'Data saved successfully!', clave });
        } else {
            res.status(500).json({ error: daoRes.error });
        }
    });

    router.delete('/:clave', async (req, res, next) => {
        // ... implementation from app.js
    });

    return router;
}

module.exports = createJornadasRouter;