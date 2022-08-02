const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping2")
    .setDescription(`Pong2!`)
    .addStringOption(option=>option.setName("test").setAutocomplete(true).setDescription("test ig?").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Pong2!`)], ephemeral: true });
    }
}