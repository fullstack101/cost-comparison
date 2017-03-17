let getdata = function (url) {
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
                console.log("getdata response: " + url + response);
            } else if (xhr.readyState == 4) {
                console.log(xhr.readyState);
                console.log(xhr.status);
                reject(Error("Something went wrong with the request \n\t\t\t\t\t XHR Status: " + xhr.status));
            }
        }
    });
};

let data1, data2, data3 = {};

data1 = getdata("/testIP");

data3 = getdata("/numbeo")
    .then(function (json) {
        data1 = json[0];
        data2 = json[1];
        console.log("numbeo data" + data2.prices[1]);
        console.log(data2.prices[1]);
    });
console.log("do we have it?\n");
console.log(data3);

//Start D3js drawing
let svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

let x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

let g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let t = d3.transition()
    .duration(750)
    .ease(d3.easeLinear);

console.log("data is now: " + data1);

//TODO bind data


let cokedata = [
    {
        location: "Blago",
        price: 1.08167,
        item: "Coke"
    },

    {
        location: "Belgrade",
        price: 1.86,
        item: "Coke"
    }

];


let mealdata = [
    {
        location: "Blago",
        price: 7.08167,
        item: "Meal"
    },

    {
        location: "Belgrade",
        price: 2.86,
        item: "Meal"
    }

];

let ticketdata = [
    {
        location: "Blago",
        price: 5.00,
        item: "Movie Ticket"
    },

    {
        location: "Belgrade",
        price: 6.00,
        item: "Movie Ticket"
    }

];



let drawchart = function (error, data) {
    if (error) throw error;

    console.log(data);


    x.domain(data.map(function (d) {
        return d.location;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.price;
    })]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(5, "$"))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Price");


    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.location);
        })
        .attr("y", function (d) {
            return y(d.price);
        })
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .transition()
        .delay(500)
        .duration(1000)
        .attr("height", function (d) {
            return height - y(d.price);

        });
};

drawchart(0, mealdata);

let showitem = function (whatdata) {

    //ugly non-d3js way to kill elements
    d3.select("body").selectAll(".bar")
        .remove();

    d3.select("body").selectAll(".axis--y")
        .transition().duration(1000)
        .style("opacity", 0)
        .style("color", "red")
        .remove();


    drawchart(0, whatdata);
};
