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
 * @fileoverview Lint check to report incomplete 'throw' and 'toThrow'.
 */

'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Lint check to report incomplete "throw" and "toThrow".',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      useThrowNewError: 'Please use "throw new Error" instead of "throw".',
      useToThrowError: 'Please use “toThrowError”  instead of “toThrow”.'
    },
  },

  create: function(context) {
    var reportThrow = function(node) {
      var typesOfError = (
        ['Error', 'TypeError', 'RangeError', 'SyntaxError', 'DimensionError']);
      if (node.argument.type !== 'NewExpression' ||
        typesOfError.indexOf(node.argument.callee.name) === -1) {
        context.report({
          node: node,
          messageId: 'useThrowNewError'
        });
      }
    };

    var reportToThrow = function(node) {
      context.report({
        node: node.property,
        messageId: 'useToThrowError'
      });
    };

    return {
      ThrowStatement: function(node) {
        reportThrow(node);
      },
      'MemberExpression[property.name=toThrow]': function(node) {
        reportToThrow(node);
      }
    };
  }
};

