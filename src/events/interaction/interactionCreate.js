const { BaseInteraction, EmbedBuilder, MessageFlags } = require('discord.js');

const { executeSlashCommand } = require('../../structures/funcs/interaction/executeSlashCommand');
const { executeButton } = require('../../structures/funcs/interaction/executeButton');
const { executeSelectMenu } = require('../../structures/funcs/interaction/executeSelectMenu');
const { executeModal } = require('../../structures/funcs/interaction/executeModal');
const { executeAutoComplete } = require('../../structures/funcs/interaction/executeAutoComplete');
const { executeContextMenu } = require('../../structures/funcs/interaction/executeContextMenu');

/** @typedef {import("../../structures/funcs/util/Types").ExtendedClient} ExtendedClient */

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {BaseInteraction} interaction 
     * @param {ExtendedClient} client
     */
    async execute(interaction, client) {
        // Autocomplete ignores being blacklisted
        if (interaction.isAutocomplete()) return executeAutoComplete(interaction, client);

        // Blacklist checks
        let userBlacklist = await client.db.blacklist.findFirst({ where: { id: interaction.user.id } });
        let guildBlacklist = await client.db.blacklist.findFirst({ where: { id: interaction.guild.id } });

        let scope = (userBlacklist ?? guildBlacklist)?.commands;

        let skipBlacklistChecks = false;
        if (process.env.SUPER_USERS?.split(',').includes(interaction.user.id)) skipBlacklistChecks = true;
        if (interaction.commandName === 'blacklist' && interaction.options.getSubcommand() === 'remove') skipBlacklistChecks = true;
        if (!scope?.includes(interaction.commandName) && !scope?.includes("all")) skipBlacklistChecks = true;

        if ((userBlacklist || guildBlacklist) && !skipBlacklistChecks) {
            let blacklistEmbed = new EmbedBuilder()
                .setTitle(`🚫 Blacklisted`)
                .setDescription(`${userBlacklist ? `You are` : `This server is`} blacklisted from using this bot.`)
                .setFields(
                    { name: `Reason`, value: `${userBlacklist?.reason ?? guildBlacklist?.reason}` },
                    { name: `Expires`, value: `<t:${userBlacklist?.expiresAt ?? guildBlacklist?.expiresAt}:F>` }
                )
                .setColor(client.config.color)
                .setFooter({ text: `Blacklisted on` })
                .setTimestamp(new Date(Number((userBlacklist ?? guildBlacklist).createdAt) * 1000));

            if (!scope?.includes("all")) blacklistEmbed.addFields({ name: `Commands`, value: `/` + scope?.join(', /') });

            return interaction.reply({ embeds: [blacklistEmbed], flags: [MessageFlags.Ephemeral] });
        };
        
        // Execute the interaction because we're not blacklisted
        if (interaction.isChatInputCommand()) executeSlashCommand(interaction, client);
        else if (interaction.isButton()) executeButton(interaction, client);
        else if (interaction.isModalSubmit()) executeModal(interaction, client);
        else if (interaction.isStringSelectMenu()) executeSelectMenu(interaction, client);
        else if (interaction.isContextMenuCommand() || interaction.isUserContextMenuCommand() || interaction.isMessageContextMenuCommand()) executeContextMenu(interaction, client);
        else return;
    }
};
