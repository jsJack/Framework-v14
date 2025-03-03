const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    id: "ceb_title",
    invokerOnly: true,

    /**
    * 
    * @param {ButtonInteraction} interaction 
    */
    async execute(interaction) {
        let existingTitle = interaction.message.embeds[0]?.title?.toString();
        let existingDescription = interaction.message.embeds[0]?.description?.toString();
        let existingColor = interaction.message.embeds[0]?.hexColor?.toString();

        // Check for invalid existing values and validate them
        existingTitle = existingTitle?.replace("\u200b", "") || "";
        existingDescription = existingDescription?.replace("\u200b", "") || "";
        existingColor = existingColor ?? "#ffffff";

        let modal = new ModalBuilder()
            .setTitle("Embed Builder | Title, Description, and Color")
            .setCustomId("ceb_title")
            .setComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("ceb_title_i")
                            .setLabel("Title")
                            .setPlaceholder("Enter a title...")
                            .setValue(existingTitle)

                            .setStyle(TextInputStyle.Short)
                            .setRequired(false)
                    ),

                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("ceb_description_i")
                            .setLabel("Description")
                            .setPlaceholder("Enter a description...")
                            .setValue(existingDescription)

                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(false)
                    ),

                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("ceb_color_i")
                            .setLabel("Color")
                            .setPlaceholder("Enter a hex code...")
                            .setValue(existingColor)

                            .setStyle(TextInputStyle.Short)
                            .setRequired(false)
                            .setMinLength(6)
                            .setMaxLength(7)
                    )
            )

        return interaction.showModal(modal);
    }
};
