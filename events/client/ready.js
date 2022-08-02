const { Client } = require("discord.js");
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

        await client.user.setActivity('Starting up... 🔴', { type: 'WATCHING' });
        await client.user.setStatus("dnd");

        if (client.config.mongoURL) {
            await mongoose.connect(l.mongo, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }).then(() => {
                consola.info(`Connected to MongoDB: ${mongoose.connection.name}`);
            }).catch(() => { console.error(new Error('MongoDB Error')); });
        };

        await client.user.setStatus("online");
        await client.user.setActivity(`you. 👁👄👁`, { type: 'WATCHING' });

        let state = 0;
        let presences = [
            { type: 'PLAYING', message: 'play.minespells.com 🧙‍♂️' },
            { type: 'WATCHING', message: 'store.minespells.com 🛒' },
            { type: 'LISTENING', message: 'minespells.com 💬' },
            { type: 'COMPETING', message: 'the new Prisons map 🥇' },
            { type: 'WATCHING', message: 'for the payouts 💎' },
        ];

        setInterval(() => {
            state = (state + 1) % presences.length;
            let presence = presences[state];
            client.user.setActivity(presence.message, { type: presence.type });
        }, 10000);
    },
};