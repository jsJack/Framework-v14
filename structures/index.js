console.clear();

const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages, MessageContent, GuildVoiceStates, GuildMessageReactions } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel } = Partials;

const Logger = require('../structures/funcs/util/Logger');
const { loadModuleStatus, updateModuleStatus } = require('./funcs/loadClientModules');

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
client.customEmbedService = require('./funcs/tools/embedTools.js');

module.exports = client;

loadModuleStatus();
updateModuleStatus("blacklist", client.config.modules.blacklist.enabled ?? true, true);

if (!client.config.mongoURL) {
    Logger.error(`MongoDB is not configured, please set config.mongoURL to your MongoDB connection string.`);
    return process.exit(1);
}

const { loadEvents } = require("./handlers/loadEvents");

require("./handlers/loadAntiCrash")(client);
loadEvents(client);

client.login(client.config.token).catch((err) => Logger.error(err));
