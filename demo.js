const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const sourceCode = fs.readFileSync(path.resolve(cwd, './test.jsx'), 'utf8');
const { jsxToJson } = require('./index.js');

const jsxInJson = jsxToJson(sourceCode);

fs.writeFileSync(path.resolve(cwd, './result.json'), JSON.stringify(jsxInJson, null, 2));