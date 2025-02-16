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
const log = (...args) => Logger.debug('[+postinstall]', ...args);
const warnLog = (...args) => Logger.warn('[+postinstall]', ...args);

async function executeCommand(cmd) {
    const [command, ...args] = cmd.split(' ');
    const execPath = pathify(`./node_modules/.bin/${command}`);
    
    const fullCommand = !fs.existsSync(execPath)
        ? `node ${FALLBACK_PATHS[command]} ${args.join(' ')}`
        : `npx ${cmd}`;

    log(`> ${fullCommand}`);

    const { stderr, stdout } = await exec(fullCommand, { cwd: pathify('./') });
    
    if (stdout) Logger.error(stdout.toString());
    if (stderr) Logger.error(stderr.toString());
};

function validateEnvironment() {
    if (!DB_PROVIDER) {
        warnLog('Environment Variables have not been filled out.\nPlease fill out the environment and run the installer again.');
        process.exit(0);
    }

    if (!SUPPORTED_PROVIDERS.includes(DB_PROVIDER)) {
        throw new Error(`DB_PROVIDER must be one of: ${SUPPORTED_PROVIDERS}`);
    }
};

function setupPrismaDirectory() {
    const prismaPath = pathify('./prisma');
    
    if (fs.existsSync(prismaPath)) {
        fs.rmSync(prismaPath, { force: true, recursive: true });
    } else {
        fs.mkdirSync(prismaPath);
    }

    fs.copySync(pathify(`./db/${DB_PROVIDER}`), prismaPath);
};

/* Re-enable when we support SQLite */
// function setupSqliteConnection() {
//     if (DB_PROVIDER === 'sqlite' && !DB_CONNECTION_URL) {
//         DB_CONNECTION_URL = `file:${join(process.cwd(), './user/database.db')}`;
//         log(`set DB_CONNECTION_URL=${DB_CONNECTION_URL}`);
//     }
// }

// Main execution
async function main() {
    validateEnvironment();
    log(`Copying schema & migrations for ${DB_PROVIDER}`);
    setupPrismaDirectory();
    // setupSqliteConnection();
    
    await executeCommand('prisma generate');
    await executeCommand('prisma migrate deploy');
};

main().catch(console.error);
