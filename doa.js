const axios = require('axios');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

const BASE_URL = 'https://api.myquran.com/v2/doa';

exports.handler = async (event, context) => {
  try {
    const path = event.path.replace('/.netlify/functions/doa', '');
    const method = event.httpMethod;

    // Get all doa list
    if (path === '/' && method === 'GET') {
      const cacheKey = 'doa_all';
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

      const response = await axios.get(`${BASE_URL}`);
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

    // Get specific doa by id
    const doaMatch = path.match(/^\/(\d+)$/);
    if (doaMatch && method === 'GET') {
      const doaId = doaMatch[1];
      const cacheKey = `doa_${doaId}`;
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

      const response = await axios.get(`${BASE_URL}/${doaId}`);
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