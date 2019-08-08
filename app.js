const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use("*", cors());

mongoose.connect('mongodb+srv://zhigamovsky:ionicpassword@ioniccluster-w3bmq.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true})
mongoose.connection.once('open', () => console.log('\nConnected to DB'));

app.use('/graphql', cors(), graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(4000, () => {
  console.log('Listening on port 4000');
})