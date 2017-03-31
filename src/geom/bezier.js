
import Curve from './curve'

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
}

export default Bezier;