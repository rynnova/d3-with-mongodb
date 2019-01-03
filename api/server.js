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
const express = require('express')
const mongoose = require('mongoose')
const app = express()

mongoose.connect('mongodb://db:27017/test', {
  useNewUrlParser: true,
  autoReconnect: true
})

const Dish = mongoose.model('Dish', {name: String, orders: Number})

app.get('/', (request, response) => {
  response.send('Hello world')
})

app.route('/dishes')
  .get(async (request, response) => {
    response.send(await Dish.find())
  })

app.listen(3000)
