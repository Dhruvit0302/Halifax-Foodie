import json
import boto3
import base64
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table('userinfo')

def lambda_handler(event, context):
  
    
    print(event)
    
    base64_message = event['body']
    base64_bytes = base64_message.encode('ascii')
    message_bytes = base64.b64decode(base64_bytes)
    message = message_bytes.decode('ascii')
    print(message)
    
    data = json.loads(message)
    print(data)

    print(type(data['email']))
    
    response = table.get_item(
        Key={
            "emailid":data['email']
        }
    )
    print(response)
   
    z=response['Item']['roles']
    print(z)
        
    return response
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
