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
const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

mongoose.connect('mongodb://db:27017/test?replicaSet=rs', {
  useNewUrlParser: true,
  autoReconnect: true
})

const db = mongoose.connection
const Dish = mongoose.model('Dish', {name: String, orders: Number})
const Expense = mongoose.model('Expense', {name: String, cost: Number})

app.use(bodyParser.json())

db.once('open', () => {
  server.listen(3000)

  app.get('/', (request, response) => {
    response.send('Hello world')
  })

  app.post('/add', (request, response) => {
    const {name, cost} = request.body
    const expense = new Expense({name, cost})
    expense.save()
    response.send()
  })

  io.on('connection', async socket => {
    const expenses = db.collection('expenses')
    const stream = expenses.watch()
    socket.emit('expenses', await Expense.find())

    stream.on('change', change => {
      socket.emit(`${change.operationType}Expense`, change)
    })
  })

  console.log('listening on port 3000, awaiting WebSocket connection')
})
