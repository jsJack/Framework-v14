const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: `channelEmpty`,
    player: true,

    async execute(queue, client) {
        let embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setTimestamp()
        .setDescription(`Everyone left my channel: <#${queue.connection.channel.id}>\nThe queue has been destroyed.`)
        
        await queue.guild.channels.cache.find(c=>c.name===`music-logs`).send({ embeds: [embed] }).catch(() => {});
    }
}