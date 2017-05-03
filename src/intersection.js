
import {EPSILON} from './constants'
import geom from './geom'
import {vec2, isZero, isEqualFloat} from '.'

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
      
    return [taArr,tbArr];
      
    // //
    // // The idea is to transform the circle (by translation and rotation) so
    // // that in the transformed coordinate system the line appears as X-axis.
    // // Then the points of intersection as the roots of the circle, i.e. points
    // // on circle where y=0.
    // //
    // let [x1,y1] = lineA.start;
    // let [x2,y2] = lineA.end;
    //
    // let [align, unalign] = alignToLineTransform(lineA.start, lineA.end);
    //
    // let center = earcB.center;
    // let [txc, tyc] = align(center);
    //
    // let rx = earcB.rx;
    // let ry = earcB.ry;
    //
    // if(ry < tyc) {
    //   return [[],[]]; // There's no intersection
    // }
    //
    // let K = Math.sqrt(r*r - tyc*tyc);
    //
    // let piArr;
    // if(isZero(K)) {
    //   // The line is tangent to circle
    //   piArr = [unalign([txc,0])];
    // } else {
    //   let txi1 = txc + K;
    //   let txi2 = txc - K;
    //   piArr = [
    //     unalign([txi1,0]),
    //     unalign([txi2,0])
    //   ];
    // }
    //
    // let taArr = [], tbArr = [];
    // for(let pi of piArr) {
    //   let ta;
    //   if(x2 === x1) {
    //     ta = (pi[1]-y1)/(y2-y1);
    //   } else {
    //     ta = (pi[0]-x1)/(x2-x1);
    //   }
    //   let tb = geom.EllipseArc.getCircleAngle(center, pi);
    //   if (inRangeExclusive(ta, lineA) && inRangeInclusive(tb, earcB)) {
    //     taArr.push(ta);
    //   }
    //
    //   if (inRangeExclusive(tb, earcB) && inRangeInclusive(ta, lineA)) {
    //     tbArr.push(tb);
    //   }
    // }
    //
    // return [taArr, tbArr];
  }

  static linecubicbez(lineA, qbezB) {
    // Ref:
    // https://github.com/Pomax/bezierjs/blob/gh-pages/lib/utils.js
    // http://www.trans4mind.com/personal_development/mathematics/polynomials/cubicAlgebra.htm
    //
    // The idea is to transform the Cubic Bezier curve (by translation and
    // rotation) so that the line appears as X-axis in the transformed
    // coordinate system. Then the points of intersection are same as the
    // roots of the bezier curve. We find parametric values of these roots.
    // Evaluate the curve at those values to get points of intersection, then
    // find their parametric values on the line.
    //

    let [align, unalign] = alignToLineTransform(lineA.start, lineA.end);
    let tcpoints = qbezB.cpoints.map(align);
    let tqbezB = new geom.CubicBezier(tcpoints);

    let crt = (v) => (v<0) ? -Math.pow(-v,1/3) : Math.pow(v,1/3);

    let qbezParams;

    let pa = tcpoints[0][1],
      pb = tcpoints[1][1],
      pc = tcpoints[2][1],
      pd = tcpoints[3][1],
      d = (-pa + 3*pb - 3*pc + pd),
      a = (3*pa - 6*pb + 3*pc) / d,
      b = (-3*pa + 3*pb) / d,
      c = pa / d,
      p = (3*b - a*a)/3,
      p3 = p/3,
      q = (2*a*a*a - 9*a*b + 27*c)/27,
      q2 = q/2,
      discriminant = q2*q2 + p3*p3*p3,
      tau = 2*Math.PI,
      u1,v1,x1,x2,x3;
    if (discriminant < 0) {
      let mp3 = -p/3,
        mp33 = mp3*mp3*mp3,
        r = Math.sqrt( mp33 ),
        t = -q/(2*r),
        cosphi = t<-1 ? -1 : t>1 ? 1 : t,
        phi = Math.acos(cosphi),
        crtr = crt(r),
        t1 = 2*crtr;
      x1 = t1 * Math.cos(phi/3) - a/3;
      x2 = t1 * Math.cos((phi+tau)/3) - a/3;
      x3 = t1 * Math.cos((phi+2*tau)/3) - a/3;
      qbezParams = [x1, x2, x3];
    } else if(discriminant === 0) {
      u1 = q2 < 0 ? crt(-q2) : -crt(q2);
      x1 = 2*u1-a/3;
      x2 = -u1 - a/3;
      qbezParams = [x1,x2];
    } else {
      let sd = Math.sqrt(discriminant);
      u1 = crt(-q2+sd);
      v1 = crt(q2+sd);
      qbezParams = [u1-v1-a/3];
    }

    let [xs,ys] = lineA.start;
    let [xe,ye] = lineA.end;

    let taArr=[], tbArr=[];

    // We do not record the breaks that are at the end of the interval
    // We have to do this on both curves (a and b) separately.
    // The intersection points whose break parameter is exclusively inside
    // the curve's interval (i.e. not on its end points), then it can be
    // recorded as intersection point, provided that the break parameter of
    // this intersection point on the other curve is in its parameter
    // range inclusively (i.e. it could be on its end points)
    for(let tb of qbezParams) {
      if(inRangeExclusive(tb, qbezB)) {
        let pt = unalign(tqbezB.evaluate(tb));
        let ta;
        if(isZero(ye-ys)) {
          ta = (pt[0]-xs)/(xe-xs);
        } else {
          ta = (pt[1]-ys)/(ye-ys);
        }
        if(inRangeInclusive(ta, lineA)) {
          tbArr.push(tb);
        }
      }
    }
    for(let tb of qbezParams) {
      if(inRangeInclusive(tb, qbezB)) {
        let pt = unalign(tqbezB.evaluate(tb));
        let ta;
        if(isZero(ye-ys)) {
          ta = (pt[0]-xs)/(xe-xs);
        } else {
          ta = (pt[1]-ys)/(ye-ys);
        }
        if(inRangeExclusive(ta, lineA)) {
          taArr.push(ta);
        }
      }
    }

    return [taArr, tbArr];
  }
}

function alignToLineTransform([x1,y1], [x2,y2]) {
  let tx = x1, ty = y1;
  let a = -Math.atan2(y2-y1,x2-x1);
  return [
    (p) => { // align (forward transform)
      let [x,y] = p;
      return [
        (x-tx) * Math.cos(a) - (y-ty) * Math.sin(a),
        (x-tx) * Math.sin(a) + (y-ty) * Math.cos(a)
      ];
    },
    (p) => { // unalign (reverse transform)
      let [x,y] = p;
      return [
        x * Math.cos(a) + y * Math.sin(a) + tx,
        -x * Math.sin(a) + y * Math.cos(a) + ty
      ];
    }
  ]
}
