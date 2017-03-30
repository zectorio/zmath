/**
 * @class
 * @memberof zmath.geom
 */
class Curve {

  /**
   * **Abstract method - Sub-classes should implement it**
   * @param {number} t
   */
  evaluate(t) {
    throw new Error('Not implemented');
  }

  /**
   * **Abstract method - Sub-classes should implement it**
   */
  generateMemento() {
    throw new Error('Not implemented');
  }

  /**
   * **Abstract method - Sub-classes should implement it**
   * @returns {ZCanvas~PathDefinition}
   */
  toCanvasPathDef() {
    throw new Error('Not implemented');
  }

  /**
   * **Abstract method - Sub-classes should implement it**
   */
  toString() {
    throw new Error('Not implemented');
  }
}

export default Curve;