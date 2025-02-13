const { StringSelectMenuBuilder, ActionRowBuilder } = require(`discord.js`);

const createHelpMenu = (array) => {
    if (!array) throw new Error(`The options were not provided! Make sure you provide all the options!`);
    if (array.length < 0) throw new Error(`The array has to have atleast one thing to select!`);
    let select_menu;
    let id = `help-menus`;
    let menus = [];
    
    const emo = {
        builders: `🛠️`,
        info: `ℹ️`,
        developer: `💻`,
        systems: `⚙️`,
    };
    
    array.forEach(cca => {
        let name = cca;
        let sName = `${name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}`
        let tName = name.toLowerCase();
        let fName = name.toUpperCase();

        return menus.push({
            label: sName,
            description: `Select to view ${tName} commands.`,
            value: fName,
            emoji: emo[tName]
        })
    });

    let smenu1 = new StringSelectMenuBuilder()
        .setCustomId(id)
        .setPlaceholder(`Choose a category`)
        .addOptions(menus)

    select_menu = new ActionRowBuilder()
        .addComponents(
            smenu1
        );


    return {
        smenu: [select_menu],
        sid: id
    }
}

module.exports = createHelpMenu;
