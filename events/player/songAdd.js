const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: `songAdd`,
    player: true,

    async execute(queue, song, client) {
        let embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setTimestamp()
        .setDescription(`A song was added to the queue in **${queue.guild.name}**:\n[${song.name}](${song.url}) [${song.duration}]\nAdded to the queue by <@${song.requestedBy}>`)
        .setThumbnail(song.thumbnail)
        
        await queue.guild.channels.cache.find(c=>c.name===`music-logs`).send({ embeds: [embed] }).catch(() => {});
    }
}