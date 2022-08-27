const consola = require("consola");
const { cyan } = require('chalk');
const { loadFiles } = require("../funcs/fileLoader");

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
    
    client.application.commands.set(commandsArray);
    client.guilds.cache.find(g=>g.id===client.config.developerGuildID).commands.set(developerArray);

    if (!commandsArray.length && !developerArray.length) return consola.error(`[Commands] None loaded - Folder empty.`)
    else return consola.success(`Successfully loaded ${cyan(`${commandsArray.length} application commands`)} // ${cyan(`${developerArray.length} developer-only commands`)}.`)
}

module.exports = { loadCommands };