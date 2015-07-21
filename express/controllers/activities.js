var express = require('express');
var express = require('express-session');
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

  	var putRoute = "_db/_system/wishpool/activities";	// configure activities collection	
	var collectionName = "wishpool_activities";     

	var collectionPromise = new Promise(function(resolve, reject) {
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
  	

  	////////////////////////////////////////////////////////////////////////////////
	/// AJAX services:
	////////////////////////////////////////////////////////////////////////////////
	app.get('/activities', function(req, res) {	  
	  console.log(global.sess);
	  if (global.sess) {
	  	var docs = [];
	  	collectionPromise.then(function(collection) {
	  	  for (var i = 0; i < 23; i++) {
	  	  	var key = i.toString();
	  	  	collection.document(key, function(err, x) {
		          if (err) {
		           	  // for production we should implement more sophisticated handling here. Like logging where appropriate etc.
		              res.status(err.code);
		              res.json(err.code);
		          }
		          else {
		              //console.log(x);
		              docs.push(x);
		              if(docs.length == 23){
		              	res.json(docs);	
		              }		              
		          }
		    });
	  	  }; 	    
	  	}, null);  // if this were rejected, we would be out already
	  } else{
	  	res.json({msg: "invalid user"});
	  };
	  
	  	  
  	}); 
	
	app.get("/activities/:key", function (req, res) {
	  console.log(global.sess);
	  if (global.sess) {
	  	var key = req.params["key"];	  	  
	  	collectionPromise.then(function(collection) {
	      collection.document(key, function(err, x) {
	          if (err) {
	              // for production we should implement more sophisticated handling here. Like logging where appropriate etc.
	              res.status(err.code);
	              //res.json(err.code);
	              res.json(err.code);
	          }
	          else {
	              res.json(x);
	          }
	      });
	  	}, null);  // if this were rejected, we would be out already
	  } else{
	  	res.json({msg: "invalid user"});
	  };
	  
	});
		
	app.put("/activities/put", function (req, res) {
		req.pipe(concat( function(body) {
			// check out body-parser for a express middleware which handles json automatically
			ep.put("put", JSON.parse(body.toString()),
				function(err, x) {
					if (err) {
					  	err.error = true;
					 	res.send(err);
					}
					else {
					  	res.send(x);
					}
				});
		} ));
	});
}

module.exports = controllers;