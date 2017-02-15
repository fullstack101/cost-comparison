var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
const getip = require('client-ip');
const fs = require('fs');
const path = require('path');
const jsonParser=require('json-parser');


/* GET home page. */
// way 1 using request
var options = {
    method: 'get',
    json: true,
    url: "https://www.numbeo.com/api/city_prices?api_key=<API_Key>&query=Belgrade"
};

// way 2 using Promises
const getContent = function(url) {
    // return new pending promise
    return new Promise((resolve, reject) => {
            // select http or https module, depending on reqested url
            const lib = url.startsWith('https') ? require('https') : require('http');
    const request = lib.get(url, (response) => {
            // handle http errors
            if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Failed to load page, status code: ' + response.statusCode));
    }
    // temporary data holder
    const body = [];
    // on every content chunk, push it to the data array
    response.on('data', (chunk) => body.push(chunk));
    // we are done, resolve promise with those joined chunks
    response.on('end', () => resolve(body.join('')));
});
    // handle connection errors of the request
    request.on('error', (err) => reject(err))
})
};
router.get('/numbeo', function (req, res, next) {
    // way 1 using request
    // request(options, function (err, res, body){console.log(body);
    //     });
    // way 2 using Promises
    getContent('https://www.numbeo.com/api/city_prices?api_key=0ifio49inu2plm&query=Belgrade')
        .then((html) => console.log(jsonParser.parse(html)))
    .catch((err) => console.error(err));

    res.render('index', {"city": 'Belgrade', "title": "Numbeo"});
});
router.get('/test?:id', function (req, res, next) {

    console.log("second");
    //res.locals.city = req.query.id;
    var ip = req.ip;
    res.render('index', {"city": ip, "title": req.query.id});
});

router.get('/', function (req, res, next) {
    console.log("first");
    res.render('index', {title: 'Express'});
});


module.exports = router;
