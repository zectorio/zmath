
import Bezier from './bezier'
import {vec2, AABB} from '../..'

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
   * @returns {Array.<*>}
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

  toSVGPathData() {
    let p = this.cpoints;
    return `M ${p[0][0]},${p[0][1]} `+
      `C ${p[1][0]},${p[1][1]}`+
      ` ${p[2][0]},${p[2][1]}`+
      ` ${p[3][0]},${p[3][1]}`
      ;
  }
}

export default CubicBezier;