const { SlashCommandBuilder, ChatInputCommandInteraction, AutocompleteInteraction, EmbedBuilder, MessageFlags } = require('discord.js');

/** @typedef {import("../../structures/funcs/util/Types").ExtendedClient} ExtendedClient */

module.exports = {
    data: new SlashCommandBuilder()
       .setName("embed")
       .setDescription("Create or load a custom embed")
       
       .addSubcommand(subcommand =>
              subcommand
                .setName("create")
                .setDescription("Create a custom embed")
       )

       .addSubcommand(subcommand =>
                subcommand
                    .setName("load")
                    .setDescription("Load a saved custom embed")
                    .addStringOption(option =>
                        option.setName("name")
                            .setDescription("The name of the embed")
                            .setRequired(true)
                            .setAutocomplete(true)
                    )
        ),
    
    /**
     * 
     * @param {AutocompleteInteraction} interaction 
     * @param {ExtendedClient} client 
     */
    async autocomplete(interaction, client) {
        let savedEmbeds = await client.db.embed.findMany({
            where: {
                name: { startsWith: interaction.options.getString("name") }
            }
        });

        let choices = savedEmbeds.map(embed => {
            return {
                name: embed.name,
                value: embed.id
            };
        });

        if (!choices.length) choices = [{ name: "No embeds found", value: "none" }];

        return interaction.respond(choices);
    },

    /**
    * 
    * @param {ChatInputCommandInteraction} interaction
    * @param {ExtendedClient} client
    */
    async execute(interaction, client) {
        let subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case "create":
                return create(interaction, client);
            case "load":
                return load(interaction, client);

            default: return interaction.reply({ content: "Sorry, that subcommand hasn't been implemented.", flags: [MessageFlags.Ephemeral] });
        };
    }
};

/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 * @param {ExtendedClient} client 
 * @returns 
 */
async function create(interaction, client) {
    let embed = new EmbedBuilder()
        .setTitle("New Embed")
        .setDescription("This is a new embed")
        .setColor('Random')
        .setTimestamp();

    return interaction.reply({ embeds: [embed] });
};

/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 * @param {ExtendedClient} client 
 * @returns 
 */
async function load(interaction, client) {
    return interaction.reply({ content: `Loading embed: ${interaction.options.getString("name")}` });
};
