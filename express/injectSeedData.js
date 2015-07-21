var fs = require('fs');
var http = require('http');
var config = require('./config')();
var _ = require('lodash');
var queryString = require('querystring');
var jaccard = require('jaccard');

var options = {
            host: 'localhost',
            port: 8529,
            path: '/_db/_system/wishpool/groups',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',                
            }
};


var req = http.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (data) {
        //console.log("body: " + data);        
        var obj = JSON.parse(data);
        if (obj.length) {
            console.log("groups exists");
        } else{         
            console.log("groups doesn`t exist");  
            fs.readFile('seedData/seed_groups.json', 'utf8', function (err, data) {
                if (err) throw err;
                var groups_obj = JSON.parse(data);      

                /* get linked groups */
                linkGroups(groups_obj);

                for (var i = 0; i < groups_obj.length ; i++) {
                    var data = JSON.stringify(groups_obj[i]);        
                    var options = {
                        host: 'localhost',
                        port: 8529,
                        path: '/_db/_system/wishpool/groups',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': Buffer.byteLength(data)
                        }
                    };
                    var req = http.request(options, function (res) {
                        res.setEncoding('utf8');
                        res.on('data', function (data) {
                            //console.log("body: " + data);
                        });
                    });
                    req.write(data);
                    req.end();
                };
            });
        };
    });
});

req.write("");
req.end();

function linkGroups( groups_obj ) {
    for (var i = 0; i < groups_obj.length ; i++) {
        for (var j = i+1; j < groups_obj.length; j++) {
                    
            /* compare two groups.  */
            var a = groups_obj[i].aboutUs;
            var b = groups_obj[j].aboutUs;                          
            
            var simuliraty = jaccard.index(a, b)   
            console.log(config.big_enough);         

            /* decide to link or not */
            if (simuliraty > config.big_enough) {
                groups_obj[i].links.push(groups_obj[j].no);
                groups_obj[j].links.push(groups_obj[i].no);
            };
        };        
    }        
}