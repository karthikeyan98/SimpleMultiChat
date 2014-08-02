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
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write('hello world');
			response.end(); 
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

readGoogleDocs();
function readGoogleDocs(){
	//SpreadSheat url
	//https://docs.google.com/spreadsheets/d/1fyZ0jib5ARvxWiagjPSB-0iapIe32aH5FOZioum7qyw/edit
	var GoogleSpreadsheet = require("google-spreadsheet");

	var my_sheet = new GoogleSpreadsheet('1fyZ0jib5ARvxWiagjPSB-0iapIe32aH5FOZioum7qyw');

	// without auth -- read only
	// # is worksheet id - IDs start at 1
	/*my_sheet.getRows( 1, function(err, row_data){
		//console.log( 'pulled in '+row_data.length + ' rows ')
		console.log(row_data);
	});*/

	// set auth to be able to edit/add/delete
	my_sheet.setAuth('AvnetPremierLeague@gmail.com','intel045', function(err){
		my_sheet.getInfo( function( err, sheet_info ){
			console.log( sheet_info.title + ' spreadsheet is loaded' );
			// use worksheet object if you want to forget about ids
			sheet_info.worksheets[0].getRows( function( err, rows ){
				//rows[0].colname = 'new val';
				//;prows[0].save();
				//rows[0].del();
				//console.log("rows=%j",rows[0]	);
				
				//Writing
				rows[0].apple="orange"
				rows[0].save();
				
				//Reading
				console.log("row[1].apple=",rows[1].apple	);
			});
		});

		// column names are set by google based on the first row of your sheet
		//my_sheet.addRow( 2, { colname: 'col value'} );
	/*
		my_sheet.getRows( 2, {
			start: 100,            // start index
			num: 100            // number of rows to pull
		}, function(err, row_data){
			// do something...
		}); */
	})
}
