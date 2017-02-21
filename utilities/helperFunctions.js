const fetch = require('node-fetch');

const getCityFromIP = function (userIP) {
    return fetch('https://www.freegeoip.net/json/100.105.14.101')
        .then((res) => getJSON(res))
        .then((json) => getCityFromJSON(json))
};

const getCityStats = function (city) {
    city = (city == "" ? "Belgrade" : city);
    return fetch("https://www.numbeo.com/api/city_prices?api_key=<API_KEU>&currency=USD&query=" + city)
        .then((res) => getJSON(res))
};

const getJSON = function (res) {
    return res.json();
};
const getCityFromJSON = function (localeJSON) {
    return localeJSON.city;
};

module.exports = {
    getJSON: getJSON,
    getCityFromJSON: getCityFromJSON,
    getCityFromIP: getCityFromIP,
    getCityStats: getCityStats
};