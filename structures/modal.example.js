const { ModalSubmitInteraction, Client, EmbedBuilder } = require("discord.js");

module.exports = {
    id: `example-modal`,
    
    /**
     * 
     * @param {ModalSubmitInteraction} interaction 
     * @param {Client} client 
     * @returns 
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        const textinput = interaction.fields.getTextInputValue("textInput1");

        let replyEmbed = new EmbedBuilder()
        .setTitle("Modal Submitted")
        .setDescription(`You submitted the modal with the text input value of ${textinput}`)
        .setColor(client.config.color)
        
        return modal.followUp({ embeds: [replyEmbed] });
    }
}