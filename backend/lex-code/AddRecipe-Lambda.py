import boto3
import boto3.dynamodb
from uuid import uuid4

dynamodb= boto3.client('dynamodb')

def lambda_handler(event, context):

    
    print(event)
    intent = event["interpretations"][0]["intent"]["name"]
    print("hel")
    print(intent)
    if(intent == "VerifyResOwner"):
 
        ResName = event["interpretations"][0]["intent"]["slots"]["ResName"]["value"]["interpretedValue"]
        ResEmail = event["interpretations"][0]["intent"]["slots"]["ResEmail"]["value"]["interpretedValue"]
        print(ResName)
        print(ResEmail)
        
        data = dynamodb.get_item(
        TableName='ResOwnerDetails',
        Key={
            'ResEmail': {'S' : ResEmail}
        }
      )
        print(data)
        Name1= data['Item']['ResName']['S']
        print(Name1)
        if ResName == Name1: 
           
            return {
                "sessionState": {
                    "sessionAttributes": {
                        "ResName": ResName,
                        "ResEmail": ResEmail
                    },
                    "dialogAction": {
                        "slotElicitationStyle": "Default",
                        "slotToElicit": "RecipeName",
                        "type": "ElicitIntent"
                    },
                    "intent": {
                        "confirmationState": "Confirmed",
                        "name": "RecipeIntent",
                        "slots": {
                            "ResName": {
                                "value": {
                                    "interpretedValue": ResName,
                                    "originalValue": ResName,
                                    "resolvedValues": [
                                        ResName
                                    ]
                                }
                            },
                            "ResEmail": {
                                "value": {
                                    "originalValue": ResEmail,
                                    "interpretedValue":  ResEmail,
                                    "resolvedValues": [
                                      ResEmail
                                    ]
                                }
                            },
                            "RecipeName": {
                                "value": {
                                    "originalValue": "",
                                    "interpretedValue":  "",
                                    "resolvedValues": [
                                      ""
                                    ]
                                }
                            },
                            "RecipePrice": {
                              "value": {
                                    "originalValue": "",
                                    "interpretedValue":  "",
                                    "resolvedValues": [
                                        ""
                                    ]
                                }
                            }
                        },
                        "state": "Fulfilled"
                    }
                },
                "messages": [
                    {
                        "contentType": "PlainText",
                        "content": "Your details are verified. You can add the recipe now."
                    }
                ]
                # ,
                # "requestAttributes": {
                #     "RecipeName": "",
                #     "RecipePrice": ""
                # }
            }
            print(event)   
     
        else:
            return {
                "sessionState": {
            		    "dialogAction": {
            		      "type": "Close"
            		    },
            		    "intent": {
            		      "name": "VerifyResOwner",
            			  "state": "Fulfilled"
            		    }
            		  },
            		  "messages": [
            	       {
            	         "contentType": "PlainText",
            	         "content": "Restaurant Owner" + ResName + " is not matched"
            	        }
            	    ]
                }
    else:
        
        id1 =str(uuid4())
        ResName= event["sessionState"]["sessionAttributes"]["ResName"]
        ResEmail = event["sessionState"]["sessionAttributes"]["ResEmail"]
        RecipeName = event["interpretations"][0]["intent"]["slots"]["RecipeName"]["value"]["interpretedValue"]
        RecipePrice = event["interpretations"][0]["intent"]["slots"]["RecipePrice"]["value"]["interpretedValue"]
        print(RecipeName)
        print(RecipePrice)
        dynamodb1 = boto3.resource('dynamodb')
        #table name
        table = dynamodb1.Table('Recipes_table')
        response = table.put_item(
        Item={
                'id': id1,
                'ResEmail': ResEmail,
                'RecipeName': RecipeName,
                'RecipePrice': RecipePrice
                
            }
        )
        return {
                "sessionState": {
            		    "dialogAction": {
            		      "type": "Close"
            		    },
            		    "intent": {
            		      "name": "RecipeIntent",
            			  "state": "Fulfilled"
            		    }
            		  },
            		  "messages": [
            	       {
            	         "contentType": "PlainText",
            	         "content": "Recipe has been added successfully"
            	        }
            	    ]
                }

        


