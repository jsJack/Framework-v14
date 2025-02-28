const { cyan } = require('chalk');

const { loadFiles } = require('../funcs/fileLoader');
const Logger = require('../funcs/util/Logger');

/** @typedef {import("../funcs/util/Types").ExtendedClient} ExtendedClient */

/**
 * 
 * @param {ExtendedClient} client 
 * @returns 
 */
async function loadSelectMenus(client) {
    client.selectmenus.clear();
    
    let menusArray = [];

    const files = await loadFiles("src/selectmenus");
    files.forEach((file) => {
        const menu = require(file);
        if (!menu?.id) return Logger.warn(`[SelectMenus] ${file} does not export a select menu (id).`);

        client.selectmenus.set(menu.id, menu);

        menusArray.push(menu);
    });

    if (!menusArray.length) return Logger.warn(`[SelectMenus] None loaded - Folder empty.`);
    else return Logger.success(`Loaded ${cyan(`${menusArray.length} select menus`)}.`);
}

module.exports = { loadSelectMenus };
