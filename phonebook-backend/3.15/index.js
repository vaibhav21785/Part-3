const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

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


// GET all persons from MongoDB
app.get('/api/persons', (req, res) => {

  Person.find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(error => {
      res.status(500).json({ error: error.message })
    })

})


// GET one person
app.get('/api/persons/:id', (req, res) => {

  Person.findById(req.params.id)
    .then(person => {

      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }

    })
    .catch(error => {
      res.status(500).json({ error: error.message })
    })

})


// ADD person to MongoDB
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

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => {
      res.status(500).json({ error: error.message })
    })

})


// DELETE person
app.delete('/api/persons/:id', (req, res) => {

  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => {
      res.status(500).json({ error: error.message })
    })

})


// UPDATE person
app.put('/api/persons/:id', (req, res) => {

  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(
    req.params.id,
    person,
    { new: true }
  )
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => {
      res.status(500).json({ error: error.message })
    })

})


// INFO
app.get('/info', (req, res) => {

  Person.find({})
    .then(persons => {
      res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
      `)
    })
    .catch(error => {
      res.status(500).json({ error: error.message })
    })

})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
