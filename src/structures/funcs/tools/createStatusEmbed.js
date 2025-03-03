class StatusEmbedBuilder {
    /**
     * 
     * @param {String} title 
     * @param {Object} author 
     */
    constructor(title, author) {
        this.title = title;
        this.author = {
            name: author?.name,
            iconURL: author?.iconURL
        };
    }

    create(description, color) {
        return new EmbedBuilder()
            .setAuthor({ name: this.author.name, iconURL: this.author.iconURL })
            .setTitle(this.title)
            .setDescription(description)
            .setColor(color);
    }
};

module.exports = StatusEmbedBuilder;
