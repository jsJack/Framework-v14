const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: `songChanged`,
    player: true,

    async execute(queue, newSong, oldSong, client) {
        let embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setTimestamp()
        .setDescription(`Song changed in ${queue.guild.name}:\n[${oldSong.name}](${oldSong.url}) came to an end, and [${newSong.name}](${newSong.url}) is now playing.\nAdded to the queue by <@${newSong.requestedBy}>`)
        .setThumbnail(newSong.thumbnail)
        
        await queue.guild.channels.cache.find(c=>c.name===`music-logs`).send({ embeds: [embed] }).catch(() => {});
    }
}