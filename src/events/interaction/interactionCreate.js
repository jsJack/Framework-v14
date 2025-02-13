const { BaseInteraction, Client } = require('discord.js');

const { executeSlashCommand } = require('../../structures/funcs/interaction/executeSlashCommand');
const { executeButton } = require('../../structures/funcs/interaction/executeButton');
const { executeSelectMenu } = require('../../structures/funcs/interaction/executeSelectMenu');
const { executeModal } = require('../../structures/funcs/interaction/executeModal');
const { executeAutoComplete } = require('../../structures/funcs/interaction/executeAutoComplete');
const { executeContextMenu } = require('../../structures/funcs/interaction/executeContextMenu');

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {BaseInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (interaction.isAutocomplete()) return executeAutoComplete(interaction, client);

        if (interaction.isChatInputCommand()) executeSlashCommand(interaction, client);
        else if (interaction.isButton()) executeButton(interaction, client);
        else if (interaction.isModalSubmit()) executeModal(interaction, client);
        else if (interaction.isStringSelectMenu()) executeSelectMenu(interaction, client);
        else if (interaction.isContextMenuCommand() || interaction.isUserContextMenuCommand() || interaction.isMessageContextMenuCommand()) executeContextMenu(interaction, client);
        else return;
    }
};
