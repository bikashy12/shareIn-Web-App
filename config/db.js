require('dotenv').config()
const mongoose = require('mongoose')

function connectionDB(){
    try{
        mongoose.connect(process.env.MONGO_URL, 
        {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify:true}, 
        ()=>{
        console.log("Database connected Successfully!");
    })
    }
    catch(err){
        console.log(`connection Failed !`);
    };
}

module.exports = connectionDB; 