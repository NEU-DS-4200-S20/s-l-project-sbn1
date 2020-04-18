// making a table
function table() {

    // Based on Mike Bostock's margin convention
    // https://bl.ocks.org/mbostock/3019563
    let ourBrush = null,
        selectableElements = d3.select(null),
        dispatcher;

    // Create the chart by adding an svg to the div with the id 
    // specified by the selector using the given data
    function chart(selector, data) {
        //console.log(data);
        let table = d3.select(selector)
            .append("table")
            .classed("my-table", true);

        // Here, we grab the labels of the first item in the dataset
        // and store them as the headers of the table.
        let tableHeaders = Object.keys(data[0]);

        // append these headers to the table
        let header = table.append("thead").append("tr");
        header
            .selectAll("th")
            .data(tableHeaders)
            .enter()
            .append("th")
            .text(function (d) {
                return d;
            });

        // add a row for each row of the data
        let tableBody = table.append("tbody");
        let rows = tableBody
            .selectAll("tr")
            .data(data)
            .enter()
            .append("tr")
            .attr("id", function (d) {
                return "id" + d["Vendor Name"];
            });
        
        // adds each cell to the rows
        let cells = rows
            .selectAll('td')
            .data(function (row) {
                return tableHeaders.map(function (column) {
                    return { column: column, value: row[column] };
                });
            })
            .enter()
            .append('td')
            .text(function (d) {
                return d.value;
            });

        return chart;
    }

    //Gets or sets the dispatcher we use for selection events
    chart.selectionDispatcher = function (k) {
        if (!arguments.length) return dispatcher;
        dispatcher = k;
        return chart;
    };

    return chart;
}