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
 * @fileoverview Lint check to disallow usage
 * of identifier phrase.
 */

'use strict';

var rule = require('./disallow-identifier-phrase');
var RuleTester = require('eslint').RuleTester;

var ruleTester = new RuleTester();
ruleTester.run('no-test-blockers', rule, {
  valid: [
    {
      code:
      `browser.explodre()`,
    }
  ],

  invalid: [
    {
      code:
      `Bypassbrowser.explore()`,
      errors: [{
        message: 'Please do not use word "bypass"',
        type: 'Identifier',
      }],
    }
  ]
});
