const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.nxgcwzj.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
})

const Person = mongoose.model('person', personSchema)

const generateId = () => {
  return Math.round(Math.random() * (100000 - 10) + 10)
}

if(process.argv.length>3){
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
    id: generateId(),
  })

  person.save().then(() => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
}else if(process.argv.length === 3){
  Person.find({}).then(result => {
    result.forEach(elem => {
      console.log(elem)
    })
    mongoose.connection.close()
  })
}