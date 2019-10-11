import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DynamoDbService } from './services/dynamodb.service';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly dynamoDbService: DynamoDbService,
    ) { }

    @Get()
    getHello(): string {

        console.log('Hery');

        this.dynamoDbService.connection.listTables((err, data) => {
            console.log(err);
            if (data) {
                console.log(data);
            }
            if (err) {
                console.log('There is no table');
                this.dynamoDbService.connection.createTable({
                    TableName: 'News',
                    KeySchema: [
                        { AttributeName: 'id', KeyType: 'HASH' },  //Partition key
                    ],
                    AttributeDefinitions: [
                        { AttributeName: 'id', AttributeType: 'N' },
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 5,
                        WriteCapacityUnits: 5,
                    },
                }, (err, data) => {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    console.log(data);
                });
            }
        });

        return this.appService.getHello();
    }
}
