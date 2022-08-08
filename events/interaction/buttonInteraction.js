const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const consola = require('consola');

module.exports = {
    name: "interactionCreate",
    /**
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {
        if(!interaction.isButton()) return;

        const button = client.buttons.get(interaction.customId);

        let notExist = new EmbedBuilder()
        .setDescription(`🛠 This button is not linked to a response.\nPlease try again later.`)
        .setColor(client.config.color)
        .setFooter({ text: `Item code: ${interaction.customId} - Infinity Development` });
        
        if (!button) return interaction.reply({ embeds: [notExist], ephemeral: true });

        let buttonNoPerms = new EmbedBuilder()
        .setTitle(`❌ You do not have permission to use this button!`)
        .setColor(client.config.color)

        let buttonOwnerOnly = new EmbedBuilder()
        .setTitle(`❌ This button is locked to the __Owner of the Guild__!`)
        .setColor(client.config.color)

        if(button.permission && !interaction.member.permissions.has(button.permission)) return interaction.reply({ embeds: [buttonNoPerms], ephemeral: true });
        if(button.ownerOnly && interaction.member.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [buttonOwnerOnly], ephemeral: true });

        consola.log(`${interaction.guild.name} | ${interaction.user.tag} | 🔘 ${interaction.customId}`);
        button.execute(interaction, client);
    }
}
