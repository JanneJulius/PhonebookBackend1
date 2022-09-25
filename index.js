const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const requestLogger = (request, response, next) => {
  console.log(
  request.method,
  request.path,
  response.statusCode);
  next();
};

morgan.token('data', function getId(req) {
  if (req.method === 'POST')
    return JSON.stringify(req.body)
})

app.use(express.json())
//app.use(requestLogger)
//app.use(morgan('tiny'))
app.use(morgan(':method :url :response-time :data'))
app.use(cors())



let persons = [
  {
    "name": "Arto Hellas",
    "number": "1212412412",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  },
  {
    "name": "Testing",
    "number": "1234",
    "id": 5
  }
]

app.get('/api/persons', (req, res) => {
  res.send(persons)
})

app.get('/api/info', (req, res) => {
  const sum = persons.length;
  const date = new Date();

  res.send(
    `<div>
      <p>Phonebook has info for ${sum} people</p>
      <p>${date}</p>
    </div>`
  )
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  
  if (person) {
    res.send(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
  }else {
    return res.status(400).send({ 
      error: 'Already removed' 
    })
  }
})

const generateId = () => {
  return Math.round(Math.random() * (100000 - 10) + 10);
}

app.post('/api/persons', (req, res) => {
  const body = req.body
  const name = body.name
  const number = body.number

  //No content at all
  if (Object.keys(body).length === 0 && body.constructor === Object) {
    return res.status(400).send({ 
      error: 'content missing' 
    })
  }// content available
  else{
    // No name
    if(!name){
      return res.status(400).send({ 
        error: 'name missing' 
      })
    }// No number
    else if(!number){
      return res.status(400).send({ 
        error: 'number missing' 
      })
    }// Body correct
    else{
      // Person already exists
      if(persons.find(p => p.name === name)){
        return res.status(400).send({ 
          error: `${name} already exists` 
        })
      }
      // Otherwise create new person
      const person = {
        name: name, 
        number: number,
        id: generateId()
      }

      persons = persons.concat(person)
      res.send(person)
    }
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})