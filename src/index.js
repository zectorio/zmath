/**
 * @module zmath
 */

import vec2 from './vec2'
import {Transform, Translation, Rotation} from './transform'
import geom from './geom'
import AABB from './aabb'

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

export {
  vec2,
  Transform,
  Translation,
  Rotation,
  AABB,
  geom,
  toDeg, toRad
};
