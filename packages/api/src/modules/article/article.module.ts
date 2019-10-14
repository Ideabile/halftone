import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { DynamoDbService } from '../../services/dynamodb.service';
import { UploadService } from '../../services/s3.services';

@Module({
    imports: [],
    controllers: [ArticleController],
    providers: [ArticleService, DynamoDbService, UploadService],
})
export class ArticleModule { }
