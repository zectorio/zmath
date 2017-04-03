import Curve from './curve'
import Line from './line'
import Bezier from './bezier'
import CubicBezier from './cbezier'
import CubicBezierSurface from './cbezsurf'
import CubicBezierSurfacePatch from './cbezsurfpatch'
import EllipseArc from './earc'

const geom = {
  Curve, Line, Bezier, CubicBezier,
  CubicBezierSurface, CubicBezierSurfacePatch,
  EllipseArc
};

export default geom;