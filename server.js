var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

const { Client } = require('pg');

const con = new Client({
	connectionString: 'postgres://tetlfqkrppwndm:f717349df9ebc16b8a31c0f726e22a8c72d3912626407ed15a9aa57a6f02bb38@ec2-174-129-32-240.compute-1.amazonaws.com:5432/d7l52ndc5vfa8e',
	ssl: true
});

con.connect();

http.listen(port, function(){
  console.log('listening on port ' + port + ', time to try not to fail...');
});

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/form', function(req, res){
	res.sendFile(__dirname + '/form.html');
});

var i = 0;
io.on('connection', function(socket){
	  socket.on('disconnect', function(data){
    io.sockets.emit('user disconnect', { user : socket.username});
});
	socket.on('request', function(){
		con.query('SELECT * FROM todo;', function(err, result){
	    if (err) throw err;
		socket.emit('give', result.rows);
	});
	});
	socket.on('write on file', function(writyboi, pass){
		if(pass == "youeatallmybeans"){
  			 	con.query('INSERT INTO todo VALUES(DEFAULT,\''+writyboi+'\');', function (err) {
    			if (err) throw err;
  			});
	 	console.log('Saved!');
	 }else{
	 	console.log('Wong passwod');
	 }
	});
	socket.on('remove from file', function(delet, pass){
		if(pass == "youeatallmybeans"){
		con.query('DELETE FROM todo WHERE todo.id = '+delet, function (err) {
    			if (err) throw err;
  			});
		console.log('Deleted!');
	}else{
		console.log('You playin with dat pass deletin');
	}
	})
});