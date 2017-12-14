const express = require('express');
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

router.get("/check",(req,res)=>{
    console.log("checked");
});

module.exports = router;