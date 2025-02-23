const { AutocompleteInteraction } = require("discord.js");

const Logger = require('../util/Logger');

/** @typedef {import("../util/Types").ExtendedClient} ExtendedClient */

/**
 * 
 * @param {AutocompleteInteraction} interaction 
 * @param {ExtendedClient} client 
 * @returns
 */
async function executeAutoComplete(interaction, client) {
    /** Check if the interaction is actually an autocomplete */
    if (!interaction.isAutocomplete()) return;

    /** Setup permission checking */
    let choices = [{ name: `Sorry, autocomplete isn't available at the moment.`, value: `no_error_found` }];
    
    /** Check if autocomplete interaction exists */
    const command = client.commands.get(interaction.commandName);
    if (!command?.autocomplete) {
        Logger.error(`Autocomplete for /${interaction.commandName} does not exist.`);
        choices[0].name = `This autocomplete is not linked to a response.`;
        choices[0].value = `no_command_exists`;
    }

    /** Check if the autocomplete requires SuperUser */
    if (command?.superUserOnly && !process.env.SUPER_USERS?.split(/, |,/).includes(interaction.user.id)) choices[0].value = `permission_error_super_user`;

    /** Check if the autocomplete requires GuildOwner */
    if (command?.ownerOnly && interaction.member.id !== interaction?.guild.ownerId) choices[0].value = `permission_error_guild_owner`;

    /** Check if the autocomplete requires a Permission */
    if (command?.permission && !interaction.member.permissions.has(command.permission)) choices[0].value = `permission_error_guild_permission`;

    /** Check if the autocomplete requires a Role */
    if (command?.reqRoles) {
        if (interaction.channel.isDMBased()) {
            choices[0].name = `Sorry, this autocomplete requires a server role.`;
            choices[0].value = `permission_error_dm`;
        };

        let hasReqRole = false;

        command.reqRoles.forEach((findRole) => {
            if (interaction?.member.roles.cache.has(findRole)) hasReqRole = true;
        });

        if (!hasReqRole) choices[0].value = `permission_error_guild_role`;
    };

    /** Process errors */
    if (choices[0].value !== `no_error_found`) return interaction.respond(choices);

    /** Execute the autocomplete */
    return command.autocomplete(interaction, client);
};

module.exports = { executeAutoComplete };
