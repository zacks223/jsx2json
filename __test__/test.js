const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const testJsx = fs.readFileSync(path.resolve(cwd, './__test__/testcase.jsx'), 'utf8');
const resultJsx = fs.readFileSync(path.resolve(cwd, './__test__/result.json'), 'utf8', 2);
const { jsxToJson } = require('../src/index.js');

test('transform jsx to json', () => {
    expect(JSON.stringify(jsxToJson(testJsx), null, 2)).toBe(resultJsx);
});