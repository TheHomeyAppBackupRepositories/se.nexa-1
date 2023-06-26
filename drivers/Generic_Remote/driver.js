'use strict';

const DriverTransmitter = require('../../lib/DriverTransmitter');

module.exports = class extends DriverTransmitter {

  async onRFInit() {
    await super.onRFInit();

    this.homey.flow
      .getDeviceTriggerCard('Generic_Remote:held')
      .registerRunListener(async (args, state) => {
        const value = ((args.state === 'held' && state.longPress) || (args.state === 'released' && state.longRelease));
        const button = (args.unit === 'any') || (args.unit === 'g' && state.group) || (args.unit === state.unit && !state.group);
        const channel = (args.channel === 'any') || (args.channel === state.channel);
        return value && button && channel;
      });

    this.homey.flow
      .getDeviceTriggerCard('Generic_Remote:received')
      .registerRunListener(async (args, state) => {
        const value = !(state.state ^ (args.state === '1'));
        const button = (args.unit === 'any') || (args.unit === 'g' && state.group) || (args.unit === state.unit && !state.group);
        const channel = (args.channel === 'any') || (args.channel === state.channel);
        return value && button && channel;
      });

    this.homey.flow
      .getDeviceTriggerCard('Generic_Remote:scene')
      .registerRunListener(async (args, state) => {
        const scene = (args.scene === 'any') || (args.scene === `${state.scene}`);
        const channel = (args.channel === 'any') || (args.channel === state.channel);
        return scene && channel;
      });
  }

};
