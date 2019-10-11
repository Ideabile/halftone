import { Controller, Get, UsePipes, ValidationPipe, Post, Body, Req, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article';
import { ImageUploadService } from '../../services/s3.services';
import * as uuid from 'uuid/v4';
import * as fileType from 'file-type';

@Controller('article')
export class ArticleController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly imageUploadService: ImageUploadService,
    ) { }

    @Get()
    async getHello(): Promise<any[]> {

        let articles = [];
        for await (const article of this.articleService.getArticles()) {
            articles.push(article);
        }
        return Promise.resolve(articles);

    }

    @Post()
    @UsePipes(
        new ValidationPipe(),
    )
    async createPost(@Body() article: CreateArticleDto): Promise<any> {

        console.log('Creating a Post', article);
        return this.articleService.createArticle(article);

    }

    @Post('image')
    @UseInterceptors(
        FileInterceptor('upload'),
    )
    async create(@Res() res, @UploadedFile() file) {
        const foundedType = fileType(file.buffer);
        const params = {
            Body: file.buffer,
            Bucket: 'halftone',
            Key: uuid(),
            ContentType: foundedType ? foundedType.mime : 'image/svg+xml',
            ACL: 'public-read',
        };
        try {
            await this.imageUploadService.s3.putObject(params).promise();
            res.status(200).json({
                key: params.Key,
            });
        } catch (e) {
            res.status(500).json({
                message: 'Something went wrong',
                error: e,
            });
        }
    }
}
