const admin = require('firebase-admin');
const functions = require('firebase-functions')
const cors = require('cors')({ origin: true });

admin.initializeApp({
  credential:admin.credential.cert({
  "type": "service_account",
  "project_id": "questionanswer-b831c",
  "private_key_id": "68cc31ef4c95ab2515d2f0343814972737fa9e51",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDAHgqmvDj6JVKF\nNFYpgfjaFFzE51jUVNBASkc8uGUA0wGKSwvIi/WhFv6mANlzqjk9OEghGWLVAfOH\nRVEB78PFck2evU0V1LszH0EEPbIxtranIks9KB0dBb83ePhaVZ9pYDJM/KeNajCc\nMUi/Ugu50d2K5Wyjw1LAxvqP0ca1fpQ4QTJ+HVjE6ZcGyqiKiTj43HpPxaZ5FIRn\n7gcrUX/D2wdqImxkFRmiSLHcqg5NWM3bSmYQBhBJZJvyQ8uZfOb6MoSUMGPItqfS\nALj8ru6bVIoP/c45JjM7hGw9ewVjstYHyaq6T2dblBZ2NNSLfwXFy/NEL9f2TbL9\nzrqOvswzAgMBAAECggEAUrLb3Og7EprMSeC8kkOLjryjLnNzznrv5izTO3UYrWEn\nUZN6cAqnYn+WgHjvIhYNa6f1jKHz5ENhxEH3XAEM4cqRVRqhuxsGtjvm7d9s/G9t\ncsaVYq8I0TxvEn71UVV4OJEbNf6wVXR3llS0vv6fY47OcgLOYDQtRCSjKROhGPCz\no+dcrJEGj+7TqsmFOfdwsnB1k5p0A8oo124CV8P9PLBKbaBOg4WD9MyWUJjt4MgV\naRkAhxxoLylAAmCSGIQWaaa6nhqQkBNVQfJUtTlUc5BLHWNDuPJOWCbxzJc+9O2O\noX1hObb7E6bRXt4Q76HsV4TVelkMAZ8Lw0/Ryp/y0QKBgQDsg4DRmAVuT1q4CWxB\nALg40SkHHuZFtAv5qpo3UQxPPNnQlx5KNRGNh+LmuGpWAMuoNRvfDhUBs1xoqGH+\nlfQTk+x/T0Sxvq2wcLkSKjlv2fmPLFYLtomps5E2MIZTgX9zmvTWyQLtgUgiEXG7\nPF/5r6TBNlwon3H46iXAAYKDKwKBgQDP8iPpQvbdjkFZ+HLeBPNzSwkakatywMjx\nOvulehPsmUj3CA8RJwTb1nFquT/jVTMeEgA7mQFHipghCL19VH7KQTrwLoFM3wOO\nDyHlWWoJek34XEK9465NauZoUX60HUVYy/Ms72HUgpMgJP3nOtKtOh9rMb97X27m\n+64WMpV3GQKBgGi8e2lVpuIIpiXlllja1rnidga/Oj4X003GrPBeJdNZISPsJ++4\nvIMub964P+7B/24HxsXqWIceRIfcOTkicqnQ0eQ22DbWN9hwsqRGqpTLtGYgviIF\nvcS2zlFu/60vJZ+uOUp8TZ2bqLPdgb3mqKHLlGwzhHBA25ndJsZ2ZLNtAoGBALT+\nqrk2mw7+6ez4rmqG3qvEbPkeP5+TI5OsZiqDFmKCjRrPfeXNE5KRlYhyE6S4nNSY\nkHFPXOi7PmzKYbx71hwPKNCzecHB/yMgEr3A1OXI+aKqE0GasjUaTdAQ1vrI23pN\nkqzS81D4Ej0RVZp0/bjfdUdlNqiYyTvtZnpVrvjJAoGAAUH5GkehSsqgIURnB2mc\nfR1HzP/crKpep/84ReoQl42wcu88YxUawtG3WXNFo5KAbFmw9inKUKZSx/oxGJYT\nWmdiyLMP4QW9kGspGT0U1Py/47h0un+XS6eEALlPp9cgAoXqhY8GBILj67tGtGu0\nw2TdNyPi11c31Y3x1iX/7jQ=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-sqbxq@questionanswer-b831c.iam.gserviceaccount.com",
  "client_id": "100730592537287290544",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-sqbxq%40questionanswer-b831c.iam.gserviceaccount.com"
  })
});
const db =admin.firestore();
const collection ="QuestionAnswer";

exports.helloWorld = functions.https.onRequest(async (req, res) => {
  await cors(req, res, async () => {
    // your function body here - use the provided req and res from cors
    console.log("Hi")
    const data= await db.collection(collection).get();
    let result=[]
    data.forEach(i=>{
        result.push(i.data())
    })
    res.status(200).json({data: result, message: 'Success'})
  })
});
