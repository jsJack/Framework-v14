const { ModalSubmitInteraction, EmbedBuilder, MessageFlags } = require('discord.js');
const StatusEmbedBuilder = require('../../../structures/funcs/tools/createStatusEmbed');

/** @typedef {import("../../../structures/funcs/util/Types").ExtendedClient} ExtendedClient */

module.exports = {
    id: "ceb_footer",

    /**
    * 
    * @param {ModalSubmitInteraction} interaction 
    * @param {ExtendedClient} client 
    */
    async execute(interaction, client) {
        const statusEmbed = new StatusEmbedBuilder("Footer", { name: "Embed Builder", iconURL: client.user.displayAvatarURL() });

        let enteredData = {
            "text": interaction.fields.getTextInputValue("ceb_footer_text_i") ?? "",
            "image": interaction.fields.getTextInputValue("ceb_footer_icon_i") ?? "",
            "timestamp": interaction.fields.getTextInputValue("ceb_footer_timestamp_i") ?? ""
        };

        if (!enteredData.text && !enteredData.image && !enteredData.timestamp) {
            return interaction.reply({
                embeds: [statusEmbed.create("You must provide at least one value for the footer.", 'Red')],
                flags: MessageFlags.Ephemeral
            });
        };

        if (enteredData.image && !enteredData.text) {
            return interaction.reply({
                embeds: [statusEmbed.create("You must provide a text if you want to set an icon.", 'Red')],
                flags: MessageFlags.Ephemeral
            });
        }

        if (enteredData.image && !isURL(enteredData.image)) {
            return interaction.reply({
                embeds: [statusEmbed.create("URLs must start with `http://` or `https://`, and be a well-formed URL.\nExample: `https://google.com`, `https://google.ie/search`", 'Red')],
                flags: MessageFlags.Ephemeral
            });
        }

        // @todo: Check if timestamp is actually a timestamp

        if (enteredData.image) {
            if (!process.env.ALLOWED_IMAGE_HOSTNAMES?.split(',').includes(new URL(iconURL).hostname) && process.env.ALLOWED_IMAGE_HOSTNAMES !== "*") {
                return interaction.reply({
                    embeds: [
                        statusEmbed
                            .create("The icon URL must be from a whitelisted domain.\n> You may be required to use a **Direct Image URL**\n> e.g. `i.imgur.com` instead of `imgur.com`", 'Red')
                            .setFields([
                                { name: "Your URL", value: iconURL, inline: false },
                                { name: "Allowed Hostnames", value: "`" + process.env.ALLOWED_IMAGE_HOSTNAMES.split(",").join("`, `") + "`", inline: false }
                            ])
                    ],
                    flags: MessageFlags.Ephemeral
                });
            };

            try {
                const res = await fetch(iconURL, { method: 'HEAD' });
                const contentType = res.headers.get('content-type');
                let supportedTypes = ['image/', 'video/'];

                if (!res.ok) throw new Error(`Invalid response: ${res.status} ${res.statusText}`);
                if (!supportedTypes.some(type => contentType?.includes(type))) throw new Error(`Invalid content type: \`${contentType}\``);
            } catch (e) {
                return await interaction.reply({
                    embeds: [
                        statusEmbed
                            .create("The icon URL must be a valid image URL.\n\n> **Note:** The image host must return a [MIME Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types) of `image/*` or `video/*` for the Icon URL to be accepted.", 'Red')
                            .setFields([
                                { name: "Error", value: e.message, inline: false },
                                { name: "Your URL", value: iconURL, inline: false }
                            ])
                    ],
                    flags: MessageFlags.Ephemeral
                });
            }
        };

        const customEmbed = interaction.message.embeds[0];
        const instructionsEmbed = interaction.message.embeds[1];

        if (referencedMessage.embeds.length != 2) {
            return interaction.editReply({
                embeds: [statusEmbed.create("There was an error fetching the embeds, have they been deleted?", 'Red')],
                flags: MessageFlags.Ephemeral
            });
        }

        const existingData = {
            text: customEmbed.footer?.text ?? "",
            iconURL: customEmbed.footer?.iconURL ?? "",
            timestamp: customEmbed.footer?.timestamp ?? ""
        };

        // Check if values have changed
        if (enteredData.text === existingData.text) enteredData.text = null;
        if (enteredData.image === existingData.iconURL) enteredData.image = null;
        if (enteredData.timestamp === existingData.timestamp) enteredData.timestamp = null;

        if (enteredData.text === null && enteredData.image === null && enteredData.timestamp === null) {
            return interaction.editReply({
                embeds: [statusEmbed.create("There were no changes made, exiting.", 'Yellow')],
                flags: MessageFlags.Ephemeral
            });
        }

        let newEmbed = EmbedBuilder.from(customEmbed);
        let doneEmbed = statusEmbed.create("The author has been successfully updated.", 'Green');

        // const updates = [
        //     { field: 'text', setter: 'name', value: name },
        //     { field: 'iconURL', setter: 'icon_url', value: iconURL },
        //     { field: 'url', setter: 'url', value: url }
        // ];

        // updates.forEach(({ field, setter, value }) => {
        //     if (value == null) return;

        //     if (value.length < 1) delete newEmbed.data.footer[setter];
        //     newEmbed.data.author[setter] = value;
        //     doneEmbed.addFields({ name: field.charAt(0).toUpperCase() + field.slice(1), value: value.length ? value : "> Unset", inline: false });
        // });

        await referencedMessage.edit({ embeds: [newEmbed, instructionsEmbed] });
        return interaction.editReply({ embeds: [doneEmbed], flags: MessageFlags.Ephemeral });
    }
};

function isURL(string) {
    return /^https?:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/\S*)?$/.test(string)
};
