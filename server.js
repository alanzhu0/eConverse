const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


// URLs
app.use(express.static('public'));




app.set('subdomain offset', 1); // 1 for local, 2 for example.com, 3 for econverse.herokuapp.com, 4 for econverse.sites.tjhsst.edu, ...
app.get('*', function(req, res, next) {
    if(req.subdomains.length===0){
        res.render('index.ejs');
        console.log('a');
    }
    else {
        res.render('room.ejs');
    }
    next();
});


// Socket events
io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('on', '🟩&#11166;&nbsp;&nbsp;&nbsp;&nbsp;<strong>' + socket.username + '</strong> <i>joined the session.</i>');
        
    });

    socket.on('disconnect', function(username) {
        io.emit('off', '🟥&#11164;&nbsp;&nbsp;&nbsp;&nbsp;<strong>' + socket.username + '</strong> <i>left the session.</i>');
        
    })
    //🟦
    socket.on('msg', function(message) {
        io.emit('message', '<strong>' + socket.username + '</strong>&nbsp;&nbsp;&nbsp;' + message);
        
    });

});

const date = String(new Date()).substring(0,24) +" ET";
// Server
const server = http.listen(process.env.PORT || 80, function() { 
    console.log( date + ' | Server started.');
}); 
