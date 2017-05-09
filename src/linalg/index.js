 /*

 Copyright (C) 2017 Jayesh Salvi, Blue Math Software Inc.

 This file is part of Zector Math.

 Zector Math is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Zector Math is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with Zector Math. If not, see <http://www.gnu.org/licenses/>.

*/

const {EPSILON} = require('../constants');

/**
* LU Decompose
* @param {NDArray} A Input/Output square matrix
* @param {Array.<number>} indx
* @constructor
*/
function LUDecompose(A, indx) {

  if(A.shape.length !== 2 || A.shape[0] !== A.shape[1]) {
    throw new Error('Not a square 2x2 Matrix');
  }

  let N = A.shape[0];
  let vv = new Float32Array(N);
  let d = 1;
  let big, temp;
  let i,j,k;
  for(i=0; i<N; i++) {
    big = 0.0;
    for(j=0; j<N; j++) {
      let temp = Math.abs(A.get([i,j]));
      if(temp > big) {
        big = temp;
      }
    }
    if(big === 0.0) {
      throw new Error('Matrix is singular');
    }
    vv[i] = 1.0/big;
  }
  for(k=0; k<N; k++) {
    big = 0.0;
    let imax;
    for(i=k; i<N; i++) {
      temp = vv[i] * Math.abs(A.get([i,k]));
      if(temp > big) {
        big = temp;
        imax = i;
      }
    }
    if(k !== imax) {
      for(j=0; j<N; j++) {
        temp = A.get([imax,j]);
        A.set([imax,j], A.get([k,j]));
        A.set([k,j], temp);
      }
      d = -d;
      vv[imax] = vv[k];
    }
    indx[k] = imax;
   
    if(A.get([k,k]) === 0.0) { // TODO : Can this be handled better?
      A.set([k,k], EPSILON);
    }
   
    for(i=k+1; i<N; i++) {
      A.set([i,k], A.get([i,k])/A.get([k,k]));
      temp = A.get([i,k]);
      for(j=k+1; j<N; j++) {
        A.set([i,j], A.get([i,j]) - temp*A.get([k,j]));
      }
    }
  }
}

export {
  LUDecompose
}
