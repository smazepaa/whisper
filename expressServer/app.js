const express = require('express');
const app = express();

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

const mongoConnection = 'mongodb+srv://sofmazepa:R-Xzpt3YA48mJC6@cluster0.lo04qnz.mongodb.net/?retryWrites=true&w=majority'
const mongoose = require('mongoose');

const fileRoutes = require('./routes/fileRoutes')
const http = require("http");
const WebSocket = require("ws");

// Set EJS / pug as the view engine
app.set('view engine', 'pug');
app.set('views', 'views');

app.use('/', fileRoutes);

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
