const fetch = require('node-fetch');
module.exports = {
    getSmth: function (userIP) {
        console.log(userIP);
    },
    getCityFromIP: function (userIP) {
        console.log(Invoked);
        return fetch('https://freegeoip.net/json/100.105.14.101')
            .then((res) => getJSON(res))
            .then((json) => getCityFromJSON(json))
            .then((city) => getCityStats(city))
    },
    getCityStats: function (city) {
        city = (city == "" ? "Belgrade" : city);
        return fetch("https://www.numbeo.com/api/city_prices?api_key=0ifio49inu2plm&query=" + city)
            .then((res) => getJSON(res))
    },
    getJSON: function (res) {
        return res.json();
    },
    getCityFromJSON: function (localeJSON) {
        return localeJSON.city;
    }
};