
const {geom} = require('..');

let line = new geom.Line([10,10],[200,300]);

console.log(`
<svg width="640" height="480" xmlns="http://www.w3.org/2000/svg">
  <g>
    <rect x="0" y="0" width="640" height="480" style="stroke:none;fill:#eee"></rect>
    <path d="${line.toSVGPath()}" style="stroke:#000"></path>
  </g>
</svg>
`);
