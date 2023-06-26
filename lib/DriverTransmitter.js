
const { RFDriver } = require('homey-rfdriver');
const NexaRFSignal = require('./NexaRFSignal');

module.exports = class extends RFDriver {
  static SIGNAL = NexaRFSignal;
};
