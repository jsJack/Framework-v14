const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  id: "CEauthor",
  permission: PermissionFlagsBits.ManageMessages,

  async execute(interaction, client) {
    // embeds
    const embeds = interaction.message.embeds;
    let modifiedEmbed = embeds[1];

    const error = client.customEmbedService.error;

    const authorEmbed = client.customEmbedService.embeds.authorEmbed;

    interaction.message.edit({
      embeds: [authorEmbed, embeds[1]],
    });

    let msgEmbed = new EmbedBuilder().setColor("F4D58D").setDescription("Tag a user");

    interaction.reply({ embeds: [msgEmbed] });

    //create message collector
    const filter = (m) => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({
      filter,
    });

    client.customEmbedService.buttons(client, interaction, collector, "author");

    collector.on("collect", (m) => {
      if (m.content.length >= 256) {
        return error(interaction, "**Author is too long**", m);
      }

      author = m.mentions.users.first();
      if (!author) {
        return error(interaction, "**Please tag a user**", m);
      }

      interaction.editReply({
        embeds: [EmbedBuilder.from(msgEmbed).setDescription(`Author set to: \`${author.username}\``)],
      });

      modifiedEmbed = EmbedBuilder.from(embeds[1]).setAuthor({
        name: `${author.username}`,
        iconURL: author.displayAvatarURL({
          dynamic: true,
          size: 512,
        }),
      });

      interaction.message
        .edit({
          embeds: [authorEmbed, modifiedEmbed],
        })
        .then(() => setTimeout(() => m.delete(), 1000));
    });
  },
};
