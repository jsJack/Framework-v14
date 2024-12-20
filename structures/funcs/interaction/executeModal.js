const { EmbedBuilder, ModalSubmitInteraction, Client } = require('discord.js');
const Logger = require('../util/Logger');

/**
 * 
 * @param {ModalSubmitInteraction} modal 
 * @param {Client} client 
 * @returns 
 */
async function executeModal(modal, client) {
    if (!modal.isModalSubmit()) return;
    const getModal = client.modals.get(modal.customId);

    let e = new EmbedBuilder()
        .setDescription(`🛠 This modal is not linked to a response.\nPlease try again later.`)
        .setColor(client.config.color)
        .setFooter({ text: `Item code: ${modal.customId} - JPY Software` });

    if (!getModal) return modal.reply({ embeds: [e], ephemeral: true });

    Logger.log(`${modal.guild.name} | ${modal.user.tag} | 📋 ${modal.customId}`);
    getModal.execute(modal, client);
}

module.exports = { executeModal };
