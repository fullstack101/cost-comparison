const fetch = require('node-fetch');
const fs = require('fs');


let apikey = "";
// First I want to read the file
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

    console.log("API key loaded from ./apikey.txt");
    console.log("apikey = \"" + apikey + "\"");

    }

}

const getGeoJSON = function (userIP) {
    userIP = (userIP == "::1" || userIP == "" ? '83.143.251.132' : userIP);
    userIP = (userIP.indexOf(":") == -1 ? userIP : userIP.substring(0,userIP.indexOf(":")));
    return fetch('https://www.freegeoip.net/json/'+userIP)
        .then((res) => getJSON(res))
};

const getCityFromIP = function (userIP) {
    return getGeoJSON(userIP)
        .then((json) => getCityFromJSON(json))
};

const getCityStats = function (city) {
    city = (city == "" ? "Belgrade" : city);
    return fetch("https://www.numbeo.com/api/city_prices?api_key=" + apikey + "&currency=USD&query=" + city)
        .then((res) => getJSON(res))
};


const getJSON = function (res) {
    return res.json();
};
const getCityFromJSON = function (localeJSON) {
    return localeJSON.city;
};

module.exports = {
    getGeoJSON: getGeoJSON,
    getCityFromIP: getCityFromIP,
    getCityStats: getCityStats,
    getJSON: getJSON,
    getCityFromJSON: getCityFromJSON
};