console.clear();

const { PrismaClient } = require('@prisma/client');
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages, MessageContent, GuildVoiceStates, GuildMessageReactions } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel } = Partials;

const Logger = require('./funcs/util/Logger');
const { missingSecrets } = require('../../scripts/helpers/env');

require('dotenv').config();

/**
 * @typedef {Object} ExtendedClient
 * 
 * @property {Collection} events
 * @property {Collection} commands
 * @property {Collection} modals
 * @property {Collection} buttons
 * @property {Collection} selectmenus
 * @property {Collection} apps
 * 
 * @property {PrismaClient} db
 * @property {Object} config
 */

/** @type {Client & ExtendedClient} */
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

client.login(process.env.TOKEN).catch((err) => Logger.error(err));
