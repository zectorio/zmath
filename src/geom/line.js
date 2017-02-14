
import {vec2} from '../..'
import {AABB} from '../..'
import Curve from './curve'

class Line extends Curve {

  constructor(start, end) {
    super();
    this.start = start;
    this.end = end;
  }

  evaluate(t) {
    return vec2.add(
      this.start,
      vec2.mul(vec2.sub(this.end, this.start),t)
    );
  }

  aabb() {
    return new AABB({
      min: [
        Math.min(this.start[0], this.end[0]),
        Math.min(this.start[1], this.end[1])
      ],
      max: [
        Math.max(this.start[0], this.end[0]),
        Math.max(this.start[1], this.end[1])
      ]
    });
  }

  toString() {
    let s = 'Line: ';
    let [x0,y0] = this.start;
    let [x1,y1] = this.end;
    if(x0 === x1) {
      s += 'x = '+x0;
    } else if(y0 === y1) {
      s += 'y = '+y0;
    } else {
      let m = (y1-y0)/(x1-x0);
      let c = (x1*y0-y1*x0)/(x1-x0);
      s += 'y = '+m.toFixed(2)+' x + '+c.toFixed(2);
    }
    return s;
  }

  toSVGPathData() {
    let [x0,y0] = this.start;
    let [x1,y1] = this.end;
    return `M ${x0},${y0} L ${x1},${y1}`;
  }

  generateMemento() {
    return {
      type : Line.TYPEID,
      start : this.start,
      end : this.end
    };
  }
}

Line.TYPEID = 'line';

export default Line;
