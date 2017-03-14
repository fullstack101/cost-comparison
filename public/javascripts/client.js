const httpJSONRequest = function(url){
    return new Promise(function(resolve, reject)
    {
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
            }else if (xhr.readyState == 4) {
                console.log(xhr.readyState);
                console.log(xhr.status);
                reject(Error("Something went wrong with the request \n\t\t\t\t\t XHR Status: " + xhr.status));
            }
        }
    });
};

httpJSONRequest("/testIP")
    .then((json) => document.getElementById("col1").appendChild(document.createElement('pre')).innerHTML = syntaxHighlight(json));

httpJSONRequest("/numbeo")
    .then(function(json)  {
        console.log("Before filter: " + json[0].prices.length);
        json[0].prices = json[0].prices.filter(obj => obj.average_price<10);
        console.log("After filter: " + json[0].prices.length);

        let barHeight = 29;
        let margin = {top: 20, right: 30, bottom: 30, left: 40},
            width = 600 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        let x = d3.scaleLinear()
            .domain([0, d3.max(json[0].prices, obj => obj.average_price)])
            .range([0, width]);

        let xText = d3.scaleLinear()
            .domain([0, d3.max(json[0].prices, obj => obj.item_name.length)])
            .range([0, width]);

        let chart = d3.select(".chart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", ((barHeight+1) * json[0].prices.length)+ margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + 0 + "," + margin.top + ")");

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

        let bar = chart.selectAll("g")
                .data(json[0].prices)
            .enter().append("g")
                .attr("transform", function(d, i) {
                    return "translate(0," + (i - 8) * (barHeight + 1) + ")"; });

        bar.append("rect")
            .attr("width", function(d) {return x(d.average_price);})
            .attr("height", barHeight)
            .attr("class", "bar");

        bar.append("text")
            .attr("x", function(d) { return xText(d.item_name.length);})
            .attr("y", barHeight / 2)
            .attr("dy", ".35em")
            .text(function(d) { return d.item_name; });
        document.getElementById("col2").appendChild(document.createElement('pre')).innerHTML = syntaxHighlight(json[0]);
    });

// Pretty JSON


function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
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




