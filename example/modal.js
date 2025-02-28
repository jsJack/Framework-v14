/**
 * Use !modal in VS Code to paste this template
 */

const { ModalSubmitInteraction, EmbedBuilder, MessageFlags } = require('discord.js');

// This import may be different depending on your project structure
/** @typedef {import("../src/structures/funcs/util/Types").ExtendedClient} ExtendedClient */

module.exports = {
    id: "modal",

    cooldown: "5s", // Cooldown for the command - in timestring format
    superUserOnly: false, // Only allow super users to run this command (.env file)
    ownerOnly: false, // Only allow the guild owner to run this command
    permission: PermissionFlagsBits.Administrator, // Required permissions for the user
    reqRoles: ["role_id", "role_id2"], // Required roles for the user

    // Not all of the above config options are required, you can mix and match
    // If you supply multiple, the user must meet all requirements

    // Note about ReqRoles: ["role_id", "role_id2"] means the user must have ONLY ONE of the roles to run the command

    /**
    * 
    * @param {ModalSubmitInteraction} interaction 
    * @param {ExtendedClient} client 
    */
    async execute(interaction, client) {
        // Setup a sample embed
        let exampleEmbed = new EmbedBuilder()
            .setTitle(`🎉 Welcome to Nginx`)
            .setDescription(`If you see this page, the nginx web server is successfully installed and working. Further configuration is required.\n\nFor online documentation and support please refer to [nginx.org](http://nginx.org/).\nCommercial support is available at [nginx.com](http://nginx.com/).\n\n*Thank you for using nginx.*`)
            .setColor('DarkVividPink')

        // Send the sample embed as a hidden reply
        return interaction.reply({
            embeds: [exampleEmbed],
            flags: MessageFlags.Ephemeral
        });
    }
};
