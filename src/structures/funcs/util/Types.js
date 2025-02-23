const { Client, Collection } = require('discord.js');
const { PrismaClient } = require('@prisma/client');

/**
 * @typedef {Object} ExtendedProperties
 * @property {Collection} events
 * @property {Collection} commands
 * @property {Collection} modals
 * @property {Collection} buttons
 * @property {Collection} selectmenus
 * @property {Collection} apps
 * @property {Collection} cooldowns
 * 
 * @property {PrismaClient} db
 * @property {Object} config
 */

/**
 * @typedef {Client & ExtendedProperties} ExtendedClient
 */

module.exports = {};
