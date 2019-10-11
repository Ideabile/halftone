import { Injectable } from '@nestjs/common';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import DynamoDB = require('aws-sdk/clients/dynamodb');

@Injectable()
export class DynamoDbService {

    private client: DynamoDB;
    private mapper: DataMapper;

    constructor(
    ) {

        const client = new DynamoDB({
            endpoint: 'http://dynamodb.halftone.localhost',
            region: 'local',
            accessKeyId: '',
            secretAccessKey: '',
        });

        this.client = client;
        this.mapper = new DataMapper({ client });

    }

    get connection(): DynamoDB {
        return this.client;
    }

    get map() {
        return this.mapper;
    }
}
