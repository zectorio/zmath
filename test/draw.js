
const {geom} = require('..');

let line = new geom.Line([10,10],[200,300]);
let cbez1 = new geom.CubicBezier([[100,10],[200,200],[210,5],[400,100]]);
let cbez2 = new geom.CubicBezier([[100,210],[0,300],[210,105],[400,300]]);
let cbez3 = new geom.CubicBezier([[400,100],[450,50],[400,300],[300,400]]);

let points = [];
points = points.concat(cbez2._getExtremes().map(t => cbez2.evaluate(t)));
points = points.concat(cbez3._getExtremes().map(t => cbez3.evaluate(t)));

let [cbez3a,cbez3b] = cbez3.split(0.76);

console.log(`
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
    
    <!--
    <path d="${cbez3a.toSVGPathData()}" style="stroke:#f00;fill:none"></path>
    <path d="${cbez3b.toSVGPathData()}" style="stroke:#00f;fill:none"></path>
    -->
    
    ${points.map(([x,y])=> `<circle r="3" cx="${x}" cy="${y}" style="fill:#fff;stroke:#000"></circle>`).join('\n')}
  </g>
</svg>
`);
