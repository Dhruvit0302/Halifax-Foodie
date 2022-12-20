import json
import boto3
import base64

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table('userinfo')

def lambda_handler(event, context):
    
    #
    print(event)
    
    base64_message = event['body']
    base64_bytes = base64_message.encode('ascii')
    message_bytes = base64.b64decode(base64_bytes)
    message = message_bytes.decode('ascii')
    print(message)
    
    data = json.loads(message)
    print(data)
    print(type(data['firstName']))
    print(type(data['roles']))
    
    print(type(data['email']))
   
    # https://stackabuse.com/encoding-and-decoding-base64-strings-in-python/
    
    # print(event['name'])
   
    table.put_item(
        Item={
         'emailid':data['email'],
         'username': data['firstName'],
         'roles': data["roles"]
        
    })
    
  
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
