const axios = require('axios');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

const BASE_URL = 'https://api.myquran.com/v2/sholat';

exports.handler = async (event, context) => {
  try {
    const path = event.path.replace('/.netlify/functions/jadwal', '');
    const method = event.httpMethod;

    // Get all cities
    if (path === '/kota/semua' && method === 'GET') {
      const cacheKey = 'jadwal_kota_semua';
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

      const response = await axios.get(`${BASE_URL}/kota/semua`);
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

    // Get daily prayer schedule (segmented format)
    const segmentedMatch = path.match(/^\/kota\/(\d+)\/tahun\/(\d+)\/bulan\/(\d+)\/tanggal\/(\d+)$/);
    if (segmentedMatch && method === 'GET') {
      const kotaId = segmentedMatch[1];
      const tahun = segmentedMatch[2];
      const bulan = segmentedMatch[3];
      const tanggal = segmentedMatch[4];
      const cacheKey = `jadwal_${kotaId}_${tahun}_${bulan}_${tanggal}`;
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

      const response = await axios.get(`${BASE_URL}/jadwal/${kotaId}/${tahun}/${bulan}/${tanggal}`);
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

    // Get monthly prayer schedule
    const monthlyMatch = path.match(/^\/kota\/(\d+)\/tahun\/(\d+)\/bulan\/(\d+)$/);
    if (monthlyMatch && method === 'GET') {
      const kotaId = monthlyMatch[1];
      const tahun = monthlyMatch[2];
      const bulan = monthlyMatch[3];
      const cacheKey = `jadwal_bulanan_${kotaId}_${tahun}_${bulan}`;
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

      const response = await axios.get(`${BASE_URL}/jadwal/${kotaId}/${tahun}/${bulan}`);
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

    // Alternative daily prayer schedule (single date format)
    const singleDateMatch = path.match(/^\/kota\/(\d+)\/tanggal\/(.+)$/);
    if (singleDateMatch && method === 'GET') {
      const kotaId = singleDateMatch[1];
      const date = singleDateMatch[2];
      const cacheKey = `jadwal_${kotaId}_${date}`;
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

      const response = await axios.get(`${BASE_URL}/jadwal/${kotaId}/${date}`);
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