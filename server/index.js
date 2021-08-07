require("dotenv").config()
const express = require("express")
const { graphqlHTTP } = require('express-graphql');
const mongoose = require("mongoose")
const schema = require("./schema/schema")
const app = express()
const path = require('path');

mongoose.connect(process.env.MONGODB_URL,
     {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
mongoose.connection.once("open", () => {
    console.log('connecting has been made')
})

app.use(express.static(path.join(__dirname, '../client/build')));

app.use("/graphql",
    graphqlHTTP(req => ({
        schema,
        graphiql: true,
        context: {
            reqHeaders: req.headers
        },
        customFormatErrorFn: (err) => {
            console.log("err in index", err)
            console.log("err in index CODE", err.originalError.code)
            return {
                message: err.message,
                code: err.originalError && err.originalError.code,
                locations: err.locations,
                path: err.path
            };
        }
    })))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'../client/build/index.html'));
    });

app.listen(4000, () => {
    console.log('app is listening on port 4000')
})