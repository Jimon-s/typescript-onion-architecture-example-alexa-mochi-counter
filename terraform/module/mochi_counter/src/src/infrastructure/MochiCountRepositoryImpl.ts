import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { MochiCountRepository, ResultMochiCount } from "../domain/MochiCountRepository";

export class MochiCountRepositoryImpl implements MochiCountRepository {
    constructor(private readonly client: DynamoDBDocumentClient, private readonly dynamodbName: string) { }

    async addMochi(this: MochiCountRepositoryImpl, person: string, mochiCount: number): Promise<ResultMochiCount> {
        const res = await this.client.send(new UpdateCommand({
            TableName: this.dynamodbName,
            Key: {
                person: person,
            },
            UpdateExpression: 'ADD #count :increment',
            ExpressionAttributeNames: {
                '#count': 'mochi-count',
            },
            ExpressionAttributeValues: {
                ':increment': mochiCount,
            },
            ReturnValues: 'ALL_NEW'
        }))

        return {
            person: res.Attributes?.['person'],
            mochiCount: res.Attributes?.['mochi-count']
        }
    }

    async removeMochi(this: MochiCountRepositoryImpl, person: string, mochiCount: number): Promise<ResultMochiCount> {
        const res = await this.client.send(new UpdateCommand({
            TableName: this.dynamodbName,
            Key: {
                person: person,
            },
            UpdateExpression: 'ADD #count :decriment',
            ExpressionAttributeNames: {
                '#count': 'mochi-count',
            },
            ExpressionAttributeValues: {
                ':decriment': -(mochiCount),
            },
            ReturnValues: 'ALL_NEW'
        }))

        return {
            person: res.Attributes?.['person'],
            mochiCount: res.Attributes?.['mochi-count']
        }
    }
}