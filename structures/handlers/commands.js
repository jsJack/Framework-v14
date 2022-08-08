function loadCommands(client) {
  const fs = require('fs');
  const consola = require('consola');

  let commandsArray = [];
  let developerArray = [];

  const commandsFolders = fs.readdirSync("./commands");
  for (const folder of commandsFolders) {
      const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));

      for (const file of commandFiles) {
          const commandFile = require(`../../commands/${folder}/${file}`);

          client.commands.set(commandFile.data.name, commandFile);

          if (commandFile.developer) developerArray.push(commandFile.data.toJSON())
          else commandsArray.push(commandFile.data.toJSON());

          continue;
      }
  }

  client.application.commands.set(commandsArray);

  const developerGuild = client.guilds.cache.get(client.config.developerGuildID);
  developerGuild.commands.set(developerArray);

  if (!commandsArray.length && !developerArray.length) return consola.error("[Commands] No Commands were loaded! (Folders Empty)");
  else consola.success(`Loaded ${commandsArray.length} Application commands // ${developerArray.length} Developer-only commands`);
}

module.exports = { loadCommands };
