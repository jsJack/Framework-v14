const Logger = require('../../structures/funcs/util/Logger');
const { cyan } = require('chalk');
const { loadFiles } = require('../funcs/fileLoader');

async function loadButtons(client) {
    await client.buttons.clear();
    let buttonsArray = []; let aliasArray = [];

    const files = await loadFiles("buttons");
    files.forEach((file) => {
        const button = require(file);

        if (button.aliases) {
            button.aliases.forEach(alias => {
                client.buttons.set(alias, button);
                aliasArray.push(alias + `-` + button?.id);
            });
        };

        client.buttons.set(button.id, button);

        buttonsArray.push(button);
    });

    if (!buttonsArray.length) return Logger.warn(`[Buttons] None loaded - Folder empty.`);
    else return Logger.success(`Loaded ${cyan(`${buttonsArray.length} buttons`)} and ${cyan(`${aliasArray.length} aliases`)}.`);
}

module.exports = { loadButtons };
