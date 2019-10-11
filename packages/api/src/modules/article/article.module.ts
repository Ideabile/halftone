import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { DynamoDbService } from '../../services/dynamodb.service';
import { ImageUploadService } from '../../services/s3.services';

@Module({
    imports: [],
    controllers: [ArticleController],
    providers: [ArticleService, DynamoDbService, ImageUploadService],
})
export class ArticleModule { }
