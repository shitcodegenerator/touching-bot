require('dotenv').config()

const express = require('express');
const { WebhookHandler } = require('@line/bot-sdk');

const config = {
  channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
  channelSecret: 'YOUR_CHANNEL_SECRET',
};

const app = express();
const handler = new WebhookHandler(config);

app.post('/callback', handler.middleware(), (req, res) => {
  res.sendStatus(200);
});

handler.on('message', async (event) => {
  try {
    const message = event.message.text;
    const replyToken = event.replyToken;

    // Handle incoming messages and send responses
    if (message === 'Hello') {
      await replyText(replyToken, 'Hi there!');
    } else {
      await replyText(replyToken, 'I did not understand that.');
    }
  } catch (err) {
    console.error(err);
  }
});

async function replyText(replyToken, text) {
  await client.replyMessage(replyToken, { type: 'text', text });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});