const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(cors())

app.use(express.static('dist'))

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

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
  }
]

// GET all persons
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// GET one person
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

// ADD person
app.post('/api/persons', (req, res) => {

  const body = req.body

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
    p => p.name === body.name
  )

  if (nameExists) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: Math.floor(Math.random() * 10000),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  res.json(person)
})

// DELETE person
app.delete('/api/persons/:id', (req, res) => {

  const id = Number(req.params.id)

  persons = persons.filter(
    p => p.id !== id
  )

  res.status(204).end()
})

// UPDATE person
app.put('/api/persons/:id', (req, res) => {

  const id = Number(req.params.id)
  const body = req.body

  const updatedPerson = {
    id: id,
    name: body.name,
    number: body.number
  }

  persons = persons.map(
    p => p.id !== id ? p : updatedPerson
  )

  res.json(updatedPerson)
})

// INFO
app.get('/info', (req, res) => {

  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})