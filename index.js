const { nextISSTimesForMyLocation } = require('./iss');

const printPassTimes = (passTimes) => {
  for (const passes of passTimes) {
    const dateTime = new Date(0);
    dateTime.setUTCSeconds(passes.risetime);
    const duration = passes.duration;
    console.log(`Next pass at ${dateTime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) return console.log("There was an error!", error);
  printPassTimes(passTimes);
});