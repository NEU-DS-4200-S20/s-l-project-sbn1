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
        console.log(data);
        let table = d3.select(selector)
            .append("table")
            .classed("my-table", true);


        // // Here, we grab the labels of the first item in the dataset
        // //  and store them as the headers of the table.
        let tableHeaders = Object.keys(data[0]);


        // // You should append these headers to the <table> element as <th> objects inside
        // // a <th>
        // // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table

        let header = table.append("thead").append("tr");
        header
            .selectAll("th")
            .data(tableHeaders)
            .enter()
            .append("th")
            .text(function (d) {
                return d;
            });
        // // Then, you add a row for each row of the data.  Within each row, you
        // // add a cell for each piece of data in the row.
        // // HINTS: For each piece of data, you should add a table row.
        // // Then, for each table row, you add a table cell.  You can do this with
        // // two different calls to enter() and data(), or with two different loops.

        let tableBody = table.append("tbody");
        var rows = tableBody
            .selectAll("tr")
            .data(data)
            .enter()
            .append("tr")
            .attr("id", function (d) { return "id" + d["0"];});

        var cells = rows
            .selectAll('td')
            .data(function (row) {
                return tableHeaders.map(function (column) {
                    return {column: column, value: row[column]};
                });
             })
            .enter()
            .append('td')
                .text(function (d) { return d.value; });



        // // Then, add code to allow for brushing.  Note, this is handled differently
        // // than the line chart and scatter plot because we are not using an SVG.
        // // Look at the readme of the assignment for hints.
        // // Note: you'll also have to implement linking in the updateSelection function
        // // at the bottom of this function.
        // // Remember that you have to dispatch that an object was highlighted.  Look
        // // in linechart.js and scatterplot.js to see how to interact with the dispatcher.
        rows.on("mouseover", selectRow).on("mousemove", selectRow);

        table.on("mouseLeave", endSelection);

        function selectRow() {
            d3.select(this).attr("class", "selected");

            let dispatchString = Object.getOwnPropertyNames(dispatcher.k)[0];

            dispatcher.call(
                dispatchString,
                this,
                tableBody.selectAll(".selected").data()
            );
        }

        function endSelection() {
            let dispatchString = Object.getOwnPropertyNames(dispatcher.k)[0];
            tableBody.selectAll(".selected").attr("class", "");
            dispatcher.call(dispatchString, this, []);
        }

        // HINT for brushing on the table: keep track of whether the mouse is down or up, 
        // and when the mouse is down, keep track of any rows that have been mouseover'd

        // YOUR CODE HERE
        // not really necessary for a table!

        return chart;
    }

    // Gets or sets the dispatcher we use for selection events
    chart.selectionDispatcher = function (k) {
        if (!arguments.length) return dispatcher;
        dispatcher = k;
        return chart;
    };

    // Given selected data from another visualization 
    // select the relevant elements here (linking)
    chart.updateSelection = function (selectedData) {
        if (!arguments.length) return;

        // Select an element if its datum was selected
        d3.selectAll('tr').classed("selected", d => {
            return selectedData.includes(d)
        });
    };

    return chart;
}