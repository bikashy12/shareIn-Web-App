require('dotenv').config()
const express = require('express')
const app = express()
const connectDB = require("./config/db")
connectDB()
const ejs = require('ejs')
const path = require('path')

app.use(express.static('public'))
app.use(express.json());
app.set("views", path.join(__dirname,"/views"))
app.set("view engine", "ejs")

app.get("/",(req, res)=>{
    res.send("Hello World");
})

// Routes 
app.use('/api/files', require('./routes/files'))
app.use('/files', require('./routes/show'))
app.use('/files/download', require('./routes/download'))

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server started running on port 3000");
})