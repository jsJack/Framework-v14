const consola = require('consola');
const { cyan } = require('chalk');
const { loadFiles } = require('../funcs/fileLoader');

async function loadModals(client) {
    await client.modals.clear();
    let modalsArray = [];

    const files = await loadFiles("modals");
    files.forEach((file) => {
        const modal = require(file);
        client.modals.set(modal.id, modal);

        modalsArray.push(modal);
    });

    if (!modalsArray.length) return consola.error(`[Modals] None loaded - Folder empty.`);
    else return consola.success(`Loaded ${cyan(`${modalsArray.length} modals`)}.`);
}

module.exports = { loadModals };