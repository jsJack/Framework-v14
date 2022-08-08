const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription(`Pong!`)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    cooldown: "5s",
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        let newRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`exampleButton`)
            .setStyle(ButtonStyle.Primary)
            .setLabel(`Example Button`)
            .setEmoji(`💎`)
        )

        return interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Pong!`)], components: [newRow], ephemeral: true });
    }
}