const { EmbedBuilder, WebhookClient } = require("discord.js");
const { inspect } = require("util");
const Logger = require('../funcs/util/Logger');

module.exports = (client) => {
    const webhook = new WebhookClient({ url: `${process.env.ANTICRASH_WEBHOOK}` });
    Logger.success("Anticrash module loaded");

    const embed = new EmbedBuilder()
    .setColor("Red");
    
    client.on("error", async (err) => {
        Logger.error(err);

        embed
        .setTitle("Discord API Error")
        .setURL("https://discordjs.guide/popular-topics/errors.html#api-errors")
        .setDescription(`\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``)
        .setTimestamp();

        return webhook.send({ embeds: [embed] }).catch(() => { return; });
    });

    process.on("unhandledRejection", async (reason, promise) => {
        Logger.error(reason, "\n", promise);

        embed
        .setTitle("Unhandled Rejection/Catch")
        .setURL("https://nodejs.org/api/process.html#event-unhandledrejection")
        .addFields(
            { name: "Reason", value: `\`\`\`${inspect(reason, { depth: 0 }).slice(0, 1000)}\`\`\`` },
            { name: "Promise", value: `\`\`\`${inspect(promise, { depth: 0 }).slice(0, 1000)}\`\`\`` }
        )
        .setTimestamp();

        return webhook.send({ embeds: [embed] }).catch(() => { return; });
    });
    
    process.on("uncaughtException", async (err, origin) => {
        Logger.error(err, "\n", origin);

        embed
        .setTitle("Uncaught Exception/Catch")
        .setURL("https://nodejs.org/api/process.html#event-uncaughtexception")
        .addFields(
            { name: "Error", value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\`` },
            { name: "Origin", value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\`` }
        )
        .setTimestamp();

        return webhook.send({ embeds: [embed] }).catch(() => { return; });
    });
    
    process.on("uncaughtExceptionMonitor", async (err, origin) => {
        Logger.error(err, "\n", origin);

        embed
        .setTitle("Uncaught Exception Monitor")
        .setURL("https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor")
        .addFields(
            { name: "Error", value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\`` },
            { name: "Origin", value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\`` }
        )
        .setTimestamp();
    
        return webhook.send({ embeds: [embed] }).catch(() => { return; });
    });
    
    process.on("warn", async (warn) => {
        Logger.error(warn);

        embed
        .setTitle("Uncaught Exception Monitor Warning")
        .setURL("https://nodejs.org/api/process.html#event-warning")
        .addFields(
            { name: "Warning", value: `\`\`\`${inspect(warn, { depth: 0 }).slice(0, 1000)}\`\`\`` }
        )
        .setTimestamp();

        return webhook.send({ embeds: [embed] }).catch(() => { return; });
    });

    client.on("warn", Logger.warn)
};
