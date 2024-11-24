const Logger = require('../../structures/funcs/util/Logger');
const { cyan } = require('chalk');
const { loadFiles } = require('../funcs/fileLoader');

async function loadEvents(client) {
    await client.events.clear();
    
    let eventsArray = [];
    let restEventsArray = [];

    const files = await loadFiles("events");
    files.forEach((file) => {
        const event = require(file);
        const execute = (...args) => event.execute(...args, client);
        client.events.set(event.name, execute);

        if (event.rest) {
            if (event.once) client.rest.once(event.name, execute);
            else client.rest.on(event.name, execute);

            restEventsArray.push(event.name);
        } else {
            if (event.once) client.once(event.name, execute);
            else client.on(event.name, execute);

            eventsArray.push(event.name);
        };

    });

    if (!eventsArray.length) return Logger.warn(`[Events] None loaded - Folder empty.`)
    else return Logger.success(`Successfully loaded ${cyan(`${restEventsArray.length} rest`)} and ${cyan(`${eventsArray.length} regular`)} events.`);
};

module.exports = { loadEvents };
