
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

  zc.root().add(new ZCanvas.Shape(
    line.toCanvasPathDef(), {stroke:'#000',strokeWidth:4}));
  zc.root().add(new ZCanvas.Shape(
    cbez.toCanvasPathDef(), {stroke:'#f00',strokeWidth:2,fill:'none'}));

  zc.render();

  zdom.add(document.body, zc.getDOMElement());

}

window.onload = () => {
  // -- test bbox
  // document.body.innerHTML = testBBox();

  // --- test bezsurf subdiv
  // document.body.innerHTML = testBezSurfSubdivision();
  // document.addEventListener('mousemove', ev => {
  //   document.body.innerHTML = testBezSurfSubdivision([ev.offsetX, ev.offsetY]);
  // });

  drawGeometries();
};

