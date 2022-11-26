const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: `playlistAdd`,
    player: true,

    async execute(queue, playlist, client) {
        let embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setTimestamp()
        .setDescription(`A playlist was added to the queue in **${queue.guild.name}**:\n**${playlist.name}** by __${playlist.author}__ • ${playlist.songs.length} songs\nAdded to the queue by <@${playlist.songs[0].requestedBy}>`)

        console.log(playlist);
        
        await queue.guild.channels.cache.find(c=>c.name===`music-logs`).send({ embeds: [embed] }).catch(() => {});
    }
}