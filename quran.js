const axios = require('axios');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

const BASE_URL = 'https://api.myquran.com/v2/quran';

exports.handler = async (event, context) => {
  try {
    const path = event.path.replace('/.netlify/functions/quran', '');
    const method = event.httpMethod;

    // Get all surah list
    if (path === '/surat' && method === 'GET') {
      const cacheKey = 'quran_surat';
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

      const response = await axios.get(`${BASE_URL}/surat`);
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

    // Get detail of a specific surah by id
    const surahMatch = path.match(/^\/surat\/(\d+)$/);
    if (surahMatch && method === 'GET') {
      const surahId = surahMatch[1];
      const cacheKey = `quran_surat_${surahId}`;
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

      const response = await axios.get(`${BASE_URL}/surat/${surahId}`);
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

    // Get specific ayah of a surah
    const ayatMatch = path.match(/^\/ayat\/(\d+:\d+)$/);
    if (ayatMatch && method === 'GET') {
      const surahAyat = ayatMatch[1];
      const cacheKey = `quran_ayat_${surahAyat}`;
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

      const response = await axios.get(`${BASE_URL}/ayat/${surahAyat}`);
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

    // Get tafsir of a specific ayah
    const tafsirMatch = path.match(/^\/tafsir\/(\d+:\d+)$/);
    if (tafsirMatch && method === 'GET') {
      const surahAyat = tafsirMatch[1];
      const cacheKey = `quran_tafsir_${surahAyat}`;
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

      const response = await axios.get(`${BASE_URL}/tafsir/${surahAyat}`);
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