require('dns').setDefaultResultOrder('ipv4first')

const mongoose = require('mongoose')

const password = process.argv[2]

const url =
  `mongodb+srv://Vaibhav_123:${password}@cluster1.20nk3wn.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster1`

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log(error)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {

  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name,
    number,
  })

  person.save().then(() => {

    console.log(`added ${name} number ${number} to phonebook`)

    mongoose.connection.close()
  })
}