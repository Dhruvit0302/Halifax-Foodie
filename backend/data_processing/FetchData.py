# Author: Indu Munagapati
# This function is responsible to retrieve the ingredients from the DynamoDB for the correspondent recipe

import json
import boto3

dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    
    #Converting the input to json format
    file = json.loads(event['body'])
    
    #Extracting filename
    fileName = file['file']

    #Getting the item of key "filename"
    data = dynamodb.get_item(
        TableName = 'Recipes',
        Key = {
            'recipe_name' : {'S': fileName}
        })
        
    #Extracting "Ingredients" from the data and sending it as response 
    ingredients = data['Item']['Ingredients']['S']
    
    return {
        'statusCode': 200,
        'body': json.dumps(ingredients)
    }
