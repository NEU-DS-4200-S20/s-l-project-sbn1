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

    function chart(selector, data) {
        let svg = d3.select(selector)
            .append("svg")
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
            .classed("svg-content", true);
        svg = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        // Give the data to this cluster layout:
        var root = d3.hierarchy(data).sum(function (d) { return d.value }) // Here the size of each leave is given in the 'value' field in input data

        // Then d3.treemap computes the position of each element of the hierarchy
        d3.treemap()
            .size([width, height])
            .padding(1)
            (root);

        // color!
        var color = d3.scaleOrdinal()
            .domain(["Non-Massachusetts Specialty Crop Farm", "Specialty Crop Value-Added Producer (50% or more specialty crop)", "Massachusetts Specialty Crop Farm"])
            .range(["#66b447", "#9f2b68", "#f2b400"]);

        //tooltip
        const tool = d3
            //.select(selector)
            .select("body")
            .append("div")
            //.attr("class", "tooltip")
            .attr("class", "tooltip");
            //.style("opacity", 0);
            //.attr("style", "position: absolute; opacity: 0");
            //.attr("style");

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
            .style("stroke", "black", "10px") // now there's no border???
            .style("fill", (d) => color(d.parent.parent.data.name))


            // from http://bl.ocks.org/ndobie/90ae9f1a5c7f88ad4929
            .on("mousemove", function (d) {
                tool.style("left", d3.event.pageX + 10 + "px")
                tool.style("top", d3.event.pageY - 20 + "px")
                tool.style("display", "inline-block");
                tool.html(function() {
                    return "<span>" + "Number of vendors: " + d.data.value + "</span>";
                //d.children ? null : d.name + "<br>" + ' $ ' + formatMoney(Math.round(d.size * 1000)) + ' ' + roundToTwo((d.value / 16147370.2) * 100) + '%');
            })
        }).on("mouseout", function (d) {
                tool
                    .transition()
                    .duration(0)
                    .style("display", none);
            });

        // .on("mousemove", (d, i) => {
        //     tool
        //       .transition()
        //       .duration(0)
        //       .style("opacity", 0.8);
        //     tool
        //       .attr("id", "tooltip")
        //       .html(function() {
        //       return "<span>" + "Number of vendors: " + d.data.value + "</span>";
        //     })
        //       .style("left", d3.event.pageX - 87.5 + "px") // -87.5 is half width of tooltip in css
        //       .style("top", d3.event.pageY - 75 + "px")
        //       .attr("data-value", d.data.value);
        //   })
        //    .on("mouseout", function(d) {
        //     tool
        //       .transition()
        //       .duration(0)
        //       .style("opacity", 0);
        //    });

        // and to add the text labels
        svg
            .selectAll("text")
            .data(root.leaves())
            .enter()
            .append("text")
            .selectAll('tspan')
            .data(d => {
                var t = d.data["Type of Business (Exhibitor/Vendor)"] + ", " + d.data["Product Category"];
                return t.split(/(?=[A-Z][^A-Z])/g) // split the text
                    .map(v => {
                        return {
                            text: v,
                            x0: d.x0,                        // keep x0 reference
                            y0: d.y0                         // keep y0 reference
                        }
                    });
            })
            .enter()
            .append('tspan')
            .attr("x", (d) => d.x0 + 5)
            .attr("y", (d, i) => d.y0 + 15 + (i * 10))
            .text(function (d) { return d.text; })
            .attr("font-size", "3px")
            .attr("fill", "white");

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