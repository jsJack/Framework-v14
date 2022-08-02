const { CommandInteraction, Collection, EmbedBuilder } = require('discord.js');
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
            if(Timeout.has(`${interaction.commandName}${interaction.member.id}`)) {
                let lastUsage = Timeout.get(`${interaction.commandName}${interaction.member.id}`);
                let msTimeout = ms(command.cooldown) / 1000;
                let timestamp = parseInt(lastUsage) + parseInt(msTimeout);

                let cooldownEmbed = new EmbedBuilder()
                .setTitle(`🏃‍♂️💨 Woah! Slow down!`)
                .setDescription(`You are currently on a __cooldown__ for **/${interaction.commandName}**!\nYou can use the command again <t:${timestamp}:R>`)
                .setColor(client.config.color)

                consola.log(`${interaction.guild.name} | ${interaction.user.tag} | 🕕 Tried to use /${interaction.commandName} but is on cooldown.`)
                return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
            }
            
            Timeout.set(`${interaction.commandName}${interaction.member.id}`, (Date.now() / 1000).toFixed(0));

            setTimeout(() => {
                Timeout.delete(`${interaction.commandName}${interaction.member.id}`)
            }, ms(command.cooldown));
        };

        consola.log(`${interaction.guild.name} | ${interaction.member.user.tag} | /${interaction.commandName}`);
        command.execute(interaction, client);
    }
}

// Text Aliases
// Required Roles