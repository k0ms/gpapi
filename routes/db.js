
//includes
var mongo = require('mongodb');
var db_cfg = require('../config/db_config');

//Global Variables
var Server = mongo.Server;
var Db = mongo.Db;
var server = new Server(db_cfg.url, db_cfg.port, {auto_reconnect: true});
db = new Db(db_cfg.name, server);

console.log(db_cfg.uname+" "+db_cfg.pword); 
//Private Methods
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'mongohq' database");
        db.authenticate(db_cfg.uname, db_cfg.pword, function(err, db) {
			if(err) {
		    	console.log("Authenticate Failed");
			}
			else {
				console.log("Authenticate Successful");
			}
		});

        db.createCollection('users', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'users' collection doesn't exist. Creating it with sample data...");
                //populateDB();
            }
        });
    }
    else{console.log("DB open error")}
});



/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var users = [
    {
        lastname: "Samaniego",
        firstname: "Mark Lester",
        email: "mark.samaniego@gmail.com",
        password: "abc123"
    },
    {
        lastname: "Malabanan",
        firstname: "Jeico",
        email: "ajp.malabanan@gmail.com",
        password: "123abc"
    }];
 
    db.collection('users', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {});
    });
 
};

exports.db = db;