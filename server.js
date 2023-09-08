const exp = require("express");
const cors = require("cors");
const bp = require("body-parser");
const axios = require("axios");

const app = exp();
app.use(bp.json());
app.use(cors());
require("dotenv").config();

const api_key = process.env.API_KEY;
const port = process.env.PORT || 8000;

app.post("/shortenURL", async (req, res) => {
  const { prompt } = req.body;

  const encodedParams = new URLSearchParams();
  encodedParams.set("url", prompt);

  const options = {
    method: "POST",
    url: "https://url-shortener-service.p.rapidapi.com/shorten",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "X-RapidAPI-Key": api_key,
      "X-RapidAPI-Host": "url-shortener-service.p.rapidapi.com",
    },
    data: encodedParams,
  };

  try {
    const response = await axios.request(options);
    res.send(response.data.result_url);
  } catch (error) {
    console.error(error.message);
    res.send(`Error: ${error.message}`);
  }
});
app.post("/summarize", async (req, res) => {
  const { prompt } = req.body;

  const options = {
    method: "POST",
    url: "https://open-ai21.p.rapidapi.com/summary",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": api_key,
      "X-RapidAPI-Host": "open-ai21.p.rapidapi.com",
    },
    data: {
      text: prompt,
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    res.send(response.data.result);
  } catch (error) {
    console.error(error);
    res.send(`Error: ${error.message}`);
  }
});
app.post("/generateQR", async (req, res) => {
  const { prompt } = req.body;

  const options = {
    method: "GET",
    url: "https://qrcodeutils.p.rapidapi.com/qrcodefree",
    params: {
      text: prompt,
      validate: "true",
      size: "350",
      type: "svg",
      level: "M",
    },
    headers: {
      "X-RapidAPI-Key": api_key,
      "X-RapidAPI-Host": "qrcodeutils.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.send(`Error: ${error.message}`);
  }
});
app.post("/generateheadline", async (req, res) => {
  const { prompt } = req.body;

  const encodedParams = new URLSearchParams();
  encodedParams.set("text", prompt);

  const options = {
    method: "POST",
    url: "https://open-ai21.p.rapidapi.com/headline",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "X-RapidAPI-Key": api_key,
      "X-RapidAPI-Host": "open-ai21.p.rapidapi.com",
    },
    data: encodedParams,
  };

  try {
    const response = await axios.request(options);
    res.send(response.data.headline);
  } catch (error) {
    console.error(error);
    res.send(`Error: ${error.message}`);
  }
});
app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  const options = {
    method: "POST",
    url: "https://open-ai21.p.rapidapi.com/conversationllama",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": api_key,
      "X-RapidAPI-Host": "open-ai21.p.rapidapi.com",
    },
    data: {
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      web_access: false,
    },
  };

  try {
    const response = await axios.request(options);
    res.send(response.data.LLAMA.slice(4));
  } catch (error) {
    console.error(error);
    res.send(`Error: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log("Server started on port 3001.");
});
