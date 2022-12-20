import boto3
import boto3.dynamodb

dynamodb= boto3.client('dynamodb')

def lambda_handler(event, context):

    
    print(event)
    intent = event["interpretations"][0]["intent"]["name"]
    print(intent)
    if(intent == "VerifyUser"):
 
        UserId = event["interpretations"][0]["intent"]["slots"]["UserId"]["value"]["interpretedValue"]
        OrderId = event["interpretations"][0]["intent"]["slots"]["OrderId"]["value"]["interpretedValue"]
        print(UserId)
        print(OrderId)
        dynamodb1 = boto3.resource('dynamodb')
        data = dynamodb.get_item(
        TableName='Users_Table',
        Key={
            'UserId': {'S' : UserId}
        }
      )
        UserId2 = data['Item']['UserId']['S']
        data2 = dynamodb.get_item(
        TableName='Orders_table',
        Key={
            'OrderId': {'S' : OrderId}
        }
      )
        print(data)
        OrderId2 = data2['Item']['OrderId']['S']
        print(OrderId2)
       
        if OrderId == OrderId2: 
           
            return {
                "sessionState": {
                    "sessionAttributes": {
                        "UserId": UserId,
                        "OrderId":OrderId
                    },
                    "dialogAction": {
                        "slotElicitationStyle": "Default",
                        "slotToElicit": "Rating",
                        "type": "ElicitIntent"
                    },
                    "intent": {
                        "confirmationState": "Confirmed",
                        "name": "RatingIntent",
                        "slots": {
                            "UserId": {
                                "value": {
                                    "interpretedValue": UserId,
                                    "originalValue": UserId,
                                    "resolvedValues": [
                                        UserId
                                    ]
                                }
                            },
                             "OrderId": {
                                "value": {
                                    "interpretedValue": OrderId,
                                    "originalValue": OrderId,
                                    "resolvedValues": [
                                        OrderId
                                    ]
                                }
                            },
                            "Rating": {
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
                        "content": "Your details are verified. You can add the rating now from 1 to 5."
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
            		      "name": "VerifyUser",
            			  "state": "Fulfilled"
            		    }
            		  },
            		  "messages": [
            	       {
            	         "contentType": "PlainText",
            	         "content": "UserId" + UserId + " is not matched"
            	        }
            	    ]
                }
    
    elif(intent == "TrackOrder"):
 
        UserId = event["interpretations"][0]["intent"]["slots"]["UserId"]["value"]["interpretedValue"]
        OrderId = event["interpretations"][0]["intent"]["slots"]["OrderId"]["value"]["interpretedValue"]
        print(UserId)
        print(OrderId)
        dynamodb3= boto3.client('dynamodb')
       
        data2 = dynamodb3.get_item(
        TableName='Orders_table',
        Key={
            'OrderId': {'S' : OrderId}
        }
      )
       
        OrderId2 = data2['Item']['OrderId']['S']
        UserId2 = data2['Item']['UserId']['S']
        Order_Status= data2['Item']['Order_Status']['S']
        print(Order_Status)
        print(OrderId2)
       
        if (OrderId == OrderId2 and UserId==UserId2): 
           return {
                "sessionState": {
            		    "dialogAction": {
            		      "type": "Close"
            		    },
            		    "intent": {
            		      "name": "TrackOrder",
            			  "state": "Fulfilled"
            		    }
            		  },
            		  "messages": [
            	       {
            	         "contentType": "PlainText",
            	         "content": "Your order status is" + Order_Status + " !"
            	        }
            	    ]
                }   
 
        else:
            return {
                "sessionState": {
            		    "dialogAction": {
            		      "type": "Close"
            		    },
            		    "intent": {
            		      "name": "VerifyUser",
            			  "state": "Fulfilled"
            		    }
            		  },
            		  "messages": [
            	       {
            	         "contentType": "PlainText",
            	         "content": "UserId or orderId is not matched"
            	        }
            	    ]
                }
    
    
    else:
        
        UserId= event["sessionState"]["sessionAttributes"]["UserId"]
        OrderId = event["sessionState"]["sessionAttributes"]["OrderId"]
        Rating = event["interpretations"][0]["intent"]["slots"]["Rating"]["value"]["interpretedValue"]
        # RecipePrice = event["interpretations"][0]["intent"]["slots"]["RecipePrice"]["value"]["interpretedValue"]
        print(Rating)
        print(OrderId)
        # print(RecipePrice)
        dynamodb2 = boto3.resource('dynamodb')
        #table name
        table = dynamodb2.Table('Orders_table')
        # response = table.put_item(
        # Item={
        #         'OrderId': OrderId,
        #         'UserId':UserId,
        #         'Rating': Rating
                
        #     }
        # )
        
        response = table.update_item(
                Key={'OrderId': OrderId},UpdateExpression="SET Rating = :Rating",
                ExpressionAttributeValues={":Rating": Rating},
            )
        
        return {
                "sessionState": {
            		    "dialogAction": {
            		      "type": "Close"
            		    },
            		    "intent": {
            		      "name": "RatingIntent",
            			  "state": "Fulfilled"
            		    }
            		  },
            		  "messages": [
            	       {
            	         "contentType": "PlainText",
            	         "content": "Rating has been added successfully"
            	        }
            	    ]
                }

        



