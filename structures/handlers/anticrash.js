const { EmbedBuilder, WebhookClient } = require("discord.js");
const { inspect } = require("util");
const webhook = new WebhookClient({ url: "https://discord.com/api/webhooks/999450630940790864/ycogfD6th3xYvlay0v3jJMYEFTIQxj3k4eXLNWEovLB45VTReNE4AAOrM06lt1Xl1t_u" });
const consola = require('consola');

module.exports = (client) => {
    consola.success("Anticrash module loaded");
    const embed = new EmbedBuilder()
        .setColor("Red");
    
    client.on("error", (err) => {
        console.log(err);

        embed
            .setTitle("Discord API Error")
            .setURL("https://discordjs.guide/popular-topics/errors.html#api-errors")
            .setDescription(`\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``)
            .setTimestamp();

        return webhook.send({ embeds: [embed] });
    });

    process.on("unhandledRejection", (reason, promise) => {
        console.log(reason, "\n", promise);

        embed
            .setTitle("Unhandled Rejection/Catch")
            .setURL("https://nodejs.org/api/process.html#event-unhandledrejection")
            .addFields(
                { name: "Reason", value: `\`\`\`${inspect(reason, { depth: 0 }).slice(0, 1000)}\`\`\`` },
                { name: "Promise", value: `\`\`\`${inspect(promise, { depth: 0 }).slice(0, 1000)}\`\`\`` }
            )
            .setTimestamp();

        return webhook.send({ embeds: [embed] });
    });
    
    process.on("uncaughtException", (err, origin) => {
        console.log(err, "\n", origin);

        embed
            .setTitle("Uncaught Exception/Catch")
            .setURL("https://nodejs.org/api/process.html#event-uncaughtexception")
            .addFields(
                { name: "Error", value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\`` },
                { name: "Origin", value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\`` }
            )
            .setTimestamp();

        return webhook.send({ embeds: [embed] });
    });
    
    process.on("uncaughtExceptionMonitor", (err, origin) => {
        console.log(err, "\n", origin);

        embed
            .setTitle("Uncaught Exception Monitor")
            .setURL("https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor")
            .addFields(
                { name: "Error", value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\`` },
                { name: "Origin", value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\`` }
            )
            .setTimestamp();
    
        return webhook.send({ embeds: [embed] });
    });
    
    process.on("warn", (warn) => {
        console.log(warn);

        embed
            .setTitle("Uncaught Exception Monitor Warning")
            .setURL("https://nodejs.org/api/process.html#event-warning")
            .addFields(
                { name: "Warning", value: `\`\`\`${inspect(warn, { depth: 0 }).slice(0, 1000)}\`\`\`` }
            )
            .setTimestamp();

        return webhook.send({ embeds: [embed] });
    });

    client.on("warn", consola.warn)
};