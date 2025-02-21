const fs = require('fs-extra');

const Logger = require('../src/structures/funcs/util/Logger');
const { env } = require('./helpers/env')

// Loggers
const createLogger = (level) => (...args) => Logger[level]('[+postinstall]', ...args);
const infoLog = createLogger('info');
const warnLog = createLogger('warn');

if (process.env.CI) {
    infoLog('CI detected, skipping'); // Can't rely on debug log being enabled
    process.exit(0);
};

if (!fs.existsSync('./.env')) {
    fs.writeFileSync('./.env', Object.entries(env).map(([k, v]) => `${k}=${v}`).join('\n'));
    infoLog('.env created and populated with default values.');
} else {
    warnLog('.env exists; not creating.');
};
