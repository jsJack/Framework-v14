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
        if (interaction.options.getSubcommand() != "load") return;
        
        let choices = [{ name: `Test`, value: `test` }];
        return interaction.respond(choices);
    },

    /**
    * 
    * @param {ChatInputCommandInteraction} interaction
    * @param {ExtendedClient} client
    */
    async execute(interaction, client) {
    }
};
