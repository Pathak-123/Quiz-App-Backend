const mongoose = require("mongoose");

 const connectDB=(uri)=>{
    mongoose.connect(uri,{
        dbName:"Quiz_App"
    }).then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e)=> console.log("error"));

};
module.exports = connectDB;