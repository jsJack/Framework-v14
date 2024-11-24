const { Schema, model } = require('mongoose');

module.exports = model("whitelist", new Schema(
        {
            _id: String, // user id
            reason: String, // reason for whitelisting
            by: String, // user id of the person who whitelisted
            at: Number, // date of when the user was whitelisted
            until: Number, // date of when the user will be unwhitelisted
            cmds: Array // commands that are whitelisted
        }
    )
);
