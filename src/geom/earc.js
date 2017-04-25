
import vec2 from '../vec2'
import Curve from './curve'
import AABB from '../aabb'
import {EPSILON} from '../constants'

class EllipseArc extends Curve {


  /**
   * @param {number[]} center - Center of ellipse
   * @param {number} rx - Radius along X
   * @param {number} ry - Radius along Y
   * @param {number} start - Start angle in radians
   * @param {number} end - End angle in radians
   * @param {boolean} ccw - Counter Clock Wise
   */
  constructor(center, rx, ry, start, end, ccw) {

    super();

    /**
     * @type {number[]}
     */
    this.center = center;
    /**
     * @type {number}
     */
    this.rx = rx;
    /**
     * @type {number}
     */
    this.ry = ry;
    /**
     * @type {number}
     */
    this.start = start;
    /**
     * @type {number}
     */
    this.end = end;
    /**
     * @type {boolean}
     */
    this.ccw = ccw;

  }
  
  aabb() {
    return new AABB({
      min : vec2.sub(this.center, [this.rx,this.ry]),
      max : vec2.add(this.center, [this.rx,this.ry])
    });
  }

  /**
   * Evaluate point on arc at angle t
   * @param {number} t - Angle in radians
   * @returns {number[]}
   */
  evaluate(t) {
    let [cx,cy] = this.center;
    return [
      cx + this.rx * Math.cos(t),
      cy + this.ry * Math.sin(t)
    ];
  }

  toCanvasPathDef() {

  }

  /**
   * Create circular arc that starts from pA, ends at pC and passes through pB
   * @param {number[]} pA Start point
   * @param {number[]} pB Through point
   * @param {number[]} pC End point
   * @returns {EllipseArc|null}
   */
  static circularArcFrom3Points(pA,pB,pC) {
    let ax = pA[0], ay = pA[1];
    let bx = pB[0], by = pB[1];
    let cx = pC[0], cy = pC[1];

    // Ref: https://en.wikipedia.org/wiki/Circumscribed_circle#Circumcenter_coordinates
    let D = 2 * (ax * (by-cy) + bx * (cy-ay) + cx * (ay-by));
    if(Math.abs(D) < EPSILON) {
      return null;
    }
    let x = ((ax * ax + ay * ay) * (by - cy) +
      (bx * bx + by * by) * (cy - ay) +
      (cx * cx + cy * cy) * (ay - by))/D;
    let y = ((ax * ax + ay * ay) * (cx - bx) +
      (bx * bx + by * by) * (ax - cx) +
      (cx * cx + cy * cy) * (bx - ax))/D;
    let center = [x,y];

    let startAngle = getCircleAngle(center, pA),
      throughAngle = getCircleAngle(center, pB),
      endAngle = getCircleAngle(center, pC);

    let minAngle = Math.min(startAngle, endAngle);
    let maxAngle = Math.max(startAngle, endAngle);

    let ccw = minAngle > throughAngle || throughAngle > maxAngle;

    let reversed = (minAngle !== startAngle);

    let radius = vec2.dist(pA, center);
    
    // Is this correct?
    if(reversed) {
      let tmp = minAngle;
      minAngle = maxAngle;
      maxAngle = tmp;
      ccw = !ccw;
    }

    return new EllipseArc(center, radius, radius, minAngle, maxAngle, ccw);
  }

  static circularArcFrom2PointsAndRadius(pA, pB, radius, sideflag) {

  }

}

function getCircleAngle(center, pt) {
  let dot = vec2.dot([1,0], vec2.unit(vec2.sub(pt, center)));
  if(pt[1] > center[1]) {
    return wrapAngle(Math.acos(dot));
  } else {
    return wrapAngle(2*Math.PI - Math.acos(dot));
  }
}

function wrapAngle(angle) {
  while(angle < 0) {
    angle = angle + 2*Math.PI;
  }
  while(angle > 2*Math.PI) {
    angle = angle - 2*Math.PI;
  }
  return angle;
}

export default EllipseArc;