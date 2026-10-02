import test from 'node:test';
import assert from 'node:assert/strict';

import authRoutes from '../routes/authRoutes.js';

test('auth routes expose register, login and me endpoints', () => {
  const paths = authRoutes.stack
    .filter((layer) => layer.route)
    .map((layer) => layer.route.path)
    .sort();

  assert.deepEqual(paths, ['/login', '/me', '/register']);
});
