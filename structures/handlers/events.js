function loadEvents(client) {
  const fs = require("fs");
  const consola = require('consola');
  let totalEvents = [];

  const folders = fs.readdirSync("./events");
  for (const folder of folders) {
      const files = fs
          .readdirSync(`./events/${folder}`)
          .filter((file) => file.endsWith(".js"));

      for (const file of files) {
          const event = require(`../../events/${folder}/${file}`);
          totalEvents.push(event.name);

          if (event.rest) {
              if (event.once)
                  client.rest.once(event.name, (...args) =>
                      event.execute(...args, client)
                  );
              else
                  client.rest.on(event.name, (...args) =>
                      event.execute(...args, client)
                  );
          } else {
              if (event.once)
                  client.once(event.name, (...args) => event.execute(...args, client));
              else client.on(event.name, (...args) => event.execute(...args, client));
          }

          continue;
      }
  }

  if (!totalEvents.length) return consola.error("[Events] No Events were loaded! (Folder Empty)");
  else consola.success(`Loaded ${totalEvents.length} events`);
}

module.exports = { loadEvents };