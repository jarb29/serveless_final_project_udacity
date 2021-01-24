import 'source-map-support/register'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import {parseUserId } from '../../auth/utils'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const bucketName = process.env.GENERATE_UPLOAD_URL

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  const todoId = uuid.v4()
  

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const newItem = await createTodo(todoId, jwtToken, event)


  await docClient.put({
    TableName: todosTable,
    Item: newItem
  }).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newItem
    })
  }
}


async function createTodo(todoId: string, jwtToken: string, event: any) {
  const createAt = new Date().toISOString()
  const newTodo: CreateTodoRequest =  JSON.parse(event.body)
  const dueDate = createAt + 2

  const newItem = {
    createAt,
    userId:parseUserId(jwtToken),
    name,
    dueDate,
    done,
    attachmentURl: `https://${bucketName}.s3.amazonaws.com/${todoId}`,
    todoId,
    ...newTodo,
  }
  console.log('Storing new todo: ', newItem)

  await docClient
    .put({
      TableName: todosTable,
      Item: newItem
    })
    .promise()

  return newItem
}
