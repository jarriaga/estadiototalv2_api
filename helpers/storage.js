'use strict'

var AWS = require('aws-sdk'),
    fs = require('fs');


AWS.config.update({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET
    }
});

var s3Bucket = new AWS.S3({
    params: {
        Bucket: 'textoclick'
    }
});

exports.save_profile_photo_base64 = (req) => {
    //request image and get base64 string
    let image_req = req.body.image;
    let base64Data = image_req.split(';base64,').pop();
    let buf = new Buffer(base64Data, 'base64')
    let data = {
        Key: `public/${req.jwt._id}/profile.png`,
        Body: buf,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
        ACL: 'public-read'
    };
    return s3Bucket.putObject(data);
};

//Save document to S3
exports.save_document = (filepath, foldername, filename, callback) => {
    fs.readFile(filepath, function (err, data) {
        if (err) throw err;
        let options = {
            Key: `documents/${foldername}/${filename}`,
            Body: data,
            ACL: 'private'
        };
        s3Bucket.putObject(options, (err, data) => {
            if (err) return callback(err);
            else return callback(null, data);
        });
    });
};


//GetObject to S3
exports.getObject = (key) => {
    return new Promise((resolve, reject) => {
        let options = {
            Key: key
        }
        s3Bucket.getObject(options, (err, data) => {
            if (err) return reject(err);
            return resolve(data);
        });
    });
}