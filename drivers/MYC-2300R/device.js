'use strict';

const DeviceTransmitter = require('../../lib/DeviceTransmitter');

module.exports = class extends DeviceTransmitter {
  async onCommandFirst({ state, unit, group }) {
    if(group) {
      unit = 'g'; // as defined in the triple-switch flow args
    }

    await this.homey.flow
      .getDeviceTriggerCard('MYC-2300R:received')
      .trigger(this, {}, { state, unit })
      .catch(err => this.error(err));
  }
};
