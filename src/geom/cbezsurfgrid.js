
import CubicBezier from './cbezier'
import CubicBezierSurface from './cbezsurf'
import vec2 from '../vec2'

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
function computeVCurve(P, U) {

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

  return [
    PU0,
    vec2.add(PU0, PvU0),
    vec2.sub(PU1, PvU1),
    PU1
  ];
}

function computeUCurve(P, V) {
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

  return [
    P0V,
    vec2.add(P0V, Pu0V),
    vec2.sub(P1V, Pu1V),
    P1V
  ];
}

export default class CubicBezierSurfaceGrid {

  constructor(surfgrid) {
    this.surfgrid = surfgrid;
  }

  /**
   * Subdivide the Surface Grid at a give point
   * If the grid had m*n surfaces before subdivision, then it will have
   * (m+1)*(n+1) surfaces after subdivision
   * @param point
   */
  subdivide(point) {

    let iidx = 0;
    let jidx = 0;
    let surf = this.surfgrid[iidx][jidx]; // TODO temporary

    const MAX_ITERS = 15;

    // Find V Curve
    let uleft = 0.0;
    let uright = 1.0;
    let umid;

    let curveLeft = surf.getLeftCurve();
    let curveRight = surf.getRightCurve();
    let valLeft, valRight;

    let i;
    for(i=0; i<MAX_ITERS; i++) {
      umid = (uleft+uright)/2;

      valLeft = vec2.distSq(curveLeft.project(point), point);
      valRight = vec2.distSq(curveRight.project(point), point);

      if(Math.abs(valLeft-valRight) < 1) {
        break;
      }

      if(valLeft < valRight) {
        uright = umid;
        curveRight = new CubicBezier(computeVCurve(surf.pointgrid, umid));
      } else {
        uleft = umid;
        curveLeft = new CubicBezier(computeVCurve(surf.pointgrid, umid));
      }
    }

    // Find U Curve
    let vleft = 0.0;
    let vright = 1.0;
    let vmid;

    curveLeft = surf.getTopCurve();
    curveRight = surf.getBottomCurve();
    for(i=0; i<MAX_ITERS; i++) {
      vmid = (vleft+vright)/2;
      let valLeft = vec2.distSq(curveLeft.project(point), point);
      let valRight = vec2.distSq(curveRight.project(point), point);

      if(Math.abs(valLeft-valRight) < 1) {
        break;
      }

      if(valLeft < valRight) {
        vright = vmid;
        curveRight = new CubicBezier(computeUCurve(surf.pointgrid, vmid));
      } else {
        vleft = vmid;
        curveLeft = new CubicBezier(computeUCurve(surf.pointgrid, vmid));
      }
    }

  }

  * getBezierSurfaces() {
    for (let i = 0; i < this.surfgrid.length; i++) {
      let row = this.surfgrid[i];
      for (let j = 0; j < row.length; j++) {
        yield row[j];
      }
    }
  }
}