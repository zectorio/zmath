module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.geom = exports.AABB = exports.Rotation = exports.Translation = exports.Transform = exports.vec2 = undefined;

	var _vec = __webpack_require__(1);

	var _vec2 = _interopRequireDefault(_vec);

	var _transform = __webpack_require__(3);

	var _transform2 = _interopRequireDefault(_transform);

	var _geom = __webpack_require__(4);

	var _geom2 = _interopRequireDefault(_geom);

	var _aabb = __webpack_require__(7);

	var _aabb2 = _interopRequireDefault(_aabb);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.vec2 = _vec2.default;
	exports.Transform = _transform2.default;
	exports.Translation = _transform.Translation;
	exports.Rotation = _transform.Rotation;
	exports.AABB = _aabb2.default;
	exports.geom = _geom2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _constants = __webpack_require__(2);

	const vec2 = {
	  add: function (...varr) {
	    let answer = [0, 0];
	    for (let v of varr) {
	      answer[0] += v[0];
	      answer[1] += v[1];
	    }
	    return answer;
	  },

	  sub: function (va, vb) {
	    return [va[0] - vb[0], va[1] - vb[1]];
	  },

	  mul: function (va, k) {
	    return [va[0] * k, va[1] * k];
	  },

	  isNonZero: function (v, tolerance = _constants.EPSILON) {
	    return Math.abs(v[0]) > tolerance || Math.abs(v[1]) > tolerance;
	  },

	  isZero: function (v, tolerance = _constants.EPSILON) {
	    return !vec2.isNonZero(v, tolerance);
	  },

	  lenSq: function (v) {
	    return v[0] * v[0] + v[1] * v[1];
	  },

	  len: function (v) {
	    return Math.sqrt(vec2.lenSq(v));
	  },

	  unit: function (v) {
	    let len = vec2.len(v);
	    if (len !== 0) {
	      return vec2.mul(v, 1 / vec2.len(v));
	    } else {
	      return [0, 0];
	    }
	  },

	  distSq: function (va, vb) {
	    return vec2.lenSq(vec2.sub(va, vb));
	  },

	  dist: function (va, vb) {
	    return Math.sqrt(vec2.distSq(va, vb));
	  },

	  dot: function (va, vb) {
	    return va[0] * vb[0] + va[1] * vb[1];
	  },

	  cross: function (va, vb) {
	    return va[0] * vb[1] - va[1] * vb[0];
	  },

	  toInt: function (v) {
	    return [Math.round(v[0]), Math.round(v[1])];
	  },

	  equal: function (va, vb, tolerance = _constants.EPSILON) {
	    return Math.abs(va[0] - vb[0]) < tolerance && Math.abs(va[1] - vb[1]) < tolerance;
	  },

	  low: function (...points) {
	    let xlow = Infinity,
	        ylow = Infinity;
	    for (let point of points) {
	      xlow = Math.min(point[0], xlow);
	      ylow = Math.min(point[1], ylow);
	    }
	    return [xlow, ylow];
	  },

	  high: function (...points) {
	    let xhigh = -Infinity,
	        yhigh = -Infinity;
	    for (let point of points) {
	      xhigh = Math.max(point[0], xhigh);
	      yhigh = Math.max(point[1], yhigh);
	    }
	    return [xhigh, yhigh];
	  },

	  format: function (v) {
	    return '[' + v[0].toFixed(2) + ',' + v[1].toFixed(2) + ']';
	  },

	  dir: function (vfrom, vto) {
	    return vec2.unit(vec2.sub(vto, vfrom));
	  },

	  orthogonal: function ([x, y]) {
	    return [y, -x];
	  }

	};

	exports.default = vec2;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	const EPSILON = 1e-6;

	exports.EPSILON = EPSILON;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	class Transform {
	  constructor(array) {
	    if (array) {
	      this.fromArray(array);
	    } else {
	      // Identity transform
	      this.a = 1;
	      this.b = 0;
	      this.c = 0;
	      this.d = 1;
	      this.e = 0;
	      this.f = 0;
	    }
	    this._cachedInverse = null;
	  }

	  isIdentity() {
	    return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.e === 1 && this.f === 0;
	  }

	  /**
	   * @param {number[]|number} coord|dx
	   * @param number dy
	   * @returns {Transform}
	   */
	  translate() {
	    if (Array.isArray(arguments[0])) {
	      this.e += arguments[0][0];
	      this.f += arguments[0][1];
	    } else {
	      this.e += arguments[0];
	      this.f += arguments[1];
	    }
	    this._cachedInverse = null;
	    return this;
	  }

	  rotate(angle) {
	    let c = Math.cos(angle);
	    let s = Math.sin(angle);
	    this.a = c;
	    this.b = s;
	    this.c = -s;
	    this.d = c;
	    this._cachedInverse = null;
	    return this;
	  }

	  rotateDeg(angle) {
	    return this.rotate(angle * Math.PI / 180);
	  }

	  static rotateAround(angle, point) {
	    // Ref: http://www.euclideanspace.com/maths/geometry/affine/aroundPoint/matrix2d/
	    let pre = new Transform().translate(...point);
	    let rotation = new Transform().rotate(angle);
	    let post = new Transform().translate(-point[0], -point[1]);
	    return pre.mul(rotation).mul(post);
	  }

	  static scaleAround([sx, sy], point) {
	    let pre = new Transform().translate(...point);
	    let scale = new Transform().scale(sx, sy);
	    let post = new Transform().translate(-point[0], -point[1]);
	    return pre.mul(scale).mul(post);
	  }

	  scale(sx, sy) {
	    this.a = sx;
	    this.d = sy;
	    this._cachedInverse = null;
	    return this;
	  }

	  getScale() {
	    return [this.a, this.d];
	  }

	  getTranslation() {
	    return [this.e, this.f];
	  }

	  toArray() {
	    return [this.a, this.b, this.c, this.d, this.e, this.f];
	  }

	  toAttributeString(precision = 2) {
	    return `matrix(${this.toArray().map(x => x.toFixed(precision)).join(',')})`;
	  }

	  fromArray([a, b, c, d, e, f]) {
	    this.a = a;
	    this.b = b;
	    this.c = c;
	    this.d = d;
	    this.e = e;
	    this.f = f;
	    this._cachedInverse = null;
	  }

	  /**
	   * The transformation matrix is
	   *     -           -
	   *     |  a  c  e  |
	   * M = |  b  d  f  |
	   *     |  0  0  1  |
	   *     -           -
	   * Det(M) = ad - bc
	   *              -           - T
	   *              |  A  C  E  |
	   * Inverse(M) = |  B  D  F  |   * (1/Det(M))
	   *              |  G  H  I  |
	   *              -           -
	   * A = d
	   * B = -c
	   * G = cf-de
	   * C = -b
	   * D = a
	   * H = be-af
	   * E = 0
	   * F = 0
	   * I = ad-bc
	   * =>
	   *              -                 -
	   *              |   d  -c  cf-de  |
	   * Inverse(M) = |  -b   a  be-af  |  * (1/Det(M))
	   *              |   0   0  ad-bc  |
	   *              -                 -
	   * =>
	   *              -              -
	   *              |  ai  ci  ei  |
	   * Inverse(M) = |  bi  di  fi  |
	   *              |  0   0   1   |
	   *              -              -
	   */
	  inverse() {
	    if (!this._cachedInverse) {
	      let { a, b, c, d, e, f } = this;
	      let det = a * d - b * c;
	      let ai = d / det;
	      let bi = -b / det;
	      let ci = -c / det;
	      let di = a / det;
	      let ei = (c * f - d * e) / det;
	      let fi = (b * e - a * f) / det;
	      this._cachedInverse = new Transform([ai, bi, ci, di, ei, fi]);
	    }
	    return this._cachedInverse;
	  }

	  /**
	   *      -              -
	   *      |  a1  c1  e1  |
	   * m1 = |  b1  d1  f1  |
	   *      |  0   0   1   |
	   *      -              -
	   *      -              -
	   *      |  a2  c2  e2  |
	   * m2 = |  b2  d2  f2  |
	   *      |  0   0   1   |
	   *      -              -
	   *
	   *         -                                          -
	   *         | a1*a2+c1*b2  a1*c2+c1*d2  a1*e2+c1*f2+e1 |
	   * m1*m2 = | b1*a2+d1*b2  b1*c2+d1*d2  b1*e2+d1*f2+f1 |
	   *         | 0            0            1              |
	   *         -                                          -
	   *
	   */
	  mul(other) {
	    let { a: a1, b: b1, c: c1, d: d1, e: e1, f: f1 } = this;
	    let { a: a2, b: b2, c: c2, d: d2, e: e2, f: f2 } = other;

	    return new Transform([a1 * a2 + c1 * b2, b1 * a2 + d1 * b2, a1 * c2 + c1 * d2, b1 * c2 + d1 * d2, a1 * e2 + c1 * f2 + e1, b1 * e2 + d1 * f2 + f1]);
	  }

	  transformPoint([x, y]) {
	    let { a, b, c, d, e, f } = this;
	    return [a * x + c * y + e, b * x + d * y + f];
	  }

	  clone() {
	    return new Transform(this.toArray());
	  }

	  generateMemento() {
	    return this.toArray();
	  }

	  toString() {
	    return `a:${this.a},b:${this.b},c:${this.c},` + `d:${this.d},e:${this.e},f:${this.f}`;
	  }
	}

	exports.default = Transform;
	Transform.revive = function (m) {
	  return new Transform(m);
	};

	Transform.IDENTITY = new Transform();

	class Translation extends Transform {
	  constructor(arg0, arg1) {
	    let arr;
	    if (Array.isArray(arg0)) {
	      arr = [1, 0, 0, 1, arg0[0], arg0[1]];
	    } else {
	      arr = [1, 0, 0, 1, arg0, arg1];
	    }
	    super(arr);
	  }
	}

	exports.Translation = Translation;
	class Rotation extends Transform {
	  constructor(angle) {
	    let cos = Math.cos(angle);
	    let sin = Math.sin(angle);
	    super([cos, sin, -sin, cos, 0, 0]);
	  }
	}
	exports.Rotation = Rotation;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _curve = __webpack_require__(5);

	var _curve2 = _interopRequireDefault(_curve);

	var _line = __webpack_require__(6);

	var _line2 = _interopRequireDefault(_line);

	var _bezier = __webpack_require__(8);

	var _bezier2 = _interopRequireDefault(_bezier);

	var _cbezier = __webpack_require__(9);

	var _cbezier2 = _interopRequireDefault(_cbezier);

	var _cbezsurf = __webpack_require__(10);

	var _cbezsurf2 = _interopRequireDefault(_cbezsurf);

	var _cbezsurfpatch = __webpack_require__(11);

	var _cbezsurfpatch2 = _interopRequireDefault(_cbezsurfpatch);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	const geom = {
	  Curve: _curve2.default, Line: _line2.default, Bezier: _bezier2.default, CubicBezier: _cbezier2.default,
	  CubicBezierSurface: _cbezsurf2.default, CubicBezierSurfacePatch: _cbezsurfpatch2.default
	};

	exports.default = geom;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	/**
	 * Parametric Curve
	 */
	class Curve {

	  /**
	   * Evaluate the curve at parameter value `t`.
	   * Abstract method - Sub-classes should implement it
	   * @param t Number or array of numbers for multiple point evaluations
	   */
	  evaluate(t) {
	    throw new Error('Not implemented');
	  }

	  /**
	   * Generate persistent representation of the Curve object
	   * Abstract method - Sub-classes should implement it
	   */
	  generateMemento() {
	    throw new Error('Not implemented');
	  }

	  /**
	   * Generate string representation
	   * Abstract method - Sub-classes should implement it
	   */
	  toString() {
	    throw new Error('Not implemented');
	  }
	}

	exports.default = Curve;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _vec = __webpack_require__(1);

	var _vec2 = _interopRequireDefault(_vec);

	var _aabb = __webpack_require__(7);

	var _aabb2 = _interopRequireDefault(_aabb);

	var _curve = __webpack_require__(5);

	var _curve2 = _interopRequireDefault(_curve);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	class Line extends _curve2.default {

	  constructor(start, end) {
	    super();
	    this.start = start;
	    this.end = end;
	  }

	  evaluate(t) {
	    return _vec2.default.add(this.start, _vec2.default.mul(_vec2.default.sub(this.end, this.start), t));
	  }

	  aabb() {
	    return new _aabb2.default({
	      min: [Math.min(this.start[0], this.end[0]), Math.min(this.start[1], this.end[1])],
	      max: [Math.max(this.start[0], this.end[0]), Math.max(this.start[1], this.end[1])]
	    });
	  }

	  toString() {
	    let s = 'Line: ';
	    let [x0, y0] = this.start;
	    let [x1, y1] = this.end;
	    if (x0 === x1) {
	      s += 'x = ' + x0;
	    } else if (y0 === y1) {
	      s += 'y = ' + y0;
	    } else {
	      let m = (y1 - y0) / (x1 - x0);
	      let c = (x1 * y0 - y1 * x0) / (x1 - x0);
	      s += 'y = ' + m.toFixed(2) + ' x + ' + c.toFixed(2);
	    }
	    return s;
	  }

	  toSVGPathData() {
	    let [x0, y0] = this.start;
	    let [x1, y1] = this.end;
	    return `M ${x0},${y0} L ${x1},${y1}`;
	  }

	  generateMemento() {
	    return {
	      type: Line.TYPEID,
	      start: this.start,
	      end: this.end
	    };
	  }
	}

	Line.TYPEID = 'line';

	exports.default = Line;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});


	class AABB {

	  constructor({ min, max }) {
	    this.min = min || [Infinity, Infinity];
	    this.max = max || [-Infinity, -Infinity];
	  }

	  transform(xform) {
	    this.min = xform.transformPoint(this.min);
	    this.max = xform.transformPoint(this.max);
	  }

	  overlaps(other) {
	    let aabb1 = this;
	    let aabb2 = other;
	    let half1 = vec2.mul(vec2.sub(aabb1.max, aabb1.min), 0.5);
	    let half2 = vec2.mul(vec2.sub(aabb2.max, aabb2.min), 0.5);
	    let center1 = vec2.add(aabb1.min, half1);
	    let center2 = vec2.add(aabb2.min, half2);
	    let dist = vec2.sub(center1, center2).map(Math.abs);
	    let separation = vec2.add(half1, half2);
	    return dist[0] <= separation[0] && dist[1] <= separation[1];
	  }

	  width() {
	    return this.max[0] - this.min[0];
	  }

	  height() {
	    return this.max[1] - this.min[1];
	  }

	  size() {
	    return vec2.dist(this.min, this.max);
	  }

	  center() {
	    return vec2.mul(vec2.add(this.min, this.max), 0.5);
	  }

	  merge(other) {
	    this.min = vec2.low(this.min, other.min);
	    this.max = vec2.high(this.max, other.max);
	  }

	  toString() {
	    let s = 'Center ' + vec2.format(this.center());
	    s += ' [min:' + vec2.format(this.min) + ' -> max:' + vec2.format(this.max) + ']';
	    return s;
	  }

	  toSVGRect() {
	    return `<rect x="${this.min[0]}" y="${this.min[1]}" ` + `width="${this.width()}" height="${this.height()}" ` + `style="fill:none;stroke:#888"></rect>`;
	  }
	}

	exports.default = AABB;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _curve = __webpack_require__(5);

	var _curve2 = _interopRequireDefault(_curve);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	class Bezier extends _curve2.default {
	  constructor(cpoints) {
	    super();
	    this.degree = cpoints.length - 1;
	    this.cpoints = cpoints;
	  }
	}

	exports.default = Bezier;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _bezier = __webpack_require__(8);

	var _bezier2 = _interopRequireDefault(_bezier);

	var _vec = __webpack_require__(1);

	var _vec2 = _interopRequireDefault(_vec);

	var _aabb = __webpack_require__(7);

	var _aabb2 = _interopRequireDefault(_aabb);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	class CubicBezier extends _bezier2.default {

	  evaluate(t) {
	    let p = this.cpoints;
	    let t2 = t * t;
	    let t3 = t * t2;
	    let one_t2 = (1 - t) * (1 - t);
	    let one_t3 = (1 - t) * one_t2;
	    let x = one_t3 * p[0][0] + 3 * t * one_t2 * p[1][0] + 3 * t2 * (1 - t) * p[2][0] + t3 * p[3][0];
	    let y = one_t3 * p[0][1] + 3 * t * one_t2 * p[1][1] + 3 * t2 * (1 - t) * p[2][1] + t3 * p[3][1];
	    return [x, y];
	  }

	  /**
	   * Return parameter values at which either x or y coords are at extremes
	   * It means that some of the values might represent curve's extremeties,
	   * but not all of them.
	   * @returns {Array.<*>}
	   * @private
	   */
	  _getExtremes() {
	    let [p1, p2, p3, p4] = this.cpoints;
	    //
	    // Ref: https://pomax.github.io/bezierinfo/#extremities
	    // a = 3(-p1 + 3p2 - 3p3 + p4);
	    // b = 6(p1 - 2p2 + p3);
	    // c = 3(p2 - p1)
	    //
	    let [ax, ay] = _vec2.default.mul(_vec2.default.add(_vec2.default.mul(p1, -1), _vec2.default.mul(p2, 3), _vec2.default.mul(p3, -3), p4), 3);
	    let [bx, by] = _vec2.default.mul(_vec2.default.add(p1, _vec2.default.mul(p2, -2), p3), 6);
	    let [cx, cy] = _vec2.default.mul(_vec2.default.sub(p2, p1), 3);

	    //
	    // Quadratic root formula
	    // t = (-b + sqrt(b*b - 4*a*c))/(2*a) and (-b - sqrt(b*b - 4*a*c))/(2*a)
	    //
	    // To be solved separately for X and Y dimensions
	    let sqterm, tx0, tx1, ty0, ty1;

	    // For x
	    sqterm = bx * bx - 4 * ax * cx;
	    if (sqterm >= 0) {
	      let Ax = -bx / (2 * ax);
	      let Bx = Math.sqrt(sqterm) / (2 * ax);
	      tx0 = Ax - Bx;
	      tx1 = Ax + Bx;
	    } else {
	      tx0 = 0.0;
	      tx1 = 1.0;
	    }

	    // For y
	    sqterm = by * by - 4 * ay * cy;
	    if (sqterm >= 0) {
	      let Ay = -by / (2 * ay);
	      let By = Math.sqrt(sqterm) / (2 * ay);
	      ty0 = Ay - By;
	      ty1 = Ay + By;
	    } else {
	      ty0 = 0.0;
	      ty1 = 1.0;
	    }

	    return [tx0, tx1, ty0, ty1].filter(t => t >= 0.0 && t <= 1.0);
	  }

	  aabb() {
	    let extremes = this._getExtremes().map(t => this.evaluate(t));
	    return new _aabb2.default({
	      min: _vec2.default.low(...extremes),
	      max: _vec2.default.high(...extremes)
	    });
	  }

	  /**
	   * Split the curve at given u value and return two Cubic Bezier curves that
	   * are identical to this curve when put together
	   * @param u
	   * @returns {[*,*]}
	   */
	  split(u) {
	    let [p0, p1, p2, p3] = this.cpoints;
	    let p01 = _vec2.default.add(_vec2.default.mul(p0, 1 - u), _vec2.default.mul(p1, u));
	    let p12 = _vec2.default.add(_vec2.default.mul(p1, 1 - u), _vec2.default.mul(p2, u));
	    let p23 = _vec2.default.add(_vec2.default.mul(p2, 1 - u), _vec2.default.mul(p3, u));

	    let p012 = _vec2.default.add(_vec2.default.mul(p01, 1 - u), _vec2.default.mul(p12, u));
	    let p123 = _vec2.default.add(_vec2.default.mul(p12, 1 - u), _vec2.default.mul(p23, u));

	    let p0123 = _vec2.default.add(_vec2.default.mul(p012, 1 - u), _vec2.default.mul(p123, u));

	    return [new CubicBezier([p0, p01, p012, p0123]), new CubicBezier([p0123, p123, p23, p3])];
	  }

	  /**
	   * Find parametric value on this curve that's closest to input point
	   * @param ipoint
	   * @returns {*}
	   */
	  projectParam(ipoint) {
	    const COARSE_ITERS = 8;
	    let tarr = [];
	    for (let i = 0; i <= COARSE_ITERS; i++) {
	      tarr.push(i / COARSE_ITERS);
	    }
	    let coarsePoints = tarr.map(t => this.evaluate(t));
	    let minidx = 0;
	    let mindistsq = Infinity;
	    let coarsev = [];
	    coarsePoints.forEach((coarsept, idx) => {
	      let distSq = _vec2.default.distSq(coarsept, ipoint);
	      coarsev.push(distSq);
	      if (distSq < mindistsq) {
	        mindistsq = distSq;
	        minidx = idx;
	      }
	    });

	    let idxleft = Math.max(minidx - 1, 0);
	    let idxright = Math.min(minidx + 1, coarsePoints.length - 1);
	    let tleft = idxleft / COARSE_ITERS;
	    let tright = idxright / COARSE_ITERS;
	    let vleft = coarsev[idxleft];
	    let vright = coarsev[idxright];
	    let vmid;
	    let tmid;
	    let gapleft, gapright;

	    const MAX_ITERS = 15;
	    let i;
	    for (i = 0; i < MAX_ITERS; i++) {

	      tmid = (tleft + tright) / 2;

	      vmid = _vec2.default.distSq(this.evaluate(tmid), ipoint);

	      gapleft = Math.abs(vleft - vmid);
	      gapright = Math.abs(vright - vmid);

	      if (gapleft < 1) {
	        tmid = tleft;
	        break;
	      }
	      if (gapright < 1) {
	        tmid = tright;
	        break;
	      }

	      if (gapleft < gapright) {
	        tright = tmid;
	        vright = vmid;
	      } else {
	        tleft = tmid;
	        vleft = vmid;
	      }
	    }

	    return tmid;
	  }

	  /**
	   * Find a point on this curve that's closest to input point
	   * @param ipoint
	   * @returns {*}
	   */
	  project(ipoint) {
	    return this.evaluate(this.projectParam(ipoint));
	  }

	  toSVGPathData(precision = 2) {
	    let p = this.cpoints;
	    return `M ${p[0][0].toFixed(precision)},${p[0][1].toFixed(precision)} ` + `C ${p[1][0].toFixed(precision)},${p[1][1].toFixed(precision)}` + ` ${p[2][0].toFixed(precision)},${p[2][1].toFixed(precision)}` + ` ${p[3][0].toFixed(precision)},${p[3][1].toFixed(precision)}`;
	  }
	}

	exports.default = CubicBezier;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _cbezier = __webpack_require__(9);

	var _cbezier2 = _interopRequireDefault(_cbezier);

	var _vec = __webpack_require__(1);

	var _vec2 = _interopRequireDefault(_vec);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	const EPSILON = 0.001;
	const MAX_INTERSECTION_PARAM_ITERS = 15;

	function hermiteBlendingFunctions(t) {
	  let f1 = 2 * t * t * t - 3 * t * t + 1;
	  let f2 = 1 - f1;
	  let f3 = t * t * t - 2 * t * t + t;
	  let f4 = t * t * t - t * t;
	  return [f1, f2, f3, f4];
	}

	/*
	 * Coons patch is defined by its boundary.
	 * A mesh gradient coons patch is defined by 4 cubic bezier curves.
	 * Hence there are expected to be 12 points on its boundaries. This routine
	 * computes the 4 inside control points for such coons patch
	 *
	 *             j ->
	 *      b00  b01  b02  b03
	 *
	 *    i b10            b13
	 *    |      b[i][j]
	 *    v b20            b23
	 *
	 *      b30  b31  b32  b33
	 *
	 *  b[i][j] =
	 *    (1-i/3) * b[0][j] + (i/3) * b[3][j] +
	 *    (1-j/3) * b[i][0] + (j/3) * b[i][3]
	 *    - b[0][0] * (1-j/3) * (1-i/3)
	 *    - b[3][0] * (j/3) * (1-i/3)
	 *    - b[0][3] * (1-j/3) * (i/3)
	 *    - b[3][3] * (j/3) * (i/3)
	 *
	 *  Ref: CAGD - Farid - 15.2
	 *
	 */
	function interpolateCoons(coons) {
	  if (coons.length !== 12) {
	    console.error("Coons boundary of unexpected length ", coons.length);
	  }
	  let b = [[coons[0], coons[1], coons[2], coons[3]], [coons[11], [0, 0], [0, 0], coons[4]], [coons[10], [0, 0], [0, 0], coons[5]], [coons[9], coons[8], coons[7], coons[6]]];

	  for (let i = 1; i <= 2; i++) {
	    for (let j = 1; j <= 2; j++) {
	      b[i][j][0] = (1 - i / 3) * b[0][j][0] + i / 3 * b[3][j][0] + (1 - j / 3) * b[i][0][0] + j / 3 * b[i][3][0] - b[0][0][0] * (1 - j / 3) * (1 - i / 3) - b[0][3][0] * (j / 3) * (1 - i / 3) - b[3][0][0] * (1 - j / 3) * (i / 3) - b[3][3][0] * (j / 3) * (i / 3);

	      b[i][j][1] = (1 - i / 3) * b[0][j][1] + i / 3 * b[3][j][1] + (1 - j / 3) * b[i][0][1] + j / 3 * b[i][3][1] - b[0][0][1] * (1 - j / 3) * (1 - i / 3) - b[0][3][1] * (j / 3) * (1 - i / 3) - b[3][0][1] * (1 - j / 3) * (i / 3) - b[3][3][1] * (j / 3) * (i / 3);
	    }
	  }
	  return b;
	}

	/**
	 *
	 *  Puv
	 *                u
	 *              --->
	 *     P00                           P10
	 *        0,0     0,1     0,2     0,3
	 *
	 *   |    1,0     1,1     1,2     1,3
	 * v |
	 *   |    2,0     2,1     2,2     2,3
	 *   v
	 *        3,0     3,1     3,2     3,3
	 *     P01                           P11
	 *
	 */

	class CubicBezierSurface {

	  constructor({ points, coons }) {
	    if (points) {
	      this.points = points;
	    } else if (coons) {
	      this.points = interpolateCoons(coons);
	    } else {
	      throw new Error('Invalid constructor input');
	    }

	    console.assert(this.points.length === 4);
	    this.points.forEach(row => {
	      console.assert(row.length === 4);
	    });
	  }

	  getBoundaryCurves() {
	    return [this.getTopCurve(), this.getRightCurve(), this.getBottomCurve(), this.getLeftCurve()];
	  }

	  containsPoint(ipoint) {
	    return this.getBoundaryCurves().every(boundaryCurve => {
	      let t = boundaryCurve.projectParam(ipoint);
	      return t > EPSILON && t < 1 - EPSILON;
	    });
	  }

	  /**
	   * Top curve corresponds to v = 0, curve from P00 to P10
	   * @returns {CubicBezier}
	   */
	  getTopCurve() {
	    return new _cbezier2.default(this.points[0].slice(0, 4));
	  }

	  /**
	   * Bottom curve corresponds to v = 1, curve from P01 to P11
	   * @returns {CubicBezier}
	   */
	  getBottomCurve() {
	    return new _cbezier2.default(this.points[3].slice(0, 4));
	  }

	  /**
	   * Left curve corresponds to u = 0, curve from P00 to P01
	   * @returns {CubicBezier}
	   */
	  getLeftCurve() {
	    return new _cbezier2.default([this.points[0][0], this.points[1][0], this.points[2][0], this.points[3][0]]);
	  }

	  /**
	   * Right curve corresponds to u = 1, curve from P10 to P11
	   * @returns {CubicBezier}
	   */
	  getRightCurve() {
	    return new _cbezier2.default([this.points[0][3], this.points[1][3], this.points[2][3], this.points[3][3]]);
	  }

	  _computeVCurve(U) {

	    let P = this.points;

	    let [f1, f2, f3, f4] = hermiteBlendingFunctions(U);

	    let Pv00 = _vec2.default.sub(P[1][0], P[0][0]);
	    let Pv01 = _vec2.default.sub(P[3][0], P[2][0]);
	    let Pv10 = _vec2.default.sub(P[1][3], P[0][3]);
	    let Pv11 = _vec2.default.sub(P[3][3], P[2][3]);

	    let PvU0 = _vec2.default.add(_vec2.default.mul(Pv00, f1), _vec2.default.mul(Pv10, f2));
	    let PvU1 = _vec2.default.add(_vec2.default.mul(Pv01, f1), _vec2.default.mul(Pv11, f2));

	    let Pu0 = new _cbezier2.default(P[0]);
	    let PU0 = Pu0.evaluate(U);
	    let Pu1 = new _cbezier2.default(P[3]);
	    let PU1 = Pu1.evaluate(U);

	    return new _cbezier2.default([PU0, _vec2.default.add(PU0, PvU0), _vec2.default.sub(PU1, PvU1), PU1]);
	  }

	  _computeUCurve(V) {
	    let P = this.points;

	    let [f1, f2, f3, f4] = hermiteBlendingFunctions(V);

	    let Pu00 = _vec2.default.sub(P[0][1], P[0][0]);
	    let Pu10 = _vec2.default.sub(P[0][3], P[0][2]);
	    let Pu01 = _vec2.default.sub(P[3][1], P[3][0]);
	    let Pu11 = _vec2.default.sub(P[3][3], P[3][2]);

	    let Pu0V = _vec2.default.add(_vec2.default.mul(Pu00, f1), _vec2.default.mul(Pu01, f2));

	    let Pu1V = _vec2.default.add(_vec2.default.mul(Pu10, f1), _vec2.default.mul(Pu11, f2));

	    let P0v = new _cbezier2.default([P[0][0], P[1][0], P[2][0], P[3][0]]);
	    let P0V = P0v.evaluate(V);
	    let P1v = new _cbezier2.default([P[0][3], P[1][3], P[2][3], P[3][3]]);
	    let P1V = P1v.evaluate(V);

	    return new _cbezier2.default([P0V, _vec2.default.add(P0V, Pu0V), _vec2.default.sub(P1V, Pu1V), P1V]);
	  }

	  _estimateU(point) {

	    let uleft = 0.0;
	    let uright = 1.0;
	    let umid;

	    let curveLeft = this.getLeftCurve();
	    let curveRight = this.getRightCurve();
	    let valLeft, valRight;

	    for (let i = 0; i < MAX_INTERSECTION_PARAM_ITERS; i++) {
	      umid = (uleft + uright) / 2;

	      valLeft = _vec2.default.distSq(curveLeft.project(point), point);
	      valRight = _vec2.default.distSq(curveRight.project(point), point);

	      if (Math.abs(valLeft - valRight) < 1) {
	        break;
	      }

	      if (valLeft < valRight) {
	        uright = umid;
	        curveRight = this._computeVCurve(umid);
	      } else {
	        uleft = umid;
	        curveLeft = this._computeVCurve(umid);
	      }
	    }
	    return umid;
	  }

	  _estimateV(point) {

	    let vleft = 0.0;
	    let vright = 1.0;
	    let vmid;

	    let curveLeft = this.getTopCurve();
	    let curveRight = this.getBottomCurve();
	    for (let i = 0; i < MAX_INTERSECTION_PARAM_ITERS; i++) {
	      vmid = (vleft + vright) / 2;
	      let valLeft = _vec2.default.distSq(curveLeft.project(point), point);
	      let valRight = _vec2.default.distSq(curveRight.project(point), point);

	      if (Math.abs(valLeft - valRight) < 1) {
	        break;
	      }

	      if (valLeft < valRight) {
	        vright = vmid;
	        curveRight = this._computeUCurve(vmid);
	      } else {
	        vleft = vmid;
	        curveLeft = this._computeUCurve(vmid);
	      }
	    }
	    return vmid;
	  }

	  /**
	   * Compute u and v parameter values that represent a point of this surface
	   * that is closest to input point
	   * @param ipoint
	   * @returns {[*,*]}
	   */
	  projectParam(ipoint) {
	    return [this._estimateU(ipoint), this._estimateV(ipoint)];
	  }

	  /**
	   * Split into two surfaces around u parameter at given value
	   * @param u
	   */
	  splitU(u) {
	    /**
	                   v0left                              v0right
	            0      1        2      3             0      1        2      3
	         0  +----------------------+  0       0  +----------------------+  0
	           |                      |             |                      |
	           |                      |             |                      |
	           |                      |      u      |                      |
	    l   1  |                      |  1   m   1  |                      |  1   r
	    e      |                      |      i      |                      |      i
	    f      |                      |      d      |                      |      g
	    t   2  |                      |  2       2  |                      |  2   h
	           |                      |             |                      |      t
	           |                      |             |                      |
	           |                      |             |                      |
	        3  +----------------------+  3       3  +----------------------+  3
	            0      1        2      3             0      1        2      3
	                   v1left                                v1right
	      */

	    let [v0LeftCrv, v0RightCrv] = this.getTopCurve().split(u);
	    let umidCrv = this._computeVCurve(u);
	    let leftCrv = this.getLeftCurve();
	    let rightCrv = this.getRightCurve();
	    let [v1LeftCrv, v1RightCrv] = this.getBottomCurve().split(u);

	    let left = new CubicBezierSurface({ coons: [v0LeftCrv.cpoints[0], v0LeftCrv.cpoints[1], v0LeftCrv.cpoints[2], v0LeftCrv.cpoints[3], umidCrv.cpoints[1], umidCrv.cpoints[2], umidCrv.cpoints[3], v1LeftCrv.cpoints[2], v1LeftCrv.cpoints[1], v1LeftCrv.cpoints[0], leftCrv.cpoints[2], leftCrv.cpoints[1]] });

	    let right = new CubicBezierSurface({ coons: [v0RightCrv.cpoints[0], v0RightCrv.cpoints[1], v0RightCrv.cpoints[2], v0RightCrv.cpoints[3], rightCrv.cpoints[1], rightCrv.cpoints[2], rightCrv.cpoints[3], v1RightCrv.cpoints[2], v1RightCrv.cpoints[1], v1RightCrv.cpoints[0], umidCrv.cpoints[2], umidCrv.cpoints[1]] });
	    return [left, right];
	  }

	  /**
	   * Split into two surfaces around v parameter at given value
	   * @param v
	   */
	  splitV(v) {
	    /**
	                   top
	            0      1        2      3        
	         0  +----------------------+  0     
	           |                      |        
	           |                      |        
	    u      |                      |      u 
	    0   1  |                      |  1   1 
	    t      |                      |      t 
	    o      |                      |      o 
	    p   2  |                      |  2   p 
	           |                      |        
	           |                      |        
	           |                      |        
	        3  +----------------------+  3     
	            0      1        2      3       
	                   vmid
	            0      1        2      3     
	         0  +----------------------+  0  
	           |                      |        
	    u      |                      |      u 
	    0      |                      |      1 
	    b   1  |                      |  1   b 
	    o      |                      |      o 
	    t      |                      |      t 
	    t   2  |                      |  2   t 
	    o      |                      |      o 
	    m      |                      |      m 
	           |                      |        
	        3  +----------------------+  3     
	            0      1        2      3          
	                  bottom
	      */
	    let [u0TopCrv, u0BottomCrv] = this.getLeftCurve().split(v);
	    let vmidCrv = this._computeUCurve(v);
	    let topCrv = this.getTopCurve();
	    let bottomCrv = this.getBottomCurve();
	    let [u1TopCrv, u1BottomCrv] = this.getRightCurve().split(v);

	    let top = new CubicBezierSurface({ coons: [topCrv.cpoints[0], topCrv.cpoints[1], topCrv.cpoints[2], topCrv.cpoints[3], u1TopCrv.cpoints[1], u1TopCrv.cpoints[2], u1TopCrv.cpoints[3], vmidCrv.cpoints[2], vmidCrv.cpoints[1], vmidCrv.cpoints[0], u0TopCrv.cpoints[2], u0TopCrv.cpoints[1]] });

	    let bottom = new CubicBezierSurface({ coons: [vmidCrv.cpoints[0], vmidCrv.cpoints[1], vmidCrv.cpoints[2], vmidCrv.cpoints[3], u1BottomCrv.cpoints[1], u1BottomCrv.cpoints[2], u1BottomCrv.cpoints[3], bottomCrv.cpoints[2], bottomCrv.cpoints[1], bottomCrv.cpoints[0], u0BottomCrv.cpoints[2], u0BottomCrv.cpoints[1]] });
	    return [top, bottom];
	  }

	  /**
	   * Split into four surfaces around u and v parameters at given values
	   * @param u
	   * @param v
	   */
	  splitUV(u, v) {

	    /**
	                   v0left                              v0right
	            0      1        2      3             0      1        2      3
	         0  +----------------------+  0       0  +----------------------+  0
	           |                      |             |                      |
	           |                      |             |                      |
	    u      |                      |      u      |                      |      u
	    0   1  |                      |  1   m   1  |                      |  1   1
	    t      |                      |      t      |                      |      t
	    o      |                      |      o      |                      |      o
	    p   2  |                      |  2   p   2  |                      |  2   p
	           |                      |             |                      |
	           |                      |             |                      |
	           |                      |             |                      |
	        3  +----------------------+  3       3  +----------------------+  3
	            0      1        2      3             0      1        2      3
	                   vmleft                               vmright
	            0      1        2      3             0      1        2      3
	         0  +----------------------+  0       0  +----------------------+  0
	           |                      |             |                      |
	    u      |                      |      u      |                      |      u
	    0      |                      |      m      |                      |      1
	    b   1  |                      |  1   b   1  |                      |  1   b
	    o      |                      |      o      |                      |      o
	    t      |                      |      t      |                      |      t
	    t   2  |                      |  2   t   2  |                      |  2   t
	    o      |                      |      o      |                      |      o
	    m      |                      |      m      |                      |      m
	           |                      |             |                      |
	        3  +----------------------+  3       3  +----------------------+  3
	            0      1        2      3             0      1        2      3
	                   v1left                                v1right
	      */

	    let [v0LeftCrv, v0RightCrv] = this.getTopCurve().split(u);
	    let [vmLeftCrv, vmRightCrv] = this._computeUCurve(v).split(u);
	    let [v1LeftCrv, v1RightCrv] = this.getBottomCurve().split(u);

	    let [u0TopCrv, u0BottomCrv] = this.getLeftCurve().split(v);
	    let [umTopCrv, umBottomCrv] = this._computeVCurve(u).split(v);
	    let [u1TopCrv, u1BottomCrv] = this.getRightCurve().split(v);

	    let topLeft = new CubicBezierSurface({ coons: [v0LeftCrv.cpoints[0], v0LeftCrv.cpoints[1], v0LeftCrv.cpoints[2], v0LeftCrv.cpoints[3], umTopCrv.cpoints[1], umTopCrv.cpoints[2], umTopCrv.cpoints[3], vmLeftCrv.cpoints[2], vmLeftCrv.cpoints[1], vmLeftCrv.cpoints[0], u0TopCrv.cpoints[2], u0TopCrv.cpoints[1]] });
	    let topRight = new CubicBezierSurface({ coons: [v0RightCrv.cpoints[0], v0RightCrv.cpoints[1], v0RightCrv.cpoints[2], v0RightCrv.cpoints[3], u1TopCrv.cpoints[1], u1TopCrv.cpoints[2], u1TopCrv.cpoints[3], vmRightCrv.cpoints[2], vmRightCrv.cpoints[1], vmRightCrv.cpoints[0], umTopCrv.cpoints[2], umTopCrv.cpoints[1]] });
	    let bottomLeft = new CubicBezierSurface({ coons: [vmLeftCrv.cpoints[0], vmLeftCrv.cpoints[1], vmLeftCrv.cpoints[2], vmLeftCrv.cpoints[3], umBottomCrv.cpoints[1], umBottomCrv.cpoints[2], umBottomCrv.cpoints[3], v1LeftCrv.cpoints[2], v1LeftCrv.cpoints[1], v1LeftCrv.cpoints[0], u0BottomCrv.cpoints[2], u0BottomCrv.cpoints[1]] });
	    let bottomRight = new CubicBezierSurface({ coons: [vmRightCrv.cpoints[0], vmRightCrv.cpoints[1], vmRightCrv.cpoints[2], vmRightCrv.cpoints[3], u1BottomCrv.cpoints[1], u1BottomCrv.cpoints[2], u1BottomCrv.cpoints[3], v1RightCrv.cpoints[2], v1RightCrv.cpoints[1], v1RightCrv.cpoints[0], umBottomCrv.cpoints[2], umBottomCrv.cpoints[1]] });

	    return [[topLeft, topRight], [bottomLeft, bottomRight]];
	  }

	  toSVGPathData(precision = 2) {
	    let d = '';
	    let P = this.points;
	    let cpx0 = P[0][0][0].toFixed(precision);
	    let cpy0 = P[0][0][1].toFixed(precision);
	    d += `M ${cpx0},${cpy0} `;
	    let cpx1 = P[0][1][0].toFixed(precision);
	    let cpy1 = P[0][1][1].toFixed(precision);
	    let cpx2 = P[0][2][0].toFixed(precision);
	    let cpy2 = P[0][2][1].toFixed(precision);
	    let cpx3 = P[0][3][0].toFixed(precision);
	    let cpy3 = P[0][3][1].toFixed(precision);
	    d += `C ${cpx1},${cpy1} ${cpx2},${cpy2} ${cpx3},${cpy3} `;
	    cpx1 = P[1][3][0].toFixed(precision);
	    cpy1 = P[1][3][1].toFixed(precision);
	    cpx2 = P[2][3][0].toFixed(precision);
	    cpy2 = P[2][3][1].toFixed(precision);
	    cpx3 = P[3][3][0].toFixed(precision);
	    cpy3 = P[3][3][1].toFixed(precision);
	    d += `C ${cpx1},${cpy1} ${cpx2},${cpy2} ${cpx3},${cpy3} `;
	    cpx1 = P[3][2][0].toFixed(precision);
	    cpy1 = P[3][2][1].toFixed(precision);
	    cpx2 = P[3][1][0].toFixed(precision);
	    cpy2 = P[3][1][1].toFixed(precision);
	    cpx3 = P[3][0][0].toFixed(precision);
	    cpy3 = P[3][0][1].toFixed(precision);
	    d += `C ${cpx1},${cpy1} ${cpx2},${cpy2} ${cpx3},${cpy3} `;
	    cpx1 = P[2][0][0].toFixed(precision);
	    cpy1 = P[2][0][1].toFixed(precision);
	    cpx2 = P[1][0][0].toFixed(precision);
	    cpy2 = P[1][0][1].toFixed(precision);
	    cpx3 = P[0][0][0].toFixed(precision);
	    cpy3 = P[0][0][1].toFixed(precision);
	    d += `C ${cpx1},${cpy1} ${cpx2},${cpy2} ${cpx3},${cpy3}`;
	    return d;
	  }

	}
	exports.default = CubicBezierSurface;

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	const EPSILON = 0.001;

	class CubicBezierSurfacePatch {

	  constructor(surfgrid) {
	    this.surfaces = surfgrid;
	  }

	  containsPoint(point) {
	    for (let i = 0; i < this.surfaces.length; i++) {
	      for (let j = 0; j < this.surfaces[i].length; j++) {
	        let surface = this.surfaces[i][j];
	        if (surface.containsPoint(point)) {
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
	   */
	  subdivide(point) {

	    let nrows = this.surfaces.length;
	    let ncols = this.surfaces[0].length;
	    let newgrid = new Array(nrows + 1);
	    for (let i = 0; i < nrows + 1; i++) {
	      newgrid[i] = new Array(ncols + 1);
	    }

	    let isplit = -1;
	    let jsplit = -1;
	    let usplit, vsplit;

	    for (let i = 0; i < this.surfaces.length; i++) {
	      let row = this.surfaces[i];
	      for (let j = 0; j < row.length; j++) {
	        let surf = row[j];
	        let [up, vp] = surf.projectParam(point);
	        let uInRange = up > EPSILON && up < 1 - EPSILON;
	        let vInRange = vp > EPSILON && vp < 1 - EPSILON;
	        if (uInRange && vInRange) {
	          isplit = i;
	          jsplit = j;
	          usplit = up;
	          vsplit = vp;
	          break;
	        }
	      }
	    }
	    if (isplit < 0 && jsplit < 0) {
	      return; // No split
	    }

	    for (let i = 0; i < this.surfaces.length; i++) {
	      let row = this.surfaces[i];
	      for (let j = 0; j < row.length; j++) {
	        let surf = row[j];
	        if (i === isplit && j === jsplit) {
	          let split = surf.splitUV(usplit, vsplit);
	          newgrid[i][j] = split[0][0];
	          newgrid[i + 1][j] = split[1][0];
	          newgrid[i][j + 1] = split[0][1];
	          newgrid[i + 1][j + 1] = split[1][1];
	        } else if (i === isplit && j !== jsplit) {
	          let [top, bottom] = surf.splitV(vsplit);
	          let iidx = isplit >= 0 && i > isplit ? i + 1 : i;
	          let jidx = jsplit >= 0 && j > jsplit ? j + 1 : j;
	          newgrid[iidx][jidx] = top;
	          newgrid[iidx + 1][jidx] = bottom;
	        } else if (i !== isplit && j === jsplit) {
	          let [left, right] = surf.splitU(usplit);
	          let iidx = isplit >= 0 && i > isplit ? i + 1 : i;
	          let jidx = jsplit >= 0 && j > jsplit ? j + 1 : j;
	          newgrid[iidx][jidx] = left;
	          newgrid[iidx][jidx + 1] = right;
	        } else {
	          let iidx = isplit >= 0 && i > isplit ? i + 1 : i;
	          let jidx = jsplit >= 0 && j > jsplit ? j + 1 : j;
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

	  *getBezierSurfaces() {
	    for (let i = 0; i < this.surfaces.length; i++) {
	      let row = this.surfaces[i];
	      for (let j = 0; j < row.length; j++) {
	        yield row[j];
	      }
	    }
	  }

	  forEachSurface(callback) {
	    for (let i = 0; i < this.surfaces.length; i++) {
	      for (let j = 0; j < this.surfaces[i].length; j++) {
	        callback(this.surfaces[i][j], i, j);
	      }
	    }
	  }
	}
	exports.default = CubicBezierSurfacePatch;

/***/ }
/******/ ]);