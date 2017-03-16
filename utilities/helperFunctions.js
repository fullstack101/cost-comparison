const fetch = require('node-fetch');
const fs = require('fs');

//Load Numbeo API key
let apikey = "";
fs.readFile('../apikey.txt', function read(err, data) {
    if (err) {
        console.log("API key missing. Place numbeo API key in ./apikey.txt");
    }
    else
    {
       apikey = data;
       processFile(apikey);
    }
});

function processFile() {
    if (apikey.toString().trim().length < 13) {
        console.log("Invalid API key in ./apikey.txt. The file should contain the Numbeo API key in one line.");
    }
    else{
    apikey = apikey.toString().trim();
    console.log("API key \"*" + apikey.substring(8) + "\" loaded from ./apikey.txt");
    }
}

const getGeoJSON = function (userIP) {
    userIP = (userIP == "::1" || userIP == "" ? '83.143.251.132' : userIP);
    userIP = (userIP.indexOf(":") == -1 ? userIP : userIP.substring(0,userIP.indexOf(":")));
    return fetch('http://ip-api.com/json/' + userIP)
        .then((res) => res.json())
};

const getCityFromIP = function (userIP) {
    return getGeoJSON(userIP)
        .then((json) => getCityFromJSON(json))
};

const getCityStats = function (city) {
    city = (city == "" ? "Belgrade" : city);
    return fetch("https://www.numbeo.com/api/city_prices?api_key=" + apikey + "&currency=USD&query=" + city)
        .then((res) => res.json())
        .then((json) => filterJSON(json));
        //.then((res) => res.json())
};

const getItemStats = function (city, item) {
    city = (city == "" ? "Belgrade" : city);
    return fetch("https://www.numbeo.com/api/city_prices?api_key=" + apikey + "&currency=USD&query=" + city)
        .then((res) => res.json())
        .then((json) => filterItem(json, item));
};


const getCityFromJSON = function (localeJSON) {
    return localeJSON.city;
};

const filterJSON = function(res) {
    res.prices = res.prices.filter(obj => obj.average_price < 10);
    return res;
};

const filterItem = function(statsJSON, item) {
    statsJSON.prices = statsJSON.prices.filter(obj => (obj.item_id == item));
    return statsJSON.prices;
};
module.exports = {
    getGeoJSON: getGeoJSON,
    getCityFromIP: getCityFromIP,
    getCityStats: getCityStats,
    getItemStats: getItemStats,
    getCityFromJSON: getCityFromJSON
};