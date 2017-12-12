const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const config = require('../../config');
const bcrypt = require('bcrypt');
const sample = require("../sampleData");
const router = new express.Router();
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log("Socket Ready");
   socket.on("user-connected",function(data){
       console.log(data);
   });
    // broadcast a user's message to other users
    socket.on('send-message', function (data) {
        console.log("receving from client");
        console.log(data.text);
        io.emit('message', {
            text: data.text
        });
    });
    socket.on("disconnected",function(){
        console.log("user disconnected")
    })
})

router.get("/search",(req,res)=>{
    console.log(req.query.query);
    var patt = new RegExp("^"+req.query.query);
    User.find( { name: { $regex: patt, $options: "i"  } },{_id:0,password:0,__v:0},(err,value)=>{
      if(err) { return res.status(401).end(); }
      return res.status(200).json({result:value});
    } )
});

// router.get("/sampledata",(req,res)=>{
//   console.log("total no of data available", sample.length);
//   for(var i=0; i < sample.length; i++){

//     console.log(sample[i]);
//     const newUser = new User(sample[i]);
//  newUser.save((err, user) => {
//     if (err) { return done(err); }

//     return res.status(200);
//   });
//   }
// });

router.get('/dashboard', (req, res) => {

  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];
  
  //decode the token and verify
  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).end(); }

    const userId = decoded.sub;

    // check if a user exists
    return User.findById(userId, (userErr, user) => {
      if (userErr || !user) {
        return res.status(401).end();
      }

      return res.status(200).json({user:{
        name: user.name,
        email: user.email
      }});
    });
  });
  
  
  // res.status(200).json({
  //   message: "You're authorized to see this secret message. sdbkakdjas"
  //   });
});

router.post('/editprofile', (req, res) => {
   var hashedpassword = "";
  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];
  const data={
              name: req.body.name,
              newpassword: req.body.newpassword 
            };
   console.log(data);

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).end(); }
    
    
    //token decoded
    const userId = decoded.sub;

    // check if a user exists
    return User.findById(userId, (userErr, user) => {
      if (userErr || !user) {
        return res.status(401).end();
      }

      // check if user name already exists or not 
      if(user.name===data.name){

        //hashing the password before saving
  //       bcrypt.genSalt((saltError, salt) => {
  //   if (saltError) { return res.status(400).json({
  //         success: false,
  //         message: saltError
  //       }); }

  //   return bcrypt.hash(data.newpassword, salt, (hashError, hash) => {
  //     if (hashError) { return res.status(400).json({
  //         success: false,
  //         message: hashError
  //       }); } 
  //     // replace a password string with hash value
  //      hashedpassword = hash;
  //      console.log(hashedpassword);

  //   });
  // });
       return User.update( {_id: user.id}, { password: data.newpassword }, function (err, result) {
          if (err)  return res.status(400).json({
                                               success: false,
                                               message: "try again !unknown error"});

                                      console.log(result)
      return res.status(200).json({user:{
                                          name: result.name,
                                          email: result.email
                                           },
                                   success: true});
   });

      } else{
          return User.find({name: data.name}, (err, result)=>{
              if(err) return res.status(400).json({success: false,
                                                    message: "try again !unknown error"});
              if(result.length!==0) {
                console.log(result)
                return res.status(400).json({success: false,
                                      message: "User name already taken. Please choose some other user name "});
              }else{

                //hashing the password before saving
  //       bcrypt.genSalt((saltError, salt) => {
  //   if (saltError) { return res.status(400).json({
  //         success: false,
  //         message: saltError
  //       }); }

  //   return bcrypt.hash(data.newpassword, salt, (hashError, hash) => {
  //     if (hashError) { return res.status(400).json({
  //         success: false,
  //         message: hashError
  //       }); } 

  //     // replace a password string with hash value
  //      hashedpassword = hash;
  //   });
  // });
                 return User.update( {_id: user.id}, 
                      { name: data.name, password: data.newpassword },
                  function (err, result) {
                      if (err) return res.status(400).json({success: false,
                                      message: "try again !unknown error"});
                      return res.status(200).json({user:{
                                                         name: result.name,
                                                         email:result.email
                                                          },
                                                  success: true});
   });
              }
              
          }).limit(1);
      }
      // return res.status(200).json({user});
    });
  });
  
  
  // res.status(200).json({
  //   message: "You're authorized to see this secret message. sdbkakdjas"
  //   });
});



module.exports = router;
