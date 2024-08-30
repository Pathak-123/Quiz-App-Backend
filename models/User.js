const mongoose = require('mongoose');
const validator = require('validator');

const schema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,"Please enter Name"]

    },
    email:{
        type: String,
        unique:[true,"Email Already Exist"],
        required:[true,"Please enter email"],
        validate:validator.default.isEmail,

    },
    password:{
        type: String,
        required:[true,"Please enter Password"]

    },
   
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("User",schema);