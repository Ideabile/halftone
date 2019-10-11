import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamoDbService } from './services/dynamodb.service';
import { ArticleModule } from './modules/article/article.module';
import { MulterModule } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'halftone';

@Module({
    imports: [

        MulterModule.registerAsync({

            useFactory: async () => {

                const s3 = new AWS.S3({
                    endpoint: 'http://s3.halftone.localhost',
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                });

                const bucket = AWS_S3_BUCKET_NAME;

                return {
                    storage: multerS3({
                        s3,
                        bucket,
                        acl: 'public-read',
                        key: function(request, file, cb) {
                            console.log('asdasdasd');
                            console.log(file);
                            cb(null, `${Date.now().toString()} - ${file.originalname}`);
                        },
                    }),
                };

            },

        }),

        ArticleModule,

    ],
    controllers: [
        AppController,
    ],
    providers: [
        AppService,
        DynamoDbService,
    ],
})
export class AppModule { }
