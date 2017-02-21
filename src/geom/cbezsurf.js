
import CubicBezier from './cbezier'
import vec2 from '../vec2'

const MAX_INTERSECTION_PARAM_ITERS = 15;

function hermiteBlendingFunctions(t) {
  let f1 = 2*t*t*t - 3*t*t + 1;
  let f2 = 1-f1;
  let f3 = t*t*t - 2*t*t + t;
  let f4 = t*t*t - t*t;
  return [ f1, f2, f3, f4 ];
}

/**
 *
 *  Puv
 *                u
 *              --->
 *     P00                           P10
 *        0,0     0,1     0,2     0,3
 *
 *   |    1,0     1,1     1,2     1,3
 * v |
 *   |    2,0     2,1     2,2     2,3
 *   v
 *        3,0     3,1     3,2     3,3
 *     P01                           P11
 *
 */

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

  /**
   * Top curve corresponds to v = 0, curve from P00 to P10
   * @returns {CubicBezier}
   */
  getTopCurve() {
    return new CubicBezier(this.pointgrid[0].slice(0, 4));
  }

  /**
   * Bottom curve corresponds to v = 1, curve from P01 to P11
   * @returns {CubicBezier}
   */
  getBottomCurve() {
    return new CubicBezier(this.pointgrid[3].slice(0, 4));
  }

  /**
   * Left curve corresponds to u = 0, curve from P00 to P01
   * @returns {CubicBezier}
   */
  getLeftCurve() {
    return new CubicBezier([
      this.pointgrid[0][0],
      this.pointgrid[1][0],
      this.pointgrid[2][0],
      this.pointgrid[3][0]
    ]);
  }

  /**
   * Right curve corresponds to u = 1, curve from P10 to P11
   * @returns {CubicBezier}
   */
  getRightCurve() {
    return new CubicBezier([
      this.pointgrid[0][3],
      this.pointgrid[1][3],
      this.pointgrid[2][3],
      this.pointgrid[3][3]
    ]);
  }

  _computeVCurve(U) {

    let P = this.pointgrid;

    let [f1,f2,f3,f4] = hermiteBlendingFunctions(U);

    let Pv00 = vec2.sub(P[1][0], P[0][0]);
    let Pv01 = vec2.sub(P[3][0], P[2][0]);
    let Pv10 = vec2.sub(P[1][3], P[0][3]);
    let Pv11 = vec2.sub(P[3][3], P[2][3]);

    let PvU0 = vec2.add(
      vec2.mul(Pv00, f1),
      vec2.mul(Pv10, f2)
    );
    let PvU1 = vec2.add(
      vec2.mul(Pv01, f1),
      vec2.mul(Pv11, f2)
    );

    let Pu0 = new CubicBezier(P[0]);
    let PU0 = Pu0.evaluate(U);
    let Pu1 = new CubicBezier(P[3]);
    let PU1 = Pu1.evaluate(U);

    return new CubicBezier([
      PU0,
      vec2.add(PU0, PvU0),
      vec2.sub(PU1, PvU1),
      PU1
    ]);
  }

  _computeUCurve(V) {
    let P = this.pointgrid;

    let [f1,f2,f3,f4] = hermiteBlendingFunctions(V);

    let Pu00 = vec2.sub(P[0][1], P[0][0]);
    let Pu10 = vec2.sub(P[0][3], P[0][2]);
    let Pu01 = vec2.sub(P[3][1], P[3][0]);
    let Pu11 = vec2.sub(P[3][3], P[3][2]);

    let Pu0V = vec2.add(
      vec2.mul(Pu00, f1),
      vec2.mul(Pu01, f2)
    );

    let Pu1V = vec2.add(
      vec2.mul(Pu10, f1),
      vec2.mul(Pu11, f2)
    );

    let P0v = new CubicBezier([P[0][0], P[1][0], P[2][0], P[3][0]]);
    let P0V = P0v.evaluate(V);
    let P1v = new CubicBezier([P[0][3], P[1][3], P[2][3], P[3][3]]);
    let P1V = P1v.evaluate(V);

    return new CubicBezier([
      P0V,
      vec2.add(P0V, Pu0V),
      vec2.sub(P1V, Pu1V),
      P1V
    ]);
  }

  _estimateU(point) {

    let uleft = 0.0;
    let uright = 1.0;
    let umid;

    let curveLeft = this.getLeftCurve();
    let curveRight = this.getRightCurve();
    let valLeft, valRight;

    for(let i=0; i<MAX_INTERSECTION_PARAM_ITERS; i++) {
      umid = (uleft+uright)/2;

      valLeft = vec2.distSq(curveLeft.project(point), point);
      valRight = vec2.distSq(curveRight.project(point), point);

      if(Math.abs(valLeft-valRight) < 1) {
        break;
      }

      if(valLeft < valRight) {
        uright = umid;
        curveRight = this._computeVCurve(umid);
      } else {
        uleft = umid;
        curveLeft = this._computeVCurve(umid);
      }
    }
    return umid;
  }

  _estimateV(point) {

    let vleft = 0.0;
    let vright = 1.0;
    let vmid;

    let curveLeft = this.getTopCurve();
    let curveRight = this.getBottomCurve();
    for(let i=0; i<MAX_INTERSECTION_PARAM_ITERS; i++) {
      vmid = (vleft+vright)/2;
      let valLeft = vec2.distSq(curveLeft.project(point), point);
      let valRight = vec2.distSq(curveRight.project(point), point);

      if(Math.abs(valLeft-valRight) < 1) {
        break;
      }

      if(valLeft < valRight) {
        vright = vmid;
        curveRight = this._computeUCurve(vmid);
      } else {
        vleft = vmid;
        curveLeft = this._computeUCurve(vmid);
      }
    }
    return vmid;
  }

  /**
   * Compute u and v parameter values that represent a point of this surface
   * that is closest to input point
   * @param ipoint
   * @returns {[*,*]}
   */
  projectParam(ipoint) {
    return [this._estimateU(ipoint), this._estimateV(ipoint)];
  }

  /**
   * Split into two surfaces around u parameter at given value
   * @param u
   */
  splitU(u) {

  }

  /**
   * Split into two surfaces around v parameter at given value
   * @param v
   */
  splitV(v) {

  }

  /**
   * Split into four surfaces around u and v parameters at given values
   * @param u
   * @param v
   */
  splitUV(u,v) {

    let [v0LeftCrv, v0RightCrv] = this.getTopCurve().split(u);
    let [vmLeftCrv, vmRightCrv] = this._computeUCurve(v).split(u);
    let [v1LeftCrv, v1RightCrv] = this.getBottomCurve().split(u);

    let [u0TopCrv, u0BottomCrv] = this.getLeftCurve().split(v);
    let [umTopCrv, umBottomCrv] = this._computeVCurve(u).split(v);
    let [u1TopCrv, u1BottomCrv] = this.getRightCurve().split(v);

    // let topLeft = new CubicBezierSurface([
    //
    // ]);
    // let topRight = new CubicBezierSurface([
    //
    // ]);
    // let bottomLeft = new CubicBezierSurface([
    //
    // ]);
    // let bottomRight = new CubicBezierSurface([
    //
    // ]);
    //
    // return [
    //   [topLeft, topRight],
    //   [bottomLeft, bottomRight]
    // ];
    return [];
  }

}