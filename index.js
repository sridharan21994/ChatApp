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
              }     
            }
        console.log("disconnected and connected users list: ",users);            
        });
              
          // broadcast a user's message to other users
          socket.on('send-message', function (data, callback) {
            console.log("receving from client");
            console.log(data);

            if (data.convo_id) {
              Chat.findOneAndUpdate({_id: data.convo_id}, {$push: {message: data.message}}, 
                function (err, chat) {
                    if(err){console.log(err);return false;}
                    for(let i=0; i < users.length; i++){
                      if(users[i].email === data.message.receiver_id){
                        console.log("****************emitting old chat", {convo_id:chat._id, message:data.message}, "to user: ", users[i]);
                          socket.to(users[i].id).emit("message-received", {convo_id:chat._id, message:data.message});
                      }
                    }

                // callback("updated");
              })
            } else {
               for(var i=0; i < users.length; i++){
                      if(users[i].email === data.message.receiver_id){
                        break;
                      }
              }
              var newChat = new Chat({
                message: {
                   sender_id: data.message.sender_id,
                   receiver_id: data.message.receiver_id,
                   text: data.message.text
                },
                initiator: {
                  sender_id: data.message.sender_id,
                  sender_name: data.message.sender_name,
                  receiver_id: data.message.receiver_id,
                  receiver_name: data.message.receiver_name
                }
              });

              newChat.save((err, chat) => {
                if (err) {console.log(err);return false;}
                console.log(chat);

             
                User.update({email:{$in:[chat.message[0].sender_id,chat.message[0].receiver_id]}},{$push:{convoList:chat._id}},{multi:true},function(err,user){
                  if(err){console.log(err); return false;}

                if(users[i]){
                console.log("****************emitting new chat: ", {convo_id:chat._id, message:chat.message}," to user: ", users[i]);
                socket.to(users[i].id).emit("message-received", {convo_id:chat._id,
                                                                 sender_name: data.message.sender_name, 
                                                                 message:[chat.message]});  }                  
                });

                callback({
                  convo_id: chat._id,
                  receiver_id: data.message.receiver_id
                });
              });
            }
            // io.emit('message', {
            //     text: data.text
            // });
          });
});

// io.sockets
//   .on('connection', socketioJwt.authorize({
//     secret: config.jwtSecret,
//     timeout: 15000
//     })).on('authenticated', function(socket) {
//     //this socket is authenticated, we are good to handle more events from it. 
//     console.log('hello! ' + socket.decoded_token.name);
//     socket.on("user-connected",function(data){
//         console.log(data);
//       });
//        socket.on('send-message', function (data) {
//         console.log("receving from client");
//         console.log(data.text);
//         io.emit('message', {
//             text: data.text
//         });
//     });
//   });


// io.on('connection', function (socket) {
//     console.log("Socket Ready");
//    socket.on("user-connected",function(data){
//        console.log(data);
//    });
//     // broadcast a user's message to other users
//     socket.on('send-message', function (data) {
//         console.log("receving from client");
//         console.log(data.text);
//         io.emit('message', {
//             text: data.text
//         });
//     });
//     socket.on("disconnected",function(){
//         console.log("user disconnected")
//     })
// });

// connect to the database and load models
// require('./server/models').connect(config.dbUri);

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