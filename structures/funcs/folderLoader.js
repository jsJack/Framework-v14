const { promisify } = require("util");
const { glob } = require("glob");
const proGlob = promisify(glob);

async function loadSubFolders(parentFolder) {
  const subFolders = await proGlob(`${process.cwd().replace(/\\/g, "/")}/${parentFolder}/*`, { onlyDirectories: true });
  
  const folderNames = subFolders.map(subFolder => subFolder.split('/').pop());
  
  return folderNames;
}

module.exports = { loadSubFolders };
