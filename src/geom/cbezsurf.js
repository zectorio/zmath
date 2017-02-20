
import CubicBezier from './cbezier'

export default class CubicBezierSurface {

  constructor(pointgrid) {
    this.pointgrid = pointgrid;

    console.assert(this.pointgrid.length === 4);
    this.pointgrid.forEach(row => {
      console.assert(row.length === 4);
    });
  }

  getBoundaryCurves() {
    return [
      this.getTopCurve(),
      this.getRightCurve(),
      this.getBottomCurve(),
      this.getLeftCurve()
    ];
  }

  getTopCurve() {
    return new CubicBezier(this.pointgrid[0].slice(0, 4));
  }

  getBottomCurve() {
    return new CubicBezier(this.pointgrid[3].slice(0, 4));
  }

  getLeftCurve() {
    return new CubicBezier([
      this.pointgrid[0][0],
      this.pointgrid[1][0],
      this.pointgrid[2][0],
      this.pointgrid[3][0]
    ]);
  }

  getRightCurve() {
    return new CubicBezier([
      this.pointgrid[0][3],
      this.pointgrid[1][3],
      this.pointgrid[2][3],
      this.pointgrid[3][3]
    ]);
  }

}