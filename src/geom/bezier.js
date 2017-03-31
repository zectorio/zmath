
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
     * @member {number} Bezier#degree
     */
    this.degree = cpoints.length-1;

    /**
     * Array of control points
     * @member {number[][]} Bezier#cpoints
     */
    this.cpoints = cpoints;
  }
}

export default Bezier;