require('dotenv').config()

const express = require('express')
const line = require('@line/bot-sdk')

// create LINE SDK config from env variables
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
  };
  
  // create LINE SDK client
//   const client = new line.messagingApi.MessagingApiClient({
//     channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
//   });

  const client = new line.messagingApi.MessagingApiClient(config);
  
  // create Express app
  // about Express itself: https://expressjs.com/
  const app = express();
  
  // register a webhook handler with middleware
  // about the middleware, please refer to doc
  app.post('/callback', line.middleware(config), (req, res) => {
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result))
      .catch((err) => {
        console.error(err);
        res.status(500).end();
      });
  });

  // Function to get image data using LINE API
async function getImageData(imageId) {
    await client.getMess
    // const response = await client.getMessageContent(imageId);
    return response;
  }
  
  // event handler
  async function handleEvent(event) {
    if (event.type === 'message' && event.message.type === 'image') {
            const imageMessage = event.message;
            const imageData = await getImageData(imageMessage.id);
            await uploadToGoogleDrive(imageData);
            // Send a confirmation message to the user
            await client.replyMessage(event.replyToken, { type: 'text', text: 'Image uploaded successfully to Google Drive.' });
    }
    if (event.type !== 'message' || event.message.type !== 'text') {
      // ignore non-text-message event
      return Promise.resolve(null);
    }
  
    // create an echoing text message
    const echo = { type: 'text', text: event.message.text };
  
    // use reply API
    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [echo],
    });
  }

  // Function to upload image data to Google Drive
async function uploadToGoogleDrive(imageData) {
    try {
      // Make a POST request to your server API endpoint
    //   const formData = new FormData();
    // formData.append("image", imageData);
      await axios.post('https://touching-backend.vercel.app/api/uploadImage', imageData, {
        headers: {
          'Content-Type': 'image/jpeg', // Change content type if needed
        },
      });
    } catch (error) {
      console.error('Error uploading image to Google Drive:', error);
      throw error;
    }
  }
  
  // listen on port
  const port = process.env.PORT || 3000;

  app.get('/', (req, res) => {
    res.send('Hey this is my API running 🥳')
  })
  app.listen(port, () => {
    console.log(`listening on ${port}`);
  });