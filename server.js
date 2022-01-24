const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// URLs
app.use(express.static('public'));
global.path='';

app.get('*', function(req, res, next) {
    path = req.originalUrl;
    var date = String(new Date()).substring(0,24) +" ET";
    console.log(date + " | Request through  " + path)
    if(path=='/'){
        res.render('index.ejs');
        console.log(date + " |      - Rendered     index.ejs")
    }
    else {
        res.render('room.ejs');
        console.log(date + " |      - Rendered     room.ejs")
    }
    next();
});

// Socket events
io.sockets.on('connection', function(socket) {
    var confirmedPath="␜" + path + "␜";
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('on', confirmedPath + '🟩&#11166;&nbsp;&nbsp;&nbsp;&nbsp;<b>' + socket.username + '</b> <i>joined the session.</i>');
        
    });

    socket.on('disconnect', function(username) {
        io.emit('off', confirmedPath + '🟥&#11164;&nbsp;&nbsp;&nbsp;&nbsp;<b>' + socket.username + '</b> <i>left the session.</i>');
        
    })
    //🟦
    socket.on('msg', function(message) {
        io.emit('message', confirmedPath + '<b>' + socket.username + '</b>&nbsp;&nbsp;&nbsp;' + message);
        
    });

});

// Server
const server = http.listen(process.env.PORT || 80, function() { 
    var date = String(new Date()).substring(0,24) +" ET";
    console.log( date + ' | Server started.');
});
