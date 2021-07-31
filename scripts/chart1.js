

charts.chart1 = function() {
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

    //remove old
    d3.select("#svg1").selectAll("svg").remove();
    d3.select("#svg1").selectAll("div").remove();

    // append the svg object to the body of the page
    var svg = d3.select("#svg1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");




    //Read the data
    d3.csv('data/avg_price_bedrooms.csv', function(data) {


    // Add X axis
            var x = d3.scaleLinear()
                .domain([0.8, 2])
                .range([ 0, width ]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

    // Add Y axis
            var y = d3.scaleLinear()
                .domain([100, 260])
                .range([ height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

    // Add a scale for bubble size
            var z = d3.scaleLinear()
                .domain([0, 3100])
                .range([ 0, 100]);

    // // Add a scale for bubble color
            var myColor = d3.scaleOrdinal()
                .domain(["Campbell", "Cupertino", "Gilroy", "Hollister", "Los Altos","Los Altos Hills", "Los Gatos",
                    "Menlo Park" ,"Milpitas", "Mente Sereno","Morgan Hill", "Mountain View", "Palo Alto", "San Jose",
                    "San Martin","Santa Clara", "Saratoga", "Stanford", "Sunnyvale", "Watsonville"])
                .range(d3.schemeSet2);

        // -1- Create a tooltip div that is hidden by default:
        var tooltip = d3.select("#svg1")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "#656565")
            .style("border-radius", "0px")
            .style("padding", "5px")
            .style("color", "white")
            .style("height",20+"px")
            .style("width",200+"px")

        // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
        var showTooltip = function(d) {
            tooltip
                .transition()
                .duration(200)
            tooltip
                .style("opacity", 1)
                .html("City: " + d.city)
                .style("left", (d3.select(this).attr("cx")) + "px")
                .style("top", (d3.select(this).attr("cy")-400) + "px")
        }
        var moveTooltip = function(d) {
            tooltip
                .style("left", (d3.select(this).attr("cx")) + "px")
                .style("top", (d3.select(this).attr("cx")-400) + "px")
        }
        var hideTooltip = function(d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
        }

    // Add dots
            svg.append('g')
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "bubbles")
                .attr("cx", function (d) { return x(d.avg_num_bedrooms); } )
                .attr("cy", function (d) { return y(d.avg_price); } )
                .attr("r", function (d) { return z(100*Math.log(d.number_listing)); } )
                .style("fill", function (d) { return myColor(d.city); } )
                .style("opacity", 0.8)
                // -3- Trigger the functions
                .on("mouseover", showTooltip )
                .on("mousemove", moveTooltip )
                .on("mouseleave", hideTooltip )

    })
}
