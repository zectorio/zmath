
import {EPSILON} from './constants';

const vec2 = {
  add : function (...varr) {
    let answer = [0,0];
    for(let v of varr) {
      answer[0] += v[0];
      answer[1] += v[1];
    }
    return answer;
  },

  sub : function (va, vb) {
    return [ va[0]-vb[0], va[1]-vb[1] ];
  },

  mul : function (va, k) {
    return [ va[0]*k, va[1]*k ];
  },

  isNonZero : function (v, tolerance=EPSILON) {
    return Math.abs(v[0]) > tolerance || Math.abs(v[1]) > tolerance;
  },

  isZero : function(v, tolerance=EPSILON) {
    return !vec2.isNonZero(v, tolerance);
  },

  lenSq : function (v) {
    return v[0]*v[0]+v[1]*v[1];
  },

  len : function (v) {
    return Math.sqrt(vec2.lenSq(v));
  },

  unit : function (v) {
    let len = vec2.len(v);
    if(len !== 0) {
      return vec2.mul(v, 1/vec2.len(v));
    } else {
      return [0,0];
    }
  },

  distSq : function (va, vb) {
    return vec2.lenSq(vec2.sub(va,vb));
  },

  dist : function (va, vb) {
    return Math.sqrt(vec2.distSq(va,vb));
  },

  dot : function (va, vb) {
    return va[0]*vb[0] + va[1]*vb[1];
  },

  cross : function (va, vb) {
    return va[0]*vb[1] - va[1]*vb[0];
  },

  toInt : function (v) {
    return [Math.round(v[0]), Math.round(v[1])];
  },

  equal : function (va, vb, tolerance=EPSILON) {
    return Math.abs(va[0]-vb[0]) < tolerance &&
      Math.abs(va[1]-vb[1]) < tolerance;
  },

  low : function(...points) {
    let xlow = Infinity, ylow = Infinity;
    for(let point of points) {
      xlow = Math.min(point[0], xlow);
      ylow = Math.min(point[1], ylow);
    }
    return [xlow,ylow];
  },

  high : function(...points) {
    let xhigh = -Infinity, yhigh = -Infinity;
    for(let point of points) {
      xhigh = Math.max(point[0], xhigh);
      yhigh = Math.max(point[1], yhigh);
    }
    return [xhigh,yhigh];
  },

  format : function(v) {
    return '['+v[0].toFixed(2)+','+v[1].toFixed(2)+']';
  },

  dir : function(vfrom, vto) {
    return vec2.unit(vec2.sub(vto, vfrom));
  },

  orthogonal : function ([x,y]) {
    return [y,-x];
  }

};

export {vec2};
