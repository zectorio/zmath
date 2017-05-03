
import vec2 from '../vec2'
import Curve from './curve'
import AABB from '../aabb'
import {EPSILON} from '../constants'
import {isZero} from '..'

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

  /**
   * Returns total angular span of this arc. The value is unsigned. It takes
   * into consideration the winding direction (cw/ccw) and start-end angles
   * @returns {number}
   */
  getAngleSpan() {
    let span;
    if(this.start < this.end) {
      if(this.ccw) {
        span = 2*Math.PI - (this.end-this.start);
      } else {
        span = this.end-this.start;
      }
    } else {
      if(this.ccw) {
        span = this.start-this.end;
      } else {
        span = 2*Math.PI - (this.start-this.end);
      }
    }
    return span;
  }

  /**
   * Given a point on the circumference of this ellipse, return corresponding
   * angle
   * @param {Point2D} point
   * @returns {number} Angle
   */
  getAngle(point) {
    let [x,y] = point;
    let angle = Math.atan2(y/x, this.ry/this.rx);
    // Place the angle in right quadrant
    // If x == 0, no additional logic is required to place it in right quadrant
    if(y > 0) {
      if(x > 0) {
      } 
      if(x < 0) {
        angle = Math.PI-Math.abs(angle);
      }
      if(isZero(x)) {
        angle = Math.PI/2;  // TODO: assumption Y-increases down
      }
    }
    if(y < 0) {
      if(x > 0) {
        angle = -Math.abs(angle);
      } 
      if(x < 0) {
        angle = Math.PI+Math.abs(angle);
      }
      if(isZero(x)) {
        angle = 3*Math.PI/2; // TODO: assumption Y-increases down
      }
    }
    if(isZero(y)) {
      if(x > 0) {
      }
      if(x < 0) {
        angle = Math.PI-Math.abs(angle);
      }
    }
    return angle;
  }

  /**
   * @returns {AABB}
   */
  aabb() {
    let span = this.getAngleSpan();
    
    if(span >= 3*Math.PI/2) {
      return new AABB({
        min : vec2.sub(this.center, [this.rx,this.ry]),
        max : vec2.add(this.center, [this.rx,this.ry])
      });
    } else if(span < Math.PI/2) {
      let ps = this.evaluate(this.start);
      let pe = this.evaluate(this.end);
      return new AABB({
        min : vec2.low(ps,pe),
        max : vec2.high(ps,pe)
      });
    } else {

      /**
       *                                ---> cw
       *                         S                      E
       *
       *     |---------------------------------------------------------|
       *     0             PI/2         PI           3*PI/2           2*PI
       *     
       *                         E                      S
       *                                <--- ccw
       */
      let extremes = [];
      
      let PI = Math.PI;
      let keyAngles = [PI/2,PI,3*PI/2];
      for(let keyAngle of keyAngles) {
        let included = false;
        if(this.start < this.end) {
          if(this.start <= keyAngle && keyAngle <= this.end) { // Inside S <-> E
            included = !this.ccw;
          } else { // Outside S <-> E
            included = this.ccw;
          }
        } else {
          if(this.end <= keyAngle && keyAngle <= this.start) { // Inside E <-> S
            included = this.ccw;
          } else { // Outside E <-> S
            included = !this.ccw;
          }
        }
        if(included) {
          extremes.push(this.evaluate(keyAngle));
        }
      }
      
      if(this.start < this.end) {
        if(this.ccw) {
          extremes.push(this.evaluate(0));
        }
      } else {
        if(!this.ccw) {
          extremes.push(this.evaluate(0));
        }
      }
      
      extremes.push(this.evaluate(this.start));
      extremes.push(this.evaluate(this.end));
      return new AABB({
        min : vec2.low(...extremes),
        max : vec2.high(...extremes)
      });
    }
  }

  /**
   * Evaluate point on arc at angle t
   * @param {number} t - Angle in radians
   * @returns {Point2D}
   */
  evaluate(t) {
    let [cx,cy] = this.center;
    let {rx,ry} = this;
    return [
      cx + rx * Math.cos(t),
      cy + ry * Math.sin(t)
    ];
  }

  /**
   * @returns {ZCanvas~PathDefinition}
   */
  toCanvasPathDef() {
    let [cx,cy] = this.center;
    let [x1,y1] = this.evaluate(this.start);
    if(this.getAngleSpan() >= 2*Math.PI) {
      // Split the arc into two semicircles
      // SVG definition for elliptical arc doesn't work for full ellipse
      return {
        type : 'path',
        curveseq : [
          ['M',x1,y1],
          ['E',cx,cy,this.rx,this.ry, 0,Math.PI, this.ccw?1:0],
          ['E',cx,cy,this.rx,this.ry, Math.PI,2*Math.PI, this.ccw?1:0]
        ]
      };
    } else {
      return {
        type : 'path',
        curveseq : [
          ['M',x1,y1],
          ['E',cx,cy,this.rx,this.ry, this.start,this.end, this.ccw?1:0]
        ]
      };
    }
  }

  /**
   * Create circular arc that starts from pA, ends at pC and passes through pB
   * @param {Point2D} pA Start point
   * @param {Point2D} pB Through point
   * @param {Point2D} pC End point
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

    let startAngle = EllipseArc.getCircleAngle(center, pA),
      throughAngle = EllipseArc.getCircleAngle(center, pB),
      endAngle = EllipseArc.getCircleAngle(center, pC);

    let ccw;

    /**
     *                                ---> cw
     *                                
     * 
     *  (A)     T(1)        S           T(2)           E          T(3)
     *     
     *     |---------------------------------------------------------|
     *     0                           PI                           2*PI
     *
     *  (B)     T(1)        E           T(2)           S          T(3)
     *  
     *  
     *                                <--- ccw
     */

    if(startAngle < endAngle) { // case A
      if(0 <= throughAngle && throughAngle < startAngle) { // A:1
        ccw = true;
      } else if(startAngle < throughAngle && throughAngle < endAngle) { // A:2
        ccw = false;
      } else if(endAngle < throughAngle && throughAngle <= 2*Math.PI) { // A:3
        ccw = true;
      }
    } else { // case B
      if(0 <= throughAngle && throughAngle < endAngle) { // B:1
        ccw = false;
      } else if(endAngle < throughAngle && throughAngle < startAngle) { // B:2
        ccw = true; 
      } else if(startAngle < throughAngle && throughAngle <= 2*Math.PI) { // B:3
        ccw = false;
      }
    }

    let radius = vec2.dist(pA, center);

    return new EllipseArc(center, radius, radius, startAngle, endAngle, ccw);
  }

  static circularArcFrom2PointsAndRadius(pA, pB, radius, sideflag) {

  }

  static getCircleAngle(center, pt) {
    let dot = vec2.dot([1,0], vec2.unit(vec2.sub(pt, center)));
    if(pt[1] > center[1]) {
      return EllipseArc.wrapAngle(Math.acos(dot));
    } else {
      return EllipseArc.wrapAngle(2*Math.PI - Math.acos(dot));
    }
  }
  
  static wrapAngle(angle) {
    while(angle < 0) {
      angle = angle + 2*Math.PI;
    }
    while(angle > 2*Math.PI) {
      angle = angle - 2*Math.PI;
    }
    return angle;
  }
}



export default EllipseArc;