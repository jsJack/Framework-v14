const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { readdirSync } = require('fs');

module.exports = {
    id: `help-menus`,

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        let cots = [];

        const emo = {
            builders: `🛠️`,
            info: `ℹ️`,
            developer: `💻`,
            systems: `⚙️`,
        };

        const select = async (interaction) => {
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

        select(interaction);
    }
};
