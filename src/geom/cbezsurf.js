
import CubicBezier from './cbezier'
import vec2 from '../vec2'

const EPSILON = 0.001;
const MAX_INTERSECTION_PARAM_ITERS = 15;

function hermiteBlendingFunctions(t) {
  let f1 = 2*t*t*t - 3*t*t + 1;
  let f2 = 1-f1;
  let f3 = t*t*t - 2*t*t + t;
  let f4 = t*t*t - t*t;
  return [ f1, f2, f3, f4 ];
}

/*
 * Coons patch is defined by its boundary.
 * A mesh gradient coons patch is defined by 4 cubic bezier curves.
 * Hence there are expected to be 12 points on its boundaries. This routine
 * computes the 4 inside control points for such coons patch
 *
 *             j ->
 *      b00  b01  b02  b03
 *
 *    i b10            b13
 *    |      b[i][j]
 *    v b20            b23
 *
 *      b30  b31  b32  b33
 *
 *  b[i][j] =
 *    (1-i/3) * b[0][j] + (i/3) * b[3][j] +
 *    (1-j/3) * b[i][0] + (j/3) * b[i][3]
 *    - b[0][0] * (1-j/3) * (1-i/3)
 *    - b[3][0] * (j/3) * (1-i/3)
 *    - b[0][3] * (1-j/3) * (i/3)
 *    - b[3][3] * (j/3) * (i/3)
 *
 *  Ref: CAGD - Farid - 15.2
 *
 */
function interpolateCoons(coons) {
  if(coons.length !== 12) {
    console.error("Coons boundary of unexpected length ", coons.length);
  }
  let b = [
    [ coons[0], coons[1], coons[2], coons[3] ],
    [ coons[11], [0,0], [0,0], coons[4] ],
    [ coons[10], [0,0], [0,0], coons[5] ],
    [ coons[9], coons[8], coons[7], coons[6] ]
  ];

  for(let i=1; i<=2; i++) {
    for(let j=1; j<=2; j++) {
      b[i][j][0] =
        (1-i/3) * b[0][j][0] + (i/3) * b[3][j][0] +
        (1-j/3) * b[i][0][0] + (j/3) * b[i][3][0]
        - b[0][0][0] * (1-j/3) * (1-i/3)
        - b[0][3][0] * (j/3) * (1-i/3)
        - b[3][0][0] * (1-j/3) * (i/3)
        - b[3][3][0] * (j/3) * (i/3);

      b[i][j][1] =
        (1-i/3) * b[0][j][1] + (i/3) * b[3][j][1] +
        (1-j/3) * b[i][0][1] + (j/3) * b[i][3][1]
        - b[0][0][1] * (1-j/3) * (1-i/3)
        - b[0][3][1] * (j/3) * (1-i/3)
        - b[3][0][1] * (1-j/3) * (i/3)
        - b[3][3][1] * (j/3) * (i/3);
    }
  }
  return b;
}

/*
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

class CubicBezierSurface {

  /**
   *
   * @param points
   * @param coons
   */
  constructor({points,coons}) {
    if(points) {
      this.points = points;
    } else if(coons) {
      this.points = interpolateCoons(coons);
    } else {
      throw new Error('Invalid constructor input');
    }

    console.assert(this.points.length === 4);
    this.points.forEach(row => {
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

  containsPoint(ipoint) {
    return this.getBoundaryCurves().every(boundaryCurve => {
      let t = boundaryCurve.projectParam(ipoint);
      return t > EPSILON && t < (1-EPSILON);
    });
  }

  /**
   * Top curve corresponds to v = 0, curve from P00 to P10
   * @return {CubicBezier}
   */
  getTopCurve() {
    return new CubicBezier(this.points[0].slice(0, 4));
  }

  /**
   * Bottom curve corresponds to v = 1, curve from P01 to P11
   * @return {CubicBezier}
   */
  getBottomCurve() {
    return new CubicBezier(this.points[3].slice(0, 4));
  }

  /**
   * Left curve corresponds to u = 0, curve from P00 to P01
   * @return {CubicBezier}
   */
  getLeftCurve() {
    return new CubicBezier([
      this.points[0][0],
      this.points[1][0],
      this.points[2][0],
      this.points[3][0]
    ]);
  }

  /**
   * Right curve corresponds to u = 1, curve from P10 to P11
   * @return {CubicBezier}
   */
  getRightCurve() {
    return new CubicBezier([
      this.points[0][3],
      this.points[1][3],
      this.points[2][3],
      this.points[3][3]
    ]);
  }

  _computeVCurve(U) {

    let P = this.points;

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
    let P = this.points;

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
   * @param {number[]} ipoint
   * @returns {number[]}
   */
  projectParam(ipoint) {
    return [this._estimateU(ipoint), this._estimateV(ipoint)];
  }

  /**
   * Split into two surfaces around u parameter at given value
   * @param {number} u
   */
  splitU(u) {
    /**
                   v0left                              v0right

           0      1        2      3             0      1        2      3

        0  +----------------------+  0       0  +----------------------+  0
           |                      |             |                      |
           |                      |             |                      |
           |                      |      u      |                      |
    l   1  |                      |  1   m   1  |                      |  1   r
    e      |                      |      i      |                      |      i
    f      |                      |      d      |                      |      g
    t   2  |                      |  2       2  |                      |  2   h
           |                      |             |                      |      t
           |                      |             |                      |
           |                      |             |                      |
        3  +----------------------+  3       3  +----------------------+  3

           0      1        2      3             0      1        2      3

                  v1left                                v1right

     */

    let [v0LeftCrv, v0RightCrv] = this.getTopCurve().split(u);
    let umidCrv = this._computeVCurve(u);
    let leftCrv = this.getLeftCurve();
    let rightCrv = this.getRightCurve();
    let [v1LeftCrv, v1RightCrv] = this.getBottomCurve().split(u);

    let left = new CubicBezierSurface({coons : [
      v0LeftCrv.cpoints[0],
      v0LeftCrv.cpoints[1],
      v0LeftCrv.cpoints[2],
      v0LeftCrv.cpoints[3],
      umidCrv.cpoints[1],
      umidCrv.cpoints[2],
      umidCrv.cpoints[3],
      v1LeftCrv.cpoints[2],
      v1LeftCrv.cpoints[1],
      v1LeftCrv.cpoints[0],
      leftCrv.cpoints[2],
      leftCrv.cpoints[1]
    ]});

    let right = new CubicBezierSurface({coons : [
      v0RightCrv.cpoints[0],
      v0RightCrv.cpoints[1],
      v0RightCrv.cpoints[2],
      v0RightCrv.cpoints[3],
      rightCrv.cpoints[1],
      rightCrv.cpoints[2],
      rightCrv.cpoints[3],
      v1RightCrv.cpoints[2],
      v1RightCrv.cpoints[1],
      v1RightCrv.cpoints[0],
      umidCrv.cpoints[2],
      umidCrv.cpoints[1]
    ]});
    return [left,right];
  }

  /**
   * Split into two surfaces around v parameter at given value
   * @param {number} v
   */
  splitV(v) {
    /**
                   top

           0      1        2      3        

        0  +----------------------+  0     
           |                      |        
           |                      |        
    u      |                      |      u 
    0   1  |                      |  1   1 
    t      |                      |      t 
    o      |                      |      o 
    p   2  |                      |  2   p 
           |                      |        
           |                      |        
           |                      |        
        3  +----------------------+  3     

           0      1        2      3       

                  vmid

           0      1        2      3     

        0  +----------------------+  0  
           |                      |        
    u      |                      |      u 
    0      |                      |      1 
    b   1  |                      |  1   b 
    o      |                      |      o 
    t      |                      |      t 
    t   2  |                      |  2   t 
    o      |                      |      o 
    m      |                      |      m 
           |                      |        
        3  +----------------------+  3     

           0      1        2      3          

                 bottom

     */
    let [u0TopCrv, u0BottomCrv] = this.getLeftCurve().split(v);
    let vmidCrv = this._computeUCurve(v);
    let topCrv = this.getTopCurve();
    let bottomCrv = this.getBottomCurve();
    let [u1TopCrv, u1BottomCrv] = this.getRightCurve().split(v);

    let top = new CubicBezierSurface({coons : [
      topCrv.cpoints[0],
      topCrv.cpoints[1],
      topCrv.cpoints[2],
      topCrv.cpoints[3],
      u1TopCrv.cpoints[1],
      u1TopCrv.cpoints[2],
      u1TopCrv.cpoints[3],
      vmidCrv.cpoints[2],
      vmidCrv.cpoints[1],
      vmidCrv.cpoints[0],
      u0TopCrv.cpoints[2],
      u0TopCrv.cpoints[1]
    ]});

    let bottom = new CubicBezierSurface({coons : [
      vmidCrv.cpoints[0],
      vmidCrv.cpoints[1],
      vmidCrv.cpoints[2],
      vmidCrv.cpoints[3],
      u1BottomCrv.cpoints[1],
      u1BottomCrv.cpoints[2],
      u1BottomCrv.cpoints[3],
      bottomCrv.cpoints[2],
      bottomCrv.cpoints[1],
      bottomCrv.cpoints[0],
      u0BottomCrv.cpoints[2],
      u0BottomCrv.cpoints[1]
    ]});
    return [top,bottom];
  }

  /**
   * Split into four surfaces around u and v parameters at given values
   * @param {number} u
   * @param {number} v
   */
  splitUV(u,v) {

    /**
                   v0left                              v0right

           0      1        2      3             0      1        2      3

        0  +----------------------+  0       0  +----------------------+  0
           |                      |             |                      |
           |                      |             |                      |
    u      |                      |      u      |                      |      u
    0   1  |                      |  1   m   1  |                      |  1   1
    t      |                      |      t      |                      |      t
    o      |                      |      o      |                      |      o
    p   2  |                      |  2   p   2  |                      |  2   p
           |                      |             |                      |
           |                      |             |                      |
           |                      |             |                      |
        3  +----------------------+  3       3  +----------------------+  3

           0      1        2      3             0      1        2      3

                  vmleft                               vmright

           0      1        2      3             0      1        2      3

        0  +----------------------+  0       0  +----------------------+  0
           |                      |             |                      |
    u      |                      |      u      |                      |      u
    0      |                      |      m      |                      |      1
    b   1  |                      |  1   b   1  |                      |  1   b
    o      |                      |      o      |                      |      o
    t      |                      |      t      |                      |      t
    t   2  |                      |  2   t   2  |                      |  2   t
    o      |                      |      o      |                      |      o
    m      |                      |      m      |                      |      m
           |                      |             |                      |
        3  +----------------------+  3       3  +----------------------+  3

           0      1        2      3             0      1        2      3

                  v1left                                v1right

     */

    let [v0LeftCrv, v0RightCrv] = this.getTopCurve().split(u);
    let [vmLeftCrv, vmRightCrv] = this._computeUCurve(v).split(u);
    let [v1LeftCrv, v1RightCrv] = this.getBottomCurve().split(u);

    let [u0TopCrv, u0BottomCrv] = this.getLeftCurve().split(v);
    let [umTopCrv, umBottomCrv] = this._computeVCurve(u).split(v);
    let [u1TopCrv, u1BottomCrv] = this.getRightCurve().split(v);

    let topLeft = new CubicBezierSurface({coons : [
      v0LeftCrv.cpoints[0],
      v0LeftCrv.cpoints[1],
      v0LeftCrv.cpoints[2],
      v0LeftCrv.cpoints[3],
      umTopCrv.cpoints[1],
      umTopCrv.cpoints[2],
      umTopCrv.cpoints[3],
      vmLeftCrv.cpoints[2],
      vmLeftCrv.cpoints[1],
      vmLeftCrv.cpoints[0],
      u0TopCrv.cpoints[2],
      u0TopCrv.cpoints[1]
    ]});
    let topRight = new CubicBezierSurface({coons : [
      v0RightCrv.cpoints[0],
      v0RightCrv.cpoints[1],
      v0RightCrv.cpoints[2],
      v0RightCrv.cpoints[3],
      u1TopCrv.cpoints[1],
      u1TopCrv.cpoints[2],
      u1TopCrv.cpoints[3],
      vmRightCrv.cpoints[2],
      vmRightCrv.cpoints[1],
      vmRightCrv.cpoints[0],
      umTopCrv.cpoints[2],
      umTopCrv.cpoints[1]
    ]});
    let bottomLeft = new CubicBezierSurface({coons : [
      vmLeftCrv.cpoints[0],
      vmLeftCrv.cpoints[1],
      vmLeftCrv.cpoints[2],
      vmLeftCrv.cpoints[3],
      umBottomCrv.cpoints[1],
      umBottomCrv.cpoints[2],
      umBottomCrv.cpoints[3],
      v1LeftCrv.cpoints[2],
      v1LeftCrv.cpoints[1],
      v1LeftCrv.cpoints[0],
      u0BottomCrv.cpoints[2],
      u0BottomCrv.cpoints[1]
    ]});
    let bottomRight = new CubicBezierSurface({coons : [
      vmRightCrv.cpoints[0],
      vmRightCrv.cpoints[1],
      vmRightCrv.cpoints[2],
      vmRightCrv.cpoints[3],
      u1BottomCrv.cpoints[1],
      u1BottomCrv.cpoints[2],
      u1BottomCrv.cpoints[3],
      v1RightCrv.cpoints[2],
      v1RightCrv.cpoints[1],
      v1RightCrv.cpoints[0],
      umBottomCrv.cpoints[2],
      umBottomCrv.cpoints[1]
    ]});

    return [
      [topLeft, topRight],
      [bottomLeft, bottomRight]
    ];
  }

  clone() {
    return new CubicBezierSurface({points:JSON.parse(JSON.stringify(this.points))});
  }

  /**
   * SVG Path data string
   * @param {number=} precision
   * @returns {string}
   */
  toSVGPathData(precision=2) {
    let d = '';
    let P = this.points;
    let cpx0 = P[0][0][0].toFixed(precision);
    let cpy0 = P[0][0][1].toFixed(precision);
    d += `M ${cpx0},${cpy0} `;
    let cpx1 = P[0][1][0].toFixed(precision);
    let cpy1 = P[0][1][1].toFixed(precision);
    let cpx2 = P[0][2][0].toFixed(precision);
    let cpy2 = P[0][2][1].toFixed(precision);
    let cpx3 = P[0][3][0].toFixed(precision);
    let cpy3 = P[0][3][1].toFixed(precision);
    d += `C ${cpx1},${cpy1} ${cpx2},${cpy2} ${cpx3},${cpy3} `;
    cpx1 = P[1][3][0].toFixed(precision);
    cpy1 = P[1][3][1].toFixed(precision);
    cpx2 = P[2][3][0].toFixed(precision);
    cpy2 = P[2][3][1].toFixed(precision);
    cpx3 = P[3][3][0].toFixed(precision);
    cpy3 = P[3][3][1].toFixed(precision);
    d += `C ${cpx1},${cpy1} ${cpx2},${cpy2} ${cpx3},${cpy3} `;
    cpx1 = P[3][2][0].toFixed(precision);
    cpy1 = P[3][2][1].toFixed(precision);
    cpx2 = P[3][1][0].toFixed(precision);
    cpy2 = P[3][1][1].toFixed(precision);
    cpx3 = P[3][0][0].toFixed(precision);
    cpy3 = P[3][0][1].toFixed(precision);
    d += `C ${cpx1},${cpy1} ${cpx2},${cpy2} ${cpx3},${cpy3} `;
    cpx1 = P[2][0][0].toFixed(precision);
    cpy1 = P[2][0][1].toFixed(precision);
    cpx2 = P[1][0][0].toFixed(precision);
    cpy2 = P[1][0][1].toFixed(precision);
    cpx3 = P[0][0][0].toFixed(precision);
    cpy3 = P[0][0][1].toFixed(precision);
    d += `C ${cpx1},${cpy1} ${cpx2},${cpy2} ${cpx3},${cpy3}`;
    return d;
  }

}

export default CubicBezierSurface;
