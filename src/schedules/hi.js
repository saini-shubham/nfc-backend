
const cron = require('node-cron');


// Function to print "Hi" to the console

const printHi = () => {
    debugger
  console.log('Hi');

};


// Schedule the cron job to run every second

cron.schedule('* * * * * *', printHi);


console.log('Cron job scheduled to print "Hi" every second.');

module.exports = cron