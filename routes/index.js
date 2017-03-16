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
const getItemStats = require('../utilities/helperFunctions.js').getItemStats;

router.get('/home', function (req, res, next) {
    res.render('index');
});

router.get('/numbeo', function (req, res, next) {
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
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
});

router.get('/getItem/:city/:item', function (req, res, next) {
    let city = req.params.city;
    let item = req.params.item;
    getItemStats(city, item)
        .then((resJSON) => res.json(resJSON));
    //res.render('test', {title: 'Arguments', text: city});
});

router.get('/', function (req, res, next) {
    res.render('test', {title: 'Express app for cost comparison', text: "Checks client IP and compares cost of a burger in that city against Blago"});
});

module.exports = router;

