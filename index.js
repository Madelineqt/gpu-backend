const express = require('express');
const app = express();
const cors = require('cors');
const passport = require('passport');
const cookieParser = require("cookie-parser");
const AWS = require('aws-sdk');
app.use(passport.initialize());
const fs =  require('fs');
require('./auth.js')
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
var path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.oizw2.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on("error", () => {
  console.log("fallo la conexion a mongodb")
  process.exit(1)
})

const secureRoute = require('./secure.routes');
const gpu = require("./gpu.model")
const users = require("./users.model")
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
  app.use(cookieParser());
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const BUCKET_NAME = process.env.BUCKET;
app.get('/gpus', jsonParser, async function (req, res) {
    const gpus = await gpu.find({})
    res.send(gpus)
});
app.post('/delete',jsonParser, passport.authenticate('jwt', { session: false }),async function (req,res){
  const idaborrar = req.body.id
  const response = await gpu.findOneAndDelete({_id:idaborrar}).then(response =>{
    console.log(response)
    s3.deleteObject({
      Bucket: "gpucomparator",
      Key: response.image
    },function (err,data){})
    res.send(true)
  }).catch(err => {
    console.log(err)
    res.send(err)
  })

} )
app.post('/upload',multipartMiddleware, passport.authenticate('jwt', { session: false }), async function (req, res) {
  console.log(req.files)
  var file = req.files.file;
  var params
  await fs.readFile(file.path, (err, data) => {
    params = {
      Bucket: "gpucomparator",
      Key: file.originalFilename, 
      Body: data
    };
    s3.upload(params, function(err, data) {
      if (err) {
          throw err;
      }
    res.send("Correcto");
  
  });
  })


  
})
app.post('/gpus', jsonParser, passport.authenticate('jwt', { session: false }), async function (req, res) {
    const nuevagpu = {
      name:req.body.name,
      memory:req.body.memory,
      image:req.body.image,
      price:req.body.price,
      benchmarks:req.body.benchmarks
    }
   
    await gpu.create(nuevagpu).then(gpu => {
      res.send(gpu)
    }).catch(err => {
      console.log(err)
      res.send("error al crear nueva gpu")
    })
  })
app.post('/login',jsonParser,async (req, res, next) => {
    passport.authenticate(
      'login',
      async (err, user, info) => {
        try {
          console.log(user)
          if (err || !user) {
            const error = new Error('An error occurred.');
            return next(error);
          }

          req.login(
            user,
            { session: false },
            async (error) => {
              if (error) return next(error);

              const body = { _id: user._id, user: user.user };
              const token = jwt.sign({ user: body }, 'TOP_SECRET');

              return res.json({ token });
            }
          );
        } catch (error) {
          
          return next(error);
        }
      }
    )(req, res, next);
  }
);

app.use(express.static(__dirname + 'public')); //Serves resources from public folder

app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req,res) =>{
  res.redirect("/login")
}) 
app.get('/login', (req,res,next) => {
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    console.log(err,user,info)
    if (!user){
      res.sendFile(path.join(__dirname + '/public/login.html'));
     
    } else {
      res.redirect("/admin")
    }
  })(req, res, next)
  
})

app.use('/admin', jsonParser,(req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    console.log(err,user,info)
    if (!user){
      res.redirect("/login")
    } else {
      next()
    }
  })(req, res, next)
 
} ,secureRoute);


const s3 = new AWS.S3({
  accessKeyId: process.env.ID,
  secretAccessKey: process.env.SECRET
});





const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, function () {
    console.log('Server is running..' + PORT);
});

