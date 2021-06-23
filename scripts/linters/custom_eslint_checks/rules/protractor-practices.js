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
      disallowSleep: 'Please do not use browser.sleep() in protractor files',
      disallowThen: 'Please do not use .then(), consider async/await instead',
      useProtractorTest: (
        'Please use “.protractor-test-” prefix classname selector instead of ' +
        '“{{incorrectClassname}}”'),
      constInAllCaps: (
        'Please make constant name “{{constName}}” are in all-caps')
    },
  },

  create: function(context) {
    var byCssSelector = (
      'CallExpression[callee.object.name=by][callee.property.name=css]');

    var checkElementSelector = function(node) {
      var thirdPartySelectorPrefixes = (
        ['.modal', '.select2', '.CodeMirror', '.toast', '.ng-joyride', '.mat']);
      for (var i = 0; i < thirdPartySelectorPrefixes.length; i++) {
        if ((node.arguments[0].type === 'Literal') &&
          (node.arguments[0].value.startsWith(thirdPartySelectorPrefixes[i]))) {
          return;
        }
        if ((node.arguments[0].type === 'Literal') &&
         (node.arguments[0].value.startsWith('option'))) {
          return;
        }
      }
      if ((node.arguments[0].type === 'Literal') &&
        (!node.arguments[0].value.startsWith('.protractor-test-'))) {
        context.report({
          node: node.arguments[0],
          messageId: 'useProtractorTest',
          data: {
            incorrectClassname: node.arguments[0].value
          }
        });
      }
    };

    var checkSleepCall = function(node) {
      var callee = node.callee;
      if (callee.property && callee.property.name !== 'sleep') {
        return;
      }

      if (callee.object && callee.object.name === 'browser') {
        context.report({
          node: node,
          loc: callee.loc,
          messageId: 'disallowSleep'
        });
      }
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
      'VariableDeclaration[kind=const]': function(node) {
        checkConstName(node);
      },
      CallExpression: function(node) {
        checkSleepCall(node);
      },
      'CallExpression[callee.property.name=\'then\']': function(node) {
        context.report({
          node: node.callee.property,
          loc: node.callee.property.loc,
          messageId: 'disallowThen'
        });
      },
      [byCssSelector]: function(node) {
        checkElementSelector(node);
      }
    };
  }
};
