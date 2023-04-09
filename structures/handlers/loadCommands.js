const consola = require("consola");
const { cyan } = require('chalk');
const { loadFiles } = require("../funcs/fileLoader");
const { loadSubFolders } = require("../funcs/folderLoader");
const { Client } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @returns 
 */
async function loadCommands(client) {
    await client.commands.clear();

    let commandsArray = [];
    let developerArray = [];

    const files = await loadFiles("commands");
    files.forEach((file) => {
        const command = require(file);
        client.commands.set(command.data.name, command);

        if (command.developer) developerArray.push(command.data.toJSON());
        else commandsArray.push(command.data.toJSON());
    });

    if (!files.length) consola.warn(`[Commands] None loaded - Folder empty.`)

    const contextMenus = await loadFiles("apps");
    contextMenus.forEach((file) => {
        const app = require(file);
        client.apps.set(app.data.name, app);

        if (app.developer) developerArray.push(app.data.toJSON());
        else commandsArray.push(app.data.toJSON());
    });

    if (!contextMenus.length) consola.warn(`[Context Menus] None loaded - Folder empty.`)

    client.application.commands.set(commandsArray);
    client.guilds.cache.find(g => g.id === client.config.developerGuildID).commands.set(developerArray);

    let commandCats = await loadSubFolders("commands");
    client.commandCategories = commandCats;

    if (!commandsArray.length && !developerArray.length) return consola.error(`[Commands] None loaded - Folder empty.`)
    else return consola.success(`Successfully loaded ${cyan(`${commandsArray.length} application commands`)} // ${cyan(`${developerArray.length} developer-only commands`)}.`)
}

module.exports = { loadCommands };