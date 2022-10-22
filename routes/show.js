const router = require('express').Router(); 
const { default: mongoose } = require('mongoose');
const File = require('../models/file'); 

router.get('/:uuid', async (req, res)=>{
  try{
    mongoose.connection.openUri(process.env.MONGO_URL);
    const file = await File.findOne({uuid : req.params.uuid});
    // mongoose.connection.close();
    if(!file){
    return res.render('download', {error : "Link has been expired."})
    }
    return res.render('download', {
        uuid: file.uuid, 
        fileName: file.filename, 
        fileSize: file.size,
        downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
    })
  }catch(err){
    return res.render('download', {error : "An error has been occurred!"})
  }
});

module.exports = router;