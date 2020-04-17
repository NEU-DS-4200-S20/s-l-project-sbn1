((() => {
  d3.json("data/new_vendors.json", (data) => {
    d3.json("data/new_nested.json", (groupByBusiness) => {
      // General event type for selections, used by d3-dispatch
      // https://github.com/d3/d3-dispatch
      const dispatchString = "selectionUpdated";
      
      // Create a table given the following: 
      // a dispatcher (d3-dispatch) for selection events; 
      // a div id selector to put our table in; and the data to use.
      let tableData = table()
        .selectionDispatcher(d3.dispatch(dispatchString))
        ("#table", data);
      tableData = data;

      // Create a treemap given the following: 
      // a dispatcher (d3-dispatch) for selection events; 
      // a div id selector to put our treemap in; and the data to use.
      let treemapData = treemap()
        .selectionDispatcher(d3.dispatch(dispatchString))
        ("#treemap", groupByBusiness, data);
    }); 
  });

})());
