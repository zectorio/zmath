
import vec2 from '../vec2'
import AABB from '../aabb'
import Curve from './curve'

class Line extends Curve {

  /**
   * @param {!number[]} start
   * @param {!number[]} end
   */
  constructor(start, end) {
    super();
    this.start = start;
    this.end = end;
  }

  /**
   * Evaluate line at given parameter value
   * @param {number} t
   * @returns {number[]} point
   */
  evaluate(t) {
    return vec2.add(
      this.start,
      vec2.mul(vec2.sub(this.end, this.start),t)
    );
  }

  /**
   * Return AABB of this line
   * @returns {AABB}
   */
  aabb() {
    return new AABB({
      min: [
        Math.min(this.start[0], this.end[0]),
        Math.min(this.start[1], this.end[1])
      ],
      max: [
        Math.max(this.start[0], this.end[0]),
        Math.max(this.start[1], this.end[1])
      ]
    });
  }

  /**
   * String representation
   * @returns {string}
   */
  toString() {
    let s = 'Line: ';
    let [x0,y0] = this.start;
    let [x1,y1] = this.end;
    if(x0 === x1) {
      s += 'x = '+x0;
    } else if(y0 === y1) {
      s += 'y = '+y0;
    } else {
      let m = (y1-y0)/(x1-x0);
      let c = (x1*y0-y1*x0)/(x1-x0);
      s += 'y = '+m.toFixed(2)+' x + '+c.toFixed(2);
    }
    return s;
  }

  /**
   * Return SVG Path Data that to draw this line
   * @returns {string}
   */
  toSVGPathData() {
    let [x0,y0] = this.start;
    let [x1,y1] = this.end;
    return `M ${x0},${y0} L ${x1},${y1}`;
  }

  /**
   * Generate memento
   * @returns {Object} Memento
   */
  generateMemento() {
    return {
      type : Line.TYPEID,
      start : this.start.slice(),
      end : this.end.slice()
    };
  }

  /**
   * Returns Canvas PathDefinition object
   * @returns {ZCanvas~PathDefinition}
   */
  toCanvasPathDef() {
    return {
      type : 'line',
      x1 : this.start[0],
      y1 : this.start[1],
      x2 : this.end[0],
      y2 : this.end[1]
    };
  }
}

/**
 * Type Id for internal use
 * @type {string}
 */
Line.TYPEID = 'line';

export default Line;
