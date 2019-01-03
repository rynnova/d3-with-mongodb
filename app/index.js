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
const init = async () => {
  const data = await d3.json('menu.json')
  const margin = {top: 20, bottom: 100, right: 20, left: 100}
  const graphHeight = 600 - margin.top - margin.bottom
  const domain = d3.extent(data, ({orders}) => orders)
  const scaleForXAxis = d3.scaleBand()
    .domain(data.map(({name}) => name))
    .range([0, 500])
    .paddingInner(0.2)
    .paddingOuter(0.2)

  const scaleForYAxis = d3.scaleLinear()
    .domain(domain)
    .range([graphHeight, 0])

  const drawSelection = selection => selection
    .attr('width', scaleForXAxis.bandwidth)
    .attr('height', ({orders}) => graphHeight - scaleForYAxis(orders))
    .attr('fill', 'orange')
    .attr('x', ({name}) => scaleForXAxis(name))
    .attr('y', ({orders}) => scaleForYAxis(orders))
  const graphic = d3.select('.canvas')
    .append('svg')
    .attr('width', 600)
    .attr('height', 600)
  const graph = graphic.append('g')
    .attr('width', 600 - margin.left - margin.right)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
  const xAxis = graph.append('g')
    .attr('transform', `translate(0, ${graphHeight})`)
  const yAxis = graph.append('g')
  const rects = graph.selectAll('rect')
    .data(data)
  const newRects = rects.enter().append('rect')
  drawSelection(rects)
  drawSelection(newRects)

  xAxis.call(d3.axisBottom(scaleForXAxis))
  xAxis.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end')
    .attr('fill', 'orange')
  yAxis.call(d3.axisLeft(scaleForYAxis)
    .ticks(3)
    .tickFormat(orders => `${orders} orders`))

  try {
    const response = await fetch('/api/dishes')
    console.log('Fetch /api/dishes')
    console.log(await response.json())
  } catch(error) {
    console.log(error)
  }
}

init()
