const File = require('./models/file')
const fs = require('fs');
const { default: mongoose } = require('mongoose');
const connectDB = require('./config/db')
connectDB(); 

async function  fetchData(){
  // Fetch all files older than 24 hours
  const pastDate = new Date(Date.now()-(24*60*60*1000));
  mongoose.connection.openUri(process.env.MONGO_URL); 
  const files = await File.find({createdAt: {$lt: pastDate}})
  console.log(files.length)
  if(files.length){
    try{
        files.forEach(async (file)=>{
        fs.unlinkSync(file.path);
        console.log(`Successfully Deleted ${file.filename}`)
        await file.remove(); 
    })
    }catch(err){
        console.log(`Error while deleting file ${err}`);
    }
  }
 // console.log("Task Completed"); 
}

fetchData().then(process.exit); 