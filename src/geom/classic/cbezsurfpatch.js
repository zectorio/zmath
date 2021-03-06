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


const EPSILON = 0.001;

/**
 * @ignore
 */
class CubicBezierSurfacePatch {

  /**
   * @param {Array} surfaces
   */
  constructor(surfaces) {
    /**
     * @readonly
     * @type {Array}
     */
    this.surfaces = surfaces;
  }

  containsPoint(point) {
    for(let i=0; i<this.surfaces.length; i++) {
      for(let j=0; j<this.surfaces[i].length; j++) {
        let surface = this.surfaces[i][j];
        if(surface.containsPoint(point)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Subdivide the Surface Grid at a give point
   * If this patch had m*n surfaces before subdivision, then it will have
   * (m+1)*(n+1) surfaces after subdivision
   * @param point
   * @returns {*} null if no split, [row,col] indices in original grid if split
   */
  subdivide(point) {

    let nrows = this.surfaces.length;
    let ncols = this.surfaces[0].length;
    let newgrid = new Array(nrows+1);
    for(let i=0; i<nrows+1; i++) {
      newgrid[i] = new Array(ncols+1);
    }

    let isplit = -1;
    let jsplit = -1;
    let usplit, vsplit;

    for (let i = 0; i < this.surfaces.length; i++) {
      let row = this.surfaces[i];
      for (let j = 0; j < row.length; j++) {
        let surf = row[j];
        let [up, vp] = surf.projectParam(point);
        let uInRange = up > EPSILON && up < 1-EPSILON;
        let vInRange = vp > EPSILON && vp < 1-EPSILON;
        if(uInRange && vInRange) {
          isplit = i;
          jsplit = j;
          usplit = up;
          vsplit = vp;
          break;
        }
      }
    }
    if(isplit < 0 && jsplit < 0) {
      return null; // No split
    }

    for (let i = 0; i < this.surfaces.length; i++) {
      let row = this.surfaces[i];
      for (let j = 0; j < row.length; j++) {
        let surf = row[j];
        if(i === isplit && j === jsplit) {
          let split = surf.splitUV(usplit, vsplit);
          newgrid[i][j] = split[0][0];
          newgrid[i+1][j] = split[1][0];
          newgrid[i][j+1] = split[0][1];
          newgrid[i+1][j+1] = split[1][1];
        } else if(i === isplit && j !== jsplit) {
          let [top,bottom] = surf.splitV(vsplit);
          let iidx = (isplit >= 0 && i > isplit) ? i+1 : i;
          let jidx = (jsplit >= 0 && j > jsplit) ? j+1 : j;
          newgrid[iidx][jidx] = top;
          newgrid[iidx+1][jidx] = bottom;
        } else if(i !== isplit && j === jsplit) {
          let [left,right] = surf.splitU(usplit);
          let iidx = (isplit >= 0 && i > isplit) ? i+1 : i;
          let jidx = (jsplit >= 0 && j > jsplit) ? j+1 : j;
          newgrid[iidx][jidx] = left;
          newgrid[iidx][jidx+1] = right;
        } else {
          let iidx = (isplit >= 0 && i > isplit) ? i+1 : i;
          let jidx = (jsplit >= 0 && j > jsplit) ? j+1 : j;
          newgrid[iidx][jidx] = surf;
        }
      }
    }

    this.surfaces = newgrid;

    return [isplit, jsplit];
  }

  getNumRows() {
    return this.surfaces.length;
  }

  getNumColumns() {
    return this.surfaces[0].length;
  }

  getSurface(row, column) {
    return this.surfaces[row][column];
  }

  * getBezierSurfaces() {
    for(let i=0; i<this.surfaces.length; i++) {
      let row = this.surfaces[i];
      for(let j=0; j<row.length; j++) {
        yield row[j];
      }
    }
  }

  forEachSurface(callback) {
    for(let i=0; i<this.surfaces.length; i++) {
      for(let j=0; j<this.surfaces[i].length; j++) {
        callback(this.surfaces[i][j], i, j);
      }
    }
  }

  clone() {
    let surfaces = new Array(this.surfaces.length);
    for(let i=0; i<this.surfaces.length; i++) {
      surfaces[i] = new Array(this.surfaces[i].length);
      for(let j=0; j<this.surfaces[i].length; j++) {
        surfaces[i][j] = this.surfaces[i][j].clone();
      }
    }
    return new CubicBezierSurfacePatch(surfaces);
  }
}

export default CubicBezierSurfacePatch