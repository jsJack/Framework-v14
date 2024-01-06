const fs = require('fs');
const path = require('path');
const Logger = require('./util/Logger')

// Base template for the modules.json file
const baseTemplate = {
    "blacklist": {
        "enabled": true,
        "available": true
    }
};

/**
 * Updates the status of a module in the modules.json file.
 * @param {string} moduleName - The name of the module to update.
 * @param {boolean} enabled - Whether the module is enabled or not.
 * @param {boolean} available - Whether the module is available or not.
 */
function updateModuleStatus(moduleName, enabled, available) {
    const filePath = path.join(__dirname, '../modules.json');
    let modules = {};
    if (fs.existsSync(filePath)) {
        modules = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } else {
        modules = baseTemplate;
    }
    modules[moduleName] = {
        enabled: enabled,
        available: available
    };
    fs.writeFileSync(filePath, JSON.stringify(modules, null, 4), 'utf8');
}

/**
 * Loads the current module status from the modules.json file.
 * If the file doesn't exist, it returns the base template.
 * @returns {Object} The current module status as an object.
 */
async function loadModuleStatus() {
    const filePath = path.join(__dirname, '../modules.json');

    try {
        const rawData = await fs.promises.readFile(filePath);
        const moduleData = JSON.parse(rawData);
        return moduleData;
    } catch (err) {
        if (err.code === 'ENOENT') {
            Logger.module('Modules file does not exist. Creating...');
            const defaultModules = ['blacklist'];
            const moduleData = {};

            defaultModules.forEach((module) => {
                moduleData[module] = {
                    enabled: true,
                    available: true,
                };
            });

            const writeStream = fs.createWriteStream(filePath);
            writeStream.write(JSON.stringify(moduleData, null, 4));
            writeStream.end();

            Logger.module('Modules file created.');
            return moduleData;
        } else {
            Logger.module('Could not load module status:', err);
            return null;
        }
    }
}

module.exports = {
    updateModuleStatus,
    loadModuleStatus
};
