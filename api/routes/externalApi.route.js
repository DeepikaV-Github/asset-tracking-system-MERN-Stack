import express from 'express';
import fetch from 'node-fetch'; // Make sure to install node-fetch
import { errorHandler } from '../utils/error.js'; // Adjust the path as necessary

const router = express.Router();

router.post('/fetch-data', async (req, res, next) => {
  const { username } = req.body; // Get the username from the request body
  console.log("data recived",username)

  try {
    const apiRes = await fetch('https://conneqtion-dev2-bmwxqal1yvum-bo.integration.ap-mumbai-1.ocp.oraclecloud.com/ic/api/integration/v1/flows/rest/ATS_TRACKING/1.0/postGreetMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from('deepika.v@conneqtiongroup.com:Chinnu2106**').toString('base64'), // Replace with actual credentials
      },
      body:  JSON.stringify({message:username }), // Send the username in the request body
    });

    if (!apiRes.ok) {
      throw new Error('Failed to fetch data from external API');
    }
    console.log(apiRes)
    const apiData = await apiRes.json();
    console.log("apidata",apiData)
    res.status(200).json(apiData['message']); // Send the API response back to the frontend
  } catch (error) {
    next(errorHandler(500, error.message)); // Handle errors
  }
});

export default router;