'use strict';

const DriverReceiver = require('../../lib/DriverReceiver');
const NexaDimRFSignal = require('../../lib/NexaDimRFSignal');

module.exports = class extends DriverReceiver {
  static SIGNAL = NexaDimRFSignal;
};
