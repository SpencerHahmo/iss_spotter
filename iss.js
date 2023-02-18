const request = require('request');

const fetchMyIP = (callback) => {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    
    if (error) return callback(error, null);
    
    if (response.statusCode !== 200) {
      const errorMessage = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(errorMessage), null);
    }
    
    const myIPAddress = JSON.parse(body).ip;
    callback(null, myIPAddress);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {

    if (error) return callback(error, null);
    
    const parsedBody = JSON.parse(body);

    if (!parsedBody.success) {
      const errorMessage = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      return callback(Error(errorMessage), null);
    }

    const { latitude, longitude } = parsedBody;
    callback(null, {latitude, longitude});
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(url, (error, response, body) => {
    if (error) return callback(error, null);
    
    if (response.statusCode !== 200) {
      const errorMessage = `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`;
      return callback(Error(errorMessage), null);
    }

    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};

const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) return callback(error, null);

    fetchCoordsByIP(ip, (error, location) => {
      if (error) return callback(error, null);

      fetchISSFlyOverTimes(location, (error, nextPasses) => {
        if (error) return callback(error, null);

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };