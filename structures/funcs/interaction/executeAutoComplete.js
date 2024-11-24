const { AutocompleteInteraction, Client } = require("discord.js");
const Logger = require('../util/Logger')

/**
 * 
 * @param {AutocompleteInteraction} interaction 
 * @param {Client} client 
 */
async function executeAutoComplete(interaction, client) {
    const commandName = interaction.commandName;
    const command = client.commands.get(commandName);

    if (!command) return;

    if (command.autocomplete) {
        try {
            return command.autocomplete(interaction, client);
        } catch (e) {
            Logger.error(e);
        }
    };
};

module.exports = { executeAutoComplete };
