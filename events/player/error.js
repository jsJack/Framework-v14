const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: `error`,
    player: true,

    async execute(error, queue, client) {
        let embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setTimestamp()
        .setDescription(`There was a music runtime error in **${queue.guild.name}**:\n\`\`\`${error}\`\`\``)
        
        await queue.guild.channels.cache.find(c=>c.name===`music-logs`).send({ embeds: [embed] }).catch(() => {});
    }
}