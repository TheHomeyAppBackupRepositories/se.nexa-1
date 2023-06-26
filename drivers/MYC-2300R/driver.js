'use strict';

const DriverTransmitter = require('../../lib/DriverTransmitter');

module.exports = class extends DriverTransmitter {
  async onRFInit() {
    await super.onRFInit();

    this.homey.flow
      .getDeviceTriggerCard('MYC-2300R:received')
      .registerRunListener(async (args, state) => {;
        return args.unit === state.unit && (args.state === '1') === state.state;
      });
  }
};
