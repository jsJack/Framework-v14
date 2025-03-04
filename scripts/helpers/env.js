const env = {
    DB_CONNECTION_URL: '',
    DB_PROVIDER: '',

    DISCORD_TOKEN: '',
    SUPER_USERS: ['324596012955992065'],

    DEVELOPER_GUILD_ID: '',
    ANTICRASH_WEBHOOK: '',

    NODE_ENV: 'production',

    ALLOWED_IMAGE_HOSTNAMES: 'i.gyazo.com,gyazo.com,i.imgur.com,imgur.com,cdn.discordapp.com'
};

const requiredSecrets = [
    'DB_CONNECTION_URL',
    'DB_PROVIDER',

    'DISCORD_TOKEN',
    'SUPER_USERS',
    
    'ANTICRASH_WEBHOOK'
];

const missingSecrets = requiredSecrets.filter((secret) => !process.env[secret]);

module.exports = { env, missingSecrets };
