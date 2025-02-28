/**
 * Use !cmd in VS Code to paste this template
 */

const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');

// This import may be different depending on your project structure
/** @typedef {import("../src/structures/funcs/util/Types").ExtendedClient} ExtendedClient */

module.exports = {
    data: new SlashCommandBuilder()
       .setName("command")
       .setDescription("This is an example command")
       .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
       // Default permissions for the command, can be overriden in individual guilds settings.

    developer: false, // Only register this command in the dev guild?
    cooldown: "5s", // Cooldown for the command - in timestring format
    superUserOnly: false, // Only allow super users to run this command (.env file)
    ownerOnly: false, // Only allow the guild owner to run this command
    reqRoles: ["role_id", "role_id2"], // Required roles for the user

    /**
    * 
    * @param {ChatInputCommandInteraction} interaction
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
