const { ContextMenuCommandInteraction, Client, EmbedBuilder, Collection, ApplicationCommandType, MessageFlags } = require('discord.js');
const { connection } = require('mongoose');
const ms = require('ms');

const Logger = require('../util/Logger');

const appTimeout = new Collection();

/**
 * 
 * @param {ContextMenuCommandInteraction} interaction 
 * @param {Client} client 
 */
async function executeContextMenu(interaction, client) {
    // Check if it exists
    const app = client.apps.get(interaction.commandName);

    let notExist = new EmbedBuilder()
        .setDescription(`🛠 This context menu is not linked to a response.\nPlease try again later.`)
        .setColor(client.config.color)
        .setFooter({ text: `Item code: ${interaction.commandName} - JPY Software` });

    if (!app) return interaction.reply({ embeds: [notExist], flags: [MessageFlags.Ephemeral] });

    // Check if it needds the database
    if (app.dbDepend && connection.readyState != 1) {
        let noDB = new EmbedBuilder()
            .setTitle(`🌌 Hold on!`)
            .setDescription(`The database isn't quite connected yet, and you cannot use this context menu without the database.\nThe bot may be starting up, please allow up to 30 seconds before re-running this app.`)
            .setColor(client.config.color)
            .setFooter({ text: `JPY Software` });

        Logger.log(`${interaction.guild.name} | ${interaction.user.tag} | 💿 Tried to use App "${interaction.commandName}"s but the database is not connected.`)
        return interaction.reply({ embeds: [noDB], flags: [MessageFlags.Ephemeral] });
    }

    // Check if the user has the required roles
    if (app.reqRoles && !interaction.channel.isDMBased()) {
        hasReqRole = false;
        app.reqRoles.forEach((findRole) => {
            if (interaction.member.roles.cache.some((role) => role.id === findRole)) hasReqRole = true;
        });

        let notReqRoles = new EmbedBuilder()
            .setTitle(`❌ You do not have the required roles to execute this app`)
            .setDescription(`Required Roles: <@&${app.reqRoles.join(">, <@&")}>`)
            .setColor(client.config.color);

        if (!hasReqRole) return interaction.reply({ embeds: [notReqRoles], flags: [MessageFlags.Ephemeral] });
    }

    // Check if the user is on a cooldown
    if (app.cooldown) {
        if (appTimeout.has(`${interaction.commandName}${interaction.user.id}`)) {
            let lastUsage = appTimeout.get(`${interaction.commandName}${interaction.user.id}`);
            let msTimeout = ms(app.cooldown) / 1000;
            let timestamp = parseInt(lastUsage) + parseInt(msTimeout);

            let cooldownEmbed = new EmbedBuilder()
                .setTitle(`🏃‍♂️💨 Woah! Slow down!`)
                .setDescription(`You are currently on a __cooldown__ for **App: "${interaction.commandName}"**!\nYou can use the app again <t:${timestamp}:R>`)
                .setColor(client.config.color)

            Logger.log(`${interaction.guild.name} | ${interaction.user.tag} | 🕕 Tried to use App: "${interaction.commandName}" but is on cooldown.`)
            return interaction.reply({ embeds: [cooldownEmbed], flags: [MessageFlags.Ephemeral] });
        }

        appTimeout.set(`${interaction.commandName}${interaction.user.id}`, (Date.now() / 1000).toFixed(0));

        setTimeout(() => {
            appTimeout.delete(`${interaction.commandName}${interaction.user.id}`)
        }, ms(app.cooldown));
    };

    // Log & Execute
    let type = ApplicationCommandType[interaction.commandType];
    Logger.log(`${interaction.channel.isDMBased() ? `DMs` : interaction.guild.name} | ${interaction.user.tag} | 📟 Executed App: "${interaction.commandName}" (${type})`);
    app.execute(interaction, client);
};

module.exports = { executeContextMenu };
