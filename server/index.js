require("dotenv").config()
const express = require("express")
const { graphqlHTTP } = require('express-graphql');
const mongoose = require("mongoose")
const cors = require("cors")
const Schema = mongoose.Schema;
const schema = require("./schema/schema")
const app = express()
const { authenticateToken } = require("./helpers/token")
mongoose.connect("mongodb+srv://admin:admin@testing.vpwk7.mongodb.net/eczane?retryWrites=true&w=majority",
     {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
mongoose.connection.once("open", () => {
    console.log('connecting has been made')
})


app.use(cors())

app.use("/graphql",
    graphqlHTTP(req => ({
        schema,
        graphiql: true,
        context: req.headers
    })))

app.listen(4000, () => {
    console.log('app is listening on port 4000')
})