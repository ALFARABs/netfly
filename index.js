exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: true,
      message: 'Islamic API is running',
      endpoints: {
        quran: '/.netlify/functions/quran',
        jadwal: '/.netlify/functions/jadwal',
        hadist: '/.netlify/functions/hadist',
        doa: '/.netlify/functions/doa'
      }
    }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  };
};