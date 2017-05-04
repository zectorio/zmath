
import {EPSILON} from './constants'
import geom from './geom'
import {vec2, isZero, isEqualFloat, Transform,Translation,Rotation,cubeRoot} from '.'

const PI = Math.PI;

/**
 *                                ---> cw
 *
 *
 *  (A)     T(1)        S           T(2)           E          T(3)
 *
 *     |---------------------------------------------------------|
 *     0                           PI                           2*PI
 *
 *  (B)     T(1)        E           T(2)           S          T(3)
 *
 *
 *                                <--- ccw
 */

let inRangeInclusiveEllipse = (t, earc) => {
  t = geom.EllipseArc.wrapAngle(t);
  let {start,end,ccw} = earc;
  if(start < end) {
    if(ccw) {
      return t <= start || end <= t; 
    } else {
      return start <= t && t <= end; 
    }
  } else {
    if(ccw) {
      return end <= t && t <= start; 
    } else {
      return t <= end || start <= t; 
    }
  }
};

let inRangeExclusiveEllipse = (t, earc) => {
  if(isEqualFloat(earc.getAngleSpan(), 2*Math.PI)) {
    return true;
  }
  t = geom.EllipseArc.wrapAngle(t);
  let {start,end,ccw} = earc;
  if(start < end) {
    if(ccw) {
      return t < start || end < t;
    } else {
      return start < t && t < end;
    }
  } else {
    if(ccw) {
      return end < t && t < start;
    } else {
      return t < end || start < t;
    }
  }
};

let inRangeInclusive = (t, crv) => {
  if(crv instanceof geom.Line || crv instanceof geom.CubicBezier) {
    return 0<=t && t <=1;
  } else if(crv instanceof geom.EllipseArc) {
    return inRangeInclusiveEllipse(t, crv);
  } else {
    console.assert(false);
  }
};

let inRangeExclusive = (t, crv) => {
  if(crv instanceof geom.Line || crv instanceof geom.CubicBezier) {
    return 0<t && t <1;
  } else if(crv instanceof geom.EllipseArc) {
    return inRangeExclusiveEllipse(t, crv);
  } else {
    console.assert(false);
  }
};

export default class Intersection {

  /**
   * Computes intersection between lineA and lineB and returns list of
   * parameters at which the intersection takes place. If lines do not intersect
   * the parameter array is empty
   * The intersection parameters exclude the end points, hence the parameter
   * values will be 0<t<1. For e.g. if lineA's start point is incident on lineB
   * (not lineB's endpoints), then lineA won't have any intersection parameters,
   * but lineB will have one.
   * @param {Line} lineA
   * @param {Line} lineB
   * @returns {Array.<Array.number>} List of intersection parameters on lineA and lineB
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
      }
    }

    if(inRangeInclusive(tb, lineB)) {
      if(inRangeExclusive(ta, lineA)) {
        taArr.push(ta);
      }
    }

    return [taArr, tbArr];
  }

  /**
   *
   * @param {Line} lineA
   * @param {EllipseArc} earcB
   * @returns {Array.<Array<number>>}
   */
  static lineellipsearc(lineA, earcB) {
    
    let taArr = [];
    let tbArr = [];
    let xlineA = lineA.clone();
    xlineA.start = vec2.sub(xlineA.start, earcB.center);
    xlineA.end = vec2.sub(xlineA.end, earcB.center);
    
    let a = earcB.rx;
    let b = earcB.ry;
    
    let tA0, tB0, tA1, tB1;
    
    if(xlineA.isVertical()) {

      let k = xlineA.start[0]; // line equation is x=k
      if(Math.abs(k) < a) { // Otherwise line is too far from ellipse to intersect
        let iy0 = b*Math.sqrt(1-k*k/a*a);
        let iy1 = -iy0;

        let [xs,ys] = xlineA.start;
        let [xe,ye] = xlineA.end;

        let tA0 = (iy0 - ys)/(ye-ys);
        let tA1 = (iy1 - ys)/(ye-ys);
        taArr = [tA0,tA1];

        let tB0 = earcB.getAngle([k,iy0]);
        let tB1 = earcB.getAngle([k,iy1]);
        tbArr = [tB0,tB1];
      } else if(isEqualFloat(Math.abs(k), a)) { // Line is tangent to the ellipse
        
        let tB;
        // A vertical line can be tangent to the ellipse only at two points
        // because the ellipse is not rotated
        if(k > 0) {
          tB = 0;
        } else {
          tB = Math.PI;
        }
        // evaluate the point on ellipse, it will be in global coordinate system
        // transform it to ellipse's coordinate system, i.e. that of xlineA
        let [ix,iy] = vec2.sub(earcB.evaluate(tB), earcB.center);
        
        let [xs,ys] = xlineA.start;
        let [xe,ye] = xlineA.end;
        let tA = (iy-ys)/(ye-ys);

        taArr.push(tA);
        tbArr.push(tB);
      }
    } else {
      let c = xlineA.getYIntercept();
      let m = xlineA.getLineSlope();
      let c2 = c*c;
      let b2 = b*b;
      let a2 = a*a;
      let m2 = m*m;
      if(c2 < b2+a2*m2) { // Otherwise line is too far from ellipse to intersect

        let A = -2 * a2 * m * c;
        let B = 2 * a * Math.sqrt(a2 * m2 * b2 - b2 * c2 + b2 * b2);
        let C = 2 * (a2 * m2 + b2);

        let ix0 = (A + B) / C;
        let ix1 = (A - B) / C;
        let iy0 = m * ix0 + c;
        let iy1 = m * ix1 + c;

        let [xs,ys] = xlineA.start;
        let [xe,ye] = xlineA.end;

        tA0 = (ix0 - xs) / (xe - xs);
        tA1 = (ix1 - xs) / (xe - xs);

        tB0 = earcB.getAngle([ix0, iy0]);
        tB1 = earcB.getAngle([ix1, iy1]);
        
        taArr = [tA0,tA1];
        tbArr = [tB0,tB1];
      } else if(isEqualFloat(c2, b2+a2*m2)) { // Line is tangent to ellipse
        
        let ix = -a2*m*c/(a2*m2+b2);
        let iy = ix*m+c;
        let [xs,ys] = xlineA.start;
        let [xe,ye] = xlineA.end;
        let tA = (ix-xs)/(xe-xs);
        taArr.push(tA);
        let tB = earcB.getAngle([ix, iy]);
        tbArr.push(tB);
      }
    }
    
    let taArrOut=[];
    let tbArrOut=[];
    
    for(let i=0; i<taArr.length; i++) {
      if (inRangeExclusive(taArr[i], lineA) && inRangeInclusive(tbArr[i], earcB)) {
        taArrOut.push(taArr[i]);
      }
    }
    for(let i=0; i<taArr.length; i++) {
      if (inRangeInclusive(taArr[i], lineA) && inRangeExclusive(tbArr[i], earcB)) {
        tbArrOut.push(tbArr[i]);
      }
    }
      
    return [taArrOut,tbArrOut];
  }

  static linecubicbez(lineA, cbezB) {

    let taArr = [], tbArr = [];

    let theta = -lineA.getInclination();
    let xform = new Rotation(theta).mul(new Translation(vec2.mul(lineA.start,-1)));

    // Control points of the cbez curve when transformed to coordinate system
    // that has the line as its X-axis
    let [p0,p1,p2,p3] = cbezB.cpoints.map(pt => xform.transformPoint(pt));

    // Intersection of cbez with the line is at points where it crosses the
    // line (i.e. X-axis in the transformed coordinate system).
    // So we have to find the roots of the cubic equation of y-coordinates of
    // the cbez curve


    // The math to find roots of cubic polynomial
    // http://www.trans4mind.com/personal_development/mathematics/polynomials/cubicAlgebra.htm

    // Accordingly out equation is
    // t^3 + a * t^2 + b * t + c = 0


    // The cubic bezier curve with controls points p0,p1,p2,p3 can be expanded to
    // (-p0+3p1-3p2+p3) t^3 + (3p0-6p1+3p2) t^2 + (-3p0+3p1) t + p0
    //
    //         d                    a*d               b*d        c*d

    let y0 = p0[1];
    let y1 = p1[1];
    let y2 = p2[1];
    let y3 = p3[1];

    let d = (-y0 + 3*y1 - 3*y2 + y3);
    if (isZero(d)) {
      // That reduces this to quadratic equation from cubic
      // a * t^2 + b * t + c = 0 // - the a,b,c have different meaning from above
      let a = 3*y0 - 6*y1 + 3*y2;
      let b = -3*y0 + 3*y1;
      let c = y0;
      
      let delta = b*b-4*a*c;
      if(delta > 0) {
        tbArr.push((-b+Math.sqrt(delta))/(2*a));
        tbArr.push((-b-Math.sqrt(delta))/(2*a));
      }
      
    } else {
      let a = (3*y0 - 6*y1 + 3*y2) / d;
      let b = (-3*y0 + 3*y1) / d;
      let c = y0 / d;

      let p = (3*b - a*a) / 3;
      let q = (2*a*a*a - 9*a*b + 27*c) / 27;

      let aby3 = a / 3;

      if (isZero(p)) {

        tbArr.push(cubeRoot(-q)-aby3);
        
      } else if (isZero(q)) {
        
        tbArr.push(-aby3);
        if (p < 0) {
          let sqrtmp = Math.sqrt(-p);
          tbArr.push(-aby3 + sqrtmp);
          tbArr.push(-aby3 - sqrtmp);
        }
        
      } else {
        let pby2 = p/2;
        let qby2 = q/2;
        let qby3 = q/3;
        let delta = pby2 * pby2 + qby3 * qby3 * qby3;

        if (delta > 0) {

          // one real root exists
          let sqrtdelta = Math.sqrt(delta);
          let u1 = cubeRoot(-qby2 + sqrtdelta);
          let v1 = cubeRoot(qby2 + sqrtdelta);
          tbArr.push(u1 - v1 - a / 3); // eqn 20

        } else if (delta < 0) {

          // From eq 33 in link above
          let mpby3 = -p / 3;
          let r = Math.sqrt(mpby3 * mpby3 * mpby3);
          let cosphi = -q / (2 * r);
          let phi = Math.acos(cosphi);
          let crtr = cubeRoot(r);
          let A = 2 * crtr;
          tbArr.push(A * Math.cos(phi / 3) - aby3);
          tbArr.push(A * Math.cos((phi + 2 * PI) / 3 - aby3));
          tbArr.push(A * Math.cos((phi + 4 * PI) / 3 - aby3));

        } else { // delta == 0

          let u1 = cubeRoot(-qby2);
          tbArr.push(2*u1-aby3); // eqn 12
          tbArr.push(-u1-aby3); // eqn 15

        }
      }
    }
    
    let [xs,ys] = lineA.start;
    let [xe,ye] = lineA.end;
    for(let tb of tbArr) {
      let [ix,iy] = cbezB.evaluate(tb);
      if(isEqualFloat(ys,ye)) {
        taArr.push((ix-xs)/(xe-xs));
      } else {
        taArr.push((iy-ys)/(ye-ys)); 
      }
    }
    
    // Filter out-of-range parameters
    let taArrOut=[];
    let tbArrOut=[];

    for(let i=0; i<taArr.length; i++) {
      if (inRangeExclusive(taArr[i], lineA) && inRangeInclusive(tbArr[i], cbezB)) {
        taArrOut.push(taArr[i]);
      }
    }
    for(let i=0; i<taArr.length; i++) {
      if (inRangeInclusive(taArr[i], lineA) && inRangeExclusive(tbArr[i], cbezB)) {
        tbArrOut.push(tbArr[i]);
      }
    }
    return [taArrOut,tbArrOut];
  }
}

