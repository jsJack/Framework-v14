const { ButtonInteraction, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { remove } = require('../../commands/developer/blacklist');

module.exports = {
    id: "blacklist-remove",
    developer: true,

    /**
    * 
    * @param {ButtonInteraction} interaction 
    * @param {Client} client 
    */
    async execute(interaction, client) {
        let idField = interaction.message.embeds[0].fields.find(f => f.name === "ID").value;
        if (!idField) return interaction.reply({ content: "This embed is missing an ID field.", ephemeral: true });

        idField = idField.replace(/`/g, "");

        let blacklistRemovedActionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("blacklist-remove")
                    .setLabel(`Removed by @${interaction.user.tag}`)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("✅")
                    .setDisabled(true)
            );

        await interaction.message.edit({ components: [blacklistRemovedActionRow] });
        return remove(interaction, client, idField);
    }
};
