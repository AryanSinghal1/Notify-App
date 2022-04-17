const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()
const personSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 4,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    cpassword:{
        type: String,
        required: true,
    },
    tokens:[
        token={
            type: String,
            required: true,
        }
    ]
})
personSchema.methods.generateToken = async function(){
    try{
    const token = jwt.sign({_id:this._id.toString()}, process.env.KEY);
    this.tokens = this.tokens.concat(token);
    await this.save();
    return token;
}
    catch(e){
        console.log(e);
    }
}
personSchema.pre("save", async function(next){
    this.password =  await bcrypt.hash(this.password, 10);
    console.log(this.password);
    next();
})
const personModel = new mongoose.model("person", personSchema);
module.exports = personModel;