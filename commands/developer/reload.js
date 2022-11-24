const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const consola = require('consola');

const { loadCommands } = require('../../structures/handlers/loadCommands');
const { loadEvents } = require('../../structures/handlers/loadEvents');
const { loadModals } = require('../../structures/handlers/loadModals');
const { loadButtons } = require('../../structures/handlers/loadButtons');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload available commands and events in the bot")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((options) => options.setName("events").setDescription("Reload your events"))
    .addSubcommand((options) => options.setName("commands").setDescription("Reload your commands"))
    .addSubcommand((options) => options.setName("modals").setDescription("Reload your modals"))
    .addSubcommand((options) => options.setName("buttons").setDescription("Reload your buttons")),

    developer: true,
    usage: "/reload <type>",
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        let embed = new EmbedBuilder()
        .setTitle(`🔃 Reloaded!`)
        .setDescription(`Successfully reloaded all **${interaction.options.getSubcommand()}**!`)
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
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return consola.warn(`[Reload] ${interaction.member.user.tag} reloaded all ${interaction.options.getSubcommand()}`);
    }
}
