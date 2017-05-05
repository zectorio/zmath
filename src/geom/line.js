/*

 Copyright (C) 2017 Jayesh Salvi, Blue Math Software Inc.

 This file is part of Zector Math.

 Zector Math is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Zector Math is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with Zector Math.  If not, see <http://www.gnu.org/licenses/>.

 */


import vec2 from '../vec2'
import AABB from '../aabb'
import Curve from './curve'
import {isEqualFloat} from '..'

class Line extends Curve {

  /**
   * @param {Point2D} start
   * @param {Point2D} end
   */
  constructor(start, end) {
    super();
    this.start = start;
    this.end = end;
  }
  
  isVertical() {
    return isEqualFloat(this.start[0], this.end[0]);
  }
  
  getLineSlope() {
    let [x1,y1] = this.start;
    let [x2,y2] = this.end;
    if(isEqualFloat(x1,x2)) {
      return Infinity;
    } else {
      return (y2-y1)/(x2-x1);
    }
  }
  
  getYIntercept() {
    let [x1,y1] = this.start;
    let [x2,y2] = this.end;
    return (x2*y1-x1*y2)/(x2-x1);
  }
  
  getInclination() {
    let [x1,y1] = this.start;
    let [x2,y2] = this.end;
    if(isEqualFloat(x1,x2)) {
      return Math.PI/2; 
    } else {
      return Math.atan2(y2-y1,x2-x1);
    }
  }

  /**
   * Evaluate line at given parameter value
   * @param {number} t
   * @returns {Point2D} point
   */
  evaluate(t) {
    return vec2.add(
      this.start,
      vec2.mul(vec2.sub(this.end, this.start),t)
    );
  }

  /**
   * Return AABB of this line
   * @returns {AABB}
   */
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

  /**
   * String representation
   * @returns {string}
   */
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

  /**
   * Return SVG Path Data that to draw this line
   * @returns {string}
   */
  toSVGPathData() {
    let [x0,y0] = this.start;
    let [x1,y1] = this.end;
    return `M ${x0},${y0} L ${x1},${y1}`;
  }

  /**
   * Generate memento
   * @returns {Object} Memento
   */
  toMemento() {
    return {
      type : Line.TYPEID,
      start : this.start.slice(),
      end : this.end.slice()
    };
  }
  
  static fromMemento(m) {
    return new Line(m.start, m.end); 
  }
  
  clone() {
    return Line.fromMemento(this.toMemento());
  }

  /**
   * Returns Canvas PathDefinition object
   * @returns {ZCanvas~PathDefinition}
   */
  toCanvasPathDef() {
    return {
      type : 'line',
      x1 : this.start[0],
      y1 : this.start[1],
      x2 : this.end[0],
      y2 : this.end[1]
    };
  }
}

/**
 * Type Id for internal use
 * @type {string}
 */
Line.TYPEID = 'line';

export default Line;
