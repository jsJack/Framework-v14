const { SelectMenuInteraction, Client, EmbedBuilder } = require('discord.js');

module.exports = {
    id: `example-select-menu`,

    /**
     * 
     * @param {SelectMenuInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        let selectedOption = interaction.values[0];

        let replyEmbed = new EmbedBuilder()
        .setTitle(`You selected ${selectedOption}`)
        .setColor(client.config.color)

        return interaction.reply({ embeds: [replyEmbed] });
    }
}