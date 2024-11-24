const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

const { loadCommands } = require('../../structures/handlers/loadCommands');
const { loadEvents } = require('../../structures/handlers/loadEvents');
const { loadModals } = require('../../structures/handlers/loadModals');
const { loadButtons } = require('../../structures/handlers/loadButtons');
const { loadSelectMenus } = require('../../structures/handlers/loadSelectMenus');

const Logger = require('../../structures/funcs/util/Logger');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload available commands and events in the bot")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((options) => options.setName("events").setDescription("Reload events"))
    .addSubcommand((options) => options.setName("commands").setDescription("Reload commands"))
    .addSubcommand((options) => options.setName("modals").setDescription("Reload modals"))
    .addSubcommand((options) => options.setName("buttons").setDescription("Reload buttons"))
    .addSubcommand((options) => options.setName("selectmenus").setDescription("Reload selectmenus")),

    developer: true,
    usage: "/reload <type>",

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        let embed = new EmbedBuilder()
        .setTitle(`🔃 Reloaded!`)
        .setDescription(`Requested reload for all **${interaction.options.getSubcommand()}**!`)
        .setColor(client.config.color);

        switch(interaction.options.getSubcommand()) {
            case "events": loadEvents(client);
            break;
            
            case "commands": await loadCommands(client);
            break;

            case "modals": await loadModals(client);
            break;

            case "buttons": await loadButtons(client);
            break;

            case "selectmenus": await loadSelectMenus(client);
            break;
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return Logger.warn(`[Reload] @${interaction.user.username} reloaded all ${interaction.options.getSubcommand()}`);
    }
};
