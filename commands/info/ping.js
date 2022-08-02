const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

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
        interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Pong!`)], ephemeral: true });
    }
}