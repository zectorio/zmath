
const assert = require('assert');
const {vec2} = require('..');

describe('Vec2 add', () => {
  it('should add two vectors', () => {
    assert.deepEqual(vec2.add([1,1],[1,1]), [2,2]);
  });
});