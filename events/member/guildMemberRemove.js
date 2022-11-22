const { GuildMember, Client, EmbedBuilder } = require('discord.js');

module.exports = {
    name: `guildMemberRemove`,

    async execute(member = new GuildMember, client = new Client) {
        let logEmbed = new EmbedBuilder()
            .setTitle(`📤 Member Left`)
            .setDescription(`${member.user.tag} (\`${member.user.id}\`)`)
            .addFields(
                {
                    name: `Account Created`,
                    value: `<t:${Math.floor(member.user.createdAt.getTime() / 1000)}:R>`,
                    inline: true
                },
                {
                    name: `Member Joined`,
                    value: `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:R>`,
                    inline: true
                },
                {
                    name: `Roles`,
                    value: member.roles.cache.map(r => r.toString()).join(`, `),
                    inline: false
                }
            )
            .setColor(client.config.color)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))

        let logChannel = member.guild.channels.cache.find(c => c.name === `logs`);
        if (logChannel) await logChannel.send({ embeds: [logEmbed] });
    }
}