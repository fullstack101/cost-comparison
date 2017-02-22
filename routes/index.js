const express = require('express');
const router = express.Router();
const http = require('http');
const request = require('request');
const getip = require('client-ip');
const fs = require('fs');
const path = require('path');
const jsonParser = require('json-parser');
const fetch = require('node-fetch');

const getGeoJSON = require('../utilities/helperFunctions.js').getGeoJSON;
const getCityFromIP = require('../utilities/helperFunctions.js').getCityFromIP;
const getCityStats = require('../utilities/helperFunctions.js').getCityStats;

router.get('/home', function (req, res, next) {
    res.render('index', {text: 'Hello World'});
});

router.get('/numbeo', function (req, res, next) {
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    //console.log(ip);
    ip = ip.substring(7);
    //console.log(ip);
    Promise.all([getCityFromIP(ip).then((city) => getCityStats(city)), getCityStats('Blagoevgrad')])
        .then((cityStats) => res.json(cityStats));
});


router.get('/testIP', function (req, res, next) {
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    getGeoJSON(ip)
        .then((geoJSON) => res.json(geoJSON));
    //res.render('test', {title: 'IP', text: ip});
});

router.get('/arguments?:city', function (req, res, next) {
    let city = req.query.city;
    res.render('test', {title: 'Arguments', text: city});
});

router.get('/', function (req, res, next) {
    res.render('test', {title: 'Express', text: "Used for testing"});
});

module.exports = router;

