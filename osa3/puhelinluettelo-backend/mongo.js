const mongoose = require('mongoose')


if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]

const url = `mongodb://amuhamed282_db_user:${password}@ac-lgycpjb-shard-00-00.llw6m9o.mongodb.net:27017,ac-lgycpjb-shard-00-01.llw6m9o.mongodb.net:27017,ac-lgycpjb-shard-00-02.llw6m9o.mongodb.net:27017/phonebook?ssl=true&replicaSet=atlas-149fa1-shard-0&authSource=admin&retryWrites=true&w=majority`
mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,


})

const Person = mongoose.model('Person', personSchema)



if (process.argv.length === 3) {
  console.log('phonebook:')


  Person.find({}).then(persons => {
    persons.forEach(p => {

      console.log(`${p.name} ${p.number}`)
    })
    mongoose.connection.close()
  })


}



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