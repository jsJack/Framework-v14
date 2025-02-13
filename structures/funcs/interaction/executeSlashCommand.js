const Logger = require('../util/Logger');
const { EmbedBuilder, Collection, ChatInputCommandInteraction, Client, ApplicationCommandOptionType, CommandInteractionOptionResolver, MessageFlags } = require('discord.js');
const { connection } = require('mongoose');
const ms = require('ms');

const cmdTimeout = new Collection();

/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 * @param {Client} client 
 * @returns 
 */
async function executeSlashCommand(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    /********************************
     * Check if the command exists  *
     ********************************/
    const command = client.commands.get(interaction.commandName);

    let notExist = new EmbedBuilder()
        .setDescription(`🛠 This command is not linked to a response.\nPlease try again later.`)
        .setColor(client.config.color)
        .setFooter({ text: `Item code: ${interaction.commandName} - JPY Software` });

    if (!command) return interaction.reply({ embeds: [notExist], flags: [MessageFlags.Ephemeral] });

    /****************************************************************
     * Check if the database is on (for commands that need the db)  *
     ****************************************************************/
    if (command.dbDepend && connection.readyState != 1) {
        let noDB = new EmbedBuilder()
            .setTitle(`🌌 Hold on!`)
            .setDescription(`The database isn't quite connected yet, and you cannot use this command without the database.\nThe bot may be starting up, please allow up to 30 seconds before re-running this command.`)
            .setColor(client.config.color)
            .setFooter({ text: `JPY Software` });

        Logger.log(`${interaction.guild.name} | ${interaction.user.tag} | 💿 Tried to use /${interaction.commandName} but the database is not connected.`)
        return interaction.reply({ embeds: [noDB], flags: [MessageFlags.Ephemeral] });
    }

    /*************************************
     * Check if user has required roles  *
     *************************************/
    if (command.reqRoles && !interaction.channel.isDMBased()) {
        hasReqRole = false;
        command.reqRoles.forEach((findRole) => {
            if (interaction.member.roles.cache.some((role) => role.id === findRole)) hasReqRole = true;
        });

        let notReqRoles = new EmbedBuilder()
            .setTitle(`❌ You do not have the required roles to execute this command`)
            .setDescription(`Required Roles: <@&${command.reqRoles.join(">, <@&")}>`)
            .setColor(client.config.color);

        if (!hasReqRole) return interaction.reply({ embeds: [notReqRoles], flags: [MessageFlags.Ephemeral] });
    }

    /*********************************
     * Check if user is on cooldown  *
     *********************************/
    if (command.cooldown) {
        if (cmdTimeout.has(`${interaction.commandName}${interaction.user.id}`)) {
            let lastUsage = cmdTimeout.get(`${interaction.commandName}${interaction.user.id}`);
            let msTimeout = ms(command.cooldown) / 1000;
            let timestamp = parseInt(lastUsage) + parseInt(msTimeout);

            let cooldownEmbed = new EmbedBuilder()
                .setTitle(`🏃‍♂️💨 Woah! Slow down!`)
                .setDescription(`You are currently on a __cooldown__ for **/${interaction.commandName}**!\nYou can use the command again <t:${timestamp}:R>`)
                .setColor(client.config.color)

            Logger.log(`${interaction.guild.name} | ${interaction.user.tag} | 🕕 Tried to use /${interaction.commandName} but is on cooldown.`)
            return interaction.reply({ embeds: [cooldownEmbed], flags: [MessageFlags.Ephemeral] });
        }

        cmdTimeout.set(`${interaction.commandName}${interaction.user.id}`, (Date.now() / 1000).toFixed(0));

        setTimeout(() => {
            cmdTimeout.delete(`${interaction.commandName}${interaction.user.id}`)
        }, ms(command.cooldown));
    };

    /******************************
     * Log & execute the command  *
     ******************************/
    // get the subcommand used
    let subcommand = interaction.options.getSubcommand(false); // false to avoid returning an error if no subcommand is used

    // get all of the options used
    let options = formatInteractionOptions(interaction.options);

    Logger.log(`${interaction.channel.isDMBased() ? `DMs` : `${interaction.guild.name}`} | ${interaction.user.tag} | /${interaction.commandName} ${subcommand ? subcommand : ``}${options ? options : ``}`);
    command.execute(interaction, client);
};

function formatInteractionOptions(options) {
    const acot = ApplicationCommandOptionType;

    let optionsStr = '';
    if (!options) {
        return optionsStr;
    }

    if (options instanceof CommandInteractionOptionResolver) {
        options = options._hoistedOptions;
    }

    for (const option of options) {
        if (option.type === acot.Subcommand) {
            optionsStr += formatInteractionOptions(option);
            continue;
        }

        if (option.type === acot.SubcommandGroup) {
            optionsStr += formatInteractionOptions(option);
            continue;
        }

        const name = option.name;
        let value = option.value;
        if (option.type === acot.User) {
            value = option.user.tag;
        } else if (option.type === acot.Channel) {
            value = option.channel.toString();
        } else if (option.type === acot.Role) {
            value = option.role.name;
        }
        optionsStr += `${name}:${value} `;
    }

    return optionsStr.trim();
};

module.exports = { executeSlashCommand };
