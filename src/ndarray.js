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

/**
 * @param {Array.<number>} shape
 */
export default class NDArray {

  constructor(shape) {
    this.shape = shape;
    if(Array.isArray(shape)) {
      let nitems = 1;
      for(let dimsize of shape) {
        nitems *= dimsize;
      }
      this.data = new Float32Array(nitems);
    } else if (Number.isInteger(shape)) {
      this.data = new Float32Array(shape);
    } else {
      this.data = new Float32Array(0);
    }
  }

  fill(data) {
    let D = data;
    if(Array.isArray(D)) {
      
    } else {
      
    }
    for(let i=0; i<data.length; i++) {
      let item = data[i];

    }
  }
  
  size() {
    return this.data.length;
  }
  
  _getAddress(indices) {
    let addr = 0;
    for(let i=0; i<this.shape.length; i++) {
      if(i < this.shape.length-1) {
        addr += this.shape[i+1] * indices[i];
      } else {
        addr += indices[i];
      }
    }
    return addr;
  }

  /**
   * Get value at given indices 
   * @param {Array.<number>} indices
   * @returns {number}
   */
  get(indices) {
    let addr = this._getAddress(indices);
    return this.data[addr];
  }

  /**
   * Set value at given indices
   * @param {Array.<number>} indices
   * @param {number} value
   */
  set(indices, value) {
    let addr = this._getAddress(indices);
    this.data[addr] = value;
  }
}