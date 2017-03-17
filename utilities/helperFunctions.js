const fetch = require('node-fetch');
const fs = require('fs');

//Load Numbeo API key
let apikey = "";
fs.readFile('./apikey.txt', function read(err, data) {
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
        //.then((city) => city.prices=city.prices.filter(item => filterItems(item, json[1].prices)));
        //.then((json) => filterJSON(json));
        //.then((res) => res.json())
};

const filterPrices = function(bothCityStats){
    bothCityStats[0].prices = bothCityStats[0].prices.filter(item => filterItems(item, bothCityStats[1].prices));
    bothCityStats[1].prices = bothCityStats[1].prices.filter(item => filterItems(item, bothCityStats[0].prices));
    bothCityStats[0].prices.sort((a, b) => sortItemsById);
    bothCityStats[1].prices.sort((a, b) => sortItemsById);
    return bothCityStats;
};
// used by the chatbot
const getItemStats = function (city, item) {
    city = (city == "" ? "Belgrade" : city);
    return fetch("https://www.numbeo.com/api/city_prices?api_key=" + apikey + "&currency=USD&query=" + city)
        .then((res) => res.json())
        .then((json) => filterItem(json, item));
};

const getCityFromJSON = function (localeJSON) {
    return localeJSON.city;
};

const filterItem = function(statsJSON, item) {
    statsJSON.prices = statsJSON.prices.filter(obj => (obj.item_id == item));
    return statsJSON.prices;
};

const filterItems = function (item, otherJSON){
    let other = otherJSON.filter(obj => obj.item_id==item.item_id);
    if(other.length==0){
        return false;
    } else if(item.average_price>10 && other[0].average_price>10){
        return false;
    } else {
        return true
    }
};
const sortItemsById=function(a, b){
    let keyA = new Date(a.item_id),
        keyB = new Date(b.item_id);
    // Compare the 2 ids
    if(keyA < keyB) return -1;
    if(keyA > keyB) return 1;
    return 0;
};
module.exports = {
    getGeoJSON: getGeoJSON,
    getCityFromIP: getCityFromIP,
    getCityStats: getCityStats,
    getItemStats: getItemStats,
    getCityFromJSON: getCityFromJSON,
    filterPrices: filterPrices
};