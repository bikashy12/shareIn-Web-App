const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const File = require('../models/file')
const {v4: uuidv4} = require('uuid')
const { default: mongoose } = require('mongoose')

// Multer configuration for file upload use
let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename : (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})

let upload = multer({dest: "uploads/", storage, dest: "uploads/", limits : {fileSize: 1000000*100}, }).single('myfile');

router.post('/', (req, res)=>{
  // Store file temporarily 
  upload(req, res, async (err)=>{
    // validate request 
    if(!req.file){
    return res.json({error: "All fields are required"});
    }
    if(err){
        return res.status(500).send({error: err.message})
    }
  // Store file into Database 
  const file = new File({
    filename : req.file.filename,
    uuid: uuidv4(), 
    path: req.file.path, 
    size: req.file.size
  })
  mongoose.connection.openUri(process.env.MONGO_URL);
  await file.save((err)=>{
    console.log(err);
  }); 
  // Return file Downloadable Link
  return res.json({file : `${process.env.APP_BASE_URL}/files/${file.uuid}`})
  })
})

router.post('/send', async (req, res)=>{
  const {uuid, emailTo, emailFrom} = req.body; 
  // Validate Request 
  if(!uuid || !emailTo || !emailFrom){
    return res.status(422).send({error:"All fields are required."})
  }
  // try{
  // Get data from database 
  mongoose.connection.openUri(process.env.MONGO_URL);
  const file = await File.findOne({uuid : uuid}); 
  if(file.sender){
    return res.status(422).send({error:"Email already sent."})
  }
  file.sender = emailFrom; 
  file.receiver = emailTo; 
  await file.save(); 

  // send email
  const sendMail = require('../services/emailService')
  sendMail({
    from:emailFrom, 
    to:emailTo, 
    subject:"ShareIn file sharing", 
    text:`${emailFrom} shared a file with you.`, 
    html:require('../services/emailTemplate')({
      emailFrom: emailFrom, 
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`, 
      size: parseInt(file.size/1000) + ' KB', 
      expires: '24 hours'
    })
  }).then(() => {
      return res.json({success: true});
    }).catch(err => {
      return res.status(500).json({error: 'Error in email sending.'});
    })
//   }catch(err) {
//   return res.status(500).send({ error: 'Something went wrong.'});
// } 
})

module.exports = router;