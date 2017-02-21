
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


    for (let i = 0; i < this.grid.length; i++) {
      let row = this.grid[i];
      for (let j = 0; j < row.length; j++) {
        let surf = row[j];
        let [up, vp] = surf.projectParam(point);
        let uInRange = up > 0 && up < 1;
        let vInRange = vp > 0 && vp < 1;
        if(uInRange && vInRange) {
          let split = surf.splitUV(up, vp);
          newgrid[i][j] = split[0][0];
          newgrid[i+1][j] = split[1][0];
          newgrid[i][j+1] = split[0][1];
          newgrid[i+1][j+1] = split[1][1];
        } else if(uInRange && !vInRange) {
          surf.splitU(up);
        } else if(!uInRange && vInRange) {
          surf.splitV(vp);
        } else {
          // Point is outside this surface. This surface won't split
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