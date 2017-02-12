
const assert = require('assert');
const {vec2, Transform, geom} = require('..');

describe('Vec2 add', () => {
  it('should add two vectors', () => {
    assert.deepEqual(vec2.add([1,1],[1,1]), [2,2]);
  });
});

describe('Transform translate', () => {
  it('should translate a transform', () => {
    let xform = new Transform();
    assert.deepEqual(xform.translate(5,5).toArray(), [1,0,0,1,5,5]);
  });
});

describe('Create line', () => {
  it('should find midpoint of line segment', () => {
    let line = new geom.Line([0,0],[10,10]);
    assert.deepEqual(line.evaluate(0.5), [5,5]);
  });
});