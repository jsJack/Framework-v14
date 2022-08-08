function loadButtons(client) {
    let totalButtons = [];
    const consola = require('consola');
    const fs = require('fs');

    const buttonsFolders = fs.readdirSync("./buttons");
    for (const folder of buttonsFolders) {
        const buttonFiles = fs.readdirSync(`./buttons/${folder}`).filter((file) => file.endsWith('.js'));

        for (const file of buttonFiles) {
            const buttonFile = require(`../../buttons/${folder}/${file}`);

            client.buttons.set(buttonFile.id, buttonFile);
            totalButtons.push(buttonFile.id);

            continue;
        }
    }

    if (!totalButtons.length) return consola.error("[Buttons] No Buttons were loaded! (Folder Empty)");
    else consola.success(`Loaded ${totalButtons.length} buttons`);
}

module.exports = { loadButtons };