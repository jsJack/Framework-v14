// This will fire on the ModalSubmit event and this is what happens if the ID of the modal submitted is "modalTest"
const { ModalSubmitInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
    id: "modalTest",
    /**
     * 
     * @param {ModalSubmitInteraction} modal
     */
    async execute(modal) {
        await modal.deferReply({ ephemeral: true });
        const textinput = modal.fields.getTextInputValue("modalTestInput");

        let replyEmbed = new EmbedBuilder()
        .addField(`You said:`, `${textinput}`, false)
        .setColor(client.config.color)
        
        return modal.followUp({ embeds: [replyEmbed] });
    }
}