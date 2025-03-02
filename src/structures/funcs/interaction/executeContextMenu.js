const { ContextMenuCommandInteraction, EmbedBuilder, MessageFlags } = require("discord.js");
const timestring = require('timestring');

const Logger = require('../util/Logger');
const { getCooldown, setCooldown, generateCooldownEmbed } = require("../util/CooldownManager");

/** @typedef {import("../util/Types").ExtendedClient} ExtendedClient */

/**
 * 
 * @param {ContextMenuCommandInteraction} interaction 
 * @param {ExtendedClient} client 
 * @returns  
 */
async function executeContextMenu(interaction, client) {
    /** Check if the interaction is actually a context menu */
    if (!interaction.isContextMenuCommand()) return;

    /** Check if the context menu exists */
    const app = client.apps.get(interaction.commandName);
    if (!app) {
        Logger.error(`ContextMenu ${interaction.commandName} does not exist.`);
        return interaction.reply({ content: `This context menu is not linked to a response.`, flags: [MessageFlags.Ephemeral] });
    };

    /** Check if the context menu needs to be ignored */
    if (client.config.ignoredInteractions.apps.includes(interaction.commandName)) return;

    /** Check if the user is on a cooldown */
    if (app?.cooldown) {
        const cooldown = await getCooldown(client, "app", interaction.commandName, interaction.user.id);
        if (cooldown) return interaction.reply({ embeds: [generateCooldownEmbed(client, getCooldown(client, "button", interaction.commandName, interaction.user.id))], flags: [MessageFlags.Ephemeral] });

        // Set the cooldown
        let appCooldown;
        try {
            appCooldown = timestring(app.cooldown);
        } catch (e) {
            Logger.error(`The cooldown for app ${interaction.commandName} is not a valid timestring.`);
        };

        setCooldown(client, "app", interaction.commandName, interaction.user.id, timestring(appCooldown));
    };

    /** Setup permission checking */
    let hasError = false;

    /** Check if the app requires SuperUser */
    if (app?.superUserOnly && !process.env.SUPER_USERS?.split(/, |,/).includes(interaction.user.id)) hasError = "permission_error_super_user";

    /** Check if the app requires GuildOwner */
    if (app?.ownerOnly && interaction.member.id !== interaction?.guild.ownerId) hasError = "permission_error_guild_owner";

    /** Check if the app requires a Permission */
    if (app?.permission && !interaction.member.permissions.has(app?.permission)) hasError = "permission_error_guild_permission";

    /** Check if the app requires a Role */
    if (app?.reqRoles) {
        if (interaction.channel.isDMBased()) hasError = "permission_error_dm";

        let hasReqRole = false;

        command.reqRoles.forEach((findRole) => {
            if (interaction?.member.roles.cache.has(findRole)) hasReqRole = true;
        });

        if (!hasReqRole) hasError = "permission_error_guild_role";
    };

    /** Process errors */
    if (hasError) {
        let errorEmbed = new EmbedBuilder()
            .setColor(client.config.color);

        switch (hasError) {
            case "permission_error_super_user":
                errorEmbed.setDescription(`❌ This app is locked to __Super Users__ only!`);
                break;

            case "permission_error_guild_owner":
                errorEmbed.setDescription(`❌ This app is locked to the __Owner of the Guild__!`);
                break;

            case "permission_error_guild_permission":
                errorEmbed.setDescription(`❌ You do not have permission to use this app!`);
                break;

            case "permission_error_guild_role":
                errorEmbed.setDescription(`❌ You do not have the required roles to execute this app`)
                    .addFields({ name: `Required Roles`, value: `<@&${button.reqRoles.join(">, <@&")}>` });
                break;

            case "permission_error_dm":
                errorEmbed.setDescription(`❌ A server role is required to interact with this app!\nPlease try again in a server.`);

                break;

            default:
                errorEmbed.setDescription(`❌ There was a permission error, but we're not sure what.`)
        };

        return interaction.reply({ embeds: [errorEmbed], flags: [MessageFlags.Ephemeral] });
    };

    /** Execute the app */
    Logger.log(`${interaction.channel.isDMBased() ? `DMs` : `${interaction.guild.name}`} | ${interaction.user.tag} | 📱 ${interaction.commandName}`)    
    return app.execute(interaction, client);
};

module.exports = { executeContextMenu };
