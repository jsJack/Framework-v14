const { ModalSubmitInteraction, EmbedBuilder, MessageFlags } = require('discord.js');
const timestring = require('timestring');

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

        if (enteredData.timestamp && !isISO8601(enteredData.timestamp)) {
            try {
                enteredData.timestamp = toISO8601(enteredData.timestamp);
            } catch (e) {
                return interaction.reply({
                    embeds: [statusEmbed.create(e.message, 'Red')],
                    flags: MessageFlags.Ephemeral
                });
            };
        }

        if (enteredData.image) {
            if (!process.env.ALLOWED_IMAGE_HOSTNAMES?.split(',').includes(new URL(enteredData.image).hostname) && process.env.ALLOWED_IMAGE_HOSTNAMES !== "*") {
                return interaction.reply({
                    embeds: [
                        statusEmbed
                            .create("The icon URL must be from a whitelisted domain.\n> You may be required to use a **Direct Image URL**\n> e.g. `i.imgur.com` instead of `imgur.com`", 'Red')
                            .setFields([
                                { name: "Your URL", value: enteredData.image, inline: false },
                                { name: "Allowed Hostnames", value: "`" + process.env.ALLOWED_IMAGE_HOSTNAMES.split(",").join("`, `") + "`", inline: false }
                            ])
                    ],
                    flags: MessageFlags.Ephemeral
                });
            };

            try {
                const res = await fetch(enteredData.image, { method: 'HEAD' });
                const contentType = res.headers.get('content-type');
                let supportedTypes = ['image/', 'video/'];

                if (!res.ok) throw new Error(`Invalid response: ${res.status} ${res.statusText}`);
                if (!supportedTypes.some(type => contentType?.includes(type))) throw new Error(`Invalid content type: \`${contentType}\``);
            } catch (e) {
                return interaction.reply({
                    embeds: [
                        statusEmbed
                            .create("The icon URL must be a valid image URL.\n\n> **Note:** The image host must return a [MIME Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types) of `image/*` or `video/*` for the Icon URL to be accepted.", 'Red')
                            .setFields([
                                { name: "Error", value: e.message, inline: false },
                                { name: "Your URL", value: enteredData.image, inline: false }
                            ])
                    ],
                    flags: MessageFlags.Ephemeral
                });
            }
        };

        const customEmbed = interaction.message.embeds[0];
        const instructionsEmbed = interaction.message.embeds[1];

        if (interaction.message.embeds.length != 2) {
            return interaction.reply({
                embeds: [statusEmbed.create("There was an error fetching the embeds, have they been deleted?", 'Red')],
                flags: MessageFlags.Ephemeral
            });
        }

        const existingData = {
            text: customEmbed.footer?.text ?? "",
            iconURL: customEmbed.footer?.iconURL ?? "",
            timestamp: customEmbed?.timestamp ?? ""
        };

        // Check if values have changed
        if (enteredData.text === existingData.text) enteredData.text = null;
        if (enteredData.image === existingData.iconURL) enteredData.image = null;
        if (enteredData.timestamp === existingData.timestamp) enteredData.timestamp = null;

        if (enteredData.text === null && enteredData.image === null && enteredData.timestamp === null) {
            return interaction.reply({
                embeds: [statusEmbed.create("There were no changes made, exiting.", 'Yellow')],
                flags: MessageFlags.Ephemeral
            });
        }

        let newEmbed = EmbedBuilder.from(customEmbed);
        let doneEmbed = statusEmbed.create("The footer has been successfully updated.", 'Green');

        const footerData = {
            text: enteredData.text,
            icon_url: enteredData.image
        };

        // Handle footer updates
        if (Object.values(footerData).some(value => value !== null)) {
            if (!newEmbed.data.footer) newEmbed.data.footer = {};
            
            Object.entries(footerData).forEach(([key, value]) => {
                if (value === null) return;
                if (value.length < 1) {
                    delete newEmbed.data.footer[key];
                } else {
                    newEmbed.data.footer[key] = value;
                }
            });
        }

        // Handle timestamp separately
        if (enteredData.timestamp !== null) {
            if (enteredData.timestamp.length < 1) {
                delete newEmbed.data.timestamp;
            } else {
                newEmbed.data.timestamp = enteredData.timestamp;
            }
        }

        // Add fields to status embed
        const updates = {
            'Text': enteredData.text,
            'Icon URL': enteredData.image,
            'Timestamp': enteredData.timestamp
        };

        Object.entries(updates).forEach(([field, value]) => {
            if (value !== null) {
                doneEmbed.addFields({ 
                    name: field, 
                    value: value.length ? value : '> Unset', 
                    inline: false
                });
            }
        });

        await interaction.message.edit({ embeds: [newEmbed, instructionsEmbed] });
        return interaction.reply({ embeds: [doneEmbed], flags: MessageFlags.Ephemeral });
    }
};

function isURL(string) {
    return /^https?:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/\S*)?$/.test(string)
};

function toISO8601(input) {
    try {
        const timestamp = timestring(input, 'ms'); // Convert to milliseconds
        const date = new Date(Date.now() + timestamp); // Apply to current time if relative
        return date.toISOString();
    } catch (err) {
        throw new Error("Invalid timestamp format. Please provide a valid timestamp format.");
    }
};

function isISO8601(string) {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,6})?[+-]\d{2}:\d{2}$/.test(string);
};
