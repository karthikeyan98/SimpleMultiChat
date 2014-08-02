 /**
 * @author Karthi
 * www.coolcomputerpctricks.com
 * Server.js - Main Server js file for multichat in node.js socket.io
 *
 */
 var http = require("http");
 var url = require('url');
 var fs = require('fs');
 var io = require('socket.io');

var server = http.createServer(function(request, response){
	
	var path = url.parse(request.url).pathname;
	console.log('Path='+path);
	switch(path){
		case '/':			
			fs.readFile(__dirname + "/index.html", function (error, data) {
				if (error) {
					response.writeHead(404);
					response.write("opps this doesn't exist - 404");
					response.end();  
				}  
				else{	
					response.writeHeader(200, {"Content-Type": "text/html"});  
					response.write(data, "utf8");
					response.end();  
				}
			});
			break;
			
		case '/socket.html':
			fs.readFile(__dirname + path, function (error, data) {
				if (error) {
					response.writeHead(404);
					response.write("opps this doesn't exist - 404");
					response.end();  
				}  
				else{	
					response.writeHeader(200, {"Content-Type": "text/html"});  
					response.write(data, "utf8");
					response.end();  
				}
			});
			break;
			
		default:
			console.log(path +"- Not found");
			response.writeHead(404);
			response.write("opps this doesn't exist - 404");
			response.end();
			break;
	}
	
});

server.listen(8001);
console.log("Server Started in port 8001");

var serv_io = io.listen(server);
var textarea="";
var name="";
serv_io.sockets.on('connection', function(socket){
	//send data to client
	setInterval(function(){		
        socket.emit('date', {'date': getCurrentTime()}
	);
		
    }, 1000);
	
	socket.on('client_data', function(data){
		textarea=data.textarea;
		name=data.name;
		console.log("name="+name);
		//socket.emit('textarea', {'textarea': data.textarea});
		emitData(socket);
	});
	
    
});

function emitData(socket){	
	socket.broadcast.emit('message', 
		{'date': getCurrentTime(),
		 'name' : name,
		 'textarea':textarea
		}
	);
}

function getCurrentTime(){
	var d = new Date();
	var curr_date = d.getDate();
	var curr_month = d.getMonth()+1;
	var curr_year = d.getFullYear();
	var curr_hour = d.getHours()%12 +"";
	var curr_min = d.getMinutes() + "";
	var curr_sec = d.getSeconds() + "";
	if(curr_hour.length == 1)
		curr_hour="0"+curr_hour;
	if(curr_min.length == 1)
		curr_min="0"+curr_min;
	if(curr_sec.length == 1)
		curr_sec="0"+curr_sec;
	
	//var dateString = sprintf("%2s-%2s-%s %2s:%2s:%2s ",curr_date,curr_month,curr_year,curr_hour,curr_min,curr_sec);
	var dateString = curr_date + "-" + curr_month + "-" + curr_year + "  " + curr_hour +":"+ curr_min +":"+ curr_sec;
	
	return dateString;
}

