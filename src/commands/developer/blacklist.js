const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const timestring = require('timestring');

/** @typedef {import("../../structures/funcs/util/Types").ExtendedClient} ExtendedClient */

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Blacklist a user or guild from using the bot.')
        
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Blacklist a user or guild from using the bot.')
                .addStringOption(option =>
                    option.setName('id')
                        .setDescription('The user or guild id to blacklist.')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('The reason for the blacklist.')
                        .setRequired(false)
                )
                .addStringOption(option =>
                    option.setName('duration')
                        .setDescription('The duration of the blacklist.')
                        .setRequired(false)
                )
                .addStringOption(option =>
                    option.setName('commands')
                        .setDescription('A comma-separated list of commands that the user will be disallowed from using.')
                        .setRequired(false)
                )
        )
        
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a user or guild from the blacklist.')
                .addStringOption(option =>
                    option.setName('id')
                        .setDescription('The user or guild id to remove from the blacklist.')
                        .setRequired(true)
                        .setAutocomplete(true)
                ) 
        )
        
        .addSubcommand(
            subcommand =>
                subcommand
                    .setName('list')
                    .setDescription('List all blacklisted users and guilds.')
        )
        
        .addSubcommand(
            subcommand =>
                subcommand
                    .setName('view')
                    .setDescription('View a user or guild\'s blacklist.')
                    .addStringOption(option =>
                        option.setName('id')
                            .setDescription('The user or guild id to view.')
                            .setRequired(true)
                            .setAutocomplete(true)
                    )
        ),

    developer: true,
    usage: "/blacklist [user/guid id] <reason>",

    /**
     * 
     * @param {AutocompleteInteraction} interaction 
     * @param {ExtendedClient} client
     * @returns 
     */
    async autocomplete(interaction, client) {
        const subcommand = interaction.options.getSubcommand();
        const userValue = interaction.options.getFocused();

        switch (subcommand) {
            case "view":
            case "remove": {
                const choices = [];
                const blacklists = await client.db.blacklist.findMany({ 
                    select: { 
                        id: true,
                        executorId: true,
                        expiresAt: true
                    } 
                });

                for (const blacklist of blacklists) {
                    const expiresDate = new Date(Number(blacklist.expiresAt) * 1000);
                    const formattedDate = expiresDate.toLocaleString();

                    try {
                        const guild = await client.guilds.fetch(blacklist.id).catch(() => null);
                        const user = !guild ? await client.users.fetch(blacklist.id).catch(() => null) : null;
                        const identifier = guild?.name || `@`+user?.tag || blacklist.id;
                        
                        choices.push({ 
                            name: `${identifier} | Expires ${formattedDate}`.slice(0, 100),
                            value: blacklist.id 
                        });
                    } catch (error) {
                        choices.push({ 
                            name: `${blacklist.id} | Expires ${formattedDate}`.slice(0, 100),
                            value: blacklist.id 
                        });
                    }
                }

                const filtered = choices.filter(choice => 
                    choice.value.toLowerCase().startsWith(userValue.toLowerCase()) ||
                    choice.name.toLowerCase().startsWith(userValue.toLowerCase())
                );
                
                return interaction.respond(filtered.slice(0, 25));
            }

            default: return interaction.respond([{ name: "No autocomplete available", value: "not_available" }]);
        };
    },

    /**
    * 
    * @param {ChatInputCommandInteraction} interaction 
    * @param {ExtendedClient} client 
    */
    async execute(interaction, client) {
        let subcommand = interaction.options.getSubcommand();

        switch(subcommand) {
            case "add": await add(interaction, client);
            break;

            case "remove": await remove(interaction, client);
            break;

            case "list": await list(interaction, client);
            break;

            case "view": await view(interaction, client);
            break;

            default: return interaction.reply({ content: "Sorry, that subcommand hasn't been implemented.", flags: [MessageFlags.Ephemeral] });
        };
    },

    remove: remove,
};

/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 * @param {ExtendedClient} client 
 */
async function add(interaction, client) {
    // Import options/vars
    const id = interaction.options.getString("id");
    let reason = interaction.options.getString("reason") || "No reason provided.";
    let duration = interaction.options.getString("duration") || "999y";
    let providedCommands = interaction.options.getString("commands") || "all";
    const invalidCommands = providedCommands.split(/, |,/).filter(command => !client.commands.has(command));

    const isGuild = client.guilds.cache.has(id) ? true : false;
    const isBot = (await client.users.fetch(id).catch(() => false)).bot ?? false;

    // Check for exclusions
    if (process.env.SUPER_USERS?.split(',').includes(interaction.user.id) || isBot) {
        let exclusionsEmbed = new EmbedBuilder()
            .setTitle("🚫 Excluded User")
            .setDescription("You cannot blacklist this user.")
            .setColor(client.config.color)

        return interaction.reply({ embeds: [exclusionsEmbed], flags: [MessageFlags.Ephemeral] });
    };

    // Check if the user or guild is already blacklisted
    let blacklist = await client.db.blacklist.findFirst({ where: { id } });

    let alreadyBlacklistedEmbed = new EmbedBuilder()
        .setTitle("🚫 Already Blacklisted")
        .setDescription("This user or guild is already blacklisted.")
        .setColor(client.config.color)

    if (blacklist) return interaction.reply({ embeds: [alreadyBlacklistedEmbed], flags: [MessageFlags.Ephemeral] });
    
    commands = providedCommands.split(/, |,/).filter(command => client.commands.has(command));
    if (!Array.isArray(commands)) commands = [commands];
    if (commands.includes("blacklist")) commands.splice(commands.indexOf("blacklist"), 1);
    if (commands.length === 0) commands = ["all"];
    const commandString = commands[0] === "all" ? "All commands" : `\`/${commands.join("\`, \`/")}\``;

    let tsAdd;
    try {
        tsAdd = timestring(duration);
    } catch (e) {
        let timestringErrorEmbed = new EmbedBuilder()
            .setTitle("🚫 Invalid Duration")
            .setDescription(`${e}`)
            .addFields({
                name: `Supported Units`,
                value: `
                    \`ms\`, \`milli\`, \`millisecond\`, \`milliseconds\` - will parse to milliseconds
                    \`s\`, \`sec\`, \`secs\`, \`second\`, \`seconds\` - will parse to seconds
                    \`m\`, \`min\`, \`mins\`, \`minute\`, \`minutes\` - will parse to minutes
                    \`h\`, \`hr\`, \`hrs\`, \`hour\`, \`hours\` - will parse to hours
                    \`d\`, \`day\`, \`days\` - will parse to days
                    \`w\`, \`week\`, \`weeks\` - will parse to weeks
                    \`mon\`, \`mth\`, \`mths\`, \`month\`, \`months\` - will parse to months
                    \`y\`, \`yr\`, \`yrs\`, \`year\`, \`years\` - will parse to years
                `.trim().replace(/^ +/gm, ''),
                inline: true
            })
            .setColor(client.config.color)

        return interaction.reply({ embeds: [timestringErrorEmbed], flags: [MessageFlags.Ephemeral] });
    };

    const unixNow = Math.floor(Date.now() / 1000);
    const unixExpire = Math.floor(Date.now() / 1000) + tsAdd;

    // Add to the database
    await client.db.blacklist.create({
        data: {
            id: id,

            executorId: interaction.user.id,
            reason: reason,
            commands: commands,

            createdAt: unixNow,
            expiresAt: unixExpire
        }
    });

    // Respond to the interaction
    let blacklistAddEmbed = new EmbedBuilder()
    .setTitle(`🚫 ${isGuild ? `Guild` : `User`} Blacklisted`)
    .setDescription(`A new ${isGuild ? `guild` : `user`} blacklist has been created.`)
    .setFields(
        { name: "ID", value: `\`${id}\``, inline: true },
        { name: "Reason", value: reason.replace(/\s+/g, ' ').trim(), inline: true },
        { name: `\u200b`, value: `\u200b`, inline: true },

        { name: `Expires in ${duration.trim().replace(/\s+/g, ' ').toLowerCase()}`, value: `<t:${unixExpire}:f>`, inline: true },
        { name: "Commands", value: commandString, inline: true },
        { name: `\u200b`, value: `\u200b`, inline: true }
    )
    .setColor(client.config.color)
    .setFooter({ text: `Blacklisted by @${interaction.user.tag}`, iconURL: interaction.member.displayAvatarURL({ size: 128 }) })
    .setTimestamp();

    if (invalidCommands.length > 0) blacklistAddEmbed.addFields({ name: "⚠️ Invalid Commands", value: `The following were not added to the blacklist because they do not exist:\n` + `\`/${invalidCommands.join("\`, \`/")}\`` });

    return interaction.reply({ embeds: [blacklistAddEmbed], flags: [MessageFlags.SuppressNotifications] });
};

/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 * @param {ExtendedClient} client 
 */
async function remove(interaction, client, identifier = false) {
    // Import options/vars
    const id = identifier ? identifier : interaction.options.getString("id");
    const isGuild = client.guilds.cache.has(id) ? true : false;

    // Get DB entry
    let blacklist = await client.db.blacklist.findUnique({ where: { id } });

    let notBlacklistedEmbed = new EmbedBuilder()
        .setTitle("🚫 Not Blacklisted")
        .setDescription("This user or guild is not blacklisted.")
        .setColor(client.config.color)

    if (!blacklist) return interaction.reply({ embeds: [notBlacklistedEmbed], flags: [MessageFlags.Ephemeral] });

    // Remove from the database
    await client.db.blacklist.delete({ where: { id: id } }).catch((e) => {
        let errorEmbed = new EmbedBuilder()
            .setTitle("🚫 Error")
            .setDescription(`An error occurred while removing the blacklist:\n${e}`)
            .setColor(client.config.color)

        return interaction.reply({ embeds: [errorEmbed], flags: [MessageFlags.Ephemeral] });
    });

    // Respond to the interaction
    let blacklistRemoveEmbed = new EmbedBuilder()
        .setTitle(`✅ ${isGuild ? `Guild` : `User`} Removed`)
        .setDescription(`The ${isGuild ? `guild` : `user`} blacklist has been removed.`)
        .setFields(
            { name: "ID", value: `\`${id}\``, inline: true },
            { name: "Type", value: isGuild ? `Guild` : `User`, inline: true },
        )
        .setColor(client.config.color)
        .setFooter({ text: `Blacklist removed by @${interaction.user.tag}`, iconURL: interaction.member.displayAvatarURL({ size: 128 }) })
        .setTimestamp();

    return interaction.reply({ embeds: [blacklistRemoveEmbed], flags: [MessageFlags.SuppressNotifications] });
};

/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 * @param {ExtendedClient} client 
 */
async function list(interaction, client) {
    const blacklistList = await client.db.blacklist.findMany({
        select: {
            id: true,
            executorId: true,
            reason: true,
            commands: true,
            expiresAt: true
        },
        orderBy: { createdAt: "desc" },
        take: 10,
    });

    let blacklistMap = blacklistList.length > 0 
        ? await Promise.all(blacklistList.map(async (b) => {
            const isGuild = client.guilds.cache.has(b.id) ? true : false;
            
            let fetchedObject;
            if (isGuild) fetchedObject = await client.guilds.fetch(b.id).catch(() => null);
            else fetchedObject = await client.users.fetch(b.id).catch(() => null);
            const fetchedName = fetchedObject?.tag ? `@${fetchedObject.tag}` : fetchedObject?.name || b.id;
            
            return `
                **${fetchedName}** - Expires <t:${b.expiresAt}:f>
                > ID: \`${b.id}\`
                > Reason: ${b.reason}
                ${b.commands.includes("all") ? "" : `> Commands: \`/` + b.commands.join("\`, \`/") + `\``}
            `.trim().replace(/^ +/gm, '');
        }))
        : ["There are no blacklists in the database."];

    let blacklistListEmbed = new EmbedBuilder()
        .setTitle("🚫 Blacklist List")
        .setDescription(`Listing all blacklisted users and guilds.\n${blacklistMap.length >= 10 ? `Showing the latest 10 blacklists.` : ""}`)
        .setColor(client.config.color)
        .setFooter({ text: `Blacklist list requested by @${interaction.user.tag}`, iconURL: interaction.member.displayAvatarURL({ size: 128 }) })
        .setTimestamp()
        .setFields({ name: "Blacklisted", value: blacklistMap.join("\n\n") });
    
    return interaction.reply({ embeds: [blacklistListEmbed], flags: [MessageFlags.SuppressNotifications] });
};

/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 * @param {ExtendedClient} client 
 */
async function view(interaction, client) {
    // Import options/vars
    const id = interaction.options.getString("id");
    const isGuild = client.guilds.cache.has(id) ? true : false;

    // Get DB entry
    let blacklist = await client.db.blacklist.findUnique({ where: { id } });

    let notBlacklistedEmbed = new EmbedBuilder()
        .setTitle("🚫 Not Blacklisted")
        .setDescription("This user or guild is not blacklisted.")
        .setColor(client.config.color)

    if (!blacklist) return interaction.reply({ embeds: [notBlacklistedEmbed], flags: [MessageFlags.Ephemeral] });

    const executor = await client.users.fetch(blacklist.executorId);

    // Respond to the interaction
    let blacklistViewEmbed = new EmbedBuilder()
        .setTitle(`🚫 ${isGuild ? `Guild` : `User`} Blacklist`)
        .setDescription(`Viewing a blacklist for a ${isGuild ? `Guild` : `User`}.`)
        .setFields(
            { name: "ID", value: `\`${id}\``, inline: true },
            { name: "Executor", value: `${executor.tag ?? `Unknown user`} (\`${blacklist.executorId}\`)`, inline: true },
            { name: `\u200b`, value: `\u200b`, inline: true },

            { name: "Reason", value: blacklist.reason, inline: true },
            { name: "Expires", value: `<t:${blacklist.expiresAt}:F>`, inline: true },
            { name: `\u200b`, value: `\u200b`, inline: true },

            { name: "Commands", value: `\`/` + blacklist.commands.join("\`, \`/") + `\``, inline: false }
        )
        .setColor(client.config.color)
        .setFooter({ text: `Blacklist created by @${interaction.user.tag}`, iconURL: interaction.member.displayAvatarURL({ size: 128 }) })
        .setTimestamp(new Date(Number(blacklist.createdAt) * 1000));

    let blacklistViewActionRow = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setCustomId(`blacklist-remove`)
        .setLabel(`Remove`)
        .setStyle(ButtonStyle.Danger)
        .setEmoji("🗑️")
    )

    return interaction.reply({ embeds: [blacklistViewEmbed], components: [blacklistViewActionRow], flags: [MessageFlags.SuppressNotifications] });
};
