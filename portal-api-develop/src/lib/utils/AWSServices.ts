/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import fs from 'fs';
import AWS from 'aws-sdk';
require('dotenv').config()
export class AWSServices {

    static uploadFile(filePath, resourceName, bucket, key): Promise<string> {
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });
        return new Promise(function (resolve, reject) {

            fs.readFile(filePath, (err, data) => {
                if (err) throw err;
                const params = {
                    Bucket: bucket,
                    Key: `${key}/${resourceName}`,
                    Body: data
                };
                s3.upload(params, function (s3Err, data) {
                    if (s3Err) throw s3Err
                    console.log(`File uploaded successfully at ${data.Location}`)
                    resolve(data.Location);
                });
            });
        });
    }

    static getSignedLink(resourceName, bucket, key): Promise<string> {
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });
        return new Promise(function (resolve, reject) {
            const myBucket = bucket
            const myKey = `${key}/${resourceName}`;
            const signedUrlExpireSeconds = 60 * 5

            const url = s3.getSignedUrl('getObject', {
                Bucket: myBucket,
                Key: myKey,
                Expires: signedUrlExpireSeconds
            })
            console.log("link", url)
            resolve(url);
        });
    }
}
