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


import vec2 from './vec2'

/**
 * @param {Object} options
 * @param {Object.number[]} options.min
 * @param {Object.number[]} options.max
 */
class AABB {

  constructor({min,max}) {
    this.min = min || [Infinity, Infinity];
    this.max = max || [-Infinity, -Infinity];
  }

  /**
   * Transform AABB
   * @param {Transform} xform
   */
  transform(xform) {
    this.min = xform.transformPoint(this.min);
    this.max = xform.transformPoint(this.max);
  }

  /**
   * Does this AABB overlap with other AABB
   * @param {AABB} other
   * @returns {boolean}
   */
  overlaps(other) {
    let aabb1 = this;
    let aabb2 = other;
    let half1 = vec2.mul(vec2.sub(aabb1.max, aabb1.min), 0.5);
    let half2 = vec2.mul(vec2.sub(aabb2.max, aabb2.min), 0.5);
    let center1 = vec2.add(aabb1.min, half1);
    let center2 = vec2.add(aabb2.min, half2);
    let dist = vec2.sub(center1, center2).map(Math.abs);
    let separation = vec2.add(half1, half2);
    return dist[0] <= separation[0] && dist[1] <= separation[1];
  }

  /**
   * Width of this AABB (spread along X-axis)
   * @returns {number}
   */
  width() {
    return this.max[0] - this.min[0];
  }

  /**
   * Height of this AABB (spread along Y-axis)
   * @returns {number}
   */
  height() {
    return this.max[1] - this.min[1];
  }

  /**
   * Diagonal size of this AABB
   * @returns {number}
   */
  size() {
    return vec2.dist(this.min, this.max);
  }

  /**
   * Center of this AABB
   * @returns {number[]}
   */
  center() {
    return vec2.mul(vec2.add(this.min, this.max), 0.5);
  }

  /**
   * Merge this AABB with another. This AABB is modified to become the merged
   * AABB.
   * @param {AABB} other
   */
  merge(other) {
    this.min = vec2.low(this.min, other.min);
    this.max = vec2.high(this.max, other.max);
  }

  /**
   * String representation
   * @returns {string}
   */
  toString() {
    let s = 'Center '+vec2.format(this.center());
    s += ' [min:'+vec2.format(this.min)+' -> max:'+vec2.format(this.max)+']';
    return s;
  }

  /**
   * Markup string in
   * {@link https://www.w3.org/TR/SVG/shapes.html#RectElement SVG Rect} element format
   * @returns {string}
   */
  toSVGRect() {
    return `<rect x="${this.min[0]}" y="${this.min[1]}" `+
      `width="${this.width()}" height="${this.height()}" `+
      `style="fill:none;stroke:#888"></rect>`;
  }
  
  toCanvasPathDef() {
    return {
      type : 'rect',
      x : this.min[0],
      y : this.min[1],
      w : this.max[0]-this.min[0],
      h : this.max[1]-this.min[1]
    };
  }
}

export default AABB;