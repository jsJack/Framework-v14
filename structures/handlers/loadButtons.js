const consola = require('consola');
const { cyan } = require('chalk');
const { loadFiles } = require('../funcs/fileLoader');

async function loadButtons(client) {
    await client.buttons.clear();
    let buttonsArray = [];

    const files = await loadFiles("buttons");
    files.forEach((file) => {
        const button = require(file);
        client.buttons.set(button.id, button);

        buttonsArray.push(button);
    });

    if (!buttonsArray.length) return consola.error(`[Buttons] None loaded - Folder empty.`);
    else return consola.success(`Loaded ${cyan(`${buttonsArray.length} buttons`)}.`);
}

module.exports = { loadButtons };