// index.js

const express = require('express')
const morgan = require('morgan')

const app = express()

// Middleware
app.use(express.json())

// Morgan custom token
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

// Morgan logger
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// Phonebook data
let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
]

// GET all persons
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// GET single person
app.get('/api/persons/:id', (req, res) => {

  const id = Number(req.params.id)

  const person = persons.find(
    p => p.id === id
  )

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

// DELETE person
app.delete('/api/persons/:id', (req, res) => {

  const id = Number(req.params.id)

  persons = persons.filter(
    person => person.id !== id
  )

  res.status(204).end()
})

// ADD new person
app.post('/api/persons', (req, res) => {

  const body = req.body

  // Validation
  if (!body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }

  const nameExists = persons.some(
    person => person.name === body.name
  )

  if (nameExists) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  // Create new person
  const person = {
    id: Math.floor(Math.random() * 10000),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  res.json(person)
})

// INFO route
app.get('/info', (req, res) => {

  const count = persons.length

  const date = new Date()

  res.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${date}</p>
  `)
})

// Server
const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})