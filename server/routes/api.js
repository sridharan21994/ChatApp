const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const config = require('../../config');
const bcrypt = require('bcrypt');


const router = new express.Router();

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

      return res.status(200).json({user});
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
  const data={name: req.body.name,
              newpassword: req.body.newpassword };
   console.log(data)
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
       return User.update( {_id: user.id}, 
                      { password: data.newpassword },
   function (err, result) {
      if (err)  return res.status(400).json({success: false,
                                      message: "try again !unknown error"});

                                      console.log(result)
      return res.status(200).json({result,
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
                      return res.status(200).json({user,
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
