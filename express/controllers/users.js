var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var cors = require('cors');

var fs = require("fs");
var Promise = require("promise");
var concat = require("concat-stream");

function controllers(params)
{
  	var app = params.app;
  	var db = params.db;  	  	

  	var putRoute = "_db/_system/wishpool/users";	// configure users collection	
	var collectionName = "wishpool_users";     	

	collectionPromise = new Promise(function(resolve, reject) {
	    db.collection(collectionName, false, function(err, res) {
	        if (err) {
	            reject(err);
	        }
	        else {
	            resolve(res);
	        }
	    });
	});

	collectionPromise.then(null, function(err) {
	  	console.log("Cannot contact the database! Terminating...");
	  	process.exit(1);
	});  	
  	
  	controllers.checkExistusers = function( ) {	  	
	  	collectionPromise.then(function(collection) {
	    	collection.document(null,function(err, x) {
	        	 if (err) {
	             	// for production we should implement more sophisticated handling here. Like logging where appropriate etc.
	              	res.status(err.code);
	              	res.json(err.code);
	          	}
	          	else {
	          		console.log(JSON.stringify(x, undefined, 2));
	              	res.json(x);
	          	}
	      	});
	  	}, null);  // if this were rejected, we would be out already
		
  	}
  	
  	////////////////////////////////////////////////////////////////////////////////
	/// AJAX services:
	////////////////////////////////////////////////////////////////////////////////
	app.get('/users', function(req, res, next) {
		sess = req.session;

		res.send('respond with a users resource');
  	}); 
	
	app.get("/users/:key", function (req, res) {
	  var key = req.params["key"];	  
	  collectionPromise.then(function(collection) {	  		
	      collection.document(key, function(err, x) {
	          if (err) {
	              // for production we should implement more sophisticated handling here. Like logging where appropriate etc.
	              res.status(err.code);	              
	              res.json({msg: err.code});
	          }
	          else {
	              res.json(x);
	          }
	      });
	  }, null);  // if this were rejected, we would be out already
	});	

	app.post("/users", function (req, res) {			
		collectionPromise.then(function(collection) {	  		
	      	console.log(req.body);
	      	collection.save(req.body, function (err, result) {
			  if (err) {
			    console.log('error: %j', err); 
			    res.json({msg: err});
			  } else {
			    console.log('result: %j', result._id); 
			    res.json({msg: result._id});
			  }
			});
	  	}, null);  // if this were rejected, we would be out already		
	});

	app.post("/login", function (req, res) {			
		var key = req.body._key;		
	  	collectionPromise.then(function(collection) {	  		
	      collection.document(key, function(err, x) {
	          if (err) {
	              // for production we should implement more sophisticated handling here. Like logging where appropriate etc.
	              res.status(err.code);	              
	              res.json({msg: err.code});
	          }
	          else {
	          	  console.log(x);		          	  
	          	  if (x.password == req.body.pass) {
	          	  	//set email into the session.
	          	  	global.sess = key;
	          	  	console.log(global.sess);
	          	  	res.json({msg: "loggedin"});	
	          	  } else{
	          	  	res.json({msg: "failed"});
	          	  };          			              
	          }
	      });
	  }, null);  // if this were rejected, we would be out already		
	});

	app.post("/signout", function (req, res) {					
		console.log("sign out")
	  	if (global.sess) {
	  		delete global.sess;
	  		console.log("signed out");
	  		res.json({msg: "signed out"});
	  	} else{
	  		res.json({msg: "failed to sign out"});
	  	};
	});
}

module.exports = controllers;