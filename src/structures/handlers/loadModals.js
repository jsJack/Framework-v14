const { cyan } = require('chalk');

const { loadFiles } = require('../funcs/fileLoader');
const Logger = require('../funcs/util/Logger');

/** @typedef {import("../funcs/util/Types").ExtendedClient} ExtendedClient */

/**
 * 
 * @param {ExtendedClient} client 
 * @returns 
 */
async function loadModals(client) {
    client.modals.clear();
    
    let modalsArray = [];

    const files = await loadFiles("src/modals");
    files.forEach((file) => {
        const modal = require(file);
        if (!modal?.id) return Logger.warn(`[Modals] ${file} does not export a modal (id).`);

        client.modals.set(modal.id, modal);

        modalsArray.push(modal);
    });

    if (!modalsArray.length) return Logger.warn(`[Modals] None loaded - Folder empty.`);
    else return Logger.success(`Loaded ${cyan(`${modalsArray.length} modals`)}.`);
}

module.exports = { loadModals };
