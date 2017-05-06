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

import {isEqualFloat} from '../..'

/**
 * @ignore
 * Compute all n'th degree bernstein polynomials at given parameter value
 * @param {number} n Degree
 * @param {number} u Parameter value
 * @returns {number[]}
 */
function bernstein(n, u) {
  let B = new Array(n+1);
  B[0] = 1.0;
  let u1 = 1.0-u;
  for(let j=1; j<=n; j++) {
    let saved = 0.0;
    for(let k=0; k<j; k++) {
      let temp = B[k];
      B[k] = saved + u1*temp;
      saved = u*temp;
    }
    B[j] = saved;
  }
  return B;
}

/**
 * @ignore
 * Find the index of the knot span in which `u` lies
 * @param {number} p Degree
 * @param {Array.<number>} U Knot vector
 * @param {number} u Parameter
 * @returns {number}
 */
function findSpan(p, U, u) {
  let m = U.length-1;
  let n = m-p-1;
  if(isEqualFloat(u, U[n+1])) {
    return n;
  }
  let low = p;
  let high = n+1;
  let mid = Math.floor((low+high)/2);
  while(u < U[mid] || u >= U[mid+1]) {
    if(u < U[mid]) {
      high = mid;
    } else {
      low = mid;
    }
    mid = Math.floor((low+high)/2);
  }
  return mid;
}

/**
 * @ignore
 * Evaluate basis function values 
 * @param {number} p Degree
 * @param {Array.<number>} U Knot vector
 * @param {number} i Knot span index
 * @param {number} u Parameter
 * @returns {Array} Basis function values at i,u
 */
function getBasisFunction(p, U, i, u) {
  let N = new Array(p+1);
  N[0] = 1.0;
  let left = new Array(p+1);
  let right = new Array(p+1);
  for(let j=1; j<=p; j++) {
    left[j] = u-U[i+1-j];
    right[j] = U[i+j]-u;
    let saved = 0.0;
    for(let r=0; r<j; r++) {
      let temp = N[r]/(right[r+1]+left[j-r]);
      N[r] = saved+right[r+1]*temp;
      saved = left[j-r]*temp;
    }
    N[j] = saved;
  }
  return N;
}

export {
  bernstein,
  findSpan,
  getBasisFunction
}