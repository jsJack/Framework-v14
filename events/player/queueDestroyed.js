const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: `queueDestroyed`,
    player: true,

    async execute(queue, client) {
        let embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setTimestamp()
        .setDescription(`The queue for <#${queue.connection.channel.id}> in **${queue.guild.name}** was destroyed.\nI left the voice channel.`)
        
        await queue.guild.channels.cache.find(c=>c.name===`music-logs`).send({ embeds: [embed] }).catch(() => {});
    }
}