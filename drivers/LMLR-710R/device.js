'use strict';

const DeviceTransmitter = require('../../lib/DeviceTransmitter');

module.exports = class extends DeviceTransmitter {
  async onCommandFirst(command) {
    if (!!command.state === true) {
      await this.homey.flow
        .getDeviceTriggerCard('LMLR-710R:received')
        .trigger(this)
        .catch(err => this.error(err));
    }
  }
};
