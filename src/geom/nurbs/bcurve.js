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

import {findSpan, getBasisFunction} from './helper'

/**
 * @param {number} degree
 * @param {Array.<Point>} cpoints
 * @param {Array.<number>} knots
 * @param {Array.<number>} weights
 */
export default class BSplineCurve {

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
    console.assert(Array.isArray(cpoints));
    console.assert(Array.isArray(cpoints[0]));

    /**
     * Knot vector
     * @type {Array.<number>}
     */
    this.knots = knots;
    console.assert(Array.isArray(knots));
    
    /*
     The degree p, number of control points n+1, number of knots m+1
     are related by
     m = n + p + 1
     [The NURBS book, P3.1]
     */
    let p = this.degree;
    let m = this.knots.length-1;
    let n = this.cpoints.length-1;
    console.assert(m === n+p+1);

    /**
     * Weights for Rational BSpline Curve.
     * If null, it's non-rational bspline curve.
     * @type {Array.<number>}
     */
    this.weights = weights;

    /**
     * Dimension of control points
     */
    this.dimension = cpoints[0].length;

    if(this.weights) {
      console.assert(this.weights.length === this.cpoints.length);
    }
  }

  /**
   * @returns {boolean}
   */
  isRational() {
    return !!this.weights;
  }

  /**
   * @param {number} t
   * @returns {Point}
   */
  evaluate(t) {

    let p = this.degree;
    let span = this.findSpan(t);
    let N = this.evaluateBasis(span, t);
    let point = new Array(this.dimension);
    for(let i=0; i<this.dimension; i++) { point[i] = 0.0; }

    let denominator;
    let isRational = this.isRational();
    if(isRational) {
      denominator = 0.0;
      for(let i=0; i<N.length; i++) {
        denominator += N[i] * this.weights[span-p+i];
      }
    } else {
      denominator = 1.0;
    }
    for(let i=0; i<p+1; i++) {
      let K;
      if(isRational) {
        K = N[i] * this.weights[span-p+i]/ denominator;
      } else {
        K = N[i]/denominator;
      }
      for(let j=0; j<this.dimension; j++) {
        point[j] += K * this.cpoints[span-p+i][j];
      }
    }
    console.assert(!isNaN(point[0]) && !isNaN(point[1]));
    return point;
  }

  /**
   * 
   * @param {number} span
   * @param {number} t
   * @returns {Array}
   */
  evaluateBasis(span, t) {
    return getBasisFunction(this.degree, this.knots, span, t);
  }

  /**
   * @param {number} t
   * @returns {number}
   */
  findSpan(t) {
    return findSpan(this.degree, this.knots, t);
  }
}
