const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("myfirstcommand")
    .setDescription(`Very nice!`)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false), //Will this command appear in DMs?

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

        return interaction.reply({ embeds: [new EmbedBuilder().setTitle(`ding dong this is jim and your opinion is wrong`)], components: [newRow], ephemeral: true });
    }
}