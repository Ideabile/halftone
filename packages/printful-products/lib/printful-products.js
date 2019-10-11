'use strict';
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const axios = require('axios');
const apiKey = process.env.PRINTFUL_API_TOKEN;

const s3 = new AWS.S3();

const uploadFile = (path, Key) => new Promise((resolve, reject) => {

    fs.readFile(path, (err, data) => {
        if (err) throw err;
        const params = {
            Bucket: 'halftone-uploads', // pass your bucket name
            Key, // file will be saved as testBucket/contacts.csv
            Body: data,
            ContentType: 'image/png',
            ACL: 'public-read'
        };
        s3.upload(params, function(s3Err, data) {

            if (s3Err) {
                reject(s3Err);
                return;
            }

            resolve(data.Location);
        });
    });

});

const createTShirt = (name, urlFile) => {

    return axios({
        method: 'post',
        url: 'https://api.printful.com/store/products',
        headers: {
            Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
        },
        data: {
            sync_product: {
                name,
                thumbnail: urlFile,
            },
            sync_variants: [{
                variant_id: 192,
                retail_price: "30.00",
                files: [
                    {url: urlFile}
                ]
            }]
        }
    });

}

module.exports = (source, destination) => uploadFile(
    source, destination
).then(url => createTShirt(destination.replace(/\//g, '_').replace('.png', ''), url)).then(console.log).catch(console.error);






