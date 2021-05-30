// Copyright 2021 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Lint check to ensure that all directives have an explicit
 * Scope: {} and scope should not set to true.
 */

'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: (
        'Lint check to ensure that all directives have an explicit Scope: {}' +
        ' and scope should not set to true'),
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      scopeNotFound: 'Please ensure that directive in file has a scope: {}.',
      messageId: (
        'Please ensure that directive in file does not have scope set to true.')
    },
  },

  create: function(context) {
    var selector = 'CallExpression[callee.object.callee.object.name=angular]' +
    '[callee.object.callee.property.name=module]' +
    '[callee.property.name=directive]';

    return {
      [selector]: function(node) {
        if (node.arguments.length !== 2 ||
          node.arguments[1].type !== 'ArrayExpression') {
          return;
        }
        var controllerFunctionNode = node.arguments[1].elements.slice(-1)[0];
        if (controllerFunctionNode.type !== 'FunctionExpression') {
          return;
        }
        if (controllerFunctionNode.body.body[0].type !== 'ReturnStatement') {
          return;
        }
        var returnDictProperties = (
          controllerFunctionNode.body.body[0].argument.properties);

        var scopeFound = false;
        returnDictProperties.forEach(function(property) {
          if (property.key.name !== 'scope') {
            return;
          }
          scopeFound = true;
          if (property.value.raw === 'true') {
            context.report({
              node: node,
              messageId: 'messageId'
            });
          }
        });
        if (!scopeFound) {
          context.report({
            node: node,
            messageId: 'scopeNotFound'
          });
        }
      }
    };
  }
};
