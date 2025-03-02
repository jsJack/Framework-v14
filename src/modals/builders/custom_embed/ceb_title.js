const { ModalSubmitInteraction, EmbedBuilder, MessageFlags } = require('discord.js');

/** @typedef {import("../../../structures/funcs/util/Types").ExtendedClient} ExtendedClient */

module.exports = {
    id: "ceb_title",

    /**
    * @param {ModalSubmitInteraction} interaction 
    * @param {ExtendedClient} client 
    */
    async execute(interaction, client) {
        let title = interaction.fields.getTextInputValue("ceb_title_i");
        let description = interaction.fields.getTextInputValue("ceb_description_i");
        let color = interaction.fields.getTextInputValue("ceb_color_i");

        // Helper function for creating status embeds
        const createStatusEmbed = (description, color) => {
            return new EmbedBuilder()
                .setAuthor({ name: `Embed Builder`, iconURL: client.user.displayAvatarURL() })
                .setTitle("Title, Description and Color")
                .setDescription(description)
                .setColor(color);
        };

        if (!title && !description) {
            return interaction.reply({ 
                embeds: [createStatusEmbed("You must provide a title **or** description.", 'Red')], 
                flags: MessageFlags.Ephemeral
            });
        }

        if (color && !/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color)) {
            return interaction.reply({ 
                embeds: [createStatusEmbed("You must provide a valid hex code for the embed **color**.", 'Red')], 
                flags: MessageFlags.Ephemeral 
            });
        }

        const customEmbed = interaction.message.embeds[0];
        const instructionsEmbed = interaction.message.embeds[1];

        // Check if values have changed
        if (title === customEmbed.title) title = null;
        if (description === customEmbed.description) description = null;
        if (color === customEmbed.hexColor) color = null;

        if (!title && !description && !color) {
            return interaction.reply({ 
                embeds: [createStatusEmbed("There were no changes made, exiting.", 'Yellow')], 
                flags: MessageFlags.Ephemeral 
            });
        }

        let newEmbed = EmbedBuilder.from(customEmbed);
        let doneEmbed = createStatusEmbed("The title, description, and color have been successfully updated.", 'Green');

        const updates = [
            { field: 'title', setter: 'setTitle', value: title },
            { field: 'description', setter: 'setDescription', value: description },
            { field: 'color', setter: 'setColor', value: color }
        ];

        updates.forEach(({ field, setter, value }) => {
            if (value) {
                newEmbed[setter](value);
                doneEmbed.addFields({ name: field.charAt(0).toUpperCase() + field.slice(1), value, inline: false });
            }
        });

        await interaction.message.edit({ embeds: [newEmbed, instructionsEmbed] });
        return interaction.reply({ embeds: [doneEmbed], flags: MessageFlags.Ephemeral });
    }
};
