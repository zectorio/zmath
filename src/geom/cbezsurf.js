
import CubicBezier from './cbezier'

export default class CubicBezierSurface {

  constructor(pointgrid) {
    this.pointgrid = pointgrid;

    console.assert(this.pointgrid.length % 4 === 0);
    this.pointgrid.forEach(row => {
      console.assert(row.length%4 === 0);
    });
  }

  getBoundaryCurves() {

    let curves = [];
    let nrows = this.pointgrid.length;
    let ncols = this.pointgrid[0].length;

    for(let i=0; i<ncols; i+=4) {
      let cpoints = this.pointgrid[0].slice(i, i+4);
      curves.push(new CubicBezier(cpoints));
    }
    for(let i=0; i<ncols; i+=4) {
      let cpoints = this.pointgrid[nrows-1].slice(i, i+4);
      curves.push(new CubicBezier(cpoints));
    }
    for(let i=0; i<nrows; i+=4) {
      let cpoints = [
        this.pointgrid[i][0],
        this.pointgrid[i+1][0],
        this.pointgrid[i+2][0],
        this.pointgrid[i+3][0]
      ];
      curves.push(new CubicBezier(cpoints));
    }
    for(let i=0; i<nrows; i+=4) {
      let cpoints = [
        this.pointgrid[i][ncols-1],
        this.pointgrid[i+1][ncols-1],
        this.pointgrid[i+2][ncols-1],
        this.pointgrid[i+3][ncols-1]
      ];
      curves.push(new CubicBezier(cpoints));
    }
    return curves;
  }

}