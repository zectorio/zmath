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

/**
 * @typedef {Array.<number>} Point - n-dimensional point (typically n=2,3)
 */

/**
 * @typedef {Array.<number>} Vector - n-dimensional vector (typically n=2,3)
 */

import vec2 from './vec2'
import {Transform, Translation, Rotation} from './transform'
import geom from './geom'
import AABB from './aabb'
import {EPSILON} from './constants'
import Intersection from './geom/classic/intersection'
import NDArray from './ndarray'

/**
 * Convert angle to degrees
 * @param {number} angleInRadians
 * @returns {number}
 */
function toDeg(angleInRadians) {
  return 180 * angleInRadians / Math.PI;
}

/**
 * Convert angle to radians
 * @param {number} angleInDegrees
 * @returns {number}
 */
function toRad(angleInDegrees) {
  return Math.PI * angleInDegrees / 180;
}

/**
 * Check if input equals zero within given tolerance
 * @param x
 * @param {number=} tolerance
 * @returns {boolean}
 */
function isZero(x, tolerance=EPSILON) {
  return Math.abs(x) < tolerance;
}

/**
 * Check if two input numbers are equal within given tolerance
 * @param {number} a
 * @param {number} b
 * @param {number=} tolerance
 * @returns {boolean}
 */
function isEqualFloat(a, b, tolerance=EPSILON) {
  return isZero(a-b, tolerance);
}

/**
 * Find cube root of given number. Math.pow return NaN while taking
 * cube root of negative number, because some of the results might
 * be complex numbers. This function only return the real cubeRoot
 * of given number
 * @param {number} x
 * @returns {number}
 */
function cubeRoot(x) {
  return x<0 ? -Math.pow(-x,1/3) : Math.pow(x,1/3);
}

export {
  vec2,
  NDArray,
  Transform,
  Translation,
  Rotation,
  AABB,
  Intersection,
  geom,
  toDeg, toRad, isZero, isEqualFloat, cubeRoot
};
