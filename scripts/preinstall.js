const fs = require('fs-extra');
const Logger = require('../src/structures/funcs/util/Logger');

function log(...args) { Logger.debug('[+preinstall]', ...args) };

if (process.env.CI) {
    log('CI detected, skipping');
    process.exit(0);
};

const env = {
    DB_CONNECTION_URL: '',
    DB_PROVIDER: '',

    DISCORD_TOKEN: '',
    SUPER_USERS: ['324596012955992065'],

    DEVELOPER_GUILD_ID: '',
    ANTICRASH_WEBHOOK: '',

    NODE_ENV: 'production',
};

if (!fs.existsSync('./.env')) {
    fs.writeFileSync('./.env', Object.entries(env).map(([k, v]) => `${k}=${v}`).join('\n'));
    log('.env created and populated with default values');
} else {
    log('.env exists; skipping');
};
