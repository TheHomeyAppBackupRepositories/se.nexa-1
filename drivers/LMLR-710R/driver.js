'use strict';

const DriverTransmitter = require('../../lib/DriverTransmitter');

module.exports = class extends DriverTransmitter {
  async onRFInit() {
    await super.onRFInit();

    this.homey.flow
      .getDeviceTriggerCard('LMLR-710R:received')
      .registerRunListener(async (args, state) => {
        return args.unit === state.unit;
      });
  }
};
