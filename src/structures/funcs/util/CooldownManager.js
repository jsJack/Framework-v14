const { EmbedBuilder } = require("discord.js");

/** @typedef {import("./Types").ExtendedClient} ExtendedClient */

/**
 * 
 * @param {ExtendedClient} client 
 * @param {String} iType 
 * @param {String} iId 
 * @param {String} iUser 
 */
function getCooldown(client, iType, iId, iUser) {
    return client.cooldowns.get(`${iType}-${iId}-${iUser}`) || null;
};

/**
 * 
 * @param {ExtendedClient} client 
 * @param {String} iType 
 * @param {String} iId 
 * @param {String} iUser 
 * @param {Number} seconds 
 */
function setCooldown(client, iType, iId, iUser, seconds) {
    const unixEnd = Math.floor(Date.now() / 1000) + seconds;
    const newCd = client.cooldowns.set(`${iType}-${iId}-${iUser}`, unixEnd);

    setTimeout(() => {
        deleteCooldown(client, iType, iId, iUser);
    }, seconds * 1000);

    return newCd;
};

/**
 * 
 * @param {ExtendedClient} client 
 * @param {String} iType 
 * @param {String} iId 
 * @param {String} iUser 
 */
function deleteCooldown(client, iType, iId, iUser) {
    return client.cooldowns.delete(`${iType}-${iId}-${iUser}`) || null;
};

/**
 * 
 * @param {ExtendedClient} client 
 * @param {Number} unixEnd 
 * @returns {EmbedBuilder}
 */
function generateCooldownEmbed(client, unixEnd) {
    let cooldownEmbed = new EmbedBuilder()
        .setTitle(`🏃‍♂️💨 Woah! Slow down!`)
        .setDescription(`You are currently on a __cooldown__ for this button!\nYou can use the button again <t:${unixEnd}:R>`)
        .setColor(client.config.color)

    // @todo: Add logger here?

    return cooldownEmbed;
}

module.exports = { getCooldown, setCooldown, deleteCooldown, generateCooldownEmbed };