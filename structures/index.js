const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const { loadEvents } = require("./handlers/events");
const { loadCommands } = require("./handlers/commands");
const { loadModals } = require("./handlers/modals");
const { loadButtons } = require("./handlers/buttons");

const consola = require("consola");

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages],
    partials: [User, Message, GuildMember, ThreadMember],
});

client.commands = new Collection();
client.modals = new Collection();
client.buttons = new Collection();
client.config = require("./config.json");

client.login(client.config.token).then(() => {
    loadEvents(client);
    loadCommands(client);
    loadModals(client);
    loadButtons(client);
}).catch((err) => console.log(err));

client
    .on('error', consola.error)
    .on('warn', consola.warn)