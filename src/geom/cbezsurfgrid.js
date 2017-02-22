
const EPSILON = 0.001;

export default class CubicBezierSurfaceGrid {

  constructor(surfgrid) {
    this.grid = surfgrid;
  }

  /**
   * Subdivide the Surface Grid at a give point
   * If the grid had m*n surfaces before subdivision, then it will have
   * (m+1)*(n+1) surfaces after subdivision
   * @param point
   */
  subdivide(point) {

    let nrows = this.grid.length;
    let ncols = this.grid[0].length;
    let newgrid = new Array(nrows+1);
    for(let i=0; i<nrows+1; i++) {
      newgrid[i] = new Array(ncols+1);
    }

    let isplit = -1;
    let jsplit = -1;

    for (let i = 0; i < this.grid.length; i++) {
      let row = this.grid[i];
      jsplit = -1;
      for (let j = 0; j < row.length; j++) {
        let surf = row[j];
        let [up, vp] = surf.projectParam(point);
        let uInRange = up > EPSILON && up < 1-EPSILON;
        let vInRange = vp > EPSILON && vp < 1-EPSILON;
        if(uInRange && vInRange) {
          console.log('splitUV',i,j,up,vp);
          let split = surf.splitUV(up, vp);
          newgrid[i][j] = split[0][0];
          newgrid[i+1][j] = split[1][0];
          newgrid[i][j+1] = split[0][1];
          newgrid[i+1][j+1] = split[1][1];
          isplit = i;
          jsplit = j;
        } else if(uInRange && !vInRange) {
          console.log('splitU',i,j,up);
          let [left,right] = surf.splitU(up);
          let iidx = (isplit >= 0 && i > isplit) ? i+1 : i;
          let jidx = (jsplit >= 0 && j > jsplit) ? j+1 : j;
          newgrid[iidx][jidx] = left;
          newgrid[iidx][jidx+1] = right;
          jsplit = j;
        } else if(!uInRange && vInRange) {
          console.log('splitV',i,j,vp);
          let [top,bottom] = surf.splitV(vp);
          let iidx = (isplit >= 0 && i > isplit) ? i+1 : i;
          let jidx = (jsplit >= 0 && j > jsplit) ? j+1 : j;
          newgrid[iidx][jidx] = top;
          newgrid[iidx+1][jidx] = bottom;
          isplit = i;
        } else {
          // Point is outside this surface. This surface won't split
          let iidx = (isplit >= 0 && i > isplit) ? i+1 : i;
          let jidx = (jsplit >= 0 && j > jsplit) ? j+1 : j;
          newgrid[iidx][jidx] = surf;
        }

      }
    }

    this.grid = newgrid;
  }

  * getBezierSurfaces() {
    for (let i = 0; i < this.grid.length; i++) {
      let row = this.grid[i];
      for (let j = 0; j < row.length; j++) {
        yield row[j];
      }
    }
  }
}