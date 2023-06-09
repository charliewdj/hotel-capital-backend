const mongoose = require("mongoose");

var mongoURL = 'mongodb+srv://charwdj:1!Lcbtcdsis@cluster0.pkfn6.mongodb.net/Capital-Hotel'

mongoose.connect(mongoURL , {useUnifiedTopology : true , useNewUrlParser : true})

var connection = mongoose.connection

connection.on('error' , () => {
    console.log('Mongo DB Connection failed')
})

connection.on('connected' , () => {
    console.log('Mongo DB Connection Successful')
})

module.exports = mongoose


