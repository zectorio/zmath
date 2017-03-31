
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
  generateMemento() {
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
}

export default Curve;