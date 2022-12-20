import json
import boto3
import base64
from boto3.dynamodb.conditions import Key, Attr
import math
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table('enterceasercipher')

def lambda_handler(event, context):
   

    body = json.loads(event['body'])
    
    text = body['plainText']
    key = body['keys']
    
    cipher_text = encryptMessage(text, key)

    print(cipher_text)
    table.put_item(
	     Item={
         'emailid':body['email'],
         'ciphertext': text,
         'key': key
        
    })
	
    return {
        'statusCode': 200,
        'body': json.dumps(cipher_text)
    }



# Encryption
def encryptMessage(msg, key):
	cipher = ""

	# track key indices
	k_indx = 0

	msg_len = float(len(msg))
	msg_lst = list(msg)
	key_lst = sorted(list(key))

	# calculate column of the matrix
	col = len(key)
	
	# calculate maximum row of the matrix
	row = int(math.ceil(msg_len / col))

	# add the padding character '_' in empty
	# the empty cell of the matix
	fill_null = int((row * col) - msg_len)
	msg_lst.extend('_' * fill_null)

	# create Matrix and insert message and
	# padding characters row-wise
	matrix = [msg_lst[i: i + col]
			for i in range(0, len(msg_lst), col)]

	# read matrix column-wise using key
	for _ in range(col):
		curr_idx = key.index(key_lst[k_indx])
		cipher += ''.join([row[curr_idx]
						for row in matrix])
		k_indx += 1
	

	return cipher