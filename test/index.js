
import {vec2, Transform, Translation, Intersection, geom, NDArray} from '..';
import {Kolor} from 'zbits'
import ZCanvas from 'zcanvas'
import zdom from 'zdom'

const PI=Math.PI;
const sin = Math.sin;
const cos = Math.cos;
let Line = geom.classic.Line;
let CubicBezier = geom.classic.CubicBezier;
let EllipseArc = geom.classic.EllipseArc;

function runNDArrayUnitTests() {
  let qunitDiv = zdom.createDiv();
  zdom.id(qunitDiv,'qunit');
  zdom.add(document.body, qunitDiv);
  let qunitFixtureDiv = zdom.createDiv();
  zdom.id(qunitFixtureDiv,'qunit-fixture');
  zdom.add(document.body, qunitFixtureDiv);
  
  QUnit.test('Check size', assert => {
    let ndarr = new NDArray([2,3,4]); 
    ndarr.set([0,0,2], 25);
    assert.equal(ndarr.size(), 24);
  });
  QUnit.test('Set and Get', assert => {
    let ndarr = new NDArray([2,3,4]);
    ndarr.set([0,0,2], 25);
    assert.equal(ndarr.get([0,0,2]), 25);
    assert.notEqual(ndarr.get([0,0,1]), 25);
  });
  QUnit.test('Fill', assert => {
    let ndarr = new NDArray(0);
    ndarr.fill([
      [1,4,3,4],
      [3,5,6,7]
    ]);
    assert.deepEqual(ndarr.shape, [2,4]);
  });
}

function runUnitTests() {
  let qunitDiv = zdom.createDiv();
  zdom.id(qunitDiv,'qunit');
  zdom.add(document.body, qunitDiv);
  let qunitFixtureDiv = zdom.createDiv();
  zdom.id(qunitFixtureDiv,'qunit-fixture');
  zdom.add(document.body, qunitFixtureDiv);

  QUnit.test('Should add two vectors', assert => {
    assert.deepEqual(vec2.add([1,1],[1,1]), [2,2]);
  });

  QUnit.test('should translate a transform', assert => {
    let xform = new Transform();
    assert.deepEqual(xform.translate(5,5).toArray(), [1,0,0,1,5,5]);
  });

  QUnit.test('should translate ', assert => {
    let xform = new Translation(5,5);
    assert.deepEqual(xform.toArray(), [1,0,0,1,5,5]);
  });

  QUnit.test('should find midpoint of line segment', assert => {
    let line = new Line([0,0],[10,10]);
    assert.deepEqual(line.evaluate(0.5), [5,5]);
  });



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

  QUnit.test('Semi circle 1', assert => {
    let earc = EllipseArc.circularArcFrom3Points( A(), B(), C() );
    assert.equal(earc.start, Math.PI);
    assert.equal(earc.end, 2*Math.PI);
    assert.equal(earc.ccw, false);
  });

  QUnit.test('Semi circle 1 - rvs', assert => {
    let earc = EllipseArc.circularArcFrom3Points( C(), B(), A() );
    assert.equal(earc.start, 2*Math.PI);
    assert.equal(earc.end, Math.PI);
    assert.equal(earc.ccw, true);
  });

  QUnit.test('Semi circle 2', assert => {
    let earc = EllipseArc.circularArcFrom3Points( B(), A(), D() );
    assert.equal(earc.start, 3*Math.PI/2);
    assert.equal(earc.end, Math.PI/2);
    assert.equal(earc.ccw, true);
  });

  QUnit.test('Semi circle 2 - rvs', assert => {
    let earc = EllipseArc.circularArcFrom3Points( B(), C(), D() );
    assert.equal(earc.start, 3*Math.PI/2);
    assert.equal(earc.end, Math.PI/2);
    assert.equal(earc.ccw, false);
  });

  QUnit.test('Quarter Circle 1', assert => {
    let earc = EllipseArc.circularArcFrom3Points( A(), P(), B() );
    assert.equal(earc.start, Math.PI);
    assert.equal(earc.end, 3*Math.PI/2);
    assert.equal(earc.ccw, false);
  });
  QUnit.test('Quarter Circle 1 - rvs', assert => {
    let earc = EllipseArc.circularArcFrom3Points( B(), P(), A() );
    assert.equal(earc.start, 3*Math.PI/2);
    assert.equal(earc.end, Math.PI);
    assert.equal(earc.ccw, true);
  });

  // Line-Line intersection

  QUnit.test('Line-Line : At midpoint', assert => {
    let iparams = Intersection.lineline(
      new Line([0,50],[100,50]), new Line([50,0],[50,100]));
    assert.deepEqual(iparams, [[0.5],[0.5]]);
  });

  QUnit.test('Line-Line : At endpoint', assert => {
    let iparams = Intersection.lineline(
      new Line([0,50],[100,50]), new Line([100,0],[100,100]));
    assert.deepEqual(iparams, [[],[0.5]]);
  });
  
  QUnit.test('Line-Line : No intersection', assert => {
    let iparams = Intersection.lineline(
      new Line([0,50],[100,50]), new Line([101,0],[101,100]));
    assert.deepEqual(iparams, [[],[]]);
  });
  
  QUnit.test('Line-Line : meet at endpoints, no intersection', assert => {
    let iparams = Intersection.lineline(
      new Line([0,100],[100,100]), new Line([100,0],[100,100]));
    assert.deepEqual(iparams, [[],[]]);
  });
  
  QUnit.test('Line-Line : slanted lines meet at midpoint', assert => {
    let iparams = Intersection.lineline(
      new Line([0,0],[100,100]), new Line([100,0],[0,100]));
    assert.deepEqual(iparams, [[0.5],[0.5]]);
  });
  
}

function testBBox() {

  let WIDTH=1000;
  let HEIGHT=800;
  let zc = new ZCanvas('svg',WIDTH,HEIGHT);
  zdom.add(document.body, zc.getDOMElement());

  let GAP=6;
  let X=GAP;
  let Y=GAP;
  let W=60;
  let H=60;
  
  let geomStyle = {stroke:'#f00', strokeWidth:2, fill:'none'};
  let aabbStyle = {stroke:'#000', strokeWidth:1, fill:'none'};
  let cpointStyle = {stroke:'none', fill:'#777'};
  
  function drawCPoints(cbez) {
    cbez.cpoints.forEach(([cx,cy]) => {
      zc.root().add(new ZCanvas.RenderShape({type:'circle',cx,cy,r:1}, cpointStyle));
    });
  }
  
  {
    let line = new Line([X+10,Y+10],[X+W-10,Y+H-30]);
    zc.root().add(
      new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(line.aabb().toCanvasPathDef(), aabbStyle));
  }
  
  X = GAP;
  Y += W+GAP;
  
  {
    let cbez = new CubicBezier([[X,Y+H],[X+.25*W,Y],[X+.75*W,Y],[X+W,Y+H]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }

  X += W+GAP;
  {
    let cbez = new CubicBezier([[X,Y+H/2],[X+.25*W,Y+H+0.25*H],[X+.75*W,Y-0.25*H],[X+W,Y+H/2]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }
  
  X += W+GAP;

  {
    let cbez = new CubicBezier([[X,Y+H],[X+.25*W,Y+H],[X+.75*W,Y],[X+W,Y]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }

  X += W+GAP;

  {
    let cbez = new CubicBezier([[X,Y+H],[X+.75*W,Y],[X+.25*W,Y],[X+W,Y+H]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }
  
  X += W+GAP;

  {
    let cbez = new CubicBezier([[X,Y+H],[X+W+0.25*W,Y+H/2],[X-0.25*W,Y+H/2],[X+W,Y+H]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }
  
  X += W+GAP;

  {
    let cbez = new CubicBezier([[X,Y+H],[X+W+0.25*W,Y+H/2],[X-0.25*W,Y+H/2],[X+W,Y+2*H/3]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }
  
  X = GAP;
  Y += W+4*GAP;

  {
    let cbez = new CubicBezier([[X,Y],[X+W,Y+0.25*H],[X+W,Y+0.75*H],[X,Y+H]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }
  
  X += W+GAP;
  {
    let cbez = new CubicBezier([[X+W/2,Y],[X-W,Y+0.25*H],[X+2*W,Y+0.75*H],[X+W/2,Y+H]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }
  
  X += W+GAP;
  {
    let cbez = new CubicBezier([[X,Y],[X+W,Y+0.75*H],[X+W,Y+0.25*H],[X,Y+H]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }

  X += W+GAP;
  {
    let cbez = new CubicBezier([[X,Y],[X+W,Y-H],[X+W,Y+2*H],[X,Y+H]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }
  
  X += W+GAP;
  {
    let cbez = new CubicBezier([[X,Y],[X+W,Y+2*H],[X+W,Y-H],[X,Y+H]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }

  X += W+GAP;
  {
    let cbez = new CubicBezier([[X,Y+H/2],[X+W,Y-H],[X+W,Y],[X+W/2,Y+H]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }
  
  //
  // Circular Arcs
  //
  X = GAP;
  Y += H+3*GAP;
  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.4*W,0.4*W,
      0, Math.PI/2, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.4*W,0.4*W,
      0, Math.PI/2, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.4*W,0.4*W,
      0, Math.PI/4, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.4*W,0.4*W,
      0, Math.PI/4, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new EllipseArc(
      [X+W/2,Y+H/2],0.4*W,0.4*W,0, 3*Math.PI/4, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new EllipseArc(
      [X+W/2,Y+H/2],0.4*W,0.4*W,0, 3*Math.PI/4, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  
  X = GAP;
  Y += H+3*GAP;
  {
    let earc = new EllipseArc(
      [X+W/2,Y+H/2],0.4*W,0.4*W,3*Math.PI/2, Math.PI/2, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new EllipseArc(
      [X+W/2,Y+H/2],0.4*W,0.4*W,3*Math.PI/2, Math.PI/2, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new EllipseArc(
      [X+W/2,Y+H/2],0.4*W,0.4*W,Math.PI/4, 5*Math.PI/4, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new EllipseArc(
      [X+W/2,Y+H/2],0.4*W,0.4*W,Math.PI/4, 5*Math.PI/4, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new EllipseArc(
      [X+W/2,Y+H/2],0.4*W,0.4*W,0, Math.PI, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new EllipseArc(
      [X+W/2,Y+H/2],0.4*W,0.4*W,0, Math.PI, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }

  // Elliptical arcs
  X = GAP;
  Y += H+3*GAP;
  {
    let earc = new EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,0, Math.PI/2, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,0, Math.PI/2, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,0, Math.PI/4, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,0, Math.PI/4, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,0, 3*Math.PI/4, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,0, 3*Math.PI/4, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  
  X = GAP;
  Y += H+3*GAP;
  {
    let earc = new EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,3*Math.PI/2, Math.PI/2, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,3*Math.PI/2, Math.PI/2, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,Math.PI/4, 5*Math.PI/4, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,Math.PI/4, 5*Math.PI/4, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,0, Math.PI, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,0, Math.PI, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }

  zc.render();
}

function testBezSurfSubdivision(ipoint) {
  let points = [];

  // let surfgrid = new CubicBezierSurfacePatch([[new CubicBezierSurface({points:[
  //   [ [100,50], [200,100], [300,100], [310,50] ],
  //   [ [120,150], [200,150], [300,150], [400,150] ],
  //   [ [70,300], [200,350], [300,350], [450,300] ],
  //   [ [100,450], [200,400], [300,400], [400,450] ]
  // ]})]]);

  let surfgrid = new CubicBezierSurfacePatch([[new CubicBezierSurface({
    coons : [
      [100,100], [100,100],
      [400,100], [400,100], [400,100],
      [400,400], [400,400], [400,400],
      [100,400], [100,400], [100,400],
      [100,100]
    ]
  })]]);


  // let divPt1 = [200,200];
  // let divPt2 = [150,150];
  // surfgrid.subdivide(divPt1);
  // surfgrid.subdivide(divPt2);
  //
  // points.push(divPt1);
  // points.push(divPt2);

  if(ipoint) {

    surfgrid.surfaces[0][0].getBoundaryCurves().forEach(crv => {
      points.push(crv.project(ipoint));
    });

    surfgrid.subdivide(ipoint);
    points.push(ipoint);
  }

  let boundaryCurveData = [];
  for(let surf of surfgrid.getBezierSurfaces()) {
    boundaryCurveData.push(surf.toSVGPathData());
  }

  return `
<svg width="640" height="480" xmlns="http://www.w3.org/2000/svg">
  <g>
    
    ${boundaryCurveData.map((data,idx) => `
      <path d="${data}"
        style="stroke:none;fill:${new Kolor({h:Math.round((idx/boundaryCurveData.length)*360),s:1.0,v:1.0}).toCSSHex()}">
      </path>`).join('\n')}
    
    ${points.map(([x,y])=> `<circle r="3" cx="${x}" cy="${y}" style="fill:#fff;stroke:#000"></circle>`).join('\n')}
  </g>
</svg>
`;
}


function drawCircleArcs() {

  function canvasDraw(ctx, earc) {

    let [cx,cy] = earc.center;

    ctx.beginPath();
    
    ctx.ellipse(cx,cy,earc.rx,earc.ry,0,earc.start,earc.end,earc.ccw);
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function svgDraw(svg, earc) {
    let [cx,cy] = earc.center;
    
    let path = zdom.createPath();

    let x1 = cx + earc.rx * Math.cos(earc.start);
    let y1 = cy + earc.ry * Math.sin(earc.start);

    let x2 = cx + earc.rx * Math.cos(earc.end);
    let y2 = cy + earc.ry * Math.sin(earc.end);

    let fS = earc.ccw ? 0 : 1;
    let fA = earc.getAngleSpan() > Math.PI ? 1 : 0;

    zdom.set(path, 'd',
      `M ${x1},${y1} A ${earc.rx},${earc.ry} 0 ${fA} ${fS} ${x2},${y2}`);
    zdom.set(path, 'style', 'stroke:#000;fill:none;stroke-width:2');

    zdom.add(svg, path);
  }
  
  function draw(earc) {
    canvasDraw(ctx, earc);
    svgDraw(svg, earc);
  }
  
  let WIDTH = 400, HEIGHT=400;
  let r = 8;
  let step = 30;
  let cx,cy;
  
  // make canvas
  let canvas = zdom.createCanvas(WIDTH,HEIGHT);
  zdom.add(document.body, canvas);
  let ctx = canvas.getContext('2d');
  
  // make svg
  let svg = zdom.createSVG(WIDTH,HEIGHT);
  zdom.add(document.body, svg);
  
  cx = 10; cy = 10;

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
  
  // 1/8 Pie
  draw(EllipseArc.circularArcFrom3Points(A(),U(),P()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(B(),V(),Q()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(C(),W(),R()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(D(),X(),S()));

  cx += 2*step;
  draw(EllipseArc.circularArcFrom3Points(P(),U(),A()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(Q(),V(),B()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(R(),W(),C()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(S(),X(),D()));

  // Quarter Pie
  cx = 10; cy += step;
  draw(EllipseArc.circularArcFrom3Points(A(),P(),B()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(B(),Q(),C()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(C(),R(),D()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(D(),S(),A()));
  
  cx += 2*step;
  draw(EllipseArc.circularArcFrom3Points(B(),P(),A()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(C(),Q(),B()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(D(),R(),C()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(A(),S(),D()));
  
  cx = 10; cy += step;
  draw(EllipseArc.circularArcFrom3Points(P(),B(),Q()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(Q(),C(),R()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(R(),D(),S()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(S(),A(),P()));
  
  cx += 2*step;
  draw(EllipseArc.circularArcFrom3Points(Q(),B(),P()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(R(),C(),Q()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(S(),D(),R()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(P(),A(),S()));
  
  // Half Pie
  cx = 10; cy += step;
  draw(EllipseArc.circularArcFrom3Points(A(),B(),C()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(B(),C(),D()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(C(),D(),A()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(D(),A(),B()));

  cx += 2*step;
  draw(EllipseArc.circularArcFrom3Points(C(),B(),A()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(D(),C(),B()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(A(),D(),C()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(B(),A(),D()));

  cx = 10; cy += step;
  draw(EllipseArc.circularArcFrom3Points(P(),Q(),R()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(Q(),R(),S()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(R(),S(),P()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(S(),P(),Q()));

  cx += 2*step;
  draw(EllipseArc.circularArcFrom3Points(R(),Q(),P()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(S(),R(),Q()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(P(),S(),R()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(Q(),P(),S()));
  
  // Three Quarters Pie
  cx = 10; cy+= step;
  draw(EllipseArc.circularArcFrom3Points(C(),A(),B()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(D(),B(),C()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(A(),C(),D()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(B(),D(),A()));

  cx += 2*step;
  draw(EllipseArc.circularArcFrom3Points(B(),A(),C()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(C(),B(),D()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(D(),C(),A()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(A(),D(),B()));
  
  cx = 10; cy += step;
  draw(EllipseArc.circularArcFrom3Points(P(),B(),S()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(Q(),C(),P()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(R(),D(),Q()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(S(),A(),R()));

  cx += 2*step;
  draw(EllipseArc.circularArcFrom3Points(S(),B(),P()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(P(),C(),Q()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(Q(),D(),R()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(R(),A(),S()));
  
  // 7/8 Pie
  cx = 10; cy += step;
  draw(EllipseArc.circularArcFrom3Points(P(),S(),A()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(Q(),P(),B()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(R(),Q(),C()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(S(),R(),D()));

  cx += 2*step;
  draw(EllipseArc.circularArcFrom3Points(A(),S(),P()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(B(),P(),Q()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(C(),Q(),R()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(D(),R(),S()));
  
  // > 7/8 Pie
  cx = 10; cy += step;
  draw(EllipseArc.circularArcFrom3Points(P(),A(),U()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(Q(),B(),V()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(R(),C(),W()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(S(),D(),X()));
  
  cx += 2*step;
  draw(EllipseArc.circularArcFrom3Points(U(),A(),P()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(V(),B(),Q()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(W(),C(),R()));
  cx += step;
  draw(EllipseArc.circularArcFrom3Points(X(),D(),S()));
}

function testIntersectionsLineEllipseFull() {

  let WIDTH=1000;
  let HEIGHT=800;
  let zc = new ZCanvas('svg',WIDTH,HEIGHT);
  zdom.add(document.body, zc.getDOMElement());

  let GAP=10;
  let X=GAP;
  let Y=GAP;
  let W=100;
  let H=100;
  let IPR=2;

  let geomStyle = {stroke:'#000', strokeWidth:2, fill:'none'};
  let ipointStyle1 = {stroke:'none', fill:'#f00'};
  let ipointStyle2 = {stroke:'#00f', fill:'none', strokeWidth:3};
  
  function plotIPoints(points, style) {
    for(let point of points) {
      zc.root().add(new ZCanvas.RenderShape(
        {type:'circle',r:IPR,cx:point[0],cy:point[1]}, style));
    }
  }
  
  //
  // Fat ellipse
  //
  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.5*H,0.3*H,0,2*Math.PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line([X,Y],[X+W,Y+H]);
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }
  
  X+=GAP+W;
  
  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.5*H,0.3*H,0,2*Math.PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line([X+W/2,Y],[X+W/2,Y+H]);
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }
  
  X+=GAP+W;

  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.5*H,0.3*H,0,2*Math.PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line([X-0.05*W,Y+H/2],[X+1.05*W,Y+H/2]);
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }
  
  X+=GAP+W;
  
  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.5*H,0.3*H,0,2*Math.PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line([X+W,Y],[X,Y+H]);
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }
  
  //
  // Tall ellipse
  //
  
  X=GAP;
  Y+=GAP+H;
  
  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.3*H,0.5*H,0,2*Math.PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line([X,Y],[X+W,Y+H]);
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }

  X+=GAP+W;

  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.3*H,0.5*H,0,2*Math.PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line([X+W/2,Y-0.05*H],[X+W/2,Y+1.05*H]);
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }

  X+=GAP+W;

  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.3*H,0.5*H,0,2*Math.PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line([X-0.05*W,Y+H/2],[X+1.05*W,Y+H/2]);
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }

  X+=GAP+W;

  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.3*H,0.5*H,0,2*Math.PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line([X+W,Y],[X,Y+H]);
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }

  // Intersections at line ends
  X=GAP;
  Y+=GAP+H;

  {
    let cx=X+W/2;
    let cy=Y+H/2;
    let rx=0.3*H;
    let ry=0.5*H;
    let earc = new EllipseArc([cx,cy],rx,ry,0,2*PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line(
      [cx-rx*cos(PI/4),cy-ry*sin(PI/4)],
      [cx+rx*cos(PI/4),cy+ry*sin(PI/4)]
    );
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }

  X+=GAP+W;
  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.3*H,0.5*H,0,2*Math.PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line([X+W/2,Y],[X+W/2,Y+H]);
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }

  X+=GAP+W;
  {
    let cx=X+W/2;
    let cy=Y+H/2;
    let rx=0.3*H;
    let ry=0.5*H;
    let earc = new EllipseArc([cx,cy],rx,ry,0,2*PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line(
      [cx-rx,cy],
      [cx+rx,cy]
    );
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }

  X+=GAP+W;
  {
    let cx=X+W/2;
    let cy=Y+H/2;
    let rx=0.3*H;
    let ry=0.5*H;
    let earc = new EllipseArc([cx,cy],rx,ry,0,2*PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line(
      [cx+rx*cos(PI/4),cy-ry*sin(PI/4)],
      [cx-rx*cos(PI/4),cy+ry*sin(PI/4)]
    );
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }
  
  X=GAP;
  Y+=GAP+H;

  // Only one intersection
  {
    let cx=X+W/2;
    let cy=Y+H/2;
    let rx=0.3*H;
    let ry=0.5*H;
    let earc = new EllipseArc([cx,cy],rx,ry,0,2*PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line(
      [cx,cy],
      [cx+rx,cy+ry]
    );
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }
  
  // No intersection
  X += GAP+W;
  {
    let cx=X+W/2;
    let cy=Y+H/2;
    let rx=0.3*H;
    let ry=0.5*H;
    let earc = new EllipseArc([cx,cy],rx,ry,0,2*PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line(
      [cx+0.5*rx*cos(PI/4),cy-0.5*ry*sin(PI/4)],
      [cx-0.5*rx*cos(PI/4),cy+0.5*ry*sin(PI/4)]
    );
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }
  
  X += GAP+W;
  {
    let cx=X+W/2;
    let cy=Y+H/2;
    let rx=0.3*H;
    let ry=0.5*H;
    let earc = new EllipseArc([cx,cy],rx,ry,0,2*PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line(
      [X+W-2,Y],
      [X+W-2,Y+H]
    );
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }

  X += GAP+W;
  {
    let cx=X+W/2;
    let cy=Y+H/2;
    let rx=0.5*H;
    let ry=0.3*H;
    let earc = new EllipseArc([cx,cy],rx,ry,0,2*PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line(
      [X,Y+2],
      [X+W,Y+2]
    );
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }

  // Tangency
  X = GAP;
  Y += H+GAP;
  {
    let cx=X+W/2;
    let cy=Y+H/2;
    let rx=0.5*H;
    let ry=0.3*H;
    let earc = new EllipseArc([cx,cy],rx,ry,0,2*PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line(
      [X,cy-ry],
      [X+W,cy-ry]
    );
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }

  X += GAP+W;
  {
    let cx=X+W/2;
    let cy=Y+H/2;
    let rx=0.5*H;
    let ry=0.3*H;
    let earc = new EllipseArc([cx,cy],rx,ry,0,2*PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line(
      [X,cy+ry],
      [X+W,cy+ry]
    );
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }
  
  X += GAP+W;
  {
    let cx=X+W/2;
    let cy=Y+H/2;
    let rx=0.3*H;
    let ry=0.5*H;
    let earc = new EllipseArc([cx,cy],rx,ry,0,2*PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line(
      [cx+rx,Y],
      [cx+rx,Y+H]
    );
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }
  
  X += GAP+W;
  {
    let cx=X+W/2;
    let cy=Y+H/2;
    let rx=0.3*H;
    let ry=0.5*H;
    let earc = new EllipseArc([cx,cy],rx,ry,0,2*PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line(
      [cx-rx,Y],
      [cx-rx,Y+H]
    );
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }

  zc.render();
}

function testIntersectionsLineEllipsePartial() {
  let WIDTH=1000;
  let HEIGHT=800;
  let zc = new ZCanvas('svg',WIDTH,HEIGHT);
  zdom.add(document.body, zc.getDOMElement());

  let GAP=10;
  let X=GAP;
  let Y=GAP;
  let W=100;
  let H=100;
  let IPR=2;

  let geomStyle = {stroke:'#000', strokeWidth:2, fill:'none'};
  let ipointStyle1 = {stroke:'none', fill:'#f00'};
  let ipointStyle2 = {stroke:'#00f', fill:'none', strokeWidth:3};

  function plotIPoints(points, style) {
    for(let point of points) {
      zc.root().add(new ZCanvas.RenderShape(
        {type:'circle',r:IPR,cx:point[0],cy:point[1]}, style));
    }
  }

  //
  // Slanted lines intersecting half ellipses
  //
  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.5*H,0.3*H,0,PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line([X,Y],[X+W,Y+H]);
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }
  
  X+=W+GAP;
  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.5*H,0.3*H,Math.PI,0,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line([X,Y],[X+W,Y+H]);
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }

  X+=W+GAP;
  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.5*H,0.3*H,0,PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line([X+W,Y],[X,Y+H]);
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }

  X+=W+GAP;
  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.5*H,0.3*H,Math.PI,0,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line([X+W,Y],[X,Y+H]);
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }
  
  //
  // Axis aligned lines touching ends of half ellipses
  //
  X = GAP;
  Y += GAP+H;
  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.3*H,0.5*H,Math.PI,0,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line([X,Y+H/2],[X+W,Y+H/2]);
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }
  
  X+=GAP+W;
  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.3*H,0.5*H,Math.PI,0,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line([X+W/2,Y],[X+W/2,Y+H]);
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }
  
  X+=GAP+W;
  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.3*H,0.4*H,Math.PI,0,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line([X+W/2,Y],[X+W/2,Y+H]);
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }

  X+=GAP+W;
  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.5*H,0.3*H,PI/2,3*PI/2,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line([X+W/2,Y],[X+W/2,Y+H]);
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }
  
  X+=GAP+W;
  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.5*H,0.3*H,PI/2,3*PI/2,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line([X,Y+H/2],[X+W,Y+H/2]);
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }
  
  X+=GAP+W;
  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.4*H,0.3*H,PI/2,3*PI/2,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line([X,Y+H/2],[X+W,Y+H/2]);
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }

  X = GAP;
  Y += GAP+H;
  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.3*H,0.5*H,PI/2,3*PI/2,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line([X+W/2,Y],[X+W/2,Y+H/2]);
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }
  X+=GAP+W;
  {
    let earc = new EllipseArc([X+W/2,Y+H/2],0.3*H,0.4*H,PI/2,3*PI/2,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line([X+W/2,Y],[X+W/2,Y+H/2]);
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }
  X+=GAP+W;
  {
    let cx=X+W/2;
    let cy=Y+H/2;
    let rx=0.5*H;
    let ry=0.3*H;
    let earc = new EllipseArc([cx,cy],rx,ry,PI,2*PI,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line(
      [X,cy-ry],
      [X+W,cy-ry]
    );
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }
  X+=GAP+W;
  {
    let cx=X+W/2;
    let cy=Y+H/2;
    let rx=0.5*H;
    let ry=0.3*H;
    let earc = new EllipseArc([cx,cy],rx,ry,PI,3*PI/2,false);
    zc.root().add(new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    let line = new Line(
      [X,cy-ry],
      [X+W,cy-ry]
    );
    zc.root().add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, earcIParams] = Intersection.lineellipsearc(line, earc);
    plotIPoints(earcIParams.map(t => earc.evaluate(t)), ipointStyle2);
    plotIPoints(lineIParams.map(t => line.evaluate(t)), ipointStyle1);
  }

  zc.render();
  
}

function testIntersectionsLineCBez() {
  let WIDTH=1000;
  let HEIGHT=800;
  let zc = new ZCanvas('svg',WIDTH,HEIGHT);
  zdom.add(document.body, zc.getDOMElement());
  
  let GAP=10;
  let X=GAP;
  let Y=GAP;
  let W=100;
  let H=100;
  let IPR=2;

  let geomStyle = {stroke:'#000', strokeWidth:2, fill:'none'};
  let ipointStyle1 = {stroke:'none', fill:'#f00'};
  let ipointStyle2 = {stroke:'#00f', fill:'none', strokeWidth:3};
  
  let cpointStyle = {stroke:'none', fill:'#777'};

  function plotCPoints(g,cbez) {
    cbez.cpoints.forEach(([cx,cy]) => {
      g.add(new ZCanvas.RenderShape({type:'circle',cx,cy,r:1}, cpointStyle));
    });
  }
  
  function plotIPoints(g,points, style) {
    for(let point of points) {
      g.add(new ZCanvas.RenderShape(
        {type:'circle',r:IPR,cx:point[0],cy:point[1]}, style));
    }
  }

  {
    let g = new ZCanvas.RenderGroup();
    zc.root().add(g);
    let cbez = new CubicBezier([[X+W/4,Y+H/4],[X+W/2,Y+H/4],[X+3*W/4,Y+H/2],[X+3*W/4,Y+3*H/4]]);
    g.add(new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    let line = new Line([X,Y+H/2],[X+W,Y+H/2]);
    g.add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, cbezIParams] = Intersection.linecubicbez(line, cbez);
    plotIPoints(g, cbezIParams.map(t => cbez.evaluate(t)), ipointStyle2);
    plotIPoints(g, lineIParams.map(t => line.evaluate(t)), ipointStyle1);
    plotCPoints(g, cbez);
  }

  X += GAP+W;
  {
    let g = new ZCanvas.RenderGroup();
    zc.root().add(g);
    let cbez = new CubicBezier([[X+W,Y],[X+W,Y+H/2],[X,Y+H/2],[X,Y+H]]);
    g.add(new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    let line = new Line([X,Y],[X+W,Y+H]);
    g.add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, cbezIParams] = Intersection.linecubicbez(line, cbez);
    plotIPoints(g,cbezIParams.map(t => cbez.evaluate(t)), ipointStyle2);
    plotIPoints(g,lineIParams.map(t => line.evaluate(t)), ipointStyle1);
    plotCPoints(g,cbez);
  }

  X += GAP+W;
  {
    let g = new ZCanvas.RenderGroup();
    zc.root().add(g);
    let cbez = new CubicBezier([[X+W,Y+H/4],[X+W,Y+H/2],[X,Y+H/2],[X,Y+H]]);
    g.add(new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    let line = new Line([X,Y],[X+W,Y+H]);
    g.add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, cbezIParams] = Intersection.linecubicbez(line, cbez);
    plotIPoints(g,cbezIParams.map(t => cbez.evaluate(t)), ipointStyle2);
    plotIPoints(g,lineIParams.map(t => line.evaluate(t)), ipointStyle1);
    plotCPoints(g,cbez);
  }
  
  X += GAP+W;
  {
    let g = new ZCanvas.RenderGroup();
    zc.root().add(g);
    let cbez = new CubicBezier([[X+W,Y+H/4],[X+W,Y+H/2],[X,Y+H/2],[X,Y+H]]);
    g.add(new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    let line = new Line([X+W,Y+H],[X,Y]);
    g.add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, cbezIParams] = Intersection.linecubicbez(line, cbez);
    plotIPoints(g,cbezIParams.map(t => cbez.evaluate(t)), ipointStyle2);
    plotIPoints(g,lineIParams.map(t => line.evaluate(t)), ipointStyle1);
    plotCPoints(g,cbez);
  }

  X += GAP+W;
  {
    let g = new ZCanvas.RenderGroup();
    zc.root().add(g);
    let cbez = new CubicBezier([[X+W,Y],[X+W,Y+H/2],[X,Y+H/2],[X,Y+H]]);
    g.add(new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    let line = new Line([X+3*W/4,Y],[X+W/4,Y+H]);
    g.add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, cbezIParams] = Intersection.linecubicbez(line, cbez);
    plotIPoints(g, cbezIParams.map(t => cbez.evaluate(t)), ipointStyle2);
    plotIPoints(g, lineIParams.map(t => line.evaluate(t)), ipointStyle1);
    plotCPoints(g, cbez);
  }
  
  X += GAP+W;
  {
    let g = new ZCanvas.RenderGroup();
    zc.root().add(g);
    let cbez = new CubicBezier([[X+W,Y+H/4],[X+W,Y+2*H],[X,Y-H],[X,Y+H]]);
    g.add(new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    let line = new Line([X,Y+H/2],[X+W,Y+H/2]);
    g.add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, cbezIParams] = Intersection.linecubicbez(line, cbez);
    plotIPoints(g, cbezIParams.map(t => cbez.evaluate(t)), ipointStyle2);
    plotIPoints(g, lineIParams.map(t => line.evaluate(t)), ipointStyle1);
    plotCPoints(g, cbez);
  }

  X += GAP+W;
  {
    let g = new ZCanvas.RenderGroup();
    zc.root().add(g);
    let cbez = new CubicBezier([[X,Y+H],[X+W,Y],[X,Y],[X+W,Y+H]]);
    g.add(new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    let line = new Line([X,Y+H/2],[X+W,Y+H/2]);
    g.add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, cbezIParams] = Intersection.linecubicbez(line, cbez);
    plotIPoints(g, cbezIParams.map(t => cbez.evaluate(t)), ipointStyle2);
    plotIPoints(g, lineIParams.map(t => line.evaluate(t)), ipointStyle1);
    plotCPoints(g, cbez);
  }
  
  X += GAP+W;
  {
    let g = new ZCanvas.RenderGroup();
    zc.root().add(g);
    let cbez = new CubicBezier([[X+W/2,Y],[X,Y+H/2],[X+W,Y+H/2],[X+W/2,Y+H]]);
    g.add(new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    let line = new Line([X+W/2,Y],[X+W/2,Y+H]);
    g.add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, cbezIParams] = Intersection.linecubicbez(line, cbez);
    plotIPoints(g, cbezIParams.map(t => cbez.evaluate(t)), ipointStyle2);
    plotIPoints(g, lineIParams.map(t => line.evaluate(t)), ipointStyle1);
    plotCPoints(g, cbez);
  }

  X = GAP;
  Y += GAP+H;
  { // Makes p=0 in line-cbez intersection code
    let g = new ZCanvas.RenderGroup();
    zc.root().add(g);
    let cbez = new CubicBezier(
      [[X,Y+H/2],[X+W/4,(Y+H/2)+20],[X+3*W/4,(Y+H/2)+30],[X+W,(Y+H/2)+35]]);
    g.add(new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    let line = new Line([X,Y+3*H/4],[X+W,Y+3*H/4]);
    g.add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, cbezIParams] = Intersection.linecubicbez(line, cbez);
    plotIPoints(g, cbezIParams.map(t => cbez.evaluate(t)), ipointStyle2);
    plotIPoints(g, lineIParams.map(t => line.evaluate(t)), ipointStyle1);
    plotCPoints(g, cbez);
  }
  
  X += GAP+W;
  {
    let g = new ZCanvas.RenderGroup();
    zc.root().add(g);
    let cbez = new CubicBezier(
      [[X+W/2,Y+H/2],[X+W/2+W/4,Y+H/3],[X+W/2+W/4,Y+H/6],[X+W,Y]]);
    g.add(new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    let line = new Line([X,Y],[X+W,Y+H]);
    g.add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, cbezIParams] = Intersection.linecubicbez(line, cbez);
    plotIPoints(g, cbezIParams.map(t => cbez.evaluate(t)), ipointStyle2);
    plotIPoints(g, lineIParams.map(t => line.evaluate(t)), ipointStyle1);
    plotCPoints(g, cbez);
  }
  
  X += GAP+W;
  {
    let g = new ZCanvas.RenderGroup();
    zc.root().add(g);
    let cbez = new CubicBezier(
      [[X+W/3,Y+2*H/3],[X+W/2+W/4,Y+H/3],[X+W/2+W/4,Y+H/6],[X+W,Y]]);
    g.add(new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    let line = new Line([X,Y],[X+W,Y+H]);
    g.add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, cbezIParams] = Intersection.linecubicbez(line, cbez);
    plotIPoints(g, cbezIParams.map(t => cbez.evaluate(t)), ipointStyle2);
    plotIPoints(g, lineIParams.map(t => line.evaluate(t)), ipointStyle1);
    plotCPoints(g, cbez);
  }

  X += GAP+W;
  {
    let g = new ZCanvas.RenderGroup();
    zc.root().add(g);
    let cbez = new CubicBezier(
      [[X+W/2,Y+H/2],[X+W/2+W/4,Y+H/3],[X+W/2+W/4,Y+H/6],[X+W,Y]]);
    g.add(new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    let line = new Line([X,Y+H/3], [X+W,Y+2*H/3]);
    g.add(new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    let [lineIParams, cbezIParams] = Intersection.linecubicbez(line, cbez);
    plotIPoints(g, cbezIParams.map(t => cbez.evaluate(t)), ipointStyle2);
    plotIPoints(g, lineIParams.map(t => line.evaluate(t)), ipointStyle1);
    plotCPoints(g, cbez);
  }
  zc.render();
}

function plotNURBSBasis() {
  let WIDTH=window.innerWidth;
  let HEIGHT=window.innerHeight;
  let zc = new ZCanvas('svg',WIDTH,HEIGHT);
  zdom.add(document.body, zc.getDOMElement());

  const RESOLUTION=100;

  let cpoints = [[1,0],[2,0],[3,0],[4,2],[3,5],[3,-4],[6,7]];
  let knots = [0,0,0,0,1/8,5/8,6/8,1,1,1,1];
  let p = 3;
  let m = knots.length-1;
  let n = m-p-1;
  
  let bcurve = new geom.nurbs.BSplineCurve(3,cpoints,knots);

  let Nip = new Array(n+1);
  for(let i=0; i<n+1; i++) {
    Nip[i] = new Array(RESOLUTION+1);
    for(let j=0;j<RESOLUTION+1; j++) {
      Nip[i][j] = 0.0;
    }
  }
  
  let tess = new Array(RESOLUTION+1);

  let basisDers = new Array(n+1);
  for(let i=0; i<n+1; i++) {
    basisDers[i] = new Array(RESOLUTION+1);
    for(let j=0; j<RESOLUTION+1; j++) {
      basisDers[i][j] = 0.0;
    }
  }
  
  for(let i=0; i<RESOLUTION+1; i++) {
    let u = i/RESOLUTION;
    let span = bcurve.findSpan(u);
    let N = bcurve.evaluateBasis(span, u);
    for(let j=p; j>=0; j--) {
      Nip[span-j][i] = N[p-j];
    }
    
    tess[i] = bcurve.evaluate(u);

    let Nd = bcurve.evaluateBasisDerivatives(span, 1, u);

    for(let j=p; j>=0; j--) {
      basisDers[span-j][i] = Nd[1][p-j];
    }
  }
  
  const PLOT_W = WIDTH*0.8;
  const PLOT_H = HEIGHT*0.8;
  const TOP_MARGIN=HEIGHT*0.1;
  const BOTTOM_MARGIN=HEIGHT*0.1;
  const LEFT_MARGIN=WIDTH*0.1;

  for(let Ni of Nip) {
    zc.root().add(new ZCanvas.RenderShape({
      type : 'polyline',
      points : Ni.map((y,i) => [
        LEFT_MARGIN+PLOT_W*(i/RESOLUTION),
        TOP_MARGIN+PLOT_H-y*PLOT_H])
    }, {stroke:'#000',fill:'none'}));
  }
  
  zc.root().add(new ZCanvas.RenderShape({
    type : 'polyline',
    points : tess.map(([x,y]) => [LEFT_MARGIN+x * PLOT_W/10,PLOT_H-y*PLOT_H/10])
  }, {stroke:'#f00',fill:'none'}));
  
  // Derivative baseline
  zc.root().add(new ZCanvas.RenderShape({
    type : 'line',
    x1:LEFT_MARGIN, y1:PLOT_H/2, x2:LEFT_MARGIN+PLOT_W, y2:PLOT_H/2
  }, {stroke:'#666', strokeDasharray:[3,6]}));
  
  for(let Nid of basisDers) {
    zc.root().add(new ZCanvas.RenderShape({
      type : 'polyline',
      points : Nid.map((y,i) => [
        LEFT_MARGIN+PLOT_W*(i/RESOLUTION),
        PLOT_H/2-y*PLOT_H/100])
    }, {stroke:'#f0f',fill:'none'}));
  }
  
  cpoints.forEach(([cx,cy]) => {
    zc.root().add(new ZCanvas.RenderShape({
      type : 'circle',
      r : 3, cx:LEFT_MARGIN+ cx * PLOT_W/10, cy: PLOT_H - cy * PLOT_H/10
    }, {stroke:'none',fill:'#66f'}));
  });
  
  knots.forEach((knot, idx) => {
    zc.root().add(new ZCanvas.RenderShape({
      type : 'circle',
      r : 3, cx:LEFT_MARGIN+ knot * PLOT_W, cy: TOP_MARGIN+BOTTOM_MARGIN+PLOT_H - 8*idx
    }, {stroke:'none',fill:'#0f0'}));
  });

  zc.render();
}

function plotCurvesAsNURBS() {
  let WIDTH=window.innerWidth;
  let HEIGHT=window.innerHeight;
  let zc = new ZCanvas('svg',WIDTH,HEIGHT);
  zdom.add(document.body, zc.getDOMElement());

  const RESOLUTION=100;
  const PLOT_W = WIDTH*0.8;
  const PLOT_H = HEIGHT*0.8;
  const TOP_MARGIN=HEIGHT*0.1;
  const BOTTOM_MARGIN=HEIGHT*0.1;
  const LEFT_MARGIN=WIDTH*0.1;
  
  let line = new geom.nurbs.Line([100,100],[300,400]);

  let tess = new Array(RESOLUTION+1);
  for(let i=0; i<RESOLUTION+1; i++) {
    let u = i/RESOLUTION;

    tess[i] = line.evaluate(u);
  }
  
  zc.root().add(new ZCanvas.RenderShape({
    type : 'polyline',
    points : tess.map(([x,y]) => [LEFT_MARGIN+x ,PLOT_H-y])
  }, {stroke:'#f00',fill:'none'}));
  zc.render();
}


window.onload = () => {

  // --- test bezsurf subdiv
  // document.body.innerHTML = testBezSurfSubdivision();
  // document.addEventListener('mousemove', ev => {
  //   document.body.innerHTML = testBezSurfSubdivision([ev.offsetX, ev.offsetY]);
  // });

  //drawGeometries();
  
  
  let choice = window.location.hash || '#bboxes';
  switch(choice) {
    case '#bboxes':
      testBBox();
      break;
    case '#circarcs':
      drawCircleArcs();
      break;
    case '#int-line-ellipse-full':
      testIntersectionsLineEllipseFull();
      break;
    case '#int-line-ellipse-partial':
      testIntersectionsLineEllipsePartial();
      break;
    case '#int-line-cbez':
      testIntersectionsLineCBez();
      break;
    case '#nurbs-basis':
      plotNURBSBasis();
      break;
    case '#nurbs-curves':
      plotCurvesAsNURBS();
      break;
    case '#unittests':
      runUnitTests();
      break;
    case '#ndarrunittests':
      runNDArrayUnitTests();
      break;
  }
  document.querySelector('select').value = choice.substr(1);

  document.querySelector('select').onchange = ev => {
    window.location.href =
      window.location.origin+window.location.pathname+'#'+ev.target.value;
    window.location.reload();
  }
};

