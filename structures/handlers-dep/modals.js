function loadModals(client) {
    let totalModals = [];
    const consola = require('consola');
    const fs = require('fs');

    const modalsFolders = fs.readdirSync("./modals");
    for (const folder of modalsFolders) {
        const modalFiles = fs.readdirSync(`./modals/${folder}`).filter((file) => file.endsWith('.js'));

        for (const file of modalFiles) {
            const modalFile = require(`../../modals/${folder}/${file}`);

            client.modals.set(modalFile.id, modalFile);
            totalModals.push(modalFile.id);

            continue;
        }
    }

    if (!totalModals.length) return consola.error("[Modals] No Modals were loaded! (Folder Empty)");
    else consola.success(`Loaded ${totalModals.length} modals`);
}

module.exports = { loadModals };
