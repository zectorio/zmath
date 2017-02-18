
class Transform {
  constructor(array) {
    if(array) {
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
    return this.a === 1 && this.b === 0 && this.c === 0 &&
      this.d === 1 && this.e === 1 && this.f === 0;
  }

  /**
   * @param {number[]|number} coord|dx
   * @param number dy
   * @returns {Transform}
   */
  translate() {
    if(Array.isArray(arguments[0])) {
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
    return this.rotate(angle * Math.PI/180);
  }

  static rotateAround(angle, point) {
    // Ref: http://www.euclideanspace.com/maths/geometry/affine/aroundPoint/matrix2d/
    let pre = new Transform().translate(...point);
    let rotation = new Transform().rotate(angle);
    let post = new Transform().translate(-point[0], -point[1]);
    return pre.mul(rotation).mul(post);
  }

  static scaleAround([sx,sy], point) {
    let pre = new Transform().translate(...point);
    let scale = new Transform().scale(sx,sy);
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

  toAttributeString() {
    return `matrix(${this.toArray().join(',')})`;
  }

  fromArray([a,b,c,d,e,f]) {
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
    if(!this._cachedInverse) {
      let {a,b,c,d,e,f} = this;
      let det = a*d-b*c;
      let ai = d/det;
      let bi = -b/det;
      let ci = -c/det;
      let di = a/det;
      let ei = (c*f-d*e)/det;
      let fi = (b*e-a*f)/det;
      this._cachedInverse = new Transform([ai,bi,ci,di,ei,fi]);
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
    let {a:a1,b:b1,c:c1,d:d1,e:e1,f:f1} = this;
    let {a:a2,b:b2,c:c2,d:d2,e:e2,f:f2} = other;

    return new Transform([
      a1*a2+c1*b2,
      b1*a2+d1*b2,
      a1*c2+c1*d2,
      b1*c2+d1*d2,
      a1*e2+c1*f2+e1,
      b1*e2+d1*f2+f1
    ]);
  }

  transformPoint([x,y]) {
    let {a,b,c,d,e,f} = this;
    return [
      a*x + c*y + e,
      b*x + d*y + f
    ];
  }

  clone() {
    return new Transform(this.toArray());
  }

  generateMemento() {
    return this.toArray();
  }

  toString() {
    return `a:${this.a},b:${this.b},c:${this.c},`+
      `d:${this.d},e:${this.e},f:${this.f}`;
  }
}

Transform.revive = function (m) {
  return new Transform(m);
};

Transform.IDENTITY = new Transform();

class Translation extends Transform {
  constructor(arg0, arg1) {
    let arr;
    if(Array.isArray(arg0)) {
      arr = [1,0,0,1,arg0[0],arg0[1]];
    } else {
      arr = [1,0,0,1,arg0,arg1];
    }
    super(arr);
  }
}

class Rotation extends Transform {
  constructor(angle) {
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    super([cos,sin,-sin,cos,0,0]);
  }
}

export default Transform;
export {Translation, Rotation};
