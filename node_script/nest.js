// get your requirements in order.
_ = require('underscore');
_.nest = require("underscore.nest");

const fs = require('fs');

let rawdata = fs.readFileSync('../data/vendors.json');
let vendors = JSON.parse(rawdata);
console.log(vendors);

// run your nesting
nestedVendors = _.nest.nest(vendors, ["Type of Business (Exhibitor/Vendor)"]);
console.log("nestedVendors:")
console.log(nestedVendors)

fs.writeFileSync('../data/vendorsNested.json', JSON.stringify(nestedVendors));
