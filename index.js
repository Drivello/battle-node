const { config } = require("dotenv");
config();

const { app1, app2 } = require("./app");

// app.listen(app.get("port"));
app1.listen(3001, () => { console.log("Started server on 3001"); }); 
app2.listen(3002, () => { console.log("Started server on 3002"); });

// console.log("Server on port", app1.get('port'));
// console.log("Server on port", app2.get('port'));

