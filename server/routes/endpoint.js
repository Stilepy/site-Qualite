const express = require('express');
const router = express.Router();
const { SquareCloudAPI } = require('@squarecloud/api');
const { Client } = require('discord.js');

const square = new SquareCloudAPI(process.env.SQUARE_API_KEY);
const discord = new Client({ 
  intents: [
    'GuildMembers',
    'Guilds'
  ] 
});

router.get('/bots', async (req, res) => {
    try {
        const bots = await square.applications.getAll();
        res.json(bots);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/bots', async (req, res) => {
    try {
        const { name, token, plan } = req.body;
        
        const deployment = await square.applications.deploy({
            name,
            token,
            plan
        });
        res.json(deployment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/bots/:id', async (req, res) => {
    try {
        const bot = await square.applications.get(req.params.id);
        res.json(bot);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/bots/:id', async (req, res) => {
    try {
        await square.applications.delete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;