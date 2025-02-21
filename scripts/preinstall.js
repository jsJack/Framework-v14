const fs = require('fs-extra');
const Logger = require('../src/structures/funcs/util/Logger');
const createLogger = (level) => (...args) => Logger[level]('[+postinstall]', ...args);

// Loggers
const infoLog = createLogger('info');
const warnLog = createLogger('warn');

if (process.env.CI) {
    infoLog('CI detected, skipping'); // Can't rely on debug log being enabled
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
    infoLog('.env created and populated with default values.');
} else {
    warnLog('.env exists; not creating.');
};
