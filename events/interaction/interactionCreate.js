const { BaseInteraction, Client, EmbedBuilder } = require('discord.js');
const { executeSlashCommand } = require('../../structures/funcs/interaction/executeSlashCommand');
const { executeButton } = require('../../structures/funcs/interaction/executeButton');
const { executeSelectMenu } = require('../../structures/funcs/interaction/executeSelectMenu');
const { executeModal } = require('../../structures/funcs/interaction/executeModal');

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {BaseInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (interaction.isCommand()) executeSlashCommand(interaction, client);
        else if (interaction.isButton()) executeButton(interaction, client);
        else if (interaction.isModalSubmit()) executeModal(interaction, client);
        else if (interaction.isSelectMenu()) executeSelectMenu(interaction, client);
        else return;
    }
}
