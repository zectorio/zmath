
import CubicBezierSurface from './cbezsurf'

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