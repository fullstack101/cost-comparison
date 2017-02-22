const fetch = require('node-fetch');

const getGeoJSON = function (userIP) {
    console.log("in geo");
    console.log(userIP+"before");
    userIP = (userIP =="::1" || userIP=="" ? '83.143.251.132' : userIP);
    console.log(userIP+"after");
    return fetch('https://www.freegeoip.net/json/83.143.251.132')
        .then((res) => getJSON(res))
};

const getCityFromIP = function (userIP) {
    return getGeoJSON(userIP)
        .then((json) => getCityFromJSON(json))
};

const getCityStats = function (city) {
    city = (city == "" ? "Belgrade" : city);
    return fetch("https://www.numbeo.com/api/city_prices?api_key=<API_KEY>&currency=USD&query=" + city)
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