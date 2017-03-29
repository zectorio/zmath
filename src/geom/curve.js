/**
 * @class
 */
class Curve {

  /**
   * Evaluate the curve at parameter value `t`.
   * **Abstract method - Sub-classes should implement it**
   * @param {number} t
   */
  evaluate(t) {
    throw new Error('Not implemented');
  }

  /**
   * Generate persistent representation of the Curve object
   * **Abstract method - Sub-classes should implement it**
   */
  generateMemento() {
    throw new Error('Not implemented');
  }

  /**
   * String representation
   * **Abstract method - Sub-classes should implement it**
   */
  toString() {
    throw new Error('Not implemented');
  }
}

export default Curve;