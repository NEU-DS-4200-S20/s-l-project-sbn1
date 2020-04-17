// initialize treemap
// Initialize a line chart. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function treemap() {

    // set the dimensions and margins of the graph
    // Based on Mike Bostock's margin convention
    // https://bl.ocks.org/mbostock/3019563
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

    function chart(selector, data, tableData) {
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

        // color scheme for business type
        var color = d3.scaleOrdinal()
            .domain(["Non-Massachusetts Specialty Crop Farm", "Specialty Crop Value-Added Producer (50% or more specialty crop)", "Massachusetts Specialty Crop Farm"])
            .range(["#66b447", "#9f2b68", "#f2b400"]);

        var legColors = ["#66b447", "#9f2b68", "#f2b400"],
            legLabels = ["Non-Massachusetts Specialty Crop Farm", "Specialty Crop Value-Added Producer (50% or more specialty crop)", "Massachusetts Specialty Crop Farm"];

        // create tooltip
        const tool = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip");

        // use this information to add rectangles:
        svg
            .selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr("id", function (d) { return "id" + d.data["Vendor Name"];})
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style("fill", (d) => color(d.parent.parent.data.name))
            // tooltip from http://bl.ocks.org/ndobie/90ae9f1a5c7f88ad4929
            .on("mousemove", function (d) {
                tool.style("left", d3.event.pageX + 10 + "px")
                tool.style("top", d3.event.pageY - 20 + "px")
                tool.style("opacity", 1);
                tool.html(function () {
                    return "<span>"  + "<b>Business Type: </b>" + "<br>" + d.data["Business Type"] + "<br>" + "<b>Product Type: </b>" + "<br>" + d.data["Product Category"] + "<br>" + "<b>Number of vendors: </b>" + "<br>" + d.data.value + "</span>";
                    })
            }).on("click", function (d) {
                selection(d);
            }).on("mouseout", function (d) {
                tool
                    .transition()
                    .duration(0)
                    .style("opacity", 0);
            });

        // and to add the text labels
        svg
            .selectAll("text")
            .data(root.leaves())
            .enter()
            .append("text")
            // apply same tooltip and click selection to text labels
            .on("mousemove", function (d) {
                tool.style("left", d3.event.pageX + 10 + "px")
                tool.style("top", d3.event.pageY - 20 + "px")
                tool.style("opacity", 1);
                tool.html(function () {
                    return "<span>"  + "<b>Business Type: </b>" + "<br>" + d.data["Business Type"] + "<br>" + "<b>Product Type: </b>" + "<br>" + d.data["Product Category"] + "<br>" + "<b>Number of vendors: </b>" + "<br>" + d.data.value + "</span>";
                    })
            }).on("click", function (d) {
                selection(d);
            }).on("mouseout", function (d) {
                tool
                    .transition()
                    .duration(0)
                    .style("opacity", 0);
            })
            .selectAll('tspan')
            .data(d => {
                var t = d.data["Product Category"];
                return t.split(" ")     // split the text
                    .map(v => {
                        return {
                            text: v,
                            x0: d.x0,   // keep x0 reference
                            y0: d.y0    // keep y0 reference
                        }
                    });
            })
            .enter()
            .append('tspan')
            .attr("x", (d) => d.x0 + 5)
            .attr("y", (d, i) => d.y0 + 15 + (i * 10))
            .text(function (d) { return d.text; })
            .attr("font-size", "10px")
            .attr("fill", "white"); 

        // add legend http://bl.ocks.org/ndobie/90ae9f1a5c7f88ad4929
        var legend = d3.select(selector).append("div").classed("legend-holder", true)
        .style("position", "relative")
        .style("width", 350 + "px")
        .style("height", 60 + "px");
        
        legend.append('div')
            .attr("class", "title")
            .style("width", "240px")
            .style("height", "22px")
            .text("Type of Business (Exhibitor/Vendor) Legend:" )
            .style("background", "black")

        for (i = 0; i < 3; i++) {
            legend.append('div')
                .attr("class", "category")
                .style("width", "400px")
                .style("height", "22px")
                .style("top", function (d) { return (55 + 18*i) + "px" })
                .text(function (d) { return legLabels[i] })
                .style("background", function (d) { return legColors[i] })
        };

        var currentlySelected = [];
        function selection(treemap_selected) {  
            if (currentlySelected.includes(treemap_selected)) {
                d3.select(selector).select("#id" + treemap_selected.data["Vendor Name"]).style("opacity", null);
                if (currentlySelected.length > 1) {
                    tableData.filter(d => {
                        if (d["Business Type"] == treemap_selected["data"]["Business Type"] 
                        && d["Product Category"] == treemap_selected["data"]["Product Category"]) {
                            d3.select("table").select("#id" + d["Vendor Name"]).style("display", "none");
                        }
                    });
                    
                    currentlySelected = currentlySelected.filter(function(value, index, arr){
                         return value != treemap_selected;});
                }

                else {
                    d3.select("table").selectAll("tr").style("display", null);
                    currentlySelected = [];
                }
                
            }
            else {
                currentlySelected.push(treemap_selected);
                d3.select(selector).select("#id" + treemap_selected.data["Vendor Name"]).style("opacity", ".5");

                if (currentlySelected.length > 1) {
                    tableData.filter(d => {
                        if (d["Business Type"] == treemap_selected["data"]["Business Type"] 
                        && d["Product Category"] == treemap_selected["data"]["Product Category"]) {
                            d3.select("table").select("#id" + d["Vendor Name"]).style("display", null);
                        }
                    });
                }
    
                else {
                    tableData.filter(d => {
                        if (!(d["Business Type"] == treemap_selected["data"]["Business Type"] 
                        && d["Product Category"] == treemap_selected["data"]["Product Category"])) {
                            d3.select("table").select("#id" + d["Vendor Name"]).style("display", "none");
                        }
                    });
                }
            }
        }

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