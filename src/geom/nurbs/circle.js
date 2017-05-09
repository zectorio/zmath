/*

 Copyright (C) 2017 Jayesh Salvi, Blue Math Software Inc.

 This file is part of Zector Math.

 Zector Math is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Zector Math is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with Zector Math. If not, see <http://www.gnu.org/licenses/>.

*/

const PI = Math.PI;

import {vec2} from '../..'
import BSplineCurve from './bcurve'

export default class Circle extends BSplineCurve {

  constructor(center, radius, start, end) {

    let r = radius;
    if(end < start) {
      end = end + 2*PI;
    }
    let theta = end-start;
    let narcs;

    if(theta <= PI/2) {
      narcs = 1;
    } else if(theta <= PI) {
      narcs = 2;
    } else if(theta <= 3*PI/2) {
      narcs = 3;
    } else {
      narcs = 4;
    }

    let dtheta = theta/narcs;

    let n = 2*narcs;  // n+1 = no. of control points
    let p = 2;        // degree
    let m = n+p+1;    // m+1 = no. of knots
    let U = new Array(m+1);
    let P = new Array(n+1);
    let wt = new Array(n+1);

    let w1 = Math.cos(dtheta/2);
    let P0 = vec2.add(center, [r*Math.cos(start), r*Math.sin(start)]);
    let T0 = [-Math.sin(start), Math.cos(start)];
    P[0] = P0;
    wt[0] = 1;
    let index = 0;
    let angle = start;

    for(let i=1; i<narcs+1; i++) {
      angle += dtheta;
      let P2 = vec2.add(center, [r*Math.cos(angle), r*Math.sin(angle)]);
      P[index+2] = P2;
      wt[index+2] = 1;
      let T2 = [-Math.sin(angle), r*Math.cos(angle)];
      let [alpha0, alpha1, isParallel, ptIntersection] =
        linelineIntersect3D(
          [P0[0], P0[1], 0],
          [T0[0], T0[1], 0],
          [P2[0], P2[1], 0],
          [T2[0], T2[1], 0]
        );
      console.assert(!isParallel);
      // For line P0 to T0, compute its direction
      P[index+1] = ptIntersection.slice(0,2);
      wt[index+1] = w1;

      index += 2;

      if(i < narcs) {
        P0 = P2;
        T0 = T2;
      }
    }

    let j = 2 * narcs + 1;

    for(let i=0; i<3; i++) {
      U[i] = 0.0;
      U[i+j] = 1.0;
    }

    if(narcs === 2) {
      U[3] = U[4] = 0.5;
    } else if(narcs === 3) {
      U[3] = U[4] = 1/3;
      U[5] = U[6] = 2/3;
    } else if(narcs === 4) {
      U[3] = U[4] = 0.25;
      U[5] = U[6] = 0.5;
      U[7] = U[8] = 0.75;
    }

    super(p, P, U, wt);
  }

}
