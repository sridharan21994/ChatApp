const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const Chat = require('mongoose').model('Chat');
const config = require('../../config');
const bcrypt = require('bcrypt');
const sample = require("../sampleData");
const router = new express.Router();
var mongoose = require("mongoose");

router.get("/search",(req,res)=>{
//    console.log(req.query.query);
    var patt = new RegExp("^"+req.query.query);
//    console.log(res.locals.user);
    let blockers=[];
    if(res.locals.user.block&&res.locals.user.blocked_by){
      blockers=[...res.locals.user.block, ...res.locals.user.blocked_by, res.locals.user.email];
    }else if(res.locals.user.block&&(!res.locals.user.blocked_by)){
      blockers=[...res.locals.user.block, res.locals.user.email];      
    }else if(res.locals.user.blocked_by&&(!res.locals.user.block)){
      blockers=[...res.locals.user.blocked_by, res.locals.user.email];      
    }else{
      blockers=[res.locals.user.email];
    }
  //  blockers=[res.locals.user.email];
    User.find( { name: { $regex: patt, $options: "i"  }, email: { $nin: blockers } },{_id:0,password:0,__v:0, convoList:0},(err,value)=>{
      if(err) { return res.status(401).end(); }
      return res.status(200).json({result:value});
    } );
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
   
    var userId = decoded.sub;
    userId = mongoose.Types.ObjectId(userId);
    // check if a user exists
    return User.findById( userId, (userErr, user) => {
      if (userErr || !user) {
        return res.status(401).end();
      }
        
      if(user.convoList.length===0){
        return res.status(200).json({
        name: user.name,
        email: user.email,
        threadList: [],
        contactList:[]
      });
      }else if(user.convoList.length>0){
         Chat.find({_id:{$in:user.convoList}},{ __v:0},function(err, data){
           if(err){console.log("error in dashboard: ", err.name); return res.status(401).end();}

           
           let contactList=[];
           let threadList=[];
           data.map((content,index)=>{  threadList[index]={};
                                        threadList[index]["convo_id"]= content._id;
                                        threadList[index].message=content.message;
                                        let lastMessage = threadList[index].message[threadList[index].message.length-1];
                                      if(content.initiator.sender_id===user.email){
                                        contactList.push({convo_id: content._id, 
                                                          name:content.initiator.receiver_name,
                                                          email:content.initiator.receiver_id,
                                                          lastMessage,
                                                          unread: content.unread});
                                      }else{
                                        contactList.push({convo_id: content._id, 
                                                          name:"ANONYMOUS",
                                                          email: "ANONYMOUS",
                                                          lastMessage,
                                                          unread: content.unread});      
                                      }
                                      
                                      });
 //console.log("dashboard data",{name: user.name,email: user.email,threadList: threadList,contactList: contactList});
           return res.status(200).json({
              name: user.name,
              email: user.email,
              threadList: threadList,
              contactList: contactList
            });
         })
      }  
      // return res.status(200).json({user:{
      //   name: user.name,
      //   email: user.email
      // }});
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

// router.get('/block', (req,res) => {
            
//              var query = JSON.parse(req.query.query);
//               console.log(query.block);
//              Chat.findOneAndUpdate({ _id: query.convo_id},
//                  { "initiator.block": query.block, "initiator.blocked_by": query.blocked_by },{new : true},
//                  function(err, chat){
//                     if(err){ console.log("error in blocking user"); return res.status(401).end(); };
//                     console.log("after ", chat.initiator);

//                    User.findOneAndUpdate({email:chat.initiator.block},{"blocked_by": chat.initiator.blocked_by },
//                       function(err,user){
//                         if(err){ console.log("error in blocking user"); return res.status(401).end(); };

//                       User.findOneAndUpdate({email:chat.initiator.blocked_by},{"block": chat.initiator.block },
//                       function(err,user){
//                         if(err){ console.log("error in blocking user"); return res.status(401).end(); };
                        
//                         return res.status(200).json({blocked: true});

//                       });
//                   });
                  
//              });

           

// });



module.exports = router;
