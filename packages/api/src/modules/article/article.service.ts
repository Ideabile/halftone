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

        console.log(Article.prototype[DynamoDbSchema]);

        this.dynamoDbService.map.ensureTableExists(
            Article,
            {
                indexOptions: {
                    ArticleId: {
                        type: 'global',
                        projection: 'all',
                        readCapacityUnits: 5,
                        writeCapacityUnits: 5,
                    },
                    ArticleCreateAt: {
                        type: 'global',
                        projection: ['createAt'],
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
        const createAt = between('2017-02-20T01:58:49.710Z', new Date().toISOString());
        console.log(createAt);
        return this.dynamoDbService.map.query(Article, {
            partitionKey: 'createAt',
            rangeKey: createAt,
        }, { indexName: 'ArticleId' });
    }

    @UsePipes(
        new ValidationPipe(),
    )
    async createArticle(article: CreateArticleDto): Promise<Article> {
        const newArticle = Object.assign(new Article, article, { id: uuid() });
        const savedArticle = await this.dynamoDbService.map.put(newArticle);
        return savedArticle;
    }
}
