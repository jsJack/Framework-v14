const { cyan } = require('chalk');

const { loadFiles } = require('../funcs/fileLoader');
const Logger = require('../funcs/util/Logger');

async function loadModals(client) {
    await client.modals.clear();
    let modalsArray = [];

    const files = await loadFiles("src/modals");
    files.forEach((file) => {
        const modal = require(file);
        client.modals.set(modal.id, modal);

        modalsArray.push(modal);
    });

    if (!modalsArray.length) return Logger.warn(`[Modals] None loaded - Folder empty.`);
    else return Logger.success(`Loaded ${cyan(`${modalsArray.length} modals`)}.`);
}

module.exports = { loadModals };
