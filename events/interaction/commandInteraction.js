const { CommandInteraction, Collection } = require('discord.js');
const consola = require('consola');
const ms = require('ms');

const Timeout = new Collection();

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return interaction.reply({ content: `There is no command with this name.`, ephemeral: true });

        if(command.cooldown) {
            console.log(ms(command.cooldown));

            if(Timeout.has(`${interaction.commandName}${interaction.member.id}`)) {
                let lastUsage = Timeout.get(`${interaction.commandName}${interaction.member.id}`);
                let msTimeout = ms(command.cooldown) / 1000;
                let timestamp = parseInt(lastUsage) + parseInt(msTimeout);
                return interaction.reply({ content: `You can use this command again: <t:${timestamp}:R>` })
            }
            
            Timeout.set(`${interaction.commandName}${interaction.member.id}`, (Date.now() / 1000).toFixed(0));

            setTimeout(() => {
                Timeout.delete(`${interaction.commandName}${interaction.member.id}`)
            }, ms(command.cooldown));
        };

        consola.info(`${interaction.guild.name} | ${interaction.member.user.tag} | /${interaction.commandName}`);
        command.execute(interaction, client);
    }
}

// Text Aliases
// Required Roles