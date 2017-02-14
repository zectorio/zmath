
import Curve from './curve'

class Bezier extends Curve {
  constructor(cpoints) {
    super();
    this.cpoints = cpoints;
  }
}

export default Bezier;