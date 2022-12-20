# Author: Indu Munagapati
# This function is responsible to retrieve the ingredients from S3 bucket and store in the DynamoDB

import json
import urllib.parse
import boto3

s3 = boto3.client('s3')
comprehend = boto3.client('comprehend')
dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):

    bucketName = event['Records'][0]['s3']['bucket']['name']
    fileName = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    try:
        #Getting the file content using bucketname and filename
        file_content = s3.get_object(Bucket=bucketName, Key=fileName)["Body"].read().decode('utf-8')

        #Fetching keyPhrases using comprehend
        keyPhrase = comprehend.detect_key_phrases(Text=file_content, LanguageCode='en')
        phrases = keyPhrase['KeyPhrases']

        ingredients = ''
        
        for phrase in phrases:
            text = phrase['Text']
            splitText = text.split('\n', 1)[0]
            
            if (splitText.isupper()) :
                ingredients += splitText + ", "
        
        #Adding the retrieved ingredients to the DB
        dynamodb.put_item(TableName='Recipes', Item={'recipe_name':{'S':fileName},'Ingredients':{'S':ingredients}})

    except Exception as e:
        print(e)
        raise e

# Referred from,
#[1] Amazon Web Services, Inc, “Detect key phrases in a document with Amazon Comprehend using an AWS SDK,” AWS SDK Code Examples. [Online]. Available: https://docs.aws.amazon.com/code-library/latest/ug/comprehend_example_comprehend_DetectKeyPhrases_section.html. [Accessed: 30-Nov-2022].
#[2] “How to read files from S3 using Python AWS Lambda,” gcptutorials. [Online]. Available: https://www.gcptutorials.com/post/how-to-read-files-from-s3-using-python-aws-lambda. [Accessed: 30-Nov-2022].