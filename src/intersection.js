
import {EPSILON} from './constants'
import geom from './geom'
import {isEqualFloat} from '.'

let inRangeInclusive = (t, crv) => {
  if(crv instanceof geom.Line || crv instanceof geom.CubicBezier) {
    return 0<=t && t <=1;
  } else if(crv instanceof geom.EllipseArc) {
    return (crv.ccw && (t <= crv.start || t >= crv.end)) ||
      (!crv.ccw && (t >= crv.start && t <= crv.end));
  } else {
    console.assert(false);
  }
};

let inRangeExclusive = (t, crv) => {
  if(crv instanceof geom.Line || crv instanceof geom.CubicBezier) {
    return 0<t && t <1;
  } else if(crv instanceof geom.EllipseArc) {
    return (crv.ccw && (t < crv.start || t > crv.end)) ||
      (!crv.ccw && (t > crv.start && t < crv.end));
  } else {
    console.assert(false);
  }
};

export default class Intersection {

  /**
   * @param {Line} lineA
   * @param {Line} lineB
   * @returns {number[]}
   */
  static lineline(lineA, lineB) {

    let [x0, y0] = lineA.start;
    let [x1, y1] = lineA.end;
    let [x2, y2] = lineB.start;
    let [x3, y3] = lineB.end;

    let ta, tb, xi, yi;

    if(x1 === x0 && x2 === x3) {
      // Both lines are parallel to Y axis, hence no intersection
      return [[],[]];
    } else if(y1 === y0 && y2 === y3) {
      // Both lines are parallel to X axis, hence no intersection
      return [[],[]];
    } else if(x1 === x0 && y2 === y3) {
      // First line is parallel to Y axis, and second is parallel to X axis
      xi = x0;
      yi = y2;
      ta = (yi-y0)/(y1-y0);
      tb = (xi-x2)/(x3-x2);
    } else if(x2 === x3 && y0 === y1) {
      // Second line is parallel to Y axis, and first is parallel to X axis
      xi = x2;
      yi = y0;
      ta = (xi-x0)/(x1-x0);
      tb = (yi-y2)/(y3-y2);
    } else if(isEqualFloat(x1, x0)) {
      // First line is parallel to Y axis

      let mb = (y3-y2)/(x3-x2);
      let cb = (x3*y2 - y3*x2)/(x3-x2);

      xi = x0;
      yi = mb * xi + cb;
      ta = (yi-y0)/(y1-y0);
      tb = (xi-x2)/(x3-x2);

    } else if(isEqualFloat(x2, x3)) {
      // Second line is parallel to Y axis

      let ma = (y1-y0)/(x1-x0);
      let ca = (x1*y0 - y1*x0)/(x1-x0);

      xi = x2;
      yi = ma * xi + ca;
      ta = (xi-x0)/(x1-x0);
      tb = (yi-y2)/(y3-y2);

    } else if(isEqualFloat(y1, y0)) {
      // First line is parallel to X axis

      let mb = (y3-y2)/(x3-x2);
      let cb = (x3*y2 - y3*x2)/(x3-x2);

      yi = y0;
      xi = (yi-cb)/mb;
      ta = (xi-x0)/(x1-x0);
      tb = (yi-y2)/(y3-y2);

    } else if(isEqualFloat(y2, y3)) {
      // Second line is parallel to X axis

      let ma = (y1-y0)/(x1-x0);
      let ca = (x1*y0 - y1*x0)/(x1-x0);

      yi = y2;
      xi = (yi-ca)/ma;
      ta = (yi-y0)/(y1-y0);
      tb = (xi-x2)/(x3-x2);

    } else {

      let ma = (y1-y0)/(x1-x0);
      let ca = (x1*y0 - y1*x0)/(x1-x0);

      let mb = (y3-y2)/(x3-x2);
      let cb = (x3*y2 - y3*x2)/(x3-x2);

      if(Math.abs(ma-mb) < EPSILON) { return [[],[]]; } // Lines are parallel

      xi = (cb-ca)/(ma-mb);
      yi = ma * xi + ca;

      ta = (yi-y0)/(y1-y0);
      tb = (yi-y2)/(y3-y2);
    }

    console.assert(!isNaN(xi) && !isNaN(yi));
    console.assert(!isNaN(ta) && !isNaN(tb));

    let tbArr = [], taArr = [];
    if(inRangeExclusive(tb, lineB)) {
      if(inRangeInclusive(ta, lineA)) {
        tbArr.push(tb);
      } else {
        tbArr.push(null);
      }
    } else {
      tbArr.push(null);
    }

    if(inRangeInclusive(tb, lineB)) {
      if(inRangeExclusive(ta, lineA)) {
        taArr.push(ta);
      } else {
        taArr.push(null);
      }
    } else {
      taArr.push(null);
    }

    return [taArr, tbArr];
  }
}