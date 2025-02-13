const { ButtonInteraction, EmbedBuilder, Collection, Client, MessageFlags } = require("discord.js");
const Logger = require('../util/Logger');
const { connection } = require('mongoose');
const ms = require('ms');

const btnTimeout = new Collection();

/**
 * 
 * @param {ButtonInteraction} interaction 
 * @param {Client} client 
 * @returns 
 */
async function executeButton(interaction, client) {
    if (!interaction.isButton()) return;

    /****************************************
     * Check if button needs to be ignored  *
     ****************************************/
    let blacklistedIDs = ["cancel", "random", "bot", "guild", "sindex", "select_embed", "delete_embed", "prev_embed", "next_embed", "value", "inline", "name", "set"];
    if (blacklistedIDs.includes(interaction.customId)) return;

    /*******************************
     * Check if the button exists  *
     *******************************/
    const button = client.buttons.get(interaction.customId);

    let notExist = new EmbedBuilder()
        .setDescription(`🛠 This button is not linked to a response.\nPlease try again later.`)
        .setColor(client.config.color)
        .setFooter({ text: `Item code: ${interaction.customId} - JPY Software` });

    if (!button) return interaction.reply({ embeds: [notExist], flags: [MessageFlags.Ephemeral] });

    /****************************************************************
     * Check if the database is on (for buttons that need the db)  *
     ****************************************************************/
    if (button.dbDepend && connection.readyState != 1) {
        let noDB = new EmbedBuilder()
            .setTitle(`🌌 Hold on!`)
            .setDescription(`The database isn't quite connected yet, and you cannot use this button without the database.\nThe bot may be starting up, please allow up to 30 seconds before re-running this button.`)
            .setColor(client.config.color)
            .setFooter({ text: `JPY Software` });

        Logger.log(`${interaction.guild.name} | ${interaction.user.tag} | 💿 Tried to use 🔘${interaction.customId} but the database is not connected.`)
        return interaction.reply({ embeds: [noDB], flags: [MessageFlags.Ephemeral] });
    }

    /*************************************
     * Check if user has required roles  *
     *************************************/
    if (button.reqRoles && !interaction.channel.isDMBased()) {
        hasReqRole = false;
        
        button.reqRoles.forEach((findRole) => {
            if (interaction.member.roles.cache.some((role) => role.id === findRole)) hasReqRole = true;
        });

        let notReqRoles = new EmbedBuilder()
            .setTitle(`❌ You do not have the required roles to execute this button`)
            .setDescription(`Required Roles: <@&${button.reqRoles.join(">, <@&")}>`)
            .setColor(client.config.color);

        if (!hasReqRole) return interaction.reply({ embeds: [notReqRoles], flags: [MessageFlags.Ephemeral] });
    }

    /*********************************
     * Check if user is on cooldown  *
     *********************************/
    if (button.cooldown) {
        if (btnTimeout.has(`${interaction.commandName}${interaction.user.id}`)) {
            let lastUsage = btnTimeout.get(`${interaction.commandName}${interaction.user.id}`);
            let msTimeout = ms(button.cooldown) / 1000;
            let timestamp = parseInt(lastUsage) + parseInt(msTimeout);

            let cooldownEmbed = new EmbedBuilder()
                .setTitle(`🏃‍♂️💨 Woah! Slow down!`)
                .setDescription(`You are currently on a __cooldown__ for this button!\nYou can use the button again <t:${timestamp}:R>`)
                .setColor(client.config.color)

            Logger.log(`${interaction.guild.name} | ${interaction.user.tag} | 🕕 Tried to use 🔘${interaction.customId} but is on cooldown.`)
            return interaction.reply({ embeds: [cooldownEmbed], flags: [MessageFlags.Ephemeral] });
        }

        btnTimeout.set(`${interaction.commandName}${interaction.user.id}`, (Date.now() / 1000).toFixed(0));

        setTimeout(() => {
            btnTimeout.delete(`${interaction.commandName}${interaction.user.id}`)
        }, ms(button.cooldown));
    };

    /******************************************
     * Check if user has required permission  *
     ******************************************/
    let buttonNoPerms = new EmbedBuilder()
        .setTitle(`❌ You do not have permission to use this button!`)
        .setColor(client.config.color)

    if (button.permission && !interaction.member.permissions.has(button.permission)) return interaction.reply({ embeds: [buttonNoPerms], flags: [MessageFlags.Ephemeral] });

    /*********************************
     * Check if user is guild owner  *
     *********************************/
    let buttonOwnerOnly = new EmbedBuilder()
        .setTitle(`❌ This button is locked to the __Owner of the Guild__!`)
        .setColor(client.config.color)

    if (button.ownerOnly && interaction.member.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [buttonOwnerOnly], flags: [MessageFlags.Ephemeral] });

    /********************************
     * Log the button & execute it  *
     ********************************/
    Logger.log(`${interaction.guild.name} | ${interaction.user.tag} | 🔘 ${interaction.customId}`);
    button.execute(interaction, client);
}

module.exports = { executeButton };
