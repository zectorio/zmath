
import {geom} from '..';
import {Kolor} from 'zbits'

function testBBox() {

  let line = new geom.Line([10,10],[200,300]);
  let cbez1 = new geom.CubicBezier([[100,10],[200,200],[210,5],[400,100]]);
  let cbez2 = new geom.CubicBezier([[100,210],[0,300],[210,105],[400,300]]);
  let cbez3 = new geom.CubicBezier([[400,100],[450,50],[400,300],[300,400]]);

  let points = [];

  points = points.concat(cbez2._getExtremes().map(t => cbez2.evaluate(t)));
  points = points.concat(cbez3._getExtremes().map(t => cbez3.evaluate(t)));

  let offpoint = [150,212];
  let projection = cbez1.project(offpoint);
  points.push(projection);
  points.push(offpoint);
  let [cbez3a,cbez3b] = cbez3.split(0.76);
  return `
<svg width="640" height="480" xmlns="http://www.w3.org/2000/svg">
  <g>
    <rect x="0" y="0" width="640" height="480" style="stroke:none;fill:#eee"></rect>
    
    <path d="${line.toSVGPathData()}" style="stroke:#000;fill:none"></path>
    ${line.aabb().toSVGRect()}
    
    <path d="${cbez1.toSVGPathData()}" style="stroke:#000;fill:none"></path>
    ${cbez1.aabb().toSVGRect()}
    
    <path d="${cbez2.toSVGPathData()}" style="stroke:#000;fill:none"></path>
    ${cbez2.aabb().toSVGRect()}
    
    <path d="${cbez3.toSVGPathData()}" style="stroke:#000;fill:none"></path>
    ${cbez3.aabb().toSVGRect()}
    
    <path d="${cbez3a.toSVGPathData()}" style="stroke:#f00;fill:none"></path>
    <path d="${cbez3b.toSVGPathData()}" style="stroke:#00f;fill:none"></path>
    
    ${points.map(([x,y])=> `<circle r="3" cx="${x}" cy="${y}" style="fill:#fff;stroke:#000"></circle>`).join('\n')}
    
  </g>
</svg>
`;
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

import ZCanvas from 'zcanvas'
import zdom from 'zdom'

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

import {vec2} from '../src'


function drawCircleArcs() {
  
  function getCircleAngle(center, pt) {
    let dot = vec2.dot([1,0], vec2.unit(vec2.sub(pt, center)));
    if(pt[1] > center[1]) {
      return wrapAngle(Math.acos(dot));
    } else {
      return wrapAngle(2*Math.PI - Math.acos(dot));
    }
  }

  function wrapAngle(angle) {
    while(angle < 0) {
      angle = angle + 2*Math.PI;
    }
    while(angle > 2*Math.PI) {
      angle = angle - 2*Math.PI;
    }
    return angle;
  }

  /**
   * @param pA
   * @param pB
   * @param pC
   * @returns {*}
   */
  function  circularArcFrom3Points(pA,pB,pC) {
    let EPSILON = 1e-6;
    let ax = pA[0], ay = pA[1];
    let bx = pB[0], by = pB[1];
    let cx = pC[0], cy = pC[1];

    // Ref: https://en.wikipedia.org/wiki/Circumscribed_circle#Circumcenter_coordinates
    let D = 2 * (ax * (by-cy) + bx * (cy-ay) + cx * (ay-by));
    if(Math.abs(D) < EPSILON) {
      return null;
    }
    let x = ((ax * ax + ay * ay) * (by - cy) +
      (bx * bx + by * by) * (cy - ay) +
      (cx * cx + cy * cy) * (ay - by))/D;
    let y = ((ax * ax + ay * ay) * (cx - bx) +
      (bx * bx + by * by) * (ax - cx) +
      (cx * cx + cy * cy) * (bx - ax))/D;
    let center = [x,y];

    let startAngle = getCircleAngle(center, pA),
      throughAngle = getCircleAngle(center, pB),
      endAngle = getCircleAngle(center, pC);

    let minAngle = Math.min(startAngle, endAngle);
    let maxAngle = Math.max(startAngle, endAngle);

    let ccw = minAngle > throughAngle || throughAngle > maxAngle;

    let radius = vec2.dist(pA, center);

    return {center, radius, start:startAngle, end:endAngle, ccw};
  }

  function canvasDraw(ctx, {center,radius, start, end, ccw}) {

    let [cx,cy] = center;
    
    let decreasing = start > end;

    ctx.beginPath();
    let minAngle = decreasing ? end : start;
    let maxAngle = decreasing ? start : end;
    ctx.arc(cx,cy,radius,minAngle,maxAngle,ccw);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function svgDraw(svg, {center,radius, start, end, ccw}) {
    let [cx,cy] = center;

    let path = zdom.createPath();

    let x1 = cx + radius * Math.cos(start);
    let y1 = cy + radius * Math.sin(start);

    let x2 = cx + radius * Math.cos(end);
    let y2 = cy + radius * Math.sin(end);

    let fA = (Math.abs(end-start) > Math.PI) ? 1 : 0;
    let fS = (end-start > 0) ? 1 : 0;
    
    fA = ccw ? (1-fA) : fA;
    fS = ccw ? (1-fS) : fS;

    zdom.set(path, 'd', `M ${x1},${y1} A ${radius},${radius} 0 ${fA} ${fS} ${x2},${y2}`);
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
  draw(circularArcFrom3Points(A(),U(),P()));
  cx += step;
  draw(circularArcFrom3Points(B(),V(),Q()));
  cx += step;
  draw(circularArcFrom3Points(C(),W(),R()));
  cx += step;
  draw(circularArcFrom3Points(D(),X(),S()));

  cx += 2*step;
  draw(circularArcFrom3Points(P(),U(),A()));
  cx += step;
  draw(circularArcFrom3Points(Q(),V(),B()));
  cx += step;
  draw(circularArcFrom3Points(R(),W(),C()));
  cx += step;
  draw(circularArcFrom3Points(S(),X(),D()));

  // Quarter Pie
  cx = 10; cy += step;
  draw(circularArcFrom3Points(A(),P(),B()));
  cx += step;
  draw(circularArcFrom3Points(B(),Q(),C()));
  cx += step;
  draw(circularArcFrom3Points(C(),R(),D()));
  cx += step;
  draw(circularArcFrom3Points(D(),S(),A()));
  
  cx += 2*step;
  draw(circularArcFrom3Points(B(),P(),A()));
  cx += step;
  draw(circularArcFrom3Points(C(),Q(),B()));
  cx += step;
  draw(circularArcFrom3Points(D(),R(),C()));
  cx += step;
  draw(circularArcFrom3Points(A(),S(),D()));
  
  cx = 10; cy += step;
  draw(circularArcFrom3Points(P(),B(),Q()));
  cx += step;
  draw(circularArcFrom3Points(Q(),C(),R()));
  cx += step;
  draw(circularArcFrom3Points(R(),D(),S()));
  cx += step;
  draw(circularArcFrom3Points(S(),A(),P()));
  
  cx += 2*step;
  draw(circularArcFrom3Points(Q(),B(),P()));
  cx += step;
  draw(circularArcFrom3Points(R(),C(),Q()));
  cx += step;
  draw(circularArcFrom3Points(S(),D(),R()));
  cx += step;
  draw(circularArcFrom3Points(P(),A(),S()));
  
  // Half Pie
  cx = 10; cy += step;
  draw(circularArcFrom3Points(A(),B(),C()));
  cx += step;
  draw(circularArcFrom3Points(B(),C(),D()));
  cx += step;
  draw(circularArcFrom3Points(C(),D(),A()));
  cx += step;
  draw(circularArcFrom3Points(D(),A(),B()));

  cx += 2*step;
  draw(circularArcFrom3Points(C(),B(),A()));
  cx += step;
  draw(circularArcFrom3Points(D(),C(),B()));
  cx += step;
  draw(circularArcFrom3Points(A(),D(),C()));
  cx += step;
  draw(circularArcFrom3Points(B(),A(),D()));

  cx = 10; cy += step;
  draw(circularArcFrom3Points(P(),Q(),R()));
  cx += step;
  draw(circularArcFrom3Points(Q(),R(),S()));
  cx += step;
  draw(circularArcFrom3Points(R(),S(),P()));
  cx += step;
  draw(circularArcFrom3Points(S(),P(),Q()));

  cx += 2*step;
  draw(circularArcFrom3Points(R(),Q(),P()));
  cx += step;
  draw(circularArcFrom3Points(S(),R(),Q()));
  cx += step;
  draw(circularArcFrom3Points(P(),S(),R()));
  cx += step;
  draw(circularArcFrom3Points(Q(),P(),S()));
  
  // Three Quarters Pie
  cx = 10; cy+= step;
  draw(circularArcFrom3Points(C(),A(),B()));
  cx += step;
  draw(circularArcFrom3Points(D(),B(),C()));
  cx += step;
  draw(circularArcFrom3Points(A(),C(),D()));
  cx += step;
  draw(circularArcFrom3Points(B(),D(),A()));

  cx += 2*step;
  draw(circularArcFrom3Points(B(),A(),C()));
  cx += step;
  draw(circularArcFrom3Points(C(),B(),D()));
  cx += step;
  draw(circularArcFrom3Points(D(),C(),A()));
  cx += step;
  draw(circularArcFrom3Points(A(),D(),B()));
  
  cx = 10; cy += step;
  draw(circularArcFrom3Points(P(),B(),S()));
  cx += step;
  draw(circularArcFrom3Points(Q(),C(),P()));
  cx += step;
  draw(circularArcFrom3Points(R(),D(),Q()));
  cx += step;
  draw(circularArcFrom3Points(S(),A(),R()));

  cx += 2*step;
  draw(circularArcFrom3Points(S(),B(),P()));
  cx += step;
  draw(circularArcFrom3Points(P(),C(),Q()));
  cx += step;
  draw(circularArcFrom3Points(Q(),D(),R()));
  cx += step;
  draw(circularArcFrom3Points(R(),A(),S()));
  
  // 7/8 Pie
  cx = 10; cy += step;
  draw(circularArcFrom3Points(P(),S(),A()));
  cx += step;
  draw(circularArcFrom3Points(Q(),P(),B()));
  cx += step;
  draw(circularArcFrom3Points(R(),Q(),C()));
  cx += step;
  draw(circularArcFrom3Points(S(),R(),D()));

  cx += 2*step;
  draw(circularArcFrom3Points(A(),S(),P()));
  cx += step;
  draw(circularArcFrom3Points(B(),P(),Q()));
  cx += step;
  draw(circularArcFrom3Points(C(),Q(),R()));
  cx += step;
  draw(circularArcFrom3Points(D(),R(),S()));
  
  // > 7/8 Pie
  cx = 10; cy += step;
  draw(circularArcFrom3Points(P(),A(),U()));
  cx += step;
  draw(circularArcFrom3Points(Q(),B(),V()));
  cx += step;
  draw(circularArcFrom3Points(R(),C(),W()));
  cx += step;
  draw(circularArcFrom3Points(S(),D(),X()));
  
  cx += 2*step;
  draw(circularArcFrom3Points(U(),A(),P()));
  cx += step;
  draw(circularArcFrom3Points(V(),B(),Q()));
  cx += step;
  draw(circularArcFrom3Points(W(),C(),R()));
  cx += step;
  draw(circularArcFrom3Points(X(),D(),S()));
}

window.onload = () => {
  // -- test bbox
  // document.body.innerHTML = testBBox();

  // --- test bezsurf subdiv
  // document.body.innerHTML = testBezSurfSubdivision();
  // document.addEventListener('mousemove', ev => {
  //   document.body.innerHTML = testBezSurfSubdivision([ev.offsetX, ev.offsetY]);
  // });

  //drawGeometries();
  
  drawCircleArcs();
};

