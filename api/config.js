const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  weatherApiURL: process.env.WEATHER_API_URL,
  weatherApiKey: process.env.WEATHER_API_KEY,
  port: process.env.API_PORT,
  redisPort: process.env.REDIS_PORT
};