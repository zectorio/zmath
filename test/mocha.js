
const assert = require('assert');
const {vec2, Transform, geom, Translation, Intersection} = require('..');

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

describe('Translation', () => {
  it('should translate ', () => {
    let xform = new Translation(5,5);
    assert.deepEqual(xform.toArray(), [1,0,0,1,5,5]);
  });
});

describe('Create line', () => {
  it('should find midpoint of line segment', () => {
    let line = new geom.Line([0,0],[10,10]);
    assert.deepEqual(line.evaluate(0.5), [5,5]);
  });
});


describe('Manufacturing circular arcs', () => {

  let cx=10; let cy=10; let r=8;
  /**
   *                   B V
   *              P        Q
   *            U
   *           A       O       C
   *                          W
   *              S         R
   *                X  D
   *
   *             O = [cx,cy]
   */
  let A = () => [cx-r,cy];
  let B = () => [cx,cy-r];
  let C = () => [cx+r,cy];
  let D = () => [cx,cy+r];

  let P = () => [cx-r*Math.cos(Math.PI/4), cy-r*Math.sin(Math.PI/4)];
  let Q = () => [cx+r*Math.cos(Math.PI/4), cy-r*Math.sin(Math.PI/4)];
  let R = () => [cx+r*Math.cos(Math.PI/4), cy+r*Math.sin(Math.PI/4)];
  let S = () => [cx-r*Math.cos(Math.PI/4), cy+r*Math.sin(Math.PI/4)];

  let U = () => [cx-r*Math.cos(Math.PI/6), cy-r*Math.sin(Math.PI/6)];
  let V = () => [cx+r*Math.sin(Math.PI/6), cy-r*Math.cos(Math.PI/6)];
  let W = () => [cx+r*Math.cos(Math.PI/6), cy+r*Math.sin(Math.PI/6)];
  let X = () => [cx-r*Math.sin(Math.PI/6), cy+r*Math.cos(Math.PI/6)];
  
  it('Semi circle 1', () => {
    let earc = geom.EllipseArc.circularArcFrom3Points( A(), B(), C() );
    assert.equal(earc.start, Math.PI);
    assert.equal(earc.end, 2*Math.PI);
    assert.equal(earc.ccw, false);
  });

  it('Semi circle 1 - rvs', () => {
    let earc = geom.EllipseArc.circularArcFrom3Points( C(), B(), A() );
    assert.equal(earc.start, 2*Math.PI);
    assert.equal(earc.end, Math.PI);
    assert.equal(earc.ccw, true);
  });
  
  it('Semi circle 2', () => {
    let earc = geom.EllipseArc.circularArcFrom3Points( B(), A(), D() );
    assert.equal(earc.start, 3*Math.PI/2);
    assert.equal(earc.end, Math.PI/2);
    assert.equal(earc.ccw, true);
  });
  
  it('Semi circle 2 - rvs', () => {
    let earc = geom.EllipseArc.circularArcFrom3Points( B(), C(), D() );
    assert.equal(earc.start, 3*Math.PI/2);
    assert.equal(earc.end, Math.PI/2);
    assert.equal(earc.ccw, false);
  });

  it('Quarter Circle 1', () => {
    let earc = geom.EllipseArc.circularArcFrom3Points( A(), P(), B() );
    assert.equal(earc.start, Math.PI);
    assert.equal(earc.end, 3*Math.PI/2);
    assert.equal(earc.ccw, false);
  });
  it('Quarter Circle 1 - rvs', () => {
    let earc = geom.EllipseArc.circularArcFrom3Points( B(), P(), A() );
    assert.equal(earc.start, 3*Math.PI/2);
    assert.equal(earc.end, Math.PI);
    assert.equal(earc.ccw, true);
  });
  
});

describe('Intersection', () => {
  
  it('Line-Line 1', () => {
    let iparams = Intersection.lineline(
      new geom.Line([0,50],[100,50]), new geom.Line([50,0],[50,100]))
    assert.deepEqual(iparams, [[0.5],[0.5]]);
  })
  
});