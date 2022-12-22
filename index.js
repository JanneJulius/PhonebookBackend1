require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')


/*
const requestLogger = (request, response, next) => {
  console.log(
    request.method,
    request.path,
    response.statusCode)
  next()
}*/

morgan.token('data', function getId(req) {
  if (req.method === 'POST')
    return JSON.stringify(req.body)
})

app.use(express.static('build'))
app.use(express.json())
//app.use(requestLogger)
//app.use(morgan('tiny'))
app.use(morgan(':method :url :response-time :data'))
app.use(cors())

// Backend for API requests

// Get all persons
app.get('/api/persons', (req, res, next) => {

  Person.find({})
    .then(person => {
      res.json(person)
    })
    .catch(error => next(error))
})

// Get info 
app.get('/api/info', (req, res, next) => {
  const date = new Date()

  Person.find({})
    .then(person => {
      const sum = person.length
      res.send(
        `<div>
          <p>Phonebook has info for ${sum} people</p>
          <p>${date}</p>
        </div>`
      )
    })
    .catch(error => next(error))
})

// Get specific person
app.get('/api/persons/:id', (req, res, next) => {
  
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Delete specific person
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// Update existing person's phonenumber
app.put('/api/persons/:id', (req, res, next) => {

  const { name, number } = req.body

  Person.findByIdAndUpdate(req.params.id, 
    { name, number },
    { new: true, runValidators: true, context: 'query'  })
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

// Create new person
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})