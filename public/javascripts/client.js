const httpJSONRequest = function (url) {
    return new Promise(function (resolve, reject) {
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
                reject(Error("Something went wrong with the request \n\t\t\t\t\t XHR Status: " + xhr.status));
            }
        }
    });
};

httpJSONRequest("/testIP")
    .then((json) => console.log(json));

httpJSONRequest("/numbeo")
    .then(function (json) {
        drawLeftChart(json[0], "#col1", ".chart1");
        drawRightChart(json[1], "#col2", ".chart2");
        d3.select("body").on("click", function() {
            if(d3.select("#col1").style("background-color")=="rgb(0, 128, 0)"){
                d3.select("#col1").style("background-color", "white");
                d3.select("#col2").style("background-color", "white");
                d3.select("#col1 div").style("color", "black");
                d3.select("#col2 div").style("color", "black");
                d3.selectAll("text").style("fill", "black");
            } else {
                d3.select("#col1").style("background-color", "green");
                d3.select("#col2").style("background-color", "green");
                d3.select("#col1 div").style("color", "white");
                d3.select("#col2 div").style("color", "white");
                d3.selectAll("text").style("fill", "white");
            }
        });
    });

//TODO: Move chart drawing to a separate module

function drawLeftChart(cityJSON, col, chartClass) {
    let cityStats = cityJSON.prices;

    d3.select("#col1").select("div.city-name").text(cityJSON.name);
    let barHeight = 29;
    let margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = parseInt(d3.select("#col1").style("width"), 10) - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    let x = d3.scaleLinear()
        .domain([0, d3.max(cityStats, obj => obj.average_price)])
        .range([0, width]);

    let chart = d3.select(chartClass)
        .attr("width", width + margin.left + margin.right - 1)
        .attr("height", ((barHeight + 1) * cityStats.length) + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + 0 + "," + margin.top + ")");


    let bar = chart.selectAll("g")
        .data(cityStats)
        .enter().append("g")
        .attr("transform", function (d, i) {
            return "translate(0," + (i * (barHeight + 1) + 3) + ")";
        });

    let xAxis = chart.append("g")
        .attr("class", "axis axis--x")
        .call(d3.axisTop(x).ticks(10, "$"));
    xAxis.selectAll("text")
        .attr("transform", "matrix(-1 0 0 1 0 0)")
        .style("text-anchor", "middle");
    xAxis.attr("transform", "translate("+ (width + margin.left + margin.right - 1) + ", 0) matrix(-1 0 0 1 0 0)")

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
            return margin.left + margin.right + width-10;
        })
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .text(function (d) {
            let itemName =d.item_name.substring(0, d.item_name.indexOf(","));
            itemName= "$"+d.average_price.toFixed(2)+ ", " + itemName;
            return itemName;
        });
    //document.getElementById(col).appendChild(document.createElement('pre')).innerHTML = syntaxHighlight(cityJSON);
}

function drawRightChart(cityJSON, col, chartClass) {
    let cityStats = cityJSON.prices;

    d3.select("#col2").select("div.city-name").text(cityJSON.name);
    let barHeight = 29;
    let margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = parseInt(d3.select("#col2").style("width"), 10) - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    let x = d3.scaleLinear()
        .domain([0, d3.max(cityStats, obj => obj.average_price)])
        .range([0, width]);

    let xText = d3.scaleLinear()
        .domain([0, d3.max(cityStats, (obj) => obj.item_name.substring(0, obj.item_name.indexOf(",")).length+6)])
        .range([0, width]);

    let chart = d3.select(chartClass)
        .attr("width", width + margin.left + margin.right - 1)
        .attr("height", ((barHeight + 1) * cityStats.length) + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + 0 + "," + margin.top + ")");

    let bar = chart.selectAll("g")
        .data(cityStats)
        .enter().append("g")
        .attr("transform", function (d, i) {
            return "translate(0," + (i * (barHeight + 1) + 3) + ")";
        });
    let xAxis = chart.append("g")
        .attr("class", "axis axis--x")
        .call(d3.axisTop(x).ticks(10, "$"))
        .attr("transform", "translate(" + 0 + ", 0)");
    xAxis.selectAll("text").style("text-anchor", "middle");
    xAxis.selectAll("text").append("text")
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
        .attr("x", 10)
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function (d) {
            let itemName =d.item_name.substring(0, d.item_name.indexOf(","));
            itemName+=", " + "$" +d.average_price.toFixed(2);
            return itemName;
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




