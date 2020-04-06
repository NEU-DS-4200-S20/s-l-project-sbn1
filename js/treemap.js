// initialize treemap
function treemap() {

    // ATTEMPT 1: appending to vis-holder svg 
    // CODE FROM: https://www.d3-graph-gallery.com/graph/treemap_json.html

    // set the dimensions and margins of the graph
    let margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    },
        width = 445 - margin.left - margin.right,
        height = 445 - margin.top - margin.bottom,
        ourBrush = null,
        selectableElements = d3.select(null),
        dispatcher;

    // append the svg object to the body of the page
    // var svg = d3.select("#vis-holder")
    //     .append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    //     .append("g")
    //     .attr("transform",
    //         "translate(" + margin.left + "," + margin.top + ")");

    function chart(selector, data) {
        let svg = d3.select(selector)
            .append("svg")
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
            .classed("svg-content", true);
        svg = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // read json data
        d3.json("data/vendors.json", function (data) {

            // create hierarchy
            //var groupByBusiness = _.nest(data, ["Type of Business (Exhibitor/Vendor)"]);
            //console.log(JSON.stringify(groupByBusiness));

            // Give the data to this cluster layout:
            var root = d3.hierarchy(data).sum(function (d) { return d.value }) // Here the size of each leave is given in the 'value' field in input data

            // Then d3.treemap computes the position of each element of the hierarchy
            d3.treemap()
                .size([width, height])
                .padding(2)
                (root)

            // use this information to add rectangles:
            svg
                .selectAll("rect")
                .data(root.leaves())
                .enter()
                .append("rect")
                .attr('x', function (d) { return d.x0; })
                .attr('y', function (d) { return d.y0; })
                .attr('width', function (d) { return d.x1 - d.x0; })
                .attr('height', function (d) { return d.y1 - d.y0; })
                .style("stroke", "black")
                .style("fill", "slateblue")

            // and to add the text labels
            svg
                .selectAll("text")
                .data(root.leaves())
                .enter()
                .append("text")
                .attr("x", function (d) { return d.x0 + 5 })    // +10 to adjust position (more right)
                .attr("y", function (d) { return d.y0 + 20 })    // +20 to adjust position (lower)
                .text(function (d) { return d.data.name })
                .attr("font-size", "15px")
                .attr("fill", "white")
        })

        return chart;
    }

    // Gets or sets the dispatcher we use for selection events
    chart.selectionDispatcher = function (k) {
        if (!arguments.length) return dispatcher;
        dispatcher = k;
        return chart;
    };

    return chart;
}