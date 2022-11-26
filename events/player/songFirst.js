const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: `songFirst`,
    player: true,

    async execute(queue, song, client) {
        let embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setTimestamp()
        .setDescription(`A new queue has been started by <@${song.requestedBy}> in **${queue.guild.name}**.\nStarting with: [${song.name}](${song.url}) [${song.duration}] in <#${queue.connection.channel.id}>`)
        .setThumbnail(song.thumbnail)
        
        await queue.guild.channels.cache.find(c=>c.name===`music-logs`).send({ embeds: [embed] }).catch(() => {});
    }
}