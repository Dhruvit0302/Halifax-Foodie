# Author: Indu Munagapati
# This function is responsible to generate CSV data with two different recipe ingredients and upload it to cloud storage

import csv
import json
from itertools import zip_longest
from flask import Flask, redirect, url_for, request
from flask_cors import CORS, cross_origin
from google.cloud import storage
import requests

app = Flask(__name__)
CORS(app)

@app.route('/gen',methods = ['POST','OPTIONS'])
@cross_origin(origin='*', headers=['access-control-allow-origin','Content-Type'])
def csvGen(self):

    #Defining the headers of CSV file
    fieldnames = ['ingredients_1', 'ingredients_2']
    matchingRecipes = '';

    requestData = str(request.data, 'UTF-8');
    data = json.loads(requestData)
    file = data["file"];
    ingredientsDetails = data["ingre"];
    ingredientDetailsSplit = ingredientsDetails.split("/n");
    print("ingredientDetailsSplit ",ingredientDetailsSplit);

    fileSplit = file.split(",");
    print(fileSplit);

    for ingredientDetails in ingredientDetailsSplit:
        testFile = ingredientDetails.split("#")[0];
        print(testFile);
        testIngredients = ingredientDetails.split("#")[1];
        print(testIngredients);
        ingredientSplit = testIngredients.split(",");
        print(ingredientSplit);

        csvData = [];
        csvData.append(fileSplit);
        csvData.append(ingredientSplit);
        print(csvData);

        #Preapring the csvtext using two different recipe ingredients
        csvfile = BuildCsvText()
        csvWriter = csv.DictWriter(csvfile, fieldnames)
        csvWriter.writeheader()
        for values in zip_longest(*csvData):
            csvWriter.writerow({fieldnames[0]: values[0], fieldnames[1]: values[1]})

        csvText = ''.join(csvfile.csv_string)

        #Uploading the csv text as .csv file to cloud storage
        storage_client = storage.Client(project='serverless-fall-22')
        bucket = storage_client.get_bucket('mlsimilarity')    
        blob = bucket.blob('recipe.csv') 
        blob.upload_from_string(csvText)  

        #Calling another cloud function which creates the dataset and evaluates Euclidean distance
        mlOutput = requests.get('https://us-central1-serverless-fall-22.cloudfunctions.net/similarityML')
        mlJson = mlOutput.json();
        mlResult = mlJson["result"];

        #If the ML returns result as true then adding the recipe file name to the variable
        if mlResult :
            matchingRecipes += testFile + "\n";

    #If the matchingRecipes value is '', then returing the following text
    if matchingRecipes == '' :
        matchingRecipes = "No Similar Recipes"
    
    return {"data" : matchingRecipes}

@app.after_request
def add_headers(response):
    response.headers.add('Content-Type', 'application/json')
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Expose-Headers', 'Content-Type,Content-Length,Authorization,X-Pagination')
    return response

if __name__ == '__main__':
   app.run(debug = True)

class BuildCsvText(object):
    def __init__(self):
        self.csv_string = []

    def write(self, row):
        self.csv_string.append(row)

#Referred from,
#[1] J. S. Joseph, “Batch Load data with Google Cloud Functions and Cloud Scheduler,” Google Cloud - Community, 03-Feb-2022. [Online]. Available: https://medium.com/google-cloud/batch-load-data-with-cloud-function-and-cloud-scheduler-with-python-da495336e8ed. [Accessed: 03-Dec-2022].
#[2] B. Poddar, “Building CSV strings in Python,” Level Up Coding, 14-Mar-2020. [Online]. Available: https://levelup.gitconnected.com/building-csv-strings-in-python-32934aed5a9e. [Accessed: 03-Dec-2022].
