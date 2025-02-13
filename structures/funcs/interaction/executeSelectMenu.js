const { StringSelectMenuInteraction, EmbedBuilder, Collection, Client, MessageFlags } = require("discord.js");
const Logger = require('../util/Logger');
const { connection } = require('mongoose');
const ms = require('ms');

const modalTimeout = new Collection();

/**
 * 
 * @param {StringSelectMenuInteraction} interaction 
 * @param {Client} client 
 * @returns 
 */
async function executeSelectMenu(interaction, client) {
    if (!interaction.isStringSelectMenu()) return;

    /**************************************
     * Check if menu needs to be ignored  *
     **************************************/
    let blacklistedIDs = []; //["help-menus"];
    if (blacklistedIDs.includes(interaction.customId)) return;

    /******************************
     * Check if the modal exists  *
     ******************************/
    const menu = client.selectmenus.get(interaction.customId);

    let notExist = new EmbedBuilder()
        .setDescription(`🛠 This menu is not linked to a response.\nPlease try again later.`)
        .setColor(client.config.color)
        .setFooter({ text: `Item code: ${interaction.customId} - JPY Software` });

    if (!menu) return interaction.reply({ embeds: [notExist], flags: [MessageFlags.Ephemeral] });

    /****************************************************************
     * Check if the database is on (for buttons that need the db)  *
     ****************************************************************/
    if (menu.dbDepend && connection.readyState != 1) {
        let noDB = new EmbedBuilder()
            .setTitle(`🌌 Hold on!`)
            .setDescription(`The database isn't quite connected yet, and you cannot use this menu without the database.\nThe bot may be starting up, please allow up to 30 seconds before re-running this menu.`)
            .setColor(client.config.color)
            .setFooter({ text: `JPY Software` });

        Logger.log(`${interaction.guild.name} | ${interaction.user.tag} | 💿 Tried to use 🔘${interaction.customId} but the database is not connected.`)
        return interaction.reply({ embeds: [noDB], flags: [MessageFlags.Ephemeral] });
    }

    /*************************************
     * Check if user has required roles  *
     *************************************/
    if (menu.reqRoles && !interaction.channel.isDMBased()) {
        hasReqRole = false;
        menu.reqRoles.forEach((findRole) => {
            if (interaction.member.roles.cache.some((role) => role.id === findRole)) hasReqRole = true;
        });

        let notReqRoles = new EmbedBuilder()
            .setTitle(`❌ You do not have the required roles to use this menu`)
            .setDescription(`Required Roles: <@&${menu.reqRoles.join(">, <@&")}>`)
            .setColor(client.config.color);

        if (!hasReqRole) return interaction.reply({ embeds: [notReqRoles], flags: [MessageFlags.Ephemeral] });
    }

    /*********************************
     * Check if user is on cooldown  *
     *********************************/
    if (menu.cooldown) {
        if (modalTimeout.has(`${interaction.commandName}${interaction.user.id}`)) {
            let lastUsage = modalTimeout.get(`${interaction.commandName}${interaction.user.id}`);
            let msTimeout = ms(menu.cooldown) / 1000;
            let timestamp = parseInt(lastUsage) + parseInt(msTimeout);

            let cooldownEmbed = new EmbedBuilder()
                .setTitle(`🏃‍♂️💨 Woah! Slow down!`)
                .setDescription(`You are currently on a __cooldown__ for this menu!\nYou can use the menu again <t:${timestamp}:R>`)
                .setColor(client.config.color)

            Logger.log(`${interaction.guild.name} | ${interaction.user.tag} | 🕕 Tried to use 📜${interaction.customId} but is on cooldown.`)
            return interaction.reply({ embeds: [cooldownEmbed], flags: [MessageFlags.Ephemeral] });
        }

        modalTimeout.set(`${interaction.commandName}${interaction.user.id}`, (Date.now() / 1000).toFixed(0));

        setTimeout(() => {
            modalTimeout.delete(`${interaction.commandName}${interaction.user.id}`)
        }, ms(menu.cooldown));
    };

    /******************************************
     * Check if user has required permission  *
     ******************************************/
    let menuNoPerms = new EmbedBuilder()
        .setTitle(`❌ You do not have permission to use this menu!`)
        .setColor(client.config.color)

    if (menu.permission && !interaction.member.permissions.has(menu.permission)) return interaction.reply({ embeds: [menuNoPerms], flags: [MessageFlags.Ephemeral] });

    /*********************************
     * Check if user is guild owner  *
     *********************************/
    let menuOwnerOnly = new EmbedBuilder()
        .setTitle(`❌ This menu is locked to the __Owner of the Guild__!`)
        .setColor(client.config.color)

    if (menu.ownerOnly && interaction.member.id !== interaction.guild.ownerId) return interaction.reply({ embeds: [menuOwnerOnly], flags: [MessageFlags.Ephemeral] });

    /********************************
     * Log the menu & execute it  *
     ********************************/
    Logger.log(`${interaction.guild.name} | ${interaction.user.tag} | 📜 ${interaction.customId}/${interaction.values[0]}`);
    menu.execute(interaction, client);
}

module.exports = { executeSelectMenu };
