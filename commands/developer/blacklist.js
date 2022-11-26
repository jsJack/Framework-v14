const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const blacklist = require('../../structures/schema/blacklist');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Blacklist a user or guild from using the bot')
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Blacklist a user from using the bot')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user to blacklist')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('reason')
                        .setDescription('The reason for blacklisting the user')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('time')
                        .setDescription('Must be in a string-readable format (1w, 1d, etc) - Defaults to 1w')
                        .setRequired(false)
                )
                .addStringOption(option =>
                    option
                        .setName('commands')
                        .setDescription('The commands to blacklist, comma separated list, defaults to "all"')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('guild')
                .setDescription('Blacklist a guild from using the bot')
                .addStringOption(option =>
                    option
                        .setName('guild')
                        .setDescription('The guild to blacklist')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('reason')
                        .setDescription('The reason for blacklisting the guild')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('time')
                        .setDescription('Must be in a string-readable format (1w, 1d, etc) - Defaults to 1w')
                        .setRequired(false)
                )
                .addStringOption(option =>
                    option
                        .setName('commands')
                        .setDescription('The commands to blacklist, comma separated list, defaults to "all"')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a blacklist from a user or guild')
                .addStringOption(option =>
                    option
                        .setName('type')
                        .setDescription('The type of blacklist to remove')
                        .setRequired(true)
                        .addChoices({ name: 'User', value: 'user' }, { name: 'Guild', value: 'guild' })
                )
                .addStringOption(option =>
                    option
                        .setName('id')
                        .setDescription('The id of the user or guild to remove the blacklist from')
                        .setRequired(true)
                )
        ),
    
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        let user = interaction.options.getUser('user');
        let guild = interaction.options.getString('guild');
        let reason = interaction.options.getString('reason');
        let time = interaction.options.getString('time') || '1w';
        let commands = interaction.options.getString('commands') || 'all';
        let type = interaction.options.getSubcommand();

        switch (type) {
            case 'user': {
                let userBlacklist = await blacklist.findOne({ id: user.id });
                if (userBlacklist) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`That user is already blacklisted.`).setColor('NotQuiteBlack')], ephemeral: true });

                commands = commands.split(',').map(c => c.trim());

                let userBlacklistData = {
                    id: user.id,
                    type: 'user',
                    reason: reason,
                    by: interaction.user.id,
                    at: Date.now(),
                    until: Date.now() + ms(time),
                    cmds: commands,
                };

                await blacklist.create(userBlacklistData);

                let blEmbed = new EmbedBuilder()
                    .setTitle('User Blacklisted')
                    .setDescription(`**Guild:** ${guild}\n**Reason:** ${reason}\n**Time:** ${time}\n**Commands:** ${commands.join(', ')}`)
                    .setColor('NotQuiteBlack')
                    .setTimestamp();

                return interaction.reply({ embeds: [blEmbed], ephemeral: true });
            }

            case 'guild': {
                let guildBlacklist = await blacklist.findOne({ id: guild });
                if (guildBlacklist) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`That guild is already blacklisted.`).setColor('NotQuiteBlack')], ephemeral: true });

                commands = commands.split(',').map(c => c.trim());

                let guildBlacklistData = {
                    id: guild,
                    type: 'guild',
                    reason: reason,
                    by: interaction.user.id,
                    at: Date.now(),
                    until: Date.now() + ms(time),
                    cmds: commands,
                };

                await blacklist.create(guildBlacklistData);
                
                let blEmbed = new EmbedBuilder()
                    .setTitle('Guild Blacklisted')
                    .setDescription(`**Guild:** ${guild}\n**Reason:** ${reason}\n**Time:** ${time}\n**Commands:** ${commands.join(', ')}`)
                    .setColor('NotQuiteBlack')
                    .setTimestamp();

                return interaction.reply({ embeds: [blEmbed], ephemeral: true });
            }

            case 'remove': {
                let bl = await blacklist.findOne({ id: interaction.options.getString('id') });
                if (!bl) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`That user or guild is not blacklisted.`).setColor('NotQuiteBlack')], ephemeral: true });

                await blacklist.deleteOne({ id: interaction.options.getString('id') });

                let blEmbed = new EmbedBuilder()
                    .setTitle('Blacklist Removed')
                    .setDescription(`**Type:** ${bl.type}\n**ID:** ${bl.id}\n**Reason:** ${bl.reason}\n**Time:** ${ms(bl.until - bl.at, { long: true })}\n**Commands:** ${bl.cmds.join(', ')}`)
                    .setColor('NotQuiteBlack')
                    .setTimestamp();

                return interaction.reply({ embeds: [blEmbed], ephemeral: true });
            }
        }
    }
}