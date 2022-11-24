const consola = require('consola');
const mongoose = require('mongoose');
const { Client, ActivityType } = require('discord.js');
const { greenBright, cyan } = require('chalk');
const { loadCommands } = require("../../structures/handlers/loadCommands");
const { loadModals } = require("../../structures/handlers/loadModals");
const { loadButtons } = require("../../structures/handlers/loadButtons");
const { loadSelectMenus } = require('../../structures/handlers/loadSelectMenus');

module.exports = {
    name: "ready",
    once: true,
    /**
     *
     * @param {Client} client
     */
    async execute(client) {
        await loadCommands(client);
        await loadModals(client);
        await loadButtons(client);
        await loadSelectMenus(client);

        consola.success(`Connected to Discord as ${cyan(`${client.user.tag}`)}!\n`);
        consola.info(`Interaction Logging started.`)

        await client.user.setActivity('Starting up... 🔴', { type: ActivityType.Watching });
        await client.user.setStatus('dnd');

        await mongoose.connect(client.config.mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            consola.info(`Connected to ${greenBright(`MongoDB`)}: ${cyan(mongoose.connection.name)}`);
        }).catch(() => { console.error(new Error('MongoDB Error')); });

        await client.user.setStatus("online");
        await client.user.setActivity(`you. 👁👄👁`, { type: ActivityType.Watching });

        let state = 0;
        let presences = [
            { type: ActivityType.Playing, message: 'Minecraft' }, // Playing Minecaft
            { type: ActivityType.Listening, message: 'Spotify' }, // Listening to Spotify
            { type: ActivityType.Watching, message: 'Netflix' }, // Watching Netflix
        ];

        setInterval(() => {
            state = (state + 1) % presences.length;
            let presence = presences[state];
            client.user.setActivity(presence.message, { type: presence.type });
        }, 10000);
    },

};
