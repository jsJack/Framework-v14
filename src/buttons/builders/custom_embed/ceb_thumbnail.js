const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

/** @typedef {import("../../../structures/funcs/util/Types").ExtendedClient} ExtendedClient */

module.exports = {
    id: "ceb_thumbnail",

    /**
    * 
    * @param {ButtonInteraction} interaction 
    */
    async execute(interaction) {
        let modal = new ModalBuilder()
            .setCustomId("ceb_thumbnail")
            .setTitle("Thumbnail & Image")
            .setComponents(
                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setCustomId("ceb_thumbnail_i")
                        .setPlaceholder("Enter a URL...")
                        .setLabel("Thumbnail URL")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                ),

                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setCustomId("ceb_image_i")
                        .setPlaceholder("Enter a URL...")
                        .setLabel("Image URL")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                )
            )

        return interaction.showModal(modal);
    }
};
