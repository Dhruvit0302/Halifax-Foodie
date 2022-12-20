// #Author: Indu Munagapati
// This function is repsonbile to store csv files in cloud storage bucket which will be used by Data studio to visualize

const { Storage } = require('@google-cloud/storage');
const express = require('express');
const cors = require('cors');

const storage_client = new Storage();
const app = express();
app.use(express.json());
app.use(cors());

app.post("/poll", async (req, res) => {
  
  const data = req.body.data;
  let value = req.body.key + "\n";;

  for (const info of data.split(",")) {  
    value += info + "\n";
  }

  //Store the data in the cloud storage
  await storage_client.bucket(req.body.bName).file(req.body.file).save(value);
  console.log("File successfully stored in bucket, " + req.body.bName + " with filename: " + req.body.file);

  //Store the data in the cloud storage if sentiment analysis available in the request
  if(req.body.sent_analysis != undefined) {
    const sent = req.body.sent_analysis;
    let valve = "analysis, value," + "\n"
    valve += "Mixed, " + sent.Mixed + "," + "\n" + "Negative, " + sent.Negative + "," + "\n" + "Neutral, " + sent.Neutral + "," + "\n" + "Positive, " + sent.Positive + "," + "\n";
    await storage_client.bucket(req.body.bName).file("senti.csv").save(valve);
    console.log("File successfully stored in bucket, " + req.body.bName + " with filename: senti.csv");
  }

  res.send({
        headers: {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : true,
            "Access-Control-Allow-Methods" : "*"
        },
      status: 200,
      message: req.body.data
    });
})


module.exports = { app }

//Referred from,
//[1]	G. Cloud, “Upload objects from memory,” Google Cloud. [Online]. Available: https://cloud.google.com/storage/docs/uploading-objects-from-memory. [Accessed: 03-Dec-2022].