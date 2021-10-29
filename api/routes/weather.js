const express = require('express');
const fetch = require('node-fetch');
const redis = require('redis');
const router = express.Router()

const { weatherApiURL, weatherApiKey, redisPort } = require('../config');

const client = redis.createClient(redisPort);

// Make request to Github for data
const getWeather = async (req, res, next) => {
  try {
    const latitude = req.params.latitude
    const longitude = req.params.longitude
    const location = latitude.toString() + longitude.toString()

    const response = await fetch(`${weatherApiURL}/weather/?lat=${latitude}&lon=${longitude}&units=metric&APPID=${weatherApiKey}`)								

    const data = await response.json();

    // Set data to Redis
    client.setex(location, 60, JSON.stringify(data));
    if (typeof data.main != 'undefined') {            
        return res.send(JSON.stringify(data))                            
    }
  } catch (err) {
    console.error(err);
    res.status(500);
  }
}

// Cache middleware
function cache(req, res, next) {
    const latitude = req.params.latitude
    const longitude = req.params.longitude
    const location = latitude.toString() + longitude.toString()

  client.get(location, (err, data) => {
    if (err) throw err;
    if (data !== null) {
        return res.send(data) 
    } else {
      next();
    }
  });
}

router.get('/:latitude/:longitude', cache, getWeather);

module.exports = router