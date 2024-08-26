const express = require('express');
const multer = require('multer');
const Queue = require('bull');
const redis = require('redis');

const {authenticateToken} = require('../../middleware/auth');
const File = require('../../models/file.model');
const User = require("../../models/user.model");
const { redisCredentials } = require("../../config/index");


const router = express.Router();

const redisClient = redis.createClient();

function getClientQueue(userId) {
    return new Queue(`fileUploadQueue_${userId}`, {
        redis: {
            host: redisCredentials.redisHost,
            port: redisCredentials.redisPort
        }
    });
}

function processClientQueue(userId) {
    const clientQueue = getClientQueue(userId);

    clientQueue.process(async (file) => {
        try {
            await File.create(file);
            console.log(`File uploaded successfully for client ${userId}: ${file.data.fileName}`);
        } catch (error) {
            console.error(`Error uploading file for client ${userId}: ${file.data.fileName}`, error.message);
        }
    });

    clientQueue.on('completed', (file, result) => {
        console.log(`File ${file.id} completed for client ${userId}!`);
    });

    clientQueue.on('failed', (file, err) => {
        console.error(`File ${file.id} failed for client ${userId} with error ${err.message}`);
    });
}

// File Upload Route
router.post('/upload', authenticateToken, multer({dest:"./uploads"}).single('file'), async (req, res) => {
    console.log('working')
    try {
        const { file } = req;
        console.log('file',file)

        const authHeader = req.headers['authorization'];
        console.log("authHeader",authHeader)

        const token = authHeader && authHeader.split(' ')[1];
        console.log("token",token)

        let user = await User.findOne({
            where: {
              token: token,
            //   deletedAt: null
            },
          });

          console.log("user",user.id)

        const fileRecord = {
            fileName: file.originalname,
            fileSize: file.size,
            uploadedBy: user.id,
        }
        
const clientQueue = getClientQueue(user.id);

processClientQueue(user.id);

// console.log('check')

        // console.log('fileRecord',fileRecord)
        // await File.create(fileRecord);

        res.json({ msg: 'File uploaded successfully', fileRecord });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
