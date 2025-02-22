const { glob } = require("glob");

/**
 * 
 * @param {String} dirName 
 * @returns 
 */
async function loadFiles(dirName) {
    const files = await glob(`${process.cwd().replace(/\\/g, "/")}/${dirName}/**/*.js`);

    files.forEach((file) => {
        try {
            delete require.cache[require.resolve(file)];
        } catch (err) {
            console.error(`Failed to clear cache for ${file}:`, err);
        }
    });
        
    return files;
}

module.exports = { loadFiles };
