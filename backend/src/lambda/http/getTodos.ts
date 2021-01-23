import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()

const TodosTable = process.env.TODOS_TABLE 


// TODO: Get all TODO items for a current user
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log('Caller event', event)
  const userId = event.pathParameters.userId
  const validuserId = await userExists(userId)

  if (!validuserId) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'User does not exist'
      })
    }
  }

  const userTodos = await getTodosPerGroup(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: userTodos
    })
  }
}

async function userExists(userId: string) {
  const result = await docClient
    .get({
      TableName: TodosTable,
      Key: {
        id: userId
      }
    })
    .promise()

  console.log('Get group: ', result)
  return !!result.Item
}

async function getTodosPerGroup(userId: string) {
  const result = await docClient.query({
    TableName: TodosTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    ScanIndexForward: false
  }).promise()

  return result.Items
}