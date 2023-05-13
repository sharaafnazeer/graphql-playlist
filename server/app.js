const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema')
const mongoose = require('mongoose');
require('dotenv').config();
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = express();
const uri = process.env.MONGODB_URI
console.log(uri)
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once('open', () => {
    console.log("MongoDB Connected");
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

app.listen(4000, () => {
    console.log("App started!");
})