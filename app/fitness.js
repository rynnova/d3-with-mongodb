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
const buttons = [].slice.call(document.querySelectorAll('button'))
const form = document.querySelector('form')
const activity = document.querySelector('form span')
const input = document.querySelector('input')
const error = document.querySelector('form .error')

const makeActive = ({target}) => {
  const action = target.dataset.activity
  buttons.forEach(button => button.classList.remove('active'))
  target.classList.add('active')

  input.setAttribute('id', action)
  activity.textContent = action
}

const sendActivity = async (distance) => {
  await fetch('/api/activities', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(makeActivity(distance))
  })

  input.value = ''
  error.textContent = ''
}

const makeActivity = distance => ({
  name: activity.textContent,
  distance,
  date: new Date().toString()
})

buttons.forEach(button => button.addEventListener('click', makeActive))

form.addEventListener('submit', event => {
  event.preventDefault()

  const distance = parseInt(input.value)

  if (distance)
    sendActivity(distance)
  else
    error.textContent = 'Please enter a valid distance.'
})

const graph = new LineGraph
const socket = io()
let data = []

socket.on('activities', activities => {
  data = activities
  graph.update(data)
})

socket.on('insertActivity', change => {
  data.push(change.fullDocument)
  graph.update(data)
})

socket.on('updateActivity', ({documentKey: {_id: id}, updateDescription}) => {
  const index = data.findIndex(datum => datum._id === id)
  const activity = data[index]
  updateDescription.removedFields.forEach(field => {
    delete activity[field]
  })

  const updated = updateDescription.updatedFields
  Object.keys(updated).forEach(key => {
    activity[key] = updated[key]
  })

  graph.update(data)
})

socket.on('deleteActivity', ({documentKey: key}) => {
  data = data.filter(datum => datum._id !== key._id)
  graph.update(data)
})
