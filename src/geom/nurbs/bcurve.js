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

export default class BSplineCurve {

  /**
   *
   * @param {number} degree
   * @param {Array.<Point>} cpoints
   * @param {Array.<number>} knots
   * @param {Array.<number>} weights
   */
  constructor(degree, cpoints, knots, weights) {

    /**
     * Degree of Curve
     * @type {number}
     */
    this.degree = degree;

    /**
     * Control points
     * @type {Array.<Point>}
     */
    this.cpoints = cpoints;

    /**
     * Knot vector
     * @type {Array.<number>}
     */
    this.knots = knots;

    console.assert(this.knots.length === this.cpoints.length+degree+1);

    /**
     * Weights for Rational BSpline Curve.
     * If null, it's non-rational bspline curve.
     * @type {Array.<number>}
     */
    this.weights = weights;

    if(this.weights) {
      console.assert(this.weights.length === this.cpoints.length);
    }
  }

  /**
   * @returns {boolean}
   */
  isRational() {
    return this.weights !== null;
  }

  /**
   * @param {number} t
   * @returns {Point}
   */
  evaluate(t) {
    
  }
}
