
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.render('index.ejs');
});
app.use(express.static('public'));

io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🟢 <strong>' + socket.username + '</strong> <i>joined the session.</i>');
        
    });

    socket.on('disconnect', function(username) {
        io.emit('is_offline', '🔴 <strong>' + socket.username + '</strong> <i>left the session.</i>');
        
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
        
    });

});

const server = http.listen(process.env.PORT || 8080, function() {
    console.log('Ready: Port ' + process.env.PORT || 8080);
});
