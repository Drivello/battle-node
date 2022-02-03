const { config } = require("dotenv");
config();
const mongoose = require("mongoose");

const connectDB = async() => {
  mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }).then(() => {
     console.log("Connected to Database");
     }).catch((err) => {
         console.log("Not Connected to Database ERROR! ", err);
     })
 };
 
 module.exports = connectDB;