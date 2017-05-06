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


import Curve from './curve'
import Line from './line'
import Bezier from './bezier'
import CubicBezier from './cbezier'
import CubicBezierSurface from './cbezsurf'
import CubicBezierSurfacePatch from './cbezsurfpatch'
import EllipseArc from './earc'

const classic = {
  Curve, Line, Bezier, CubicBezier,
  CubicBezierSurface, CubicBezierSurfacePatch,
  EllipseArc
};

export default classic;