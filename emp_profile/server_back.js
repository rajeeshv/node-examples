var http = require('http');
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var querystring=require('querystring');
var employeeSchema = mongoose.Schema({
    name: String,
    designation: String,
    skill: [String]
});
var EmployeeModel = mongoose.model('Employee', employeeSchema);
var onErr = function(err,callback){
    mongoose.connection.close();
    callback(err);
};
 
                                      
http.createServer(function (request, response) {
    console.log(request.method);
    if (request.method == 'POST') {
        
        var chunk = '';
        request.on('data', function (data) {
            chunk += data;
        });
        request.on('end', function () {
            console.log(chunk + "<-Posted Data Test");
            
            var jsondata = querystring.parse(chunk);
            
            console.log(jsondata);
            
           var db = mongoose.connect('mongodb://root:asd123@localhost/test');
            
           // var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'connection error:'));
            db.once('open', function callback () {
               
                var employee = new EmployeeModel({
                    name: jsondata.employeeName,
                    designation: jsondata.designation,
                    skill: jsondata.skill
                });
                //console.log(employee.name); // 'Silence'

                employee.save(function (err, fluffy) {
                    if (err) // TODO handle the error
                        console.log("Error:"+err);
                });

                if(err){
                    onErr(err,callback);
                }else{
                    mongoose.connection.close();
                
                }
            });
        });
    }
 
    console.log('request starting...');
     
    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';
         
    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.gif':
            contentType = 'image/gif';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }
    console.log("Filepath:"+filePath);
    path.exists(filePath, function(exists) {
     
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    
                    
                    var onErr = function(err,callback){
                        mongoose.connection.close();
                        callback(err);
                    };
                    mongoose.connect('mongodb://localhost/test');
                    var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'connection error:'));
                    db.once('open', function callback () {
                       
                        EmployeeModel.find({}, function (err, docs) {
console.log(err);
                            //console.log(docs.length);
                            var res = "<form action=\"list.html\"><input type=\"text\" name=\"searchText\"><input type=\"submit\" value=\"Search\"></form>";
                            res+="<table border=\"1\"><th>Name</th><th>Designation</th><th>Skill</th>";
                            for(i=0; i<docs.length;i++) {
                                res+="<tr><td>"+docs[i].name+"</td><td>"+docs[i].designation+"</td><td>"+docs[i].skill+"</td></tr>"; 
                            }
                            res+="</table>";
                            console.log("Request URL:"+request.url);
                            if(request.url!="/list.html") {
                                response.end(content, 'utf-8');  
                            }
                            else {
                                response.end(res, 'utf-8'); 
                            }
                            if(err){
                                onErr(err,callback);
                            }else{
                                mongoose.connection.close();
                            // console.log(docs);
                            }
                           
                        });
                        
                    });
                    
                }
               
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });
     
}).listen(8126);
 
console.log('Server running at http://127.0.0.1:8125/');
