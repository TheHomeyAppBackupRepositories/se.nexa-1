'use strict';

const { RFDriver } = require('homey-rfdriver');
const NexaSmokeAlarmRFSignal = require('../../lib/NexaSmokeAlaramRFSignal');

module.exports = class extends RFDriver {

  static SIGNAL = NexaSmokeAlarmRFSignal;

};
