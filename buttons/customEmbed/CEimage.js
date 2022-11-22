const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  id: "CEimage",
  permission: PermissionFlagsBits.ManageMessages,

  async execute(interaction, client) {
    // embeds
    const embeds = interaction.message.embeds;
    let modifiedEmbed = embeds[1];

    // utilities
    const error = client.customEmbedService.error;

    const imageEmbed = client.customEmbedService.embeds.imageEmbed;

    interaction.message.edit({ embeds: [imageEmbed, embeds[1]] });

    let msgEmbed = new EmbedBuilder().setColor("F4D58D").setDescription("**Enter a direct image link:**");
    interaction.reply({ embeds: [msgEmbed] });

    const filter = (m) => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({
      filter,
    });

    client.customEmbedService.buttons(client, interaction, collector);

    collector.on("collect", (m) => {
      let image = "";

      image = m.content;

      let formatRegex = /\/raw$|\.png$|\.jpeg$|\.jpg$|\.gif$/;
      let urlRegex = /^https?:\/\//;
      if (!image.match(formatRegex) || !image.match(urlRegex)) {
        return error(interaction, "Invalid image link", m);
      }

      interaction.editReply({
        embeds: [msgEmbed.setDescription(`**Send a new link to update the image**`)],
      });

      modifiedEmbed = EmbedBuilder.from(embeds[1]).setImage(image);

      interaction.message
        .edit({
          embeds: [imageEmbed, modifiedEmbed],
        })
        .then(() => setTimeout(() => m.delete(), 1000));
    });
  },
};
