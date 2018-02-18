const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const Chat = require('mongoose').model('Chat');
const config = require('../../config');
const bcrypt = require('bcrypt');
const sample = require("../sampleData");
const router = new express.Router();
var mongoose = require("mongoose");
 

router.post("/fb-info",(req,res)=>{
         console.log(res.locals.user.email, req.body.friendsList);
         User.findOneAndUpdate({email: res.locals.user.email}, {name: req.body.name, fb_details: req.body},function(err,value){
           if(err){console.log("fb error",err.name); return res.status(400).end();}
           res.send({status:"ok"});
         })
});

router.get("/search",(req,res)=>{ 
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
    User.find( { name: { $regex: patt, $options: "i"  }, email: { $nin: blockers } },{name:1,email:1, "fb_details.id":1,"fb_details.name":1 }).limit(15).lean().exec((err,value)=>{
      if(err) { return res.status(401).end(); }
   //   console.log(value);
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
  
      if(res.locals.user.convoList.length===0){
        return res.status(200).json({
        name: res.locals.user.name,
        email:res.locals.user.email,
        fb_details: res.locals.user.fb_details,
        threadList: [],
        contactList:[]
      });
      }else if(res.locals.user.convoList.length>0){
         Chat.find({_id:{$in:res.locals.user.convoList}},{ __v:0},function(err, data){
           if(err){console.log("error in dashboard: ", err.name); return res.status(401).end();}
           
           let contactList=[];
           let threadList=[];
           data.map((content,index)=>{  threadList[index]={};
                                        threadList[index]["convo_id"]= content._id;
                                        threadList[index].message=content.message;
                                        let lastMessage = threadList[index].message[threadList[index].message.length-1];
                                      if(content.initiator.sender_id===res.locals.user.email){
                                        contactList.push({convo_id: content._id, 
                                                          name:content.initiator.receiver_name,
                                                          email:content.initiator.receiver_id,
                                                          fb_id: (content.fb_details&&content.fb_details.receiver_id)?content.fb_details.receiver_id:"",
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
              name: res.locals.user.name,
              email: res.locals.user.email,
              fb_details: res.locals.user.fb_details,
              threadList: threadList,
              contactList: contactList
            });
         })
      }  
      // return res.status(200).json({user:{
      //   name: user.name,
      //   email: user.email
      // }});
   
  
  
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
