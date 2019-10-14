import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class UploadService {

    public s3: AWS.S3;

    constructor() {
        this.s3 = new AWS.S3({
            s3ForcePathStyle: true,
            endpoint: 'http://s3.halftone.localhost',
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }

}
