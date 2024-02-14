const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require('./routes');

const mongoConnection = 'mongodb+srv://sofmazepa:R-Xzpt3YA48mJC6@cluster0.lo04qnz.mongodb.net/?retryWrites=true&w=majority'
const mongoose = require('mongoose');

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Set EJS / pug as the view engine
app.set('view engine', 'pug');
// app.set('views', 'views');
app.set('views', ['views', 'views/user']);

// app.use('/', routes.homeRoutes);
app.use('/', (req, res)=>{
  res.send("hello");
});
// app.use('/users', routes.userRoutes);
// app.use('/*', routes.homeRoutes);

const PORT = 3400;

const start = async () => {
  await mongoose.connect(mongoConnection);
  console.log('Database connected');
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })
};

start();