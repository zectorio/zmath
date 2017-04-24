
import Curve from './curve'
import vec2 from '../vec2'
import AABB from '../aabb'

class Bezier extends Curve {

  /**
   * @param {Point2D[]} cpoints
   */
  constructor(cpoints) {
    super();

    /**
     * Degree of Bezier curve
     * @member {number} Bezier#degree
     */
    this.degree = cpoints.length-1;

    /**
     * Array of control points
     * @member {number[][]} Bezier#cpoints
     */
    this.cpoints = cpoints;
  }

  /**
   * @returns {AABB}
   */
  aabb() {
    return new AABB({
      min : vec2.low(...this.cpoints),
      max : vec2.high(...this.cpoints)
    });
  }
}

export default Bezier;