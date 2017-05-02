
import {vec2, Transform, Translation, Intersection, geom} from '..';
import {Kolor} from 'zbits'
import ZCanvas from 'zcanvas'
import zdom from 'zdom'

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
    let line = new geom.Line([0,0],[10,10]);
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
    let earc = geom.EllipseArc.circularArcFrom3Points( A(), B(), C() );
    assert.equal(earc.start, Math.PI);
    assert.equal(earc.end, 2*Math.PI);
    assert.equal(earc.ccw, false);
  });

  QUnit.test('Semi circle 1 - rvs', assert => {
    let earc = geom.EllipseArc.circularArcFrom3Points( C(), B(), A() );
    assert.equal(earc.start, 2*Math.PI);
    assert.equal(earc.end, Math.PI);
    assert.equal(earc.ccw, true);
  });

  QUnit.test('Semi circle 2', assert => {
    let earc = geom.EllipseArc.circularArcFrom3Points( B(), A(), D() );
    assert.equal(earc.start, 3*Math.PI/2);
    assert.equal(earc.end, Math.PI/2);
    assert.equal(earc.ccw, true);
  });

  QUnit.test('Semi circle 2 - rvs', assert => {
    let earc = geom.EllipseArc.circularArcFrom3Points( B(), C(), D() );
    assert.equal(earc.start, 3*Math.PI/2);
    assert.equal(earc.end, Math.PI/2);
    assert.equal(earc.ccw, false);
  });

  QUnit.test('Quarter Circle 1', assert => {
    let earc = geom.EllipseArc.circularArcFrom3Points( A(), P(), B() );
    assert.equal(earc.start, Math.PI);
    assert.equal(earc.end, 3*Math.PI/2);
    assert.equal(earc.ccw, false);
  });
  QUnit.test('Quarter Circle 1 - rvs', assert => {
    let earc = geom.EllipseArc.circularArcFrom3Points( B(), P(), A() );
    assert.equal(earc.start, 3*Math.PI/2);
    assert.equal(earc.end, Math.PI);
    assert.equal(earc.ccw, true);
  });

  // Line-Line intersection

  QUnit.test('Line-Line : At midpoint', assert => {
    let iparams = Intersection.lineline(
      new geom.Line([0,50],[100,50]), new geom.Line([50,0],[50,100]));
    assert.deepEqual(iparams, [[0.5],[0.5]]);
  });

  QUnit.test('Line-Line : At endpoint', assert => {
    let iparams = Intersection.lineline(
      new geom.Line([0,50],[100,50]), new geom.Line([100,0],[100,100]));
    assert.deepEqual(iparams, [[],[0.5]]);
  });
  
  QUnit.test('Line-Line : No intersection', assert => {
    let iparams = Intersection.lineline(
      new geom.Line([0,50],[100,50]), new geom.Line([101,0],[101,100]));
    assert.deepEqual(iparams, [[],[]]);
  });
  
  QUnit.test('Line-Line : meet at endpoints, no intersection', assert => {
    let iparams = Intersection.lineline(
      new geom.Line([0,100],[100,100]), new geom.Line([100,0],[100,100]));
    assert.deepEqual(iparams, [[],[]]);
  });
  
  QUnit.test('Line-Line : slanted lines meet at midpoint', assert => {
    let iparams = Intersection.lineline(
      new geom.Line([0,0],[100,100]), new geom.Line([100,0],[0,100]));
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
    let line = new geom.Line([X+10,Y+10],[X+W-10,Y+H-30]);
    zc.root().add(
      new ZCanvas.RenderShape(line.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(line.aabb().toCanvasPathDef(), aabbStyle));
  }
  
  X = GAP;
  Y += W+GAP;
  
  {
    let cbez = new geom.CubicBezier([[X,Y+H],[X+.25*W,Y],[X+.75*W,Y],[X+W,Y+H]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }

  X += W+GAP;
  {
    let cbez = new geom.CubicBezier([[X,Y+H/2],[X+.25*W,Y+H+0.25*H],[X+.75*W,Y-0.25*H],[X+W,Y+H/2]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }
  
  X += W+GAP;

  {
    let cbez = new geom.CubicBezier([[X,Y+H],[X+.25*W,Y+H],[X+.75*W,Y],[X+W,Y]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }

  X += W+GAP;

  {
    let cbez = new geom.CubicBezier([[X,Y+H],[X+.75*W,Y],[X+.25*W,Y],[X+W,Y+H]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }
  
  X += W+GAP;

  {
    let cbez = new geom.CubicBezier([[X,Y+H],[X+W+0.25*W,Y+H/2],[X-0.25*W,Y+H/2],[X+W,Y+H]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }
  
  X += W+GAP;

  {
    let cbez = new geom.CubicBezier([[X,Y+H],[X+W+0.25*W,Y+H/2],[X-0.25*W,Y+H/2],[X+W,Y+2*H/3]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }
  
  X = GAP;
  Y += W+4*GAP;

  {
    let cbez = new geom.CubicBezier([[X,Y],[X+W,Y+0.25*H],[X+W,Y+0.75*H],[X,Y+H]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }
  
  X += W+GAP;
  {
    let cbez = new geom.CubicBezier([[X+W/2,Y],[X-W,Y+0.25*H],[X+2*W,Y+0.75*H],[X+W/2,Y+H]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }
  
  X += W+GAP;
  {
    let cbez = new geom.CubicBezier([[X,Y],[X+W,Y+0.75*H],[X+W,Y+0.25*H],[X,Y+H]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }

  X += W+GAP;
  {
    let cbez = new geom.CubicBezier([[X,Y],[X+W,Y-H],[X+W,Y+2*H],[X,Y+H]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }
  
  X += W+GAP;
  {
    let cbez = new geom.CubicBezier([[X,Y],[X+W,Y+2*H],[X+W,Y-H],[X,Y+H]]);
    zc.root().add(
      new ZCanvas.RenderShape(cbez.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(cbez.aabb().toCanvasPathDef(), aabbStyle));
    drawCPoints(cbez);
  }

  X += W+GAP;
  {
    let cbez = new geom.CubicBezier([[X,Y+H/2],[X+W,Y-H],[X+W,Y],[X+W/2,Y+H]]);
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
    let earc = new geom.EllipseArc([X+W/2,Y+H/2],0.4*W,0.4*W,
      0,0, Math.PI/2, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new geom.EllipseArc([X+W/2,Y+H/2],0.4*W,0.4*W,
      0,0, Math.PI/2, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new geom.EllipseArc([X+W/2,Y+H/2],0.4*W,0.4*W,
      0,0, Math.PI/4, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new geom.EllipseArc([X+W/2,Y+H/2],0.4*W,0.4*W,
      0,0, Math.PI/4, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new geom.EllipseArc(
      [X+W/2,Y+H/2],0.4*W,0.4*W,0,0, 3*Math.PI/4, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new geom.EllipseArc(
      [X+W/2,Y+H/2],0.4*W,0.4*W,0,0, 3*Math.PI/4, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  
  X = GAP;
  Y += H+3*GAP;
  {
    let earc = new geom.EllipseArc(
      [X+W/2,Y+H/2],0.4*W,0.4*W,0,3*Math.PI/2, Math.PI/2, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new geom.EllipseArc(
      [X+W/2,Y+H/2],0.4*W,0.4*W,0,3*Math.PI/2, Math.PI/2, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new geom.EllipseArc(
      [X+W/2,Y+H/2],0.4*W,0.4*W,0,Math.PI/4, 5*Math.PI/4, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new geom.EllipseArc(
      [X+W/2,Y+H/2],0.4*W,0.4*W,0,Math.PI/4, 5*Math.PI/4, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new geom.EllipseArc(
      [X+W/2,Y+H/2],0.4*W,0.4*W,0,0, Math.PI, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new geom.EllipseArc(
      [X+W/2,Y+H/2],0.4*W,0.4*W,0,0, Math.PI, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }

  // Elliptical arcs
  X = GAP;
  Y += H+3*GAP;
  {
    let earc = new geom.EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,0,0, Math.PI/2, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new geom.EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,0,0, Math.PI/2, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new geom.EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,0,0, Math.PI/4, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new geom.EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,0,0, Math.PI/4, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new geom.EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,0,0, 3*Math.PI/4, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new geom.EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,0,0, 3*Math.PI/4, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  
  X = GAP;
  Y += H+3*GAP;
  {
    let earc = new geom.EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,0,3*Math.PI/2, Math.PI/2, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new geom.EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,0,3*Math.PI/2, Math.PI/2, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new geom.EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,0,Math.PI/4, 5*Math.PI/4, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new geom.EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,0,Math.PI/4, 5*Math.PI/4, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new geom.EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,0,0, Math.PI, false);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }
  X += W+GAP;
  {
    let earc = new geom.EllipseArc(
      [X+W/2,Y+H/2],0.5*W,0.3*W,0,0, Math.PI, true);
    zc.root().add(
      new ZCanvas.RenderShape(earc.toCanvasPathDef(), geomStyle));
    zc.root().add(
      new ZCanvas.RenderShape(earc.aabb().toCanvasPathDef(), aabbStyle));
  }

  zc.render();
}

function testBezSurfSubdivision(ipoint) {
  let points = [];

  // let surfgrid = new geom.CubicBezierSurfacePatch([[new geom.CubicBezierSurface({points:[
  //   [ [100,50], [200,100], [300,100], [310,50] ],
  //   [ [120,150], [200,150], [300,150], [400,150] ],
  //   [ [70,300], [200,350], [300,350], [450,300] ],
  //   [ [100,450], [200,400], [300,400], [400,450] ]
  // ]})]]);

  let surfgrid = new geom.CubicBezierSurfacePatch([[new geom.CubicBezierSurface({
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


function drawGeometries() {

  let zc = new ZCanvas('svg',640,480);

  let line = new geom.Line([100,100],[150,455]);
  let cbez = new geom.CubicBezier([[100,100],[200,255],[300,30],[500,100]]);

  zc.root().add(new ZCanvas.RenderShape(
    line.toCanvasPathDef(), {stroke:'#000',strokeWidth:4}));
  zc.root().add(new ZCanvas.RenderShape(
    cbez.toCanvasPathDef(), {stroke:'#f00',strokeWidth:2,fill:'none'}));

  zc.render();

  zdom.add(document.body, zc.getDOMElement());

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
  draw(geom.EllipseArc.circularArcFrom3Points(A(),U(),P()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(B(),V(),Q()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(C(),W(),R()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(D(),X(),S()));

  cx += 2*step;
  draw(geom.EllipseArc.circularArcFrom3Points(P(),U(),A()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(Q(),V(),B()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(R(),W(),C()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(S(),X(),D()));

  // Quarter Pie
  cx = 10; cy += step;
  draw(geom.EllipseArc.circularArcFrom3Points(A(),P(),B()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(B(),Q(),C()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(C(),R(),D()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(D(),S(),A()));
  
  cx += 2*step;
  draw(geom.EllipseArc.circularArcFrom3Points(B(),P(),A()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(C(),Q(),B()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(D(),R(),C()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(A(),S(),D()));
  
  cx = 10; cy += step;
  draw(geom.EllipseArc.circularArcFrom3Points(P(),B(),Q()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(Q(),C(),R()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(R(),D(),S()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(S(),A(),P()));
  
  cx += 2*step;
  draw(geom.EllipseArc.circularArcFrom3Points(Q(),B(),P()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(R(),C(),Q()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(S(),D(),R()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(P(),A(),S()));
  
  // Half Pie
  cx = 10; cy += step;
  draw(geom.EllipseArc.circularArcFrom3Points(A(),B(),C()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(B(),C(),D()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(C(),D(),A()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(D(),A(),B()));

  cx += 2*step;
  draw(geom.EllipseArc.circularArcFrom3Points(C(),B(),A()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(D(),C(),B()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(A(),D(),C()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(B(),A(),D()));

  cx = 10; cy += step;
  draw(geom.EllipseArc.circularArcFrom3Points(P(),Q(),R()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(Q(),R(),S()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(R(),S(),P()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(S(),P(),Q()));

  cx += 2*step;
  draw(geom.EllipseArc.circularArcFrom3Points(R(),Q(),P()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(S(),R(),Q()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(P(),S(),R()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(Q(),P(),S()));
  
  // Three Quarters Pie
  cx = 10; cy+= step;
  draw(geom.EllipseArc.circularArcFrom3Points(C(),A(),B()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(D(),B(),C()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(A(),C(),D()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(B(),D(),A()));

  cx += 2*step;
  draw(geom.EllipseArc.circularArcFrom3Points(B(),A(),C()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(C(),B(),D()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(D(),C(),A()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(A(),D(),B()));
  
  cx = 10; cy += step;
  draw(geom.EllipseArc.circularArcFrom3Points(P(),B(),S()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(Q(),C(),P()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(R(),D(),Q()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(S(),A(),R()));

  cx += 2*step;
  draw(geom.EllipseArc.circularArcFrom3Points(S(),B(),P()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(P(),C(),Q()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(Q(),D(),R()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(R(),A(),S()));
  
  // 7/8 Pie
  cx = 10; cy += step;
  draw(geom.EllipseArc.circularArcFrom3Points(P(),S(),A()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(Q(),P(),B()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(R(),Q(),C()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(S(),R(),D()));

  cx += 2*step;
  draw(geom.EllipseArc.circularArcFrom3Points(A(),S(),P()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(B(),P(),Q()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(C(),Q(),R()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(D(),R(),S()));
  
  // > 7/8 Pie
  cx = 10; cy += step;
  draw(geom.EllipseArc.circularArcFrom3Points(P(),A(),U()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(Q(),B(),V()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(R(),C(),W()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(S(),D(),X()));
  
  cx += 2*step;
  draw(geom.EllipseArc.circularArcFrom3Points(U(),A(),P()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(V(),B(),Q()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(W(),C(),R()));
  cx += step;
  draw(geom.EllipseArc.circularArcFrom3Points(X(),D(),S()));
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
    case '#unittests':
      runUnitTests();
      break;
  }
  document.querySelector('select').value = choice.substr(1);

  document.querySelector('select').onchange = ev => {
    window.location.href =
      window.location.origin+window.location.pathname+'#'+ev.target.value;
    window.location.reload();
  }
};

