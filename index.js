// app setup
import express from 'express';
let app = express();

// log 4xx and 5xx responses to console
import morgan from 'morgan';
app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}));

// set up daily logs
import fs from 'fs';
import path from 'path';
import rfs from 'rfs';

let logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

let accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});

app.use(morgan('combined', {stream: accessLogStream}));

// twilio setup
import Twilio from 'twilio';
import 'dotenv/config'
let twilioClient = new Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

//app controller
app.get('/', function (req, res) {
  console.log(req);
  console.log(process.env.TWILIO_SID);
  res.send('Hello World!')
});

app.post('/', function (req, res) {
  console.log(req)
  twilioClient.messages.create({
    body: 'Hello from Node',
    to: '+12345678901',  // Text this number
    from: '+12345678901' // From a valid Twilio number
  }).then();
});

app.listen(3000, function () {
  console.log('Listening on port 3000!')
});

