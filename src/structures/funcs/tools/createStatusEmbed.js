const { EmbedBuilder } = require('discord.js');

class StatusEmbedBuilder {
    /**
     * 
     * @param {String} title 
     * @param {Object} [author] Optional author object
     */
    constructor(title, author) {
        this.title = title;
        if (author?.name) {
            this.author = {
                name: author.name,
                iconURL: author.iconURL
            };
        }
    }

    create(description, color) {
        const embed = new EmbedBuilder()
            .setTitle(this.title)
            .setDescription(description)
            .setColor(color);

        if (this.author) {
            embed.setAuthor({ name: this.author.name, iconURL: this.author.iconURL });
        }

        return embed;
    }
};

module.exports = StatusEmbedBuilder;
