
var services = require('./services');
// Declare the app
var app = {};

// Init function
app.init = function(){

   //Starting our services
   services.init();

};

// Self executing
app.init();


// Export the app
module.exports = app;