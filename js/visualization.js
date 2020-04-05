((() => {

  d3.json("data/vendors.json", (data) => {
    // General event type for selections, used by d3-dispatch
    // https://github.com/d3/d3-dispatch
    const dispatchString = "selectionUpdated";
    
    // Create a table given the following: 
    // a dispatcher (d3-dispatch) for selection events; 
    // a div id selector to put our table in; and the data to use.
    let tableData = table()
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#table", data);

    let treemapData = treemap()
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#treemap", data);
  });

})());