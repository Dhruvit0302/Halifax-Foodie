# Author: Indu Munagapati
# This function is responsible to run the evaluate the newly created table and get "mean squared distance" 

from google.cloud import bigquery
from flask import Flask, redirect, url_for, request

app = Flask(__name__)
@app.route('/',methods = ['GET'])
def create_dataset(self):

  # Construct a BigQuery client object.
  client = bigquery.Client()
  print(client);

  #Create the dataset
  dataset = bigquery.Dataset('serverless-fall-22.pro_testdata')
  dataset.location = "US"
  dataset = client.create_dataset(dataset, timeout=30)

  #Specify the table schema
  schema = [
    bigquery.SchemaField("string_field_0", "STRING"),
    bigquery.SchemaField("string_field_1", "STRING")
  ]

  #Create the table
  table = bigquery.Table('serverless-fall-22.pro_testdata.pro_testdata', schema=schema)
  table = client.create_table(table)

  #Create job config to fetch csv data
  job_config = bigquery.LoadJobConfig(
    schema=[
        bigquery.SchemaField("string_field_0", "STRING"),
        bigquery.SchemaField("string_field_1", "STRING"),
    ],
    source_format=bigquery.SourceFormat.CSV,
  )

  #URI for csv data
  uri = "gs://mlsimilarity/recipe.csv"

  #Load the table with the uri 
  load_job = client.load_table_from_uri(
    uri, 'serverless-fall-22.pro_testdata.pro_testdata', job_config=job_config
  )

  #Waits for the job to complete.
  load_job.result()

  destination_table = client.get_table('serverless-fall-22.pro_testdata.pro_testdata')
  print("Loaded {} rows.".format(destination_table.num_rows))
  
  #Query to evaluate the new table with trained model
  query = """SELECT * FROM ML.EVALUATE(MODEL `pro_traindata.model`, (SELECT *  FROM `pro_testdata.pro_testdata`)) """
  query_job = client.query(query)

  #"Mean Squared Distance" from the result
  distance = '';
  for row in query_job:
    distance = row[1]
  
  #Checking if the distance is less than 3
  dist = distance < 3
  print("dist " , dist)

  #Deleting the dataset
  client.delete_dataset('serverless-fall-22.pro_testdata', delete_contents=True, not_found_ok=True)
  print("Deleted the dataset")

  return {"result" : dist }

if __name__ == '__main__':
   app.run(debug = True)

#Referred from,
# [1] G. Cloud, “Create a dataset,” Google Cloud. [Online]. Available: https://cloud.google.com/bigquery/docs/samples/bigquery-create-dataset. [Accessed: 03-Dec-2022].
# [2] G. Cloud, “Create table with schema,” Google Cloud. [Online]. Available: https://cloud.google.com/bigquery/docs/samples/bigquery-create-table. [Accessed: 03-Dec-2022].
# [3] G. Cloud, “Add a column using a query job,” Google Cloud. [Online]. Available: https://cloud.google.com/bigquery/docs/samples/bigquery-add-column-query-append. [Accessed: 03-Dec-2022].
# [4] G. Cloud, “Delete a dataset,” Google Cloud. [Online]. Available: https://cloud.google.com/bigquery/docs/samples/bigquery-delete-dataset. [Accessed: 03-Dec-2022].
