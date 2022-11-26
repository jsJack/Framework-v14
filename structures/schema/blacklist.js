const { Schema, model } = require('mongoose');

module.exports = model("blacklist", new Schema(
        {
            // not using _id because guild and user id could clash in very rare cases
            id: String, // guild or user id
            type: String, // guild or user
            reason: String, // reason for blacklisting
            by: String, // user id of the person who blacklisted
            at: Number, // date of when the guild or user was blacklisted
            until: Number, // date of when the guild or user will be unblacklisted
            cmds: Array // commands that are blacklisted
        }
    )
);