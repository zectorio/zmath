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

import Curve from './curve'
import vec2 from '../../vec2'
import AABB from '../../aabb'

/**
 * @ignore
 * @param {Point2D[]} cpoints
 */
class Bezier extends Curve {

  constructor(cpoints) {
    super();

    /**
     * Degree of Bezier curve
     * @member {number} Bezier#degree
     */
    this.degree = cpoints.length-1;

    /**
     * Array of control points
     * @member {number[][]} Bezier#cpoints
     */
    this.cpoints = cpoints;
  }

  /**
   * @returns {AABB}
   */
  aabb() {
    return new AABB({
      min : vec2.low(...this.cpoints),
      max : vec2.high(...this.cpoints)
    });
  }
}

export default Bezier;