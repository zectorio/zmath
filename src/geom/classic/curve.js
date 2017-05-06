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


/**
 * @ignore
 */
class Curve {

  /**
   * @abstract
   */
  evaluate(t) {
    throw new Error('Not implemented');
  }

  /**
   * @abstract
   */
  toMemento() {
    throw new Error('Not implemented');
  }

  /**
   * @abstract
   */
  toCanvasPathDef() {
    throw new Error('Not implemented');
  }

  /**
   * @abstract
   */
  toString() {
    throw new Error('Not implemented');
  }

  /**
   * Loose AABB (cheap to calculate) for this curve
   * Note that the {Curve} object is 1-dimensional geometry, i.e. it doesn't
   * have thickness. Hence the AABB is not affected by any thickness the
   * application might attribute to this curve during rendering
   * @abstract
   * @returns {AABB}
   */
  aabb() {
    throw new Error('Not implemented');
  }
}

export default Curve;