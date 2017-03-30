
import Curve from './curve'

/**
 * @class
 * @memberof zmath.geom
 */
class Bezier extends Curve {

  /**
   * @param {number[][]} cpoints
   */
  constructor(cpoints) {
    super();

    /**
     * Degree of Bezier curve
     * @type {number}
     */
    this.degree = cpoints.length-1;

    /**
     * Array of control points
     * @type {number[][]}
     */
    this.cpoints = cpoints;
  }
}

export default Bezier;