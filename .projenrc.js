const { AwsCdkTypeScriptApp, SourceCode, FileBase } = require('projen');

const project = new AwsCdkTypeScriptApp({
  cdkVersion: '2.0.0-rc.1',
  defaultReleaseBranch: 'main',
  description: 'hello cdk day!',
  name: 'cdkday-projen-codegen',
  mergify: false,
});

function ts(path) {
  const src = new SourceCode(project, path);
  src.line(`// ${FileBase.PROJEN_MARKER}`);
  return src;
}

function entity(name, key, fields) {
  const basename = name.toLowerCase();
  const env = `${name.toUpperCase()}_TABLE_NAME`;

  const model = ts(`src/${basename}/model.ts`);
  model.open(`export interface ${name} {`);
  model.line(`readonly ${key}: string; // key`);
  for (const field of fields) {
    model.line(`readonly ${field}?: string;`);
  }
  model.close('}');

  const table = ts(`src/${basename}/table.ts`);
  table.line('import * as dynamodb from \'aws-cdk-lib/aws-dynamodb\';');
  table.line('import * as lambda from \'aws-cdk-lib/aws-lambda\';');
  table.line('import { Construct } from \'constructs\';');
  table.open(`export class ${name}Table extends dynamodb.Table {`);
  table.open('constructor(scope: Construct, id: string) {');
  table.open('super(scope, id, {');
  table.line(`partitionKey: { name: '${key}', type: dynamodb.AttributeType.STRING },`);
  table.close('});');
  table.close('}');
  table.open('public bind(handler: lambda.Function) {');
  table.line(`handler.addEnvironment('${env}', this.tableName);`);
  table.line('this.grantReadWriteData(handler);');
  table.close('}');
  table.close('}');

  const client = ts(`src/${basename}/client.ts`);
  client.line('import { DynamoDB } from \'aws-sdk\';');
  client.line(`import { ${name} } from './model';`);
  project.addDeps('aws-sdk');
  client.open(`export class ${name}Client {`);
  client.line('readonly client = new DynamoDB();');
  client.open(`public async putItem(item: ${name}) {`);
  client.line('const attrs: DynamoDB.PutItemInputAttributeMap = {};');
  client.line(`attrs.${key} = { S: item.${key} };`);
  for (const field of fields) {
    client.open(`if (item.${field} != null) {`);
    client.line(`attrs.${field} = { S: item.${field} };`);
    client.close('}');
  }

  client.open('const req: DynamoDB.PutItemInput = {');
  client.line(`TableName: process.env.${env}!,`);
  client.line('Item: attrs,');
  client.close('};');
  client.line('return this.client.putItem(req).promise();');
  client.close('}');
  client.close('}');
}

entity('User', 'username', [
  'name',
  'lastname',
  'phone',
  'address',
]);

entity('Project', 'pid', [
  'name', 'description',
]);


project.synth();