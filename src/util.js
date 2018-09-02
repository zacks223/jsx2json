const fs = require('fs');
const path = require('path');
const cwd = process.cwd();

function writeJsonFile(obj, dir) {
    const fileDir = path.resolve(cwd, dir);
    fs.writeFileSync(fileDir, JSON.stringify(obj, null, 2));
}

module.exports = {
    writeJsonFile
}