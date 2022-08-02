const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const consola = require('consola');
const { loadCommands } = require('../../structures/handlers/commands');
const { loadEvents } = require('../../structures/handlers/events');
const { loadModals } = require('../../structures/handlers/modals');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload available commands and events in the bot")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((options) => options.setName("events").setDescription("Reload your events"))
    .addSubcommand((options) => options.setName("commands").setDescription("Reload your commands"))
    .addSubcommand((options) => options.setName("modals").setDescription("Reload your modals")),

    developer: true,
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
            case "events": {
                loadEvents(client);
                interaction.reply({ embeds: [embed] });
            }
            break;
            
            case "commands": {
                loadCommands(client);
                interaction.reply({ embeds: [embed] });
            }
            break;

            case "modals": {
                loadModals(client);
                interaction.reply({ embeds: [embed] });
            }
            break;
        }

        return console.log(`[Reload] ${interaction.member.user.tag} reloaded all ${interaction.options.getSubcommand()}`)
    }
}