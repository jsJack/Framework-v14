const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

/** @typedef {import("../../../structures/funcs/util/Types").ExtendedClient} ExtendedClient */

module.exports = {
    id: "ceb_footer",

    /**
    * 
    * @param {ButtonInteraction} interaction 
    * @param {ExtendedClient} client 
    */
    async execute(interaction, client) {
        const existingEmbed = interaction.message.embeds[0];
        const existingData = {
            text: existingEmbed.footer?.text,
            icon_url: existingEmbed.footer?.iconURL,
        };

        let modal = new ModalBuilder()
            .setTitle("Footer")
            .setCustomId("ceb_footer")
            .setComponents(
                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setCustomId("ceb_footer_text")
                        .setLabel("Footer Text")
                        .setPlaceholder("Enter some inspiring text...")
                        .setValue(existingData.text ?? "")

                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                ),

                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setCustomId("ceb_footer_icon")
                        .setLabel("Footer Icon URL")
                        .setPlaceholder("Enter a URL...")
                        .setValue(existingData.icon_url ?? "")

                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                ),

                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setCustomId("ceb_footer_timestamp")
                        .setLabel("Timestamp")
                        .setPlaceholder("Enter a timestamp...")
                        .setValue(existingEmbed.timestamp ?? "")

                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                )
            )

        return interaction.showModal(modal);
    }
};
