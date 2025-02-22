const { cyan } = require('chalk');
const { Client } = require('discord.js');

const { loadFiles } = require("../funcs/fileLoader");
const { loadSubFolders } = require("../funcs/folderLoader");
const Logger = require('../funcs/util/Logger');

/** @typedef {import("../funcs/util/Types").ExtendedClient} ExtendedClient */

/**
 * 
 * @param {ExtendedClient} client 
 * @returns 
 */
async function loadCommands(client) {
    client.commands.clear();

    let commandsArray = [];
    let appsArray = [];
    let developerArray = [];
    let devAppsArray = [];

    const files = await loadFiles("src/commands");
    files.forEach((file) => {
        const command = require(file);
        client.commands.set(command.data.name, command);

        if (command.developer) developerArray.push(command.data.toJSON());
        else commandsArray.push(command.data.toJSON());
    });

    if (!files.length) Logger.warn(`[Commands] None loaded - Folder empty.`)

    const contextMenus = await loadFiles("src/apps");
    contextMenus.forEach((file) => {
        const app = require(file);
        client.apps.set(app.data.name, app);

        if (app.developer) devAppsArray.push(app.data.toJSON());
        else appsArray.push(app.data.toJSON());
    });

    commandsArray.push(...appsArray);
    developerArray.push(...devAppsArray);

    client.application.commands.set(commandsArray);
    if (!process.env.DEVELOPER_GUILD_ID) return Logger.warn(`[Commands] Developer commands not loaded - Developer guild ID not provided.`);
    client.guilds.cache.find(g => g.id === process.env.DEVELOPER_GUILD_ID)?.commands.set(developerArray).catch(() => { return; });

    let commandCats = await loadSubFolders("commands");
    client.commandCategories = commandCats;

    if (!commandsArray.length && !developerArray.length) return Logger.error(`[Commands] None loaded - Folder empty.`)
    else return Logger.success(`Successfully loaded commands:\n                       ╒═ ${cyan(`${commandsArray.length} slash commands`)} (${cyan(`${developerArray.length} developer slash commands`)})\n                       ╞═ ${cyan(`${appsArray.length} context menus`)} (${cyan(`${devAppsArray.length} developer context menus`)})\n                       ╘═ Across ${cyan(`${commandCats.length} categories`)}.`);
}

module.exports = { loadCommands };
