const { glob } = require("glob");

async function loadSubFolders(parentFolder) {
  const subFolders = await glob(`${process.cwd().replace(/\\/g, "/")}/${parentFolder}/*`, { onlyDirectories: true });

  return subFolders.map(subFolder => subFolder.split('/').pop());
}

module.exports = { loadSubFolders };
