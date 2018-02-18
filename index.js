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
var favicon = require('serve-favicon');
var path = require('path');


// var users=[];
var clients={};

app.use(favicon(path.join(__dirname, 'favicon.ico')));

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
// const authSocketMiddleware = require('./server/middleware/auth-socket');

io.use(function (socket, next) {
  //console.log("socket for auth check", socket.id);
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, config.jwtSecret, function (err, decoded) {
      if (err) return next(new Error('Authentication error'));
      // console.log("check ",decoded);
      User.find({_id:decoded.sub}).limit(1).lean().exec((userErr, user) => {
        if (userErr || !user) {
          console.log("error");
          return next(new Error('Authentication error'));
        }
        socket.decoded = user[0];
        console.log("decoded socket email: ", user[0].email);
        return next();
      });
    });
  }
  next(new Error('Authentication error'));
});


io.on('connection', function (socket,user) {
      //   console.log("socket connected: ", socket.id);
         console.log('socket authenticated user: ', socket.decoded.email);
         clients[socket.decoded.email] = {
              "socket": socket.id
            };

            // users.unshift({
            //         id : socket.id,
            //         email : socket.decoded.email
            //       });
                  // let len = users.length;
                  // len--;
      console.log("connected users list: ",clients);
              // 	io.emit('userList', users, users[len].id); 

        socket.on('disconnect',()=>{

           for(var name in clients) {
                if(clients[name].socket === socket.id) {
                  delete clients[name];
                  break;
                }
              }	

		      	// for(let i=0; i < users.length; i++){
		        // 	if(users[i].id === socket.id){
            //    users.splice(i,1);  
            //    break;
            //   }     
            // }
        console.log("disconnected removed and updated users list: ",clients);            
        });
              
        socket.on("block-user", function(data,callback){ 

       console.log("blocked_by: ", socket.decoded.email, data.blocked_by);
          
             data.blocked_by = socket.decoded.email;
             Chat.find({ _id: data.convo_id}).limit(1).lean().exec(
                 function(err, chat){
                    if(err){ console.log("error in blocking user"); return false };
                      console.log("after ", chat);

                 if(chat)
                  {   if(chat[0].initiator.sender_id===data.blocked_by){
                            data.block= chat[0].initiator.receiver_id;

                            if(clients[data.block]){
                              socket.to(clients[data.block].socket).emit("youareblocked", 
                                    {convo_id: data.convo_id});
                            }
                          //           for(let i=0; i < users.length; i++){
                          //                     if(users[i].email === data.block){
                          // //                    console.log("youareblocked : ", data.block)
                          //                     socket.to(users[i].id).emit("youareblocked", 
                          //                       {convo_id: data.convo_id});
                          //                     break;
                          //                     }
                          //           }                              
                    }else if(chat[0].initiator.receiver_id===data.blocked_by){
                            data.block= chat[0].initiator.sender_id;

                            if(clients[data.block]){
                              socket.to(clients[data.block].socket).emit("youareblocked", 
                                     {convo_id: data.convo_id});
                            }
        //                 for(let i=0; i < users.length; i++){
        //                           if(users[i].email === data.block){
        //  //                         console.log("youareblocked : ", data.block)
        //                           socket.to(users[i].id).emit("youareblocked", 
        //                           {convo_id: data.convo_id});
        //                           break;
        //                           }
        //                 }                              
                    }
      //           console.log("-----------", data.block,chat.initiator.blocked_by, typeof data.block, typeof chat.initiator.blocked_by, data.convo_id);

                   User.findOneAndUpdate({email: data.block}, {$push: {"blocked_by": data.blocked_by}},function(err,user){
                        if(err){ console.log("error in blocking user"); return false };
                   User.findOneAndUpdate({email: data.blocked_by}, {$push: {"block": data.block}},function(err,user){
                        if(err){ console.log("error in blocking user"); return false };
                     data.convo_id = mongoose.Types.ObjectId(data.convo_id);
                   User.findOneAndUpdate({email: data.block},{$pull:{"convoList":data.convo_id} },function(err,user){
                        if(err){ console.log("error in blocking user"); return false };
                   User.findOneAndUpdate({email: data.blocked_by},{$pull:{"convoList":data.convo_id} },function(err,user){
                        if(err){ console.log("error in blocking user"); return false };
                                          

                      });
                  });                    

                      });
                  });        
                   }else{
                      callback({blocked:false});
                   }
                  
             });
              Chat.findOneAndRemove({_id:data.convo_id},function(err,chat){
                if(err){console.log("error in blocking user"); return false};
                callback({blocked:true,convo_id: data.convo_id});
              });
        });
          
        socket.on("unread",function(data,callback){
             Chat.findOneAndUpdate({_id:data.convo_id},{unread:false},function(err,res){
               if(err){console.log("error in unread: ", err.name); return false;}
             })
        });
 

          socket.on('send-message', function (data, callback) {
        //    console.log("receving from client");
         //   console.log(data);

            if (data.convo_id) {
              Chat.find({_id:data.convo_id}).limit(1).lean().exec(function(err,value){
                  if(err){console.log("error in data.convo_id: ", err.name); return false;}

                  if(socket.decoded.email===value[0].initiator.sender_id){
                      Chat.findOneAndUpdate({_id: data.convo_id}, {unread: data.message.unread, $push: {message: {receiver_id: value[0].initiator.receiver_id , text: data.message.text, time: data.message.time}}},
                      function (err, chat) {
                        if(err){console.log(err);return false;}
                       
         console.log("****************emitting old chat", value[0].initiator.receiver_id );
                       if (clients[value[0].initiator.receiver_id]){
                                socket.to(clients[value[0].initiator.receiver_id].socket).emit("message-received", {convo_id:chat._id, message: {receiver_id: value[0].initiator.receiver_id , text: data.message.text, time: data.message.time, unread: data.message.unread}});
                          }
                          // for(let i=0; i < users.length; i++){
                          //   if(users[i].email === value.initiator.receiver_id){
                          //     console.log("****************emitting old chat", {convo_id:chat._id, message: {receiver_id: value.initiator.receiver_id , text: data.message.text}}, "to user: ", users[i]);
                          //       socket.to(users[i].id).emit("message-received", {convo_id:chat._id, message: {receiver_id: value.initiator.receiver_id , text: data.message.text, time: data.message.time, unread: data.message.unread}});
                          //       break;
                          //   }
                          // }
                        });
                  }else if(socket.decoded.email===value[0].initiator.receiver_id){
                      Chat.findOneAndUpdate({_id: data.convo_id}, {unread: data.message.unread, $push: {message: {sender_id: value[0].initiator.receiver_id , text: data.message.text, time: data.message.time}}},
                      function (err, chat) {
                        if(err){console.log(err);return false;}
                           console.log("****************emitting old chat", value[0].initiator.sender_id );
                            if (clients[value[0].initiator.sender_id]){
                       socket.to(clients[value[0].initiator.sender_id].socket).emit("message-received", {convo_id:chat._id, message: {sender_id: value[0].initiator.receiver_id , text: data.message.text, time: data.message.time, unread: data.message.unread}});
                          }
                          //  for(let i=0; i < users.length; i++){
                          //   if(users[i].email === value.initiator.sender_id){
                          //     console.log("****************emitting old chat", {convo_id:chat._id, message: {sender_id: value.initiator.receiver_id , text: data.message.text}}, "to user: ", users[i]);
                          //       socket.to(users[i].id).emit("message-received", {convo_id:chat._id, message: {sender_id: value.initiator.receiver_id , text: data.message.text, time: data.message.time, unread: data.message.unread}});
                          //       break;
                          //   }
                          // }
                        });
                  }
              });

            } else {
            
          function execute(){
            //  for(var i=0; i < users.length; i++){
            //           if(users[i].email === data.message.receiver_id){
            //             break;
            //           }
            //   }
              var newChat = new Chat({
                message: {
                   receiver_id: data.message.receiver_id,
                   text: data.message.text,
                   time: data.message.time
                },
                initiator: {
                  sender_id: socket.decoded.email,
                  sender_name: socket.decoded.name,
                  receiver_id: data.message.receiver_id,
                  receiver_name: data.message.receiver_name
                },
                unread: data.message.unread,
                fb_details:{
                  receiver_id: data.fb_id?data.fb_id:undefined
                }
              });

              newChat.save((err, chat) => {
                if (err) {console.log(err);return false;}
            //    console.log(chat);

                User.update({email:{$in:[chat.initiator.sender_id,chat.initiator.receiver_id]}},{$push:{convoList: chat._id}},{multi:true,new: true},function(err,user){
                  if(err){console.log(err); return false;}
                  console.log("--------",user);
                       console.log("hack check new chat", user.block, user.blocked_by,chat.initiator.sender_id,chat.initiator.receiver_id);
                      if((user.block&&user.block.indexOf(chat.initiator.sender_id)!==-1)||
                      (user.block&&user.block.indexOf(chat.initiator.receiver_id)!==-1)||
                      (user.blocked_by&&user.blocked_by.indexOf(chat.initiator.sender_id)!==-1)||
                      (user.blocked_by&&user.blocked_by.indexOf(chat.initiator.receiver_id)!==-1)){
                           console.log("-*-*-* hack true");
                      }
  
                   if(clients[data.message.receiver_id]){
                     console.log("****************emitting new chat: ", {convo_id:chat._id, message:chat.message}," to user: ", data.message.receiver_id, clients[data.message.receiver_id].socket);
                  socket.to(clients[data.message.receiver_id].socket).emit("message-received", {convo_id:chat._id,
                                                                  sender_name: "ANONYMOUS", 
                                                                  message:chat.message,
                                                                  lastMessage: chat.message[chat.message.length-1],
                                                                  unread: chat.unread  
                                                                }); 
                   }
                    
                  // if(users[i]){
                  // console.log("****************emitting new chat: ", {convo_id:chat._id, message:chat.message}," to user: ", users[i]);
                  // socket.to(users[i].id).emit("message-received", {convo_id:chat._id,
                  //                                                 sender_name: "ANONYMOUS", 
                  //                                                 message:chat.message,
                  //                                                 lastMessage: chat.message[chat.message.length-1],
                  //                                                 unread: chat.unread  
                  //                                               });  }                  
                });

               
               
               
                callback({
                  convo_id: chat._id,
                  receiver_id: chat.initiator.receiver_id,
                  lastMessage: chat.message[chat.message.length-1],
                  fb_id: data.fb_id
                });
              });
          }




             if(data.fb_id){
            User.find({"fb_details.id" : data.fb_id}).limit(1).lean().exec(function(err,user){
                 if(err){console.log(err); return false;}
                 console.log(user[0]);
                 data.message.receiver_id = user[0].email;
                //  data.message.receiver_name = user.name;
                 execute();
            })}else{
              execute();
            }

              
            }
          });
});


   Chat.collection.indexes(function(error, indexes){
     if(error){console.log(error);}
    console.log("indexes:", indexes);
    // ...
});
console.log("*******", User.collection.getIndexes({full:true}) );

// tell the app to look for static files in these directories
app.use(express.static('./server/static/'));
app.use(express.static('./client/dist/'));
// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

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