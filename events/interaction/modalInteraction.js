const { EmbedBuilder, ModalSubmitInteraction, Client } = require('discord.js');

module.exports = {
    name: "modalSubmit",
    /**
     * 
     * @param {ModalSubmitInteraction} modal
     * @param {Client} client 
     */
    async execute(modal, client) {
        const getModal = client.modals.get(modal.customId);

        let e = new EmbedBuilder()
        .setDescription(`🛠 This modal is not linked to a response.\nPlease try again later.`)
        .setColor(client.config.color)
        .setFooter({ text: `Item code: ${modal.customId} - Infinity Development` });

        if (!getModal) return modal.followUp({ embeds: [e], ephemeral: true });

        getModal.execute(modal, client);
    }
}