const Bree = require('bree');

const bree = new Bree({
  jobs: [
    // runs `./jobs/worker-1.js` on the last day of the month
    // {
    //   name: 'worker-1',
    //   interval: 'on the last day of the month'
    // },
    {
      name: 'printreport',
      interval: 5000
    }
  ]
});

module.exports = bree