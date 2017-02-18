const express = require('express');
const router = express.Router();
const http = require('http');
const request = require('request');
const getip = require('client-ip');
const fs = require('fs');
const path = require('path');
const jsonParser = require('json-parser');
const fetch = require('node-fetch');


const getCity = function (userIP){
    return new Promise(function(resolve, reject) {
        fetch('https://freegeoip.net/json/100.105.14.101')
            .then(function(res) {
                return res.json();
            }).then(function(localeJSON) {
            return localeJSON.city;
        }).then(function(city){
            city=(city == "" ? "Belgrade" : city);
            fetch("https://www.numbeo.com/api/city_prices?api_key=<API_Key>&query="+city)
                .then(function(res){
                    return res.json();
                }).then(function(cityStatsJSON) {
                resolve(cityStatsJSON);
            });
        })
    });
};

router.get('/numbeo', function (req, res, next) {
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    ip = ip.substring(7);
    getCity(ip).then(function (cityStats) { res.end(JSON.stringify(cityStats)); });
});



router.get('/testIP', function (req, res, next) {
    console.log("second");
    //res.locals.city = req.query.id;
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    res.render('index', {title: 'IP', text: ip});
});

router.get('/arguments?:city', function (req, res, next) {
    console.log("first");
    let city = req.query.city;
    res.render('index', {title: 'Arguments', text: city});
});

router.get('/', function (req, res, next) {
    console.log("first");
    res.render('index', {title: 'Express', text: "Used for testing"});
});

module.exports = router;
