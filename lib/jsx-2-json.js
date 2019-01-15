'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.jsx2Json = jsx2Json;

var _babelTraverse = require('babel-traverse');

var _babelTraverse2 = _interopRequireDefault(_babelTraverse);

var _babelGenerator = require('babel-generator');

var _babelGenerator2 = _interopRequireDefault(_babelGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parser = require('@babel/parser');
var types = require('babel-types');
function jsx2Json(jsx) {
    var options = {
        sourceType: 'module',
        plugins: ['jsx']
    };
    var JSXlevel = 0;
    var jsonTree = void 0;
    var ast = parser.parse(jsx, options);
    (0, _babelTraverse2.default)(ast, {
        JSXElement: {
            enter: function enter() {
                JSXlevel++;
            },
            exit: function exit() {
                JSXlevel--;
            }
        },

        JSXOpeningElement: function JSXOpeningElement(path) {
            var nodeName = path.node.name;
            var jsonNode = void 0;
            if (types.isJSXIdentifier(nodeName)) {
                var type = nodeName.name;
                jsonNode = {
                    type: type
                };
            } else if (types.isJSXMemberExpression(nodeName)) {
                var _type = nodeName.property.name;
                var parentType = getParentType(nodeName.object);
                jsonNode = {
                    type: _type,
                    parentType: parentType
                };
            }
            if (JSXlevel === 1) {
                jsonTree = jsonNode;
                path.parent.__jsonNode = jsonNode;
            } else if (JSXlevel > 1) {
                path.parent.__jsonNode = jsonNode;
                var parentJsonNode = path.parentPath.parentPath.node.__jsonNode;
                if (!parentJsonNode.children) {
                    parentJsonNode.children = [];
                }
                parentJsonNode.children.push(jsonNode);
            }
        },

        JSXText: function JSXText(path) {
            var text = path.node.value.replace(/[\n]/g, '').trim();
            if (text) {
                var parentNode = path.parent.__jsonNode;
                if (parentNode.type !== 'span') {
                    if (!parentNode.children) {
                        parentNode.children = [];
                    }
                    parentNode.children.push({
                        type: 'text',
                        text: text
                    });
                } else {
                    parentNode.text = text;
                }
            }
        },

        JSXAttribute: function JSXAttribute(path) {
            var node = path.node;
            var key = node.name.name;
            var value = getPropValue(node.value);
            var parent = path.findParent(function (path) {
                return types.isJSXElement(path.node);
            });
            var parentJsonNode = parent.node.__jsonNode;
            if (!parentJsonNode.props) {
                parentJsonNode.props = {};
            }
            parentJsonNode.props[key] = value;
        }
    });
    return jsonTree;
}

function getPropValue(node) {
    var value = void 0;
    if (types.isJSXExpressionContainer(node)) {
        var expression = node.expression;
        var code = (0, _babelGenerator2.default)(expression).code;
        value = eval('(' + code + ')');
    } else {
        value = node.value;
    }
    return value;
}

function getParentType(node) {
    var type = void 0;
    if (types.isJSXIdentifier(node)) {
        type = node.name;
    } else if (types.isJSXMemberExpression(node)) {
        type = getParentType(node.object) + '.' + node.property.name;
    }
    return type;
}