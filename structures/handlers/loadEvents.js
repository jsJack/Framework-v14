const consola = require('consola');
const { cyan } = require('chalk');
const { loadFiles } = require('../funcs/fileLoader');

async function loadEvents(client) {
    await client.events.clear();
    let eventsArray = [];

    const files = await loadFiles("events");
    files.forEach((file) => {
        const event = require(file);
        const execute = (...args) => event.execute(...args, client);
        client.events.set(event.name, execute);

        if (event.rest) {
            if (event.once) client.rest.once(event.name, execute);
            else client.rest.on(event.name, execute);
        } else if (event.player) {
            client.player.on(event.name, execute);
        }else {
            if (event.once) client.once(event.name, execute);
            else client.on(event.name, execute);
        };

        eventsArray.push(event.name);
    });

    if (!eventsArray.length) return consola.error(`[Events] None loaded - Folder empty.`)
    else return consola.success(`Successfully loaded ${cyan(`${eventsArray.length} events`)}.`);
};

module.exports = { loadEvents };