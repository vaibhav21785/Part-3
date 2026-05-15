const mongoose = require('mongoose')

const url =
  'mongodb://Vaibhav_123:Vaibhav123@ac-nzc82hc-shard-00-00.20nk3wn.mongodb.net:27017,ac-nzc82hc-shard-00-01.20nk3wn.mongodb.net:27017,ac-nzc82hc-shard-00-02.20nk3wn.mongodb.net:27017/phonebookApp?ssl=true&replicaSet=atlas-zogslp-shard-0&authSource=admin&appName=Cluster1'

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log(error)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: 'Anna',
  number: '9876543210',
})

person.save().then(() => {

  console.log('person saved!')

  mongoose.connection.close()
})