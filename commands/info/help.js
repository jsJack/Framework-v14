const { EmbedBuilder, ChatInputCommandInteraction, Client, SlashCommandBuilder, AutocompleteInteraction } = require("discord.js");
const { readdirSync } = require("fs");
const createHelpMenu = require(`../../structures/funcs/tools/createHelpMenu`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`help`)
        .setDescription(`Shows info on commands, or shows help on a specific command`)
        .addStringOption(option => option.setName(`command`).setDescription(`The command to get help on`).setRequired(false).setAutocomplete(true))
        .setDMPermission(true),

    usage: `/help [command|category]`,

    /**
     * 
     * @param {AutocompleteInteraction} interaction 
     * @param {Client} client 
     */
    async autocomplete(interaction, client) {
        // Max is 25
        let userValue = interaction.options.getFocused();
        const choices = client.commandCategories.map((category) => ({ name: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(), value: category.toLowerCase() }));

        const filter = choices.filter((choice) => choice.name.toLowerCase().startsWith(userValue.toLowerCase()));
        return interaction.respond(filter.map((choice) => ({ name: choice.name, value: choice.value })));
    },

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
            systems: `📡`,
        };

        if (!helpcmd) {
            let ignored = ["ignored_command"];

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
                .setTitle(`✨ ${interaction.guild.members.me.displayName} - Help Menu`)
                .setDescription(`Select a category below to view available commands and usage.
You may also use \`/help [category name]\` or \`/help [command name]\` directly.\n
**Need extra support?** Open a ticket!`)
                .addFields(categories)
                .setTimestamp()
                .setColor(client.config.color);

            let menus = createHelpMenu(ccate);

            return await interaction.reply({ embeds: [embed], components: menus.smenu, ephemeral: true });
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
