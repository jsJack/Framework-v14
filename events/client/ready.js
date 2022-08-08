const { Client, ActivityType } = require("discord.js");
const consola = require("consola");
const chalk = require('chalk');

module.exports = {
    name: "ready",
    once: true,
    /**
     *
     * @param {Client} client
     */
    async execute(client) {
        consola.info(chalk.greenBright(`Hello world!`), chalk.gray(`Connected to Discord as`), chalk.blueBright(`${client.user.tag}`));

        await client.user.setActivity('Starting up... 🔴', { type: ActivityType.Watching });
        await client.user.setStatus('dnd');

        if (client.config.mongoURL) {
            await mongoose.connect(l.mongo, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }).then(() => {
                consola.info(`Connected to MongoDB: ${mongoose.connection.name}`);
            }).catch(() => { console.error(new Error('MongoDB Error')); });
        };

        await client.user.setStatus("online");
        await client.user.setActivity(`you. 👁👄👁`, { type: ActivityType.Watching });

        consola.log(``); consola.info(`Interaction logging started`);

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