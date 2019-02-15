/*
 *  A Dockerised nginx + D3.js + Express.js + MongoDB learning project.
 *  Copyright (C) 2019  Ryan Y.
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
class LineGraph {
  constructor(margin, size) {
    this.margin = margin
    this.size = size

    const element = d3.select('.canvas')
      .append('svg')
      .attr('width', this.size.width)
      .attr('height', this.size.height)

    this.container = element.append('g')
      .attr('width', this.dimensions.width)
      .attr('height', this.dimensions.height)
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
  }

  get dimensions() {
    return {
      width: this.size.width - this.margin.left - this.margin.right,
      height: this.size.height - this.margin.top - this.margin.bottom
    }
  }

  update(data) {
    console.log('updated', data)
  }
}

