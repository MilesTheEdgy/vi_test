require("dotenv").config()
const express = require("express")
const { graphqlHTTP } = require('express-graphql');
const FormatError = require('easygraphql-format-error')
const mongoose = require("mongoose")
const schema = require("./schema/schema")
const app = express()
mongoose.connect("mongodb+srv://admin:admin@testing.vpwk7.mongodb.net/eczane?retryWrites=true&w=majority",
     {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
mongoose.connection.once("open", () => {
    console.log('connecting has been made')
})

const formatError = new FormatError([{
    name: 'USER_EXISTS',
    message: 'This user already exists',
    statusCode: '400'
  }])
const errorName = formatError.errorName
// app.use(cors())

app.use("/graphql",
    graphqlHTTP(req => ({
        schema,
        graphiql: true,
        context: {
            reqHeaders: req.headers,
            errorName
        },
        customFormatErrorFn: (err) => {
            console.log("err in index", err.originalError.message)
            return formatError.getError(err)
        }
    })))

app.listen(4000, () => {
    console.log('app is listening on port 4000')
})