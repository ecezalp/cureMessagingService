import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import twilio from 'twilio';
import 'dotenv/config'

let app, twilioClient, isValid;

// setup app and error logging
app = express();
app.use(bodyParser.json());
app.use(morgan('dev', {
  skip: function (req, res) {
    return res.statusCode < 400
  }
}));

twilioClient = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

isValid = (req) => (
  req.body.targetNumber.match(/^[0-9]{11}$/) &&
  req.body.accessCode.length === 4 &&
  req.header("secret-token") === process.env.SECRET_TOKEN
);

//controller
app.post('/', function (req, res) {
  isValid(req) && twilioClient.messages.create({
    body: `Your CURE CONNECT access code is ${req.body.accessCode}`,
    to: '+' + req.body.targetNumber,
    from: process.env.TWILIO_MY_NUMBER
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

