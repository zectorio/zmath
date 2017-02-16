
import Curve from './curve'

class Bezier extends Curve {
  constructor(cpoints) {
    super();
    this.degree = cpoints.length-1;
    this.cpoints = cpoints;
  }
}

export default Bezier;