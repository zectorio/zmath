/*

 Copyright (C) 2017 Jayesh Salvi, Blue Math Software Inc.

 This file is part of Zector Math.

 Zector Math is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Zector Math is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with Zector Math.  If not, see <http://www.gnu.org/licenses/>.

 */


import {EPSILON} from './constants';

/**
 * @typedef {Array.<number>} Point2D - Contains x,y coordinates of 2D point
 */

/**
 * @typedef {Array.<number>} Vector2D - Contains x,y components of 2D vector
 */

/**
 * @class
 */
class vec2 {

  /**
   * Add one or many input vectors
   * @param {...Point2D} varr
   * @returns {Point2D}
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
   * @param {Point2D|Vector2D} va
   * @param {Point2D|Vector2D} vb
   * @returns {Vector2D}
   */
  static sub(va, vb) {
    return [ va[0]-vb[0], va[1]-vb[1] ];
  }

  /**
   * Multiply va by constant k
   * @param {Point2D|Vector2D} va
   * @param {number} k
   * @returns {Point2D|Vector2D}
   */
  static mul(va, k) {
    return [ va[0]*k, va[1]*k ];
  }

  /**
   * Is input vector non-zero, within given tolerance
   * @param {Point2D|Vector2D} v
   * @param {number=} tolerance
   * @returns {boolean}
   */
  static isNonZero(v, tolerance=EPSILON) {
    return Math.abs(v[0]) > tolerance || Math.abs(v[1]) > tolerance;
  }

  /**
   * Is input vector zero, withing given tolerance
   * @param {Point2D} v
   * @param  {number=} tolerance
   * @returns {boolean}
   */
  static isZero(v, tolerance=EPSILON) {
    return !vec2.isNonZero(v, tolerance);
  }

  /**
   * Squared length of input vector
   * @param {Vector2D} v
   * @returns {number}
   */
  static lenSq(v) {
    return v[0]*v[0]+v[1]*v[1];
  }

  /**
   * Length of input vector
   * @param {Vector2D} v
   * @returns {number}
   */
  static len(v) {
    return Math.sqrt(vec2.lenSq(v));
  }

  /**
   * Unit vector along input vector
   * If input vector is zero length, return [0,0]
   * @param {Vector2D} v
   * @returns {Vector2D}
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
   * @param {Point2D} va
   * @param {Point2D} vb
   * @returns {number}
   */
  static distSq(va, vb) {
    return vec2.lenSq(vec2.sub(va,vb));
  }

  /**
   * Distance between input point vectors
   * @param {Point2D} va
   * @param {Point2D} vb
   * @returns {number}
   */
  static dist(va, vb) {
    return Math.sqrt(vec2.distSq(va,vb));
  }

  /**
   * Dot product of input vectors
   * @param {Vector2D} va
   * @param {Vector2D} vb
   * @returns {number}
   */
  static dot(va, vb) {
    return va[0]*vb[0] + va[1]*vb[1];
  }

  /**
   * Cross product of input vectors
   * @param {Vector2D} va
   * @param {Vector2D} vb
   * @returns {number}
   */
  static cross(va, vb) {
    return va[0]*vb[1] - va[1]*vb[0];
  }

  /**
   * Round the input vector
   * @param {Vector2D|Point2D} v
   * @returns {Vector2D|Point2D}
   */
  static toInt(v) {
    return [Math.round(v[0]), Math.round(v[1])];
  }

  /**
   * Are two input vectors equal, within given tolerance
   * @param {Point2D|Vector2D} va
   * @param {Point2D|Vector2D} vb
   * @param {number=} tolerance
   * @returns {boolean}
   */
  static equal(va, vb, tolerance=EPSILON) {
    return Math.abs(va[0]-vb[0]) < tolerance &&
      Math.abs(va[1]-vb[1]) < tolerance;
  }

  /**
   * Return the min-x and min-y values for variable number of input point vectors
   * @param {...Point2D} points
   * @returns {Point2D}
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
   * @param {...Point2D} points
   * @returns {Point2D}
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
   * @param {Point2D|Vector2D} v
   * @returns {string}
   */
  static format(v) {
    return '['+v[0].toFixed(2)+','+v[1].toFixed(2)+']';
  }

  /**
   * Direction vector from vfrom to vto
   * @param {Point2D} vfrom
   * @param {Point2D} vto
   * @returns {Vector2D}
   */
  static dir(vfrom, vto) {
    return vec2.unit(vec2.sub(vto, vfrom));
  }

  /**
   * Orthogonal vector of input vector
   * @param {Vector2D} v
   * @returns {Vector2D}
   */
  static orthogonal(v) {
    let [x,y] = v;
    return [y,-x];
  }

}

export default vec2;
