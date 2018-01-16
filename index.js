const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
// var socketioJwt   = require("socketio-jwt");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
var users=[];

mongoose.connect(config.dbUri);
// plug in the promise library:
mongoose.Promise = global.Promise;


mongoose.connection.on('error', (err) => {
  console.error(`Mongoose connection error: ${err}`);
  process.exit(1);
});

// load models
require('./server/models/user');
require("./server/models/chat");

const User = require('mongoose').model('User');
const Chat = require('mongoose').model('Chat');


// io.use(socketioJwt.authorize({
//   secret: config.jwtSecret,
//   handshake: true,
//   timeout:15000
// }));
const authCheckMiddleware = require('./server/middleware/auth-check');
const authSocketMiddleware = require('./server/middleware/auth-socket');

io.use(function (socket, next) {
  //console.log("socket for auth check", socket.id);
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, config.jwtSecret, function (err, decoded) {
      if (err) return next(new Error('Authentication error'));
      // console.log("check ",decoded);
      User.findById(decoded.sub, (userErr, user) => {
        if (userErr || !user) {
          console.log("error");
          return next(new Error('Authentication error'));
        }
        socket.decoded = user;
        // console.log(user);
        return next();
      });
    });
  }
  next(new Error('Authentication error'));
});


io.on('connection', function (socket,user) {
      //   console.log("socket connected: ", socket.id);
         console.log('socket authenticated user: ', socket.decoded.name);

            users.unshift({
                    id : socket.id,
                    email : socket.decoded.email
                  });
                  // let len = users.length;
                  // len--;
      console.log("connected users list: ",users);
              // 	io.emit('userList', users, users[len].id); 

        socket.on('disconnect',()=>{
		      	for(let i=0; i < users.length; i++){
		        	if(users[i].id === socket.id){
               users.splice(i,1);  
               break;
              }     
            }
        console.log("disconnected and connected users list: ",users);            
        });
              
        socket.on("block-user", function(data,callback){

          for(let i=0; i < users.length; i++){
                 if(users[i].email === data.block){
                   socket.to(users[i].id).emit("youareblocked", 
                     {convo_id: data.convo_id, blocked_by: data.blocked_by});
                     break;
                  }
          } 

             Chat.findOneAndUpdate({ _id: data.convo_id},
                 { "initiator.block": data.block, "initiator.blocked_by": data.blocked_by },{new : true},
                 function(err, chat){
                    if(err){ console.log("error in blocking user"); return false };
                    console.log("after ", chat.initiator);
                                      

                   User.findOneAndUpdate({email:chat.initiator.block},{"blocked_by": chat.initiator.blocked_by },
                      function(err,user){
                        if(err){ console.log("error in blocking user"); return false };

                      User.findOneAndUpdate({email:chat.initiator.blocked_by},{"block": chat.initiator.block },
                      function(err,user){
                        if(err){ console.log("error in blocking user"); return false };


                        
                        callback({blocked:true});

                      });
                  });
                  
             });
        });

          socket.on('send-message', function (data, callback) {
            console.log("receving from client");
            console.log(data);

            if (data.convo_id) {
              Chat.findById(data.convo_id,function(err,value){
                  if(err){console.log("error in data.convo_id: ", err.name); return false;}

                  if(socket.decoded.email===value.initiator.sender_id){
                      Chat.findOneAndUpdate({_id: data.convo_id}, {$push: {message: {receiver_id: value.initiator.receiver_id , text: data.message.text}}}, 
                        function (err, chat) {if(err){console.log(err);return false;}

                          for(let i=0; i < users.length; i++){
                            if(users[i].email === value.initiator.receiver_id){
                              console.log("****************emitting old chat", {convo_id:chat._id, message: {receiver_id: value.initiator.receiver_id , text: data.message.text}}, "to user: ", users[i]);
                                socket.to(users[i].id).emit("message-received", {convo_id:chat._id, message: {receiver_id: value.initiator.receiver_id , text: data.message.text}});
                                break;
                            }
                          }
                        });
                  }else if(socket.decoded.email===value.initiator.receiver_id){
                      Chat.findOneAndUpdate({_id: data.convo_id}, {$push: {message: {sender_id: value.initiator.receiver_id , text: data.message.text}}}, 
                        function (err, chat) {if(err){console.log(err);return false;}
                           
                           for(let i=0; i < users.length; i++){
                            if(users[i].email === value.initiator.sender_id){
                              console.log("****************emitting old chat", {convo_id:chat._id, message: {sender_id: value.initiator.receiver_id , text: data.message.text}}, "to user: ", users[i]);
                                socket.to(users[i].id).emit("message-received", {convo_id:chat._id, message: {sender_id: value.initiator.receiver_id , text: data.message.text}});
                                break;
                            }
                          }
                        });
                  }
              });

              // Chat.findOneAndUpdate({_id: data.convo_id}, {$push: {message: data.message}}, 
              //   function (err, chat) {
              //       if(err){console.log(err);return false;}
              //       for(let i=0; i < users.length; i++){
              //         if(users[i].email === data.message.receiver_id){
              //           console.log("****************emitting old chat", {convo_id:chat._id, message:data.message}, "to user: ", users[i]);
              //             socket.to(users[i].id).emit("message-received", {convo_id:chat._id, message:data.message});
              //             break;
              //         }
              //       }

              //   // callback("updated");
              // })
            } else {
               for(var i=0; i < users.length; i++){
                      if(users[i].email === data.message.receiver_id){
                        break;
                      }
              }
              var newChat = new Chat({
                message: {
                   receiver_id: data.message.receiver_id,
                   text: data.message.text
                },
                initiator: {
                  sender_id: socket.decoded.email,
                  sender_name: socket.decoded.name,
                  receiver_id: data.message.receiver_id,
                  receiver_name: data.message.receiver_name
                }
              });

              newChat.save((err, chat) => {
                if (err) {console.log(err);return false;}
                console.log(chat);

             
                User.update({email:{$in:[chat.initiator.sender_id,chat.initiator.receiver_id]}},{$push:{convoList:{$each:[chat._id],$position: 0}}},{multi:true},function(err,user){
                  if(err){console.log(err); return false;}

                if(users[i]){
                console.log("****************emitting new chat: ", {convo_id:chat._id, message:chat.message}," to user: ", users[i]);
                socket.to(users[i].id).emit("message-received", {convo_id:chat._id,
                                                                 sender_name: "ANONYMOUS", 
                                                                 message:chat.message});  }                  
                });

                callback({
                  convo_id: chat._id,
                  receiver_id: chat.initiator.receiver_id
                });
              });
            }
            // io.emit('message', {
            //     text: data.text
            // });
          });
});


// tell the app to look for static files in these directories
app.use(express.static('./server/static/'));
app.use(express.static('./client/dist/'));
// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({
  extended: false
}));
// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);


// pass the authorization checker middleware
app.use('/api', authCheckMiddleware);


// routes
const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get("/*", function (req, res) {
  res.sendFile(__dirname + '/server/static/index.html')
})

// start the server
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000 or http://192.168.0.108:3000');
});