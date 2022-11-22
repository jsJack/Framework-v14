const { GuildMember, Client, EmbedBuilder } = require('discord.js');

module.exports = {
    name: `guildMemberAdd`,

    async execute(member = new GuildMember, client = new Client) {
        let logEmbed = new EmbedBuilder()
            .setTitle(`📤 Member Joined`)
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
            )
            .setColor(client.config.color)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))

        let logChannel = member.guild.channels.cache.find(c => c.name === `logs`);
        if (logChannel) await logChannel.send({ embeds: [logEmbed] });
    }
}