const httpJSONRequest = function(url){
    return new Promise(function(resolve, reject)
    {
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

httpJSONRequest("http://cost-comparison.azurewebsites.net/testIP")
    .then((json) => document.getElementById("col1").appendChild(document.createElement('pre')).innerHTML = syntaxHighlight(json));

httpJSONRequest("http://cost-comparison.azurewebsites.net/numbeo")
    .then(function(json)  {
        var width = 500,
            barHeight = 20;
        var x = d3.scaleLinear()
            .range([0, 500]);

        var chart = d3.select(".chart")
            .attr("width", width)
            .attr("height", barHeight * json[0].prices.length);

        var bar = chart.selectAll("g")
            .data(json[0].prices)
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

        bar.append("rect")
            .attr("width", function(d) {return d.average_price;})
            .attr("height", barHeight);

        bar.append("text")
            .attr("x", function(d) { return 500; })
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




