const { StringSelectMenuInteraction, MessageFlags } = require('discord.js');
const StatusEmbedBuilder = require('../../../structures/funcs/tools/createStatusEmbed');

/** @typedef {import("../../../structures/funcs/util/Types").ExtendedClient} ExtendedClient */

module.exports = {
    id: "ceb_send_channel",

    /**
    * 
    * @param {StringSelectMenuInteraction} interaction 
    * @param {ExtendedClient} client 
    */
    async execute(interaction, client) {
        const statusEmbed = new StatusEmbedBuilder("Send Embed", { name: "Embed Builder", iconURL: client.user.displayAvatarURL() });

        await interaction.deferUpdate();

        let referencedMessage = await interaction.message.fetchReference();
        let customEmbed = referencedMessage.embeds[0];

        let channel = interaction.values[0];
        let channelToSend = await interaction.guild.channels.fetch(channel);

        try {
            await channelToSend.send({ embeds: [customEmbed] });

            return interaction.editReply({
                embeds: [statusEmbed.create(`The embed has been successfully sent to <#${channelToSend.id}>.\nIn case you wanted to save it, we've not deleted the embed builder above - cancel or save the embed now to remove it from the channel.`, 'Green')],
                components: [],
                flags: MessageFlags.Ephemeral
            });
        } catch {
            return interaction.editReply({
                embeds: [statusEmbed.create(`There was an error sending the embed to <#${channelToSend.id}>.\nTry using the select menu below to select a different channel, or check the bot's permissions to send in that channel.`, 'Red')],
                flags: MessageFlags.Ephemeral
            });
        };
    }
};
