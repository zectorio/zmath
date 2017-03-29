
import {EPSILON} from './constants';

/**
 * @class
 */
class vec2 {

  /**
   * Add one or many input vectors
   * @param {...number[]} varr
   * @returns {number[]}
   */
  static add(...varr) {
    let answer = [0,0];
    for(let v of varr) {
      answer[0] += v[0];
      answer[1] += v[1];
    }
    return answer;
  }

  /**
   * Subtract vb from va
   * @param {number[]} va
   * @param {number[]} vb
   * @returns {number[]}
   */
  static sub(va, vb) {
    return [ va[0]-vb[0], va[1]-vb[1] ];
  }

  /**
   * Multiply va by constant k
   * @param {number[]} va
   * @param {number} k
   * @returns {number[]}
   */
  static mul(va, k) {
    return [ va[0]*k, va[1]*k ];
  }

  /**
   * Is input vector non-zero, within given tolerance
   * @param {number[]} v
   * @param {number=} tolerance
   * @returns {boolean}
   */
  static isNonZero(v, tolerance=EPSILON) {
    return Math.abs(v[0]) > tolerance || Math.abs(v[1]) > tolerance;
  }

  /**
   * Is input vector zero, withing given tolerance
   * @param {number[]} v
   * @param  {number=} tolerance
   * @returns {boolean}
   */
  static isZero(v, tolerance=EPSILON) {
    return !vec2.isNonZero(v, tolerance);
  }

  /**
   * Squared length of input vector
   * @param v
   * @returns {number}
   */
  static lenSq(v) {
    return v[0]*v[0]+v[1]*v[1];
  }

  /**
   * Length of input vector
   * @param v
   * @returns {number}
   */
  static len(v) {
    return Math.sqrt(vec2.lenSq(v));
  }

  /**
   * Unit vector along input vector
   * If input vector is zero length, return [0,0]
   * @param {number[]} v
   * @returns {number[]}
   */
  static unit(v) {
    let len = vec2.len(v);
    if(len !== 0) {
      return vec2.mul(v, 1/vec2.len(v));
    } else {
      return [0,0];
    }
  }

  /**
   * Square distance between input point vectors
   * @param {number[]} va
   * @param {number[]} vb
   * @returns {number}
   */
  static distSq(va, vb) {
    return vec2.lenSq(vec2.sub(va,vb));
  }

  /**
   * Distance between input point vectors
   * @param {number[]} va
   * @param {number[]} vb
   * @returns {number}
   */
  static dist(va, vb) {
    return Math.sqrt(vec2.distSq(va,vb));
  }

  /**
   * Dot product of input vectors
   * @param {number[]} va
   * @param {number[]} vb
   * @returns {number}
   */
  static dot(va, vb) {
    return va[0]*vb[0] + va[1]*vb[1];
  }

  /**
   * Cross product of input vectors
   * @param {number[]} va
   * @param {number[]} vb
   * @returns {number}
   */
  static cross(va, vb) {
    return va[0]*vb[1] - va[1]*vb[0];
  }

  /**
   * Round the input vector
   * @param {number[]} v
   * @returns {number[]}
   */
  static toInt(v) {
    return [Math.round(v[0]), Math.round(v[1])];
  }

  /**
   * Are two input vectors equal, within given tolerance
   * @param {number[]} va
   * @param {number[]} vb
   * @param {number=} tolerance
   * @returns {boolean}
   */
  static equal(va, vb, tolerance=EPSILON) {
    return Math.abs(va[0]-vb[0]) < tolerance &&
      Math.abs(va[1]-vb[1]) < tolerance;
  }

  /**
   * Return the min-x and min-y values for variable number of input point vectors
   * @param {...number[]} points
   * @returns {number[]}
   */
  static low(...points) {
    let xlow = Infinity, ylow = Infinity;
    for(let point of points) {
      xlow = Math.min(point[0], xlow);
      ylow = Math.min(point[1], ylow);
    }
    return [xlow,ylow];
  }

  /**
   * Return the max-x and max-y values for variable number of input point vectors
   * @param {...number[]} points
   * @returns {number[]}
   */
  static high(...points) {
    let xhigh = -Infinity, yhigh = -Infinity;
    for(let point of points) {
      xhigh = Math.max(point[0], xhigh);
      yhigh = Math.max(point[1], yhigh);
    }
    return [xhigh,yhigh];
  }

  /**
   * Concise string representation
   * @param {number[]} v
   * @returns {string}
   */
  static format(v) {
    return '['+v[0].toFixed(2)+','+v[1].toFixed(2)+']';
  }

  /**
   * Direction vector from vfrom to vto
   * @param {number[]} vfrom
   * @param {number[]} vto
   * @returns {number[]}
   */
  static dir(vfrom, vto) {
    return vec2.unit(vec2.sub(vto, vfrom));
  }

  /**
   * Orthogonal vector of input vector
   * @param {number} x
   * @param {number} y
   * @returns {number[]}
   */
  static orthogonal([x,y]) {
    return [y,-x];
  }

}

export default vec2;
