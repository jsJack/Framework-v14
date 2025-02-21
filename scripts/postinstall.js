const { promisify } = require('util');
const { resolve, join } = require('path');
const fs = require('fs-extra');
const exec = promisify(require('child_process').exec);

const Logger = require('../src/structures/funcs/util/Logger');

require('dotenv').config();

// Constants
const FALLBACK_PATHS = { prisma: './node_modules/prisma/build/index.js' };
const SUPPORTED_PROVIDERS = ['mysql'];
const DB_PROVIDER = process.env.DB_PROVIDER;

// Helper functions
const pathify = (path) => resolve(__dirname, '../', path);
const createLogger = (level) => (...args) => Logger[level]('[+postinstall]', ...args);

// Loggers
const log = createLogger('debug');
const warnLog = createLogger('warn');
const errorLog = createLogger('error');

// Main functions
async function executeNPX(cmd) {
    try {
        const [command, ...args] = cmd.split(' ');
        const execPath = pathify(`./node_modules/.bin/${command}`);

        const fullCommand = !fs.existsSync(execPath)
            ? `node ${FALLBACK_PATHS[command]} ${args.join(' ')}`
            : `npx ${cmd}`;

        log(`> ${fullCommand}`);

        const { stderr, stdout } = await exec(fullCommand, { cwd: pathify('./') });

        if (stdout) log(stdout.toString());
        if (stderr) errorLog(stderr.toString());
    } catch (error) {
        errorLog(`Failed to execute command: ${cmd}\n${error.message}`);
        process.exit(1);
    }
};

function validateEnvironment() {
    if (!DB_PROVIDER) {
        warnLog('Environment Variables have not been filled out.\nPlease fill out the environment and run the installer again.');
        process.exit(0);
    }

    if (!SUPPORTED_PROVIDERS.includes(DB_PROVIDER)) {
        throw new Error(`DB_PROVIDER must be one of [${SUPPORTED_PROVIDERS.join(", ")}]`);
    }
};

function setupPrismaDirectory() {
    try {
        const prismaPath = pathify('./prisma');

        if (fs.existsSync(prismaPath)) {
            fs.rmSync(prismaPath, { force: true, recursive: true });
        } else {
            fs.mkdirSync(prismaPath);
        }

        fs.copySync(pathify(`./db/${DB_PROVIDER}`), prismaPath);
    } catch (error) {
        errorLog(`Error setting up Prisma directory - ${error.message}`);
        process.exit(1);
    }
};

/* Re-enable when we support SQLite */
// function setupSqliteConnection() {
//     if (DB_PROVIDER === 'sqlite' && !DB_CONNECTION_URL) {
//         DB_CONNECTION_URL = `file:${join(process.cwd(), './user/database.db')}`;
//         log(`set DB_CONNECTION_URL=${DB_CONNECTION_URL}`);
//     }
// }

async function main() {
    try {
        validateEnvironment();
        log(`Copying schema & migrations for ${DB_PROVIDER}`);
        setupPrismaDirectory();
        // setupSqliteConnection();
        
        await executeNPX('prisma generate');
        await executeNPX('prisma migrate deploy');
    } catch (error) {
        errorLog(`An unexpected error occurred: ${error.message}`);
        process.exit(1);
    }
}

main().catch((error) => {
    errorLog(`Fatal error: ${error.message}`);
    process.exit(1);
});
