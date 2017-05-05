
class Curve {

  /**
   * @abstract
   */
  evaluate(t) {
    throw new Error('Not implemented');
  }

  /**
   * @abstract
   */
  toMemento() {
    throw new Error('Not implemented');
  }

  /**
   * @abstract
   */
  toCanvasPathDef() {
    throw new Error('Not implemented');
  }

  /**
   * @abstract
   */
  toString() {
    throw new Error('Not implemented');
  }

  /**
   * Loose AABB (cheap to calculate) for this curve
   * Note that the {Curve} object is 1-dimensional geometry, i.e. it doesn't
   * have thickness. Hence the AABB is not affected by any thickness the
   * application might attribute to this curve during rendering
   * @abstract
   * @returns {AABB}
   */
  aabb() {
    throw new Error('Not implemented');
  }
}

export default Curve;