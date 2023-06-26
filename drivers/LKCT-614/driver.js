'use strict';

const DriverTransmitter = require('../../lib/DriverTransmitter');

module.exports = class extends DriverTransmitter {
  async onRFInit() {
    await super.onRFInit();

    this.homey.flow
      .getDeviceTriggerCard('LKCT-614:received')
      .registerRunListener(async (args, state) => {
        return (args.state === '1') === state.state;
      });
  }
};
