const { Client, ActivityType } = require('discord.js');
const { greenBright, cyan } = require('chalk');
const mongoose = require('mongoose');

const { loadCommands } = require("../../structures/handlers/loadCommands");
const { loadModals } = require("../../structures/handlers/loadModals");
const { loadButtons } = require("../../structures/handlers/loadButtons");
const { loadSelectMenus } = require('../../structures/handlers/loadSelectMenus');
const { updateModuleStatus } = require('../../structures/funcs/loadClientModules');

const Logger = require('../../structures/funcs/util/Logger');

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

        Logger.success(`Connected to Discord as ${cyan(`${client.user.tag}`)}!\n`);
        Logger.info(`Interaction Logging started.`)

        client.user.setActivity('Starting up... 🔴', { type: ActivityType.Watching });
        client.user.setStatus('dnd');

        await mongoose.connect(client.config.mongoURL).then(() => {
            Logger.info(`Connected to ${greenBright(`MongoDB`)}: ${cyan(mongoose.connection.name)}\n`);
        }).catch(() => {
            updateModuleStatus("blacklist", client.config.modules.blacklist.enabled, false);
            Logger.error(new Error('MongoDB Error'));
        });

        client.user.setStatus("online");
        client.user.setActivity(`you. 👁👄👁`, { type: ActivityType.Watching });

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
