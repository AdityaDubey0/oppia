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
 * @fileoverview Lint to ensure that follow good practices
 * for writing proractor e2e test.
 */

'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: (
        'Lint check to follow good practices for writing protractor e2e test'),
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      constInAllCaps: (
        'Please make sure that constant name “{{constName}}” are in all-caps'),
      disallowedBrowserMethods: (
        'Please do not use browser.{{methodName}}() in protractor files'),
      disallowThen: 'Please do not use .then(), consider async/await instead',
      disallowAwait: 'Please do not use await for "{{propertyName}}()"'
    },
  },

  create: function(context) {
    var invalidAwaitSelector = (
      'AwaitExpression[argument.callee.property.name=/^(first|last|get)$/]');
    var disallowedBrowserMethods = [
      'sleep', 'explore', 'pause', 'waitForAngular'];
    var disallowedBrowserMethodsRegex = (
      `/^(${disallowedBrowserMethods.join('|')})$/`);
    var disallowedBrowserMethodsSelector = (
      'CallExpression[callee.object.name=browser][callee.property.name=' +
      disallowedBrowserMethodsRegex + ']');

    var reportDisallowInvalidAwait = function(node) {
      context.report({
        node: node,
        messageId: 'disallowAwait',
        data: {
          propertyName: node.argument.callee.property.name
        }
      });
    };

    var reportDisallowedBrowserMethod = function(node) {
      context.report({
        node: node,
        loc: node.callee.loc,
        messageId: 'disallowedBrowserMethods',
        data: {
          methodName: node.callee.property.name
        }
      });
    };

    var checkConstName = function(node) {
      var constantName = node.declarations[0].id.name;
      if ((node.declarations[0].id.type === 'Identifier') &&
        (constantName !== constantName.toUpperCase())) {
        context.report({
          node: node,
          messageId: 'constInAllCaps',
          data: {
            constName: constantName
          }
        });
      }
    };

    return {
      [invalidAwaitSelector]: function(node) {
        reportDisallowInvalidAwait(node);
      },
      'VariableDeclaration[kind=const]': function(node) {
        checkConstName(node);
      },
      [disallowedBrowserMethodsSelector]: function(node) {
        reportDisallowedBrowserMethod(node);
      },
      'CallExpression[callee.property.name=\'then\']': function(node) {
        context.report({
          node: node.callee.property,
          loc: node.callee.property.loc,
          messageId: 'disallowThen'
        });
      }
    };
  }
};
