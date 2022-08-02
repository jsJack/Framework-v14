const { Client } = require("discord.js");
const consola = require("consola");

module.exports = {
  name: "ready",
  once: true,
  /**
   *
   * @param {Client} client
   */
  execute(client) {
    consola.success(`Hello world! Connected to Discord: ${client.user.tag}`);
  },
};
