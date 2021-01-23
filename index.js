const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.oizw2.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on("error", () => {
  console.log("fallo la conexion a mongodb")
  process.exit(1)
})
const gpu = require("./gpu.model")
  const corsOpts = {
    origin: '*',
  
    methods: [
      'GET',
      'POST',
    ],
  
    allowedHeaders: [
      'Content-Type',
    ],
  };
  
  app.use(cors(corsOpts));

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

app.get('/gpus', jsonParser, async function (req, res) {
    const gpus = await gpu.find({})
    res.send(gpus)
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, function () {
    console.log('Server is running..' + PORT);
});

