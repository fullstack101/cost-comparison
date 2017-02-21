const express = require('express');
const router = express.Router();
const http = require('http');
const request = require('request');
const getip = require('client-ip');
const fs = require('fs');
const path = require('path');
const jsonParser = require('json-parser');
const fetch = require('node-fetch');

const getCityFromIP = require('../utilities/helperFunctions.js').getCityFromIP;
const getCityStats = require('../utilities/helperFunctions.js').getCityStats;

router.get('/numbeo', function (req, res, next) {
    console.log(getCityFromIP);
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    ip = ip.substring(7);
    Promise.all([getCityFromIP(ip).then((city) => getCityStats(city)),
        getCityStats('Blagoevgrad')])
        .then(function (cityStats) {
            res.json(cityStats);
        });
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

