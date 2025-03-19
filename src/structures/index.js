console.clear();

const { PrismaClient } = require('@prisma/client');
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { 
    AutoModerationConfiguration, AutoModerationExecution, DirectMessagePolls, DirectMessageReactions,
    DirectMessages, DirectMessageTyping, GuildExpressions, GuildIntegrations, GuildInvites, GuildMembers,
    GuildMessagePolls, GuildMessageReactions, GuildMessages, GuildMessageTyping, GuildModeration, GuildPresences,
    Guilds, GuildScheduledEvents, GuildVoiceStates, GuildWebhooks, MessageContent
} = GatewayIntentBits;
const { User, Channel, GuildMember, Message, Reaction, GuildScheduledEvent, ThreadMember } = Partials;

const Logger = require('./funcs/util/Logger');
const { missingSecrets } = require('../../scripts/helpers/env');

require('dotenv').config();

/** @typedef {import("./funcs/util/Types").ExtendedClient} ExtendedClient */

/** @type {Client & ExtendedClient} */
const client = new Client({
    intents: [
        AutoModerationConfiguration, AutoModerationExecution, DirectMessagePolls, DirectMessageReactions,
        DirectMessages, DirectMessageTyping, GuildExpressions, GuildIntegrations, GuildInvites, GuildMembers,
        GuildMessagePolls, GuildMessageReactions, GuildMessages, GuildMessageTyping, GuildModeration, GuildPresences,
        Guilds, GuildScheduledEvents, GuildVoiceStates, GuildWebhooks, MessageContent
    ],
    partials: [User, Channel, GuildMember, Message, Reaction, GuildScheduledEvent, ThreadMember],
});

client.events = new Collection();

client.commands = new Collection();
client.apps = new Collection();

client.buttons = new Collection();
client.modals = new Collection();
client.selectmenus = new Collection();

client.cooldowns = new Collection();
client.jobs = new Collection();

try {
    client.db = new PrismaClient();
} catch (err) {
    Logger.error(err);
};

client.config = require("./config.json");

module.exports = client;

// Check for missing environment variables
if (missingSecrets.length > 0) {
    Logger.error(`Missing environment variables: ${missingSecrets.join(', ')}`);
    process.exit(1);
}

const { loadEvents } = require("./handlers/loadEvents");

require("./handlers/loadAntiCrash")(client);
loadEvents(client);

client.login(process.env.DISCORD_TOKEN).catch((err) => Logger.error(err));
