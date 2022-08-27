const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const consola = require('consola');

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages],
    partials: [User, Message, GuildMember, ThreadMember],
});

client.events = new Collection();
client.commands = new Collection();
client.modals = new Collection();
client.buttons = new Collection();
client.config = require("./config.json");

const { loadEvents } = require("./handlers/loadEvents");

require("./handlers/loadAntiCrash")(client);
loadEvents(client);

client.login(client.config.token).catch((err) => consola.error(err));
