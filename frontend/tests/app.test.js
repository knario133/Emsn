import assert from 'node:assert/strict';
import test from 'node:test';

import { createStatusMessage } from '../src/js/app.js';

test('createStatusMessage normaliza el nombre del usuario', () => {
  assert.equal(createStatusMessage('  Frank  '), 'IntraMessenger listo para Frank');
  assert.equal(createStatusMessage(''), 'IntraMessenger listo');
  assert.equal(createStatusMessage(null), 'IntraMessenger listo');
});
