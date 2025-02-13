console.clear();

const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages, MessageContent, GuildVoiceStates, GuildMessageReactions } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel } = Partials;

const Logger = require('./funcs/util/Logger');

require('dotenv').config();

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages, MessageContent, GuildVoiceStates, GuildMessageReactions],
    partials: [User, Message, GuildMember, ThreadMember, Channel],
});

client.events = new Collection();
client.commands = new Collection();
client.modals = new Collection();
client.buttons = new Collection();
client.selectmenus = new Collection();
client.apps = new Collection();
client.config = require("./config.json");

module.exports = client;

let requiredSecrets = [`MONGODB_URI`, `TOKEN`, `DEVELOPER_GUILD_ID`, `ANTICRASH_WEBHOOK`];
let missingSecrets = requiredSecrets.filter((secret) => !process.env[secret]);

if (missingSecrets.length) {
    Logger.error(`Missing required environment variables: ${missingSecrets.join(", ")}`);
    process.exit(1);
}

const { loadEvents } = require("./handlers/loadEvents");

require("./handlers/loadAntiCrash")(client);
loadEvents(client);

client.login(process.env.TOKEN).catch((err) => Logger.error(err));
