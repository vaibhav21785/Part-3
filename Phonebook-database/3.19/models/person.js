const mongoose = require('mongoose')

const url =
  'mongodb://Vaibhav_123:Vaibhav123@ac-nzc82hc-shard-00-00.20nk3wn.mongodb.net:27017,ac-nzc82hc-shard-00-01.20nk3wn.mongodb.net:27017,ac-nzc82hc-shard-00-02.20nk3wn.mongodb.net:27017/phonebookApp?ssl=true&replicaSet=atlas-zogslp-shard-0&authSource=admin&appName=Cluster1'

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    minlength: 3
  },

  number: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d{5,}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }

})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {

    returnedObject.id = returnedObject._id.toString()

    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)