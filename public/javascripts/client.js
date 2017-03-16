const httpJSONRequest = function (url) {
    return new Promise(function (resolve, reject) {
        console.log(url);
        let xhr = new XMLHttpRequest();

        xhr.withCredentials = false;
        xhr.open('GET', url, true);
        xhr.send();
        xhr.addEventListener("readystatechange", processRequest, false);

        function processRequest(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let response = JSON.parse(xhr.responseText);
                resolve(response);
            } else if (xhr.readyState == 4) {
                console.log(xhr.readyState);
                console.log(xhr.status);
                reject(Error("Something went wrong with the request \n\t\t\t\t\t XHR Status: " + xhr.status));
            }
        }
    });
};

httpJSONRequest("/testIP")
    .then((json) => console.log(json));

httpJSONRequest("/numbeo")
    .then(function (json) {
        drawLeftChart(json[0], "col1", ".chart1");
        drawRightChart(json[1], "col2", ".chart2");
    });

function drawLeftChart(cityJSON, col, chartClass) {
    let cityStats = cityJSON.prices;
    //json[0];
    console.log("Before filter: " + cityStats.length);
    cityStats = cityStats.filter(obj => obj.average_price < 10);
    console.log("After filter: " + cityStats.length);

    d3.select("#col1").select("div.city-name").text(cityJSON.name);
    let barHeight = 29;
    let margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = 600 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    console.log(width);
    let x = d3.scaleLinear()
        .domain([0, d3.max(cityStats, obj => obj.average_price)])
        .range([0, width]);

    let xText = d3.scaleLinear()
        .domain([0, d3.max(cityStats, obj => (margin.left + margin.right + width-obj.item_name.length))])
        .range([0, (margin.left + margin.right + width)]);

    let chart = d3.select(chartClass)
        .attr("width", width + margin.left + margin.right)
        .attr("height", ((barHeight + 1) * cityStats.length) + margin.top + margin.bottom)
        .append("g")
        //.attr("transform", "rotate(180)")
        .attr("transform", "translate(" + 0 + "," + margin.top + ")");
    //.attr("transform", "translate(" + width + "," + margin.top + ") rotate(-180 0 "+ width + ")");


    let bar = chart.selectAll("g")
        .data(cityStats)
        .enter().append("g")
        .attr("transform", function (d, i) {
            return "translate(0," + (i * (barHeight + 1) + 3) + ")";
        });

    chart.append("g")
        .attr("class", "axis axis--x")
        .call(d3.axisBottom(x).ticks(10, "$"))
        .attr("transform", "rotate(180 " + ((+margin.left + margin.right + width) / 2) + " " + 0 + ")")
        .append("text")
        .attr("x", 6)
        .attr("dx", "0.71em")
        .attr("text-anchor", "end")
        .text("Price")
        //.attr("transform", "translate(" + 20 + ", -9)");
        .attr("transform", "translate(" + (20-width) + ", 9) rotate(-180 " + ((width) / 2) + " " + 0 + ")");

    bar.append("rect")
        .attr("width", function (d) {
            return x(d.average_price);
        })
        .attr("transform", function (d) {
            return "translate(" + (margin.left + margin.right + width - x(d.average_price)) + ",0)"
        })
        .attr("height", barHeight)
        .attr("class", "bar");

    bar.append("text")
        .attr("x", function (d) {
            return ( xText(margin.left + margin.right + width-d.item_name.length));
        })
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .text(function (d) {
            return d.item_name;
        });
    //document.getElementById(col).appendChild(document.createElement('pre')).innerHTML = syntaxHighlight(cityJSON);
}

function drawRightChart(cityJSON, col, chartClass) {
    let cityStats = cityJSON.prices;
    console.log("Before filter: " + cityStats.length);
    cityStats = cityStats.filter(obj => obj.average_price < 10);
    console.log("After filter: " + cityStats.length);

    d3.select("#col2").select("div.city-name").text(cityJSON.name);
    let barHeight = 29;
    let margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = 600 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    let x = d3.scaleLinear()
        .domain([0, d3.max(cityStats, obj => obj.average_price)])
        .range([0, width]);

    let xText = d3.scaleLinear()
        .domain([0, d3.max(cityStats, obj => obj.item_name.length)])
        .range([0, width]);

    let chart = d3.select(chartClass)
        .attr("width", width + margin.left + margin.right)
        .attr("height", ((barHeight + 1) * cityStats.length) + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + 0 + "," + margin.top + ")");

    let bar = chart.selectAll("g")
        .data(cityStats)
        .enter().append("g")
        .attr("transform", function (d, i) {
            return "translate(0," + (i * (barHeight + 1) + 3) + ")";
        });
    chart.append("g")
        .attr("class", "axis axis--x")
        .call(d3.axisTop(x).ticks(10, "$"))
        .attr("transform", "translate(" + 0 + ", 0)")
        .append("text")
        .attr("x", 6)
        .attr("dx", "0.71em")
        .attr("text-anchor", "end")
        .text("Price")
        .attr("transform", "translate(" + 20 + ", -9)");
    bar.append("rect")
        .attr("width", function (d) {
            return x(d.average_price);
        })
        .attr("height", barHeight)
        .attr("class", "bar");

    bar.append("text")
        .attr("x", function (d) {
            return xText(d.item_name.length);
        })
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .text(function (d) {
            return d.item_name;
        });
    //document.getElementById(col).appendChild(document.createElement('pre')).innerHTML = syntaxHighlight(cityJSON);
}
// Pretty JSON

function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}




