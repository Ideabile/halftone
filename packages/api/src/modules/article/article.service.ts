import { Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import { Article } from './article.lib';
import { DynamoDbService } from '../../services/dynamodb.service';
import { CreateArticleDto } from './dto/create-article';
import { ScanIterator, QueryIterator, GlobalSecondaryIndexOptions, DynamoDbTable, DynamoDbSchema } from '@aws/dynamodb-data-mapper';
import * as uuid from 'uuid/v4';
import { between } from '@aws/dynamodb-expressions';

function formatDate(date): string {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 101).toString().substring(1);
    const day = (date.getDate() + 100).toString().substring(1);
    return `${year}-${month}-${day}`;
}

@Injectable()
export class ArticleService {

    constructor(
        private dynamoDbService: DynamoDbService,
    ) {
        this.dynamoDbService.map.ensureTableExists(
            Article,
            {
                indexOptions: {
                    ArticleDay: {
                        type: 'global',
                        projection: ['all'],
                        readCapacityUnits: 5,
                        writeCapacityUnits: 5,
                    },
                },
                readCapacityUnits: 5,
                writeCapacityUnits: 5,
            },
        );

    }

    getArticles(): QueryIterator<Article> {
        return this.dynamoDbService.map.query(Article, {
            day: formatDate(new Date())
        }, { indexName: 'ArticleDay', projection: ['title', 'image', 'url'] });
    }

    @UsePipes(
        new ValidationPipe(),
    )
    async createArticle(article: CreateArticleDto): Promise<Article> {
        const newArticle = Object.assign(new Article, article, { id: uuid(), day: formatDate(new Date()) });
        const savedArticle = await this.dynamoDbService.map.put(newArticle);
        return savedArticle;
    }
}
