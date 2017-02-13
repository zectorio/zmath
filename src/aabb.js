

class AABB {

  constructor({min,max}) {
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
    let s = 'Center '+vec2.format(this.center());
    s += ' [min:'+vec2.format(this.min)+' -> max:'+vec2.format(this.max)+']';
    return s;
  }
}

export default AABB;