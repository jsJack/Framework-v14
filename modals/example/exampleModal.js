// This will fire on the ModalSubmit event and this is what happens if the ID of the modal submitted is "modalTest"
const { ModalSubmitInteraction, EmbedBuilder, Client } = require("discord.js");

module.exports = {
    id: "myModal",
    /**
     * 
     * @param {ModalSubmitInteraction} modal
     * @param {Client} client
     */
    async execute(modal, client) {
        await modal.deferReply({ ephemeral: true });
        const textinput = modal.fields.getTextInputValue("textInput1");

        let replyEmbed = new EmbedBuilder()
        .addFields(
            { name: `Is your mother gay?`, value: `You said: **${textinput}**`, inline: false }
        )
        .setColor(client.config.color)
        
        return modal.followUp({ embeds: [replyEmbed] });
    }
}
