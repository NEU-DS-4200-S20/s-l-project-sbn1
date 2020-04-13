((() => {
    // requiring certain libraries?
    // CODE FROM : https://requirejs.org/docs/node.html

    // requirejs.config({
    //     //Pass the top-level main.js/index.js require
    //     //function to requirejs so that node modules
    //     //are loaded relative to the top-level JS file.
    //     nodeRequire: require
    // });

  d3.json("data/new_vendors.json", (data) => {
    d3.json("data/copy.json", (groupByBusiness) => {
      // General event type for selections, used by d3-dispatch
      // https://github.com/d3/d3-dispatch
      const dispatchString = "selectionUpdated";
      
      // Create a table given the following: 
      // a dispatcher (d3-dispatch) for selection events; 
      // a div id selector to put our table in; and the data to use.
      let tableData = table()
        .selectionDispatcher(d3.dispatch(dispatchString))
        ("#table", data);


      // var groupByBusiness = _.nest(data, ["Type of Business (Exhibitor/Vendor)"]);
      //   console.log(JSON.stringify(groupByBusiness));

      // Create a treemap given the following: 
      // a dispatcher (d3-dispatch) for selection events; 
      // a div id selector to put our treemap in; and the data to use.
      let treemapData = treemap()
        .selectionDispatcher(d3.dispatch(dispatchString))
        ("#treemap", groupByBusiness);
		
		
				
/* 	 // When the table selection is updated via brushing, 
    // tell the treemap to update it's selection (linking)
	 tableData.selectionDispatcher().on(dispatchString, function(selectedData) {
      treemapData.updateSelection(selectedData);
    });

    // When the treemap selection is updated via brushing, 
    // tell the table to update it's selection (linking)
    treemapData.selectionDispatcher().on(dispatchString, function(selectedData) {
      tableData.updateSelection(selectedData);
*/
    }); 
  });

})());