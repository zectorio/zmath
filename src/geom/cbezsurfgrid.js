
export default class CubicBezierSurfaceGrid {

  constructor(surfgrid) {
    this.surfgrid = surfgrid;
  }

  /**
   * Subdivide the Surface Grid at a give point
   * If the grid had m*n surfaces before subdivision, then it will have
   * (m+1)*(n+1) surfaces after subdivision
   * @param point
   */
  subdivide(point) {

    let iidx = 0;
    let jidx = 0;
    let surf = this.surfgrid[iidx][jidx]; // TODO temporary


    for (let i = 0; i < this.surfgrid.length; i++) {
      let row = this.surfgrid[i];
      for (let j = 0; j < row.length; j++) {
        let surf = row[j];
        let [up, vp] = surf.projectParam(point);
        let uInRange = up > 0 && up < 1;
        let vInRange = vp > 0 && vp < 1;
        if(uInRange && vInRange) {
          surf.splitUV(up, vp);
        } else if(uInRange && !vInRange) {
          surf.splitU(up);
        } else if(!uInRange && vInRange) {
          surf.splitV(vp);
        } else {
          // Point is outside this surface. This surface won't split
        }

      }
    }
  }

  * getBezierSurfaces() {
    for (let i = 0; i < this.surfgrid.length; i++) {
      let row = this.surfgrid[i];
      for (let j = 0; j < row.length; j++) {
        yield row[j];
      }
    }
  }
}