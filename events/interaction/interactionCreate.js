const { BaseInteraction, Client, EmbedBuilder } = require('discord.js');
const { executeSlashCommand } = require('../../structures/funcs/interaction/executeSlashCommand');
const { executeButton } = require('../../structures/funcs/interaction/executeButton');
const { executeSelectMenu } = require('../../structures/funcs/interaction/executeSelectMenu');
const { executeModal } = require('../../structures/funcs/interaction/executeModal');
const blacklist = require('../../structures/schema/blacklist');

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {BaseInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
        let blacklisted = false;

        const userBlacklist = await blacklist.findOne({ id: interaction.user.id, type: "user" });
        if (userBlacklist) blacklisted = true;

        const guildBlacklist = await blacklist.findOne({ id: interaction.guild.id, type: "guild" });
        if (guildBlacklist) blacklisted = true;

        if (blacklisted) {
            if (userBlacklist && userBlacklist.until < Date.now()) {
                await blacklist.deleteOne({ id: interaction.user.id, type: "user" });
            } else if (guildBlacklist && guildBlacklist.until < Date.now()) {
                await blacklist.deleteOne({ id: interaction.guild.id, type: "guild" });
            } else {
                let cmds = userBlacklist ? userBlacklist.cmds : guildBlacklist.cmds;
                if (cmds.includes(interaction.commandName) || cmds.includes(interaction.customId) || cmds.includes("all")) blacklisted = true;
                else blacklisted = false;

                if (blacklisted) {
                    let timestamp = userBlacklist ? userBlacklist.until : guildBlacklist.until;
                    let reason = userBlacklist ? userBlacklist.reason : guildBlacklist.reason;
                    let by = userBlacklist ? userBlacklist.by : guildBlacklist.by;

                    let blEmbed = new EmbedBuilder()
                        .setTitle('Blacklisted')
                        .setDescription(`${userBlacklist ? "You are" : "This guild is"} blacklisted from using this command.`)
                        .setColor('NotQuiteBlack')
                        .setTimestamp()
                        .addFields(
                            { name: 'Reason', value: reason, inline: true },
                            { name: 'By', value: `<@${by}>`, inline: true },
                            { name: 'Unblacklisted', value: `<t:${Math.floor(timestamp / 1000)}:R>`, inline: true }
                        );
                    return interaction.reply({ embeds: [blEmbed], ephemeral: true });
                }
            }
        }

        if (interaction.isCommand()) executeSlashCommand(interaction, client);
        else if (interaction.isButton()) executeButton(interaction, client);
        else if (interaction.isModalSubmit()) executeModal(interaction, client);
        else if (interaction.isSelectMenu()) executeSelectMenu(interaction, client);
        else return;
    }
}