// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
export class UserTable extends dynamodb.Table {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      partitionKey: { name: 'username', type: dynamodb.AttributeType.STRING },
    });
  }
  public bind(handler: lambda.Function) {
    handler.addEnvironment('USER_TABLE_NAME', this.tableName);
    this.grantReadWriteData(handler);
  }
}