const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages, MessageContent, GuildMessageReactions } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel } = Partials;

const consola = require('consola');

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages, MessageContent, GuildMessageReactions],
    partials: [User, Message, GuildMember, ThreadMember, Channel],
});

client.events = new Collection();
client.commands = new Collection();
client.modals = new Collection();
client.buttons = new Collection();
client.selectmenus = new Collection();
client.config = require("./config.json");

module.exports = client;

const { loadEvents } = require("./handlers/loadEvents");

require("./handlers/loadAntiCrash")(client);
loadEvents(client);

client.login(client.config.token).catch((err) => consola.error(err));
