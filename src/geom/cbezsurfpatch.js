
const EPSILON = 0.001;

export default class CubicBezierSurfacePatch {

  constructor(surfgrid) {
    this.surfaces = surfgrid;
  }

  /**
   * Subdivide the Surface Grid at a give point
   * If this patch had m*n surfaces before subdivision, then it will have
   * (m+1)*(n+1) surfaces after subdivision
   * @param point
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
      return; // No split
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
    for (let i = 0; i < this.surfaces.length; i++) {
      let row = this.surfaces[i];
      for (let j = 0; j < row.length; j++) {
        yield row[j];
      }
    }
  }
}