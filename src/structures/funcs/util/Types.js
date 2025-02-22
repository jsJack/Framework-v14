const { Collection } = require('discord.js');
const { PrismaClient } = require('@prisma/client');

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

module.exports = {};
