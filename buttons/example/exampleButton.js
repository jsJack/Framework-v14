const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
    id: "exampleButton", // The custom id of the button
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {
        let modal = new ModalBuilder()
        .setCustomId(`myModal`)
        .setTitle(`This super amazing modal`)

        let textInput1 = new TextInputBuilder()
        .setCustomId(`textInput1`)
        .setLabel(`Is your mother gay?`)
        .setStyle(TextInputStyle.Short)

        let question1 = new ActionRowBuilder().addComponents(textInput1);

        modal.addComponents(question1)

        return interaction.showModal(modal);
    }
};
