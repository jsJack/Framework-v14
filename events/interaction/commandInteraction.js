const { CommandInteraction } = require('discord.js');
const consola = require('consola');

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return interaction.reply({ content: `There is no command with this name.`, ephemeral: true });

        consola.info(`${interaction.guild.name} | ${interaction.member.user.tag} | /${interaction.command.name}`)
        command.execute(interaction, client);
    }
}


// Command Cooldowns (User and server??)
// Text Aliases
// Required Roles