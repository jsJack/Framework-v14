const { ButtonInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
    id: "ceb_cancel",
    invokerOnly: true,

    /**
    * 
    * @param {ButtonInteraction} interaction 
    */
    async execute(interaction) {
        await interaction.deferUpdate();

        const embed = new EmbedBuilder()
            .setTitle("Embed Builder")
            .setDescription("The embed builder has been cancelled.")
            .setColor('Red');

        return interaction.editReply({ embeds: [embed], components: [] });
    }
};
