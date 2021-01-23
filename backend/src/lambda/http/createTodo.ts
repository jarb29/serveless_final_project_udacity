import 'source-map-support/register'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  const todoId = uuid.v4()
  const newItem = await createTodo(todoId, event)


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


async function createTodo(todoId: string, event: any) {
  const createAt = new Date().toISOString()
  const newTodo: CreateTodoRequest =  JSON.parse(event.body)
  const dueDate = createAt + 2

  const newItem = {
    createAt,
    name,
    dueDate,
    done,
    attachmentURl,
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
