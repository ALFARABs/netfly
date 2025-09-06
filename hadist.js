const axios = require('axios');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

const BASE_URL = 'https://api.myquran.com/v2/hadits';

exports.handler = async (event, context) => {
  try {
    const path = event.path.replace('/.netlify/functions/hadist', '');
    const method = event.httpMethod;

    // Get list of hadith books
    if (path === '/kitab' && method === 'GET') {
      const cacheKey = 'hadist_kitab';
      const cachedData = cache.get(cacheKey);
      
      if (cachedData) {
        return {
          statusCode: 200,
          body: JSON.stringify(cachedData),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        };
      }

      const response = await axios.get(`${BASE_URL}/kitab`);
      const data = {
        status: true,
        data: response.data.data
      };
      cache.set(cacheKey, data);

      return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      };
    }

    // Get hadith list by book name
    const bookMatch = path.match(/^\/kitab\/([^\/]+)$/);
    if (bookMatch && method === 'GET') {
      const bookName = bookMatch[1];
      const cacheKey = `hadist_kitab_${bookName}`;
      const cachedData = cache.get(cacheKey);
      
      if (cachedData) {
        return {
          statusCode: 200,
          body: JSON.stringify(cachedData),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        };
      }

      const response = await axios.get(`${BASE_URL}/${bookName}`);
      const data = {
        status: true,
        data: response.data.data
      };
      cache.set(cacheKey, data);

      return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      };
    }

    // Get specific hadith by book name and hadith number
    const hadithMatch = path.match(/^\/kitab\/([^\/]+)\/(\d+)$/);
    if (hadithMatch && method === 'GET') {
      const bookName = hadithMatch[1];
      const hadithNumber = hadithMatch[2];
      const cacheKey = `hadist_kitab_${bookName}_${hadithNumber}`;
      const cachedData = cache.get(cacheKey);
      
      if (cachedData) {
        return {
          statusCode: 200,
          body: JSON.stringify(cachedData),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        };
      }

      const response = await axios.get(`${BASE_URL}/${bookName}/${hadithNumber}`);
      const data = {
        status: true,
        data: response.data.data
      };
      cache.set(cacheKey, data);

      return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      };
    }

    return {
      statusCode: 404,
      body: JSON.stringify({
        status: false,
        message: 'Endpoint not found'
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: false,
        message: error.message
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};