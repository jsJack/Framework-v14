const Logger = require('../../structures/funcs/util/Logger');
const { cyan } = require('chalk');
const { loadFiles } = require('../funcs/fileLoader');

async function loadSelectMenus(client) {
    await client.selectmenus.clear();
    let menusArray = [];

    const files = await loadFiles("selectmenus");
    files.forEach((file) => {
        const menu = require(file);
        client.selectmenus.set(menu.id, menu);

        menusArray.push(menu);
    });

    if (!menusArray.length) return Logger.warn(`[SelectMenus] None loaded - Folder empty.`);
    else return Logger.success(`Loaded ${cyan(`${menusArray.length} select menus`)}.`);
}

module.exports = { loadSelectMenus };
