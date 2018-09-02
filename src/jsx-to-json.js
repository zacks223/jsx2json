const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const parser = require('@babel/parser');
const types = require('babel-types');
const babelTraverse = require('babel-traverse').default;
const babelGenerator = require('babel-generator').default;
const { writeJsonFile } = require('./util');

function jsxToJson(jsx) {
    const options = {
        sourceType: 'module',
        plugins: ['jsx']
    };
    let JSXlevel = 0;
    let jsonTree;
    const ast = parser.parse(jsx, options);
    writeJsonFile(ast, './ast.json');
    babelTraverse(ast, {
        JSXElement: {
            enter: () => {
                JSXlevel++;
            },
            exit: () => {
                JSXlevel--;
            }
        },

        JSXOpeningElement: {
            enter: path => {
                const nodeName = path.node.name;
                let jsonNode;
                if (types.isJSXIdentifier(nodeName)) {
                    const type = nodeName.name;
                    jsonNode = {
                        type,
                    };
                } else if (types.isJSXMemberExpression(nodeName)) {
                    const type = nodeName.property.name;
                    const parentType = getParentType(nodeName.object);
                    jsonNode = {
                        type,
                        parentType,
                    };
                }
                if (JSXlevel === 1) {
                    jsonTree = jsonNode;
                    path.parent.__jsonNode = jsonNode;
                } else if (JSXlevel > 1) {
                    path.parent.__jsonNode = jsonNode;
                    const parentJsonNode = path.parentPath.parentPath.node.__jsonNode;
                    if (!parentJsonNode.children) {
                        parentJsonNode.children = [];
                    }
                    parentJsonNode.children.push(jsonNode);
                }
            }
        },

        JSXText: path => {
            const text = path.node.value.replace(/[\n]/g, '').trim();
            if (text) {
                const parentNode = path.parent.__jsonNode;
                if (parentNode.type !== 'span') {
                    if (!parentNode.children) {
                        parentNode.children = [];
                    }
                    parentNode.children.push({
                        type: 'text',
                        text,
                    });
                } else {
                    parentNode.text = text;
                }
            }
        },

        JSXAttribute: path => {
            const node = path.node;
            const key = node.name.name;
            const value = getPropValue(node.value);
            const parent = path.findParent(path => {
                return types.isJSXElement(path.node)
            });
            const parentJsonNode = parent.node.__jsonNode;
            if (!parentJsonNode.props) {
                parentJsonNode.props = {};
            }
            parentJsonNode.props[key] = value;
        }
    });
    return jsonTree;
}

function getPropValue(node) {
    let value;
    if (types.isJSXExpressionContainer(node)) {
        const expression = node.expression;
        const code = babelGenerator(expression).code;
        value = eval(`(${code})`);
    } else {
        value = node.value;
    }
    return value;
}

module.exports = jsxToJson;