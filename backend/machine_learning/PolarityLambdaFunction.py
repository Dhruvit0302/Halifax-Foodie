# Author: Indu Munagapati
# This function is responsible to retrieve the ingredients from the DynamoDB for the correspondent recipe

import json
import boto3

dynamodb = boto3.client('dynamodb')
comprehend = boto3.client('comprehend')

def lambda_handler(event, context):
    
    #Converting the input to json format
    email = json.loads(event['body'])
    
    #Extracting emailaddress of the restaurant owner
    emailAddress = email['email']

    #Extracting feedback from the DynamoDB
    data = dynamodb.get_item(
        TableName = 'order_feedback',
        Key = {
            'restaurant_id' : {'S': emailAddress }
        }
    )
    
    feedback = data['Item']['feedback']['S']
    
    #Fetching Key Phrases of the feedback
    keyPhrases = comprehend.detect_key_phrases(Text=feedback, LanguageCode='en')

    text = ''
    for keyPhrase in keyPhrases['KeyPhrases']:
        sample = keyPhrase['Text']
        text += sample + ","

    #Fetching Sentiment Score of the feedback
    analysis = comprehend.detect_sentiment(Text= text, LanguageCode='en')
    sentiment_score = analysis['SentimentScore']

    return { 'message': text, 'sentiment_analysis' :  sentiment_score}
    
# Referred from,
#[1] Amazon Web Services, Inc, “Detect entities in a document with Amazon Comprehend using an AWS SDK,” AWS SDK Code Examples. [Online]. Available: https://docs.aws.amazon.com/code-library/latest/ug/comprehend_example_comprehend_DetectEntities_section.html. [Accessed: 02-Dec-2022].
#[2] Amazon Web Services, Inc, “Detect the sentiment of a document with Amazon Comprehend using an AWS SDK,” AWS SDK Code Examples. [Online]. Available: https://docs.aws.amazon.com/code-library/latest/ug/comprehend_example_comprehend_DetectSentiment_section.html. [Accessed: 02-Dec-2022].
