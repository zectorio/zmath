
import Bezier from './bezier'
import vec2 from '../vec2'
import AABB from '../aabb'

/**
 * @class
 */
class CubicBezier extends Bezier {

  evaluate(t) {
    let p = this.cpoints;
    let t2 = t*t;
    let t3 = t*t2;
    let one_t2 = (1-t)*(1-t);
    let one_t3 = (1-t)*one_t2;
    let x = one_t3*p[0][0] + 3*t*one_t2*p[1][0]+ 3*t2*(1-t)*p[2][0]+ t3*p[3][0];
    let y = one_t3*p[0][1] + 3*t*one_t2*p[1][1]+ 3*t2*(1-t)*p[2][1]+ t3*p[3][1];
    return [x,y];
  }

  /**
   * Return parameter values at which either x or y coords are at extremes
   * It means that some of the values might represent curve's extremeties,
   * but not all of them.
   * @returns {number[]}
   * @private
   */
  _getExtremes() {
    let [p1,p2,p3,p4] = this.cpoints;
    //
    // Ref: https://pomax.github.io/bezierinfo/#extremities
    // a = 3(-p1 + 3p2 - 3p3 + p4);
    // b = 6(p1 - 2p2 + p3);
    // c = 3(p2 - p1)
    //
    let [ax,ay] = vec2.mul(
      vec2.add(vec2.mul(p1,-1), vec2.mul(p2,3), vec2.mul(p3,-3), p4), 3);
    let [bx,by] = vec2.mul(
      vec2.add(p1, vec2.mul(p2, -2), p3), 6);
    let [cx,cy] = vec2.mul(vec2.sub(p2,p1),3);

    //
    // Quadratic root formula
    // t = (-b + sqrt(b*b - 4*a*c))/(2*a) and (-b - sqrt(b*b - 4*a*c))/(2*a)
    //
    // To be solved separately for X and Y dimensions
    let sqterm, tx0, tx1, ty0, ty1;

    // For x
    sqterm = bx*bx - 4*ax*cx;
    if(sqterm >= 0) {
      let Ax = -bx/(2*ax);
      let Bx = Math.sqrt(sqterm)/(2*ax);
      tx0 = Ax - Bx;
      tx1 = Ax + Bx;
    } else {
      tx0 = 0.0;
      tx1 = 1.0;
    }

    // For y
    sqterm = by*by - 4*ay*cy;
    if(sqterm >= 0) {
      let Ay = -by/(2*ay);
      let By = Math.sqrt(sqterm)/(2*ay);
      ty0 = Ay - By;
      ty1 = Ay + By;
    } else {
      ty0 = 0.0;
      ty1 = 1.0;
    }

    return [tx0,tx1,ty0,ty1].filter(t => t >= 0.0 && t <= 1.0);
  }

  aabb() {
    let extremes = this._getExtremes().map(t => this.evaluate(t));
    return new AABB({
      min : vec2.low(...extremes),
      max : vec2.high(...extremes)
    });
  }

  /**
   * Split the curve at given u value and return two Cubic Bezier curves that
   * are identical to this curve when put together
   * @param {number} u
   * @returns {CubicBezier[]}
   */
  split(u) {
    let [p0,p1,p2,p3] = this.cpoints;
    let p01 = vec2.add(vec2.mul(p0,1-u), vec2.mul(p1,u));
    let p12 = vec2.add(vec2.mul(p1,1-u), vec2.mul(p2,u));
    let p23 = vec2.add(vec2.mul(p2,1-u), vec2.mul(p3,u));

    let p012 = vec2.add(vec2.mul(p01,1-u), vec2.mul(p12,u));
    let p123 = vec2.add(vec2.mul(p12,1-u), vec2.mul(p23,u));

    let p0123 = vec2.add(vec2.mul(p012,1-u), vec2.mul(p123,u));

    return [
      new CubicBezier([p0,p01,p012,p0123]),
      new CubicBezier([p0123,p123,p23,p3])
    ];
  }

  /**
   * Find parametric value on this curve that's closest to input point
   * @param {!number[]} ipoint
   * @returns {number}
   */
  projectParam(ipoint) {
    const COARSE_ITERS = 8;
    let tarr = [];
    for (let i = 0; i <= COARSE_ITERS; i++) {
      tarr.push(i/COARSE_ITERS);
    }
    let coarsePoints = tarr.map(t => this.evaluate(t));
    let minidx = 0;
    let mindistsq = Infinity;
    let coarsev = [];
    coarsePoints.forEach((coarsept, idx) => {
      let distSq = vec2.distSq(coarsept, ipoint);
      coarsev.push(distSq);
      if(distSq < mindistsq) {
        mindistsq = distSq;
        minidx = idx;
      }
    });

    let idxleft = Math.max(minidx-1, 0);
    let idxright = Math.min(minidx+1, coarsePoints.length-1);
    let tleft = idxleft/COARSE_ITERS;
    let tright = idxright/COARSE_ITERS;
    let vleft = coarsev[idxleft];
    let vright = coarsev[idxright];
    let vmid;
    let tmid;
    let gapleft, gapright;

    const MAX_ITERS = 15;
    let i;
    for(i=0; i<MAX_ITERS; i++) {

      tmid = (tleft+tright)/2;

      vmid = vec2.distSq(this.evaluate(tmid), ipoint);

      gapleft = Math.abs(vleft-vmid);
      gapright = Math.abs(vright-vmid);

      if(gapleft < 1) {
        tmid = tleft;
        break;
      }
      if(gapright < 1) {
        tmid = tright;
        break;
      }

      if(gapleft < gapright) {
        tright = tmid;
        vright = vmid;
      } else {
        tleft = tmid;
        vleft = vmid;
      }
    }

    return tmid;
  }

  /**
   * Find a point on this curve that's closest to input point
   * @param ipoint
   * @returns {*}
   */
  project(ipoint) {
    return this.evaluate(this.projectParam(ipoint));
  }

  /**
   * Return SVG Path data
   * @param {number} precision
   * @returns {string}
   */
  toSVGPathData(precision=2) {
    let p = this.cpoints;
    return `M ${p[0][0].toFixed(precision)},${p[0][1].toFixed(precision)} `+
      `C ${p[1][0].toFixed(precision)},${p[1][1].toFixed(precision)}`+
      ` ${p[2][0].toFixed(precision)},${p[2][1].toFixed(precision)}`+
      ` ${p[3][0].toFixed(precision)},${p[3][1].toFixed(precision)}`
      ;
  }

  /**
   * Returns Canvas PathDefinition object
   * @returns {ZCanvas~PathDefinition}
   */
  toCanvasPathDef() {
    return {
      type : 'cbez',
      cpoints : JSON.parse(JSON.stringify(this.cpoints))
    };
  }
}

export default CubicBezier;