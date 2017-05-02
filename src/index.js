/**
 * @module zmath
 */

import vec2 from './vec2'
import {Transform, Translation, Rotation} from './transform'
import geom from './geom'
import AABB from './aabb'
import {EPSILON} from './constants'
import Intersection from './intersection'

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

export {
  vec2,
  Transform,
  Translation,
  Rotation,
  AABB,
  Intersection,
  geom,
  toDeg, toRad, isZero, isEqualFloat
};
