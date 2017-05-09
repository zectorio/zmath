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

import {EPSILON} from './constants'

/**
 * @typedef {Array.<number>} Point3D - Contains x,y coordinates of 2D point
 */

/**
 * @typedef {Array.<number>} Vector3D - Contains x,y components of 2D vector
 */

export default class vec3 {

  /**
   * Adds input 3d points/vectors
   * @param {...Point3D} varr
   * @returns {Point3D}
   */
  static add(...varr) {
    let answer = [0,0,0];
    for(let v of varr) {
      answer[0] += v[0];
      answer[1] += v[1];
      answer[2] += v[2];
    }
    return answer;
  }

  /**
   * Subtracts vb from va 
   * @param {Point3D} va
   * @param {Point3D} vb
   * @returns {Point3D}
   */
  static sub(va, vb) {
    return [
      va[0] - vb[0],
      va[1] - vb[1],
      va[2] - vb[2]
    ];
  }

  /**
   * Compute Dot product of va and vb 
   * @param {Point3D} va
   * @param {Point3D} vb
   * @returns {number}
   */
  static dot(va, vb) {
    return va[0]*vb[0] + va[1]*vb[1] + va[2]*vb[2];
  }
  
}

