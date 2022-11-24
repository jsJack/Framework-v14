const { EmbedBuilder, ChatInputCommandInteraction, Client, SlashCommandBuilder, InteractionType } = require("discord.js");
const { readdirSync } = require("fs");
const createHelpMenu = require(`../../structures/funcs/tools/createHelpMenu`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`help`)
        .setDescription(`Shows info on commands, or shows help on a specific command`)
        .addStringOption(option => option.setName(`command`).setDescription(`The command to get help on`).setRequired(false))
        .setDMPermission(true),

    usage: `/help [command|category]`,
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const helpcmd = interaction.options.getString("command");

        let categories = [];
        let cots = [];

        const emo = {
            builders: `🛠️`,
            info: `ℹ️`,
            developer: `💻`,
        };

        if (!helpcmd) {
            let ignored = ["the ingored commands"];

            let ccate = [];
            readdirSync("./commands/").forEach((dir) => {
                if (ignored.includes(dir.toLowerCase())) return;
                readdirSync(`./commands/${dir}/`).filter((file) =>
                    file.endsWith(".js")
                );

                if (ignored.includes(dir.toLowerCase())) return;

                const name = `${emo[dir]} - ${dir.charAt(0).toUpperCase() + dir.slice(1).toLowerCase()}`;
                let nome = dir.toLowerCase();

                let cats = new Object();
                cats = {
                    name: name,
                    value: `\`/help ${dir.toLowerCase()}\``,
                    inline: true,
                };

                categories.push(cats);
                ccate.push(nome);
            });

            const embed = new EmbedBuilder()
                .setTitle(`✨ ${interaction.guild.members.me.user.username} - Help Menu`)
                .setDescription(`Select a category below to view available commands and usage.
You may also use \`/help [category name]\` or \`/help [command name]\` directly.\n
**Need extra support?** Open a ticket!`)
                .addFields(categories)
                .setTimestamp()
                .setColor(client.config.color);

            let menus = createHelpMenu(ccate);

            return await interaction.reply({ embeds: [embed], components: menus.smenu, fetchReply: true, ephemeral: true }).then(async (interactionn) => {
                const menuID = menus.sid;

                const select = async (interaction) => {
                    if (interaction.customId != menuID) return;

                    let { values } = interaction;

                    let value = values[0];

                    let catts = [];

                    readdirSync("./commands/").forEach((dir) => {
                        if (dir.toLowerCase() !== value.toLowerCase()) return;
                        const commands = readdirSync(`./commands/${dir}/`).filter(
                            (file) => file.endsWith(".js")
                        );
                        const cmds = commands.map((command) => {
                            let file = require(`../../commands/${dir}/${command}`);
                            let name = file.data.name;

                            if (!file.data.name) return "No command name.";

                            if (client.commands.get(name).hidden) return;

                            let des = file.data.description;
                            let usg = client.commands.get(name).usage;
                            if (!usg) {
                                usg = "No usage provided";
                            }
                            let emo = client.commands.get(name).emoji;
                            let emoe = emo ? `${emo} - ` : ``;

                            let obj = {
                                cname: `${emoe}**/${name}** |  \`${usg}\``,
                                des,
                            };

                            return obj;
                        });

                        let dota = new Object();

                        cmds.map((co) => {
                            if (co == undefined) return;

                            dota = {
                                name: `${cmds.length === 0 ? "In progress." : co.cname}`,
                                value: co.des ? co.des : `No Description`,
                                inline: true,
                            };
                            catts.push(dota);
                        });

                        cots.push(dir.toLowerCase());
                    });

                    if (cots.includes(value.toLowerCase())) {
                        const combed = new EmbedBuilder()
                            .setTitle(`${emo[value.toLowerCase()]} __Category: ${value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}__ (${catts.length} ${catts.length == 1 ? "command" : "commands"})`)
                            .addFields(catts)
                            .setColor(client.config.color)

                        if (value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() === "Developer") {
                            combed.setDescription(`Need more information on a command? Try using \`/help [command name]\`!\n⚠ **Warning:** Developer commands are not enabled for the general public. You do not have access to these commands.`)
                        } else {
                            combed.setDescription(`Need more information on a command? Try using \`/help [command name]\`!`)
                        }

                        return interaction.update({ embeds: [combed], ephemeral: true });
                    }
                };
                const filter = (interaction) => {
                    return (
                        !interaction.user.bot &&
                        interaction.user.id == interaction.member.id
                    );
                };

                const collector = interactionn.createMessageComponentCollector({
                    filter,
                    componentType: InteractionType.MessageComponent,
                });
                collector.on("collect", select);
                collector.on("end", () => null);
            });
        } else {
            let catts = [];

            readdirSync("./commands/").forEach((dir) => {
                if (dir.toLowerCase() !== helpcmd.toLowerCase()) return;
                const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
                    file.endsWith(".js")
                );

                const cmds = commands.map((command) => {
                    let file = require(`../../commands/${dir}/${command}`);
                    let name = file.data.name;

                    if (!file.data.name) return "No command name.";

                    if (client.commands.get(name).hidden) return;

                    let des = file.data.description;
                    let usg = client.commands.get(name).usage;
                    if (!usg) {
                        usg = "No usage provided";
                    }
                    let emo = client.commands.get(name).emoji;
                    let emoe = emo ? `${emo} - ` : ``;

                    let obj = {
                        cname: `${emoe}\`${name}\` |  **${usg}**`,
                        des,
                    };

                    return obj;
                });

                let dota = new Object();
                cmds.map((co) => {
                    if (co == undefined) return;
                    dota = {
                        name: `${cmds.length === 0 ? "In progress." : co.cname}`,
                        value: co.des ? co.des : `No Description`,
                        inline: true,
                    };
                    catts.push(dota);
                });

                cots.push(dir.toLowerCase());
            });

            const command = client.commands.get(helpcmd.toLowerCase());

            if (cots.includes(helpcmd.toLowerCase())) {
                const combed = new EmbedBuilder()
                    .setTitle(
                        `${emo[helpcmd.toLowerCase()]} __Category: ${helpcmd.charAt(0).toUpperCase() + helpcmd.slice(1).toLowerCase()}__ (${catts.length} ${catts.length > 1 ? "commands" : "command"})`
                    )
                    .setDescription(
                        `Need more information on a command? Try using \`/help [command name]\`!`
                    )
                    .addFields(catts)
                    .setColor(client.config.color);

                return interaction.reply({ embeds: [combed], ephemeral: true });
            }

            if (!command) {
                const embed = new EmbedBuilder()
                    .setTitle(`❌ Invalid Command/Category!`)
                    .setDescription(`Make sure you supplied a valid command or category name.\nUse \`/help\` for more info!`)
                    .setColor(client.config.color);
                return await interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
            }
            const embed = new EmbedBuilder()
                .setTitle(`Command: __/${command.data.name}__`)
                .addFields(
                    { name: "Usage:", value: command.usage ? `\`${command.usage}\`` : `\`/${command.data.name}\``, inline: true },
                    { name: "Command Description:", value: command.data.description ? command.data.description : "No description for this command.", inline: true }
                )
                .setTimestamp()
                .setColor(client.config.color);

            return await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }
    },
};