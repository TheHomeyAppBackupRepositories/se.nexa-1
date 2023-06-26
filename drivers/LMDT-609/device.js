'use strict';

const DeviceTransmitter = require('../../lib/DeviceTransmitter');

module.exports = class extends DeviceTransmitter {
  async onCommandFirst(command) {
    if (!!command.state === true) {
      const timerSetting = Number(this.getSetting('timeout')) * 60 * 1000;
      if (timerSetting !== 0) {
        this.homey.clearTimeout(this.deviceTimeout);
        this.deviceTimeout = this.homey.setTimeout(() => {
          this.setCapabilityValue('alarm_motion', false).catch(this.error);
        }, timerSetting);
      }
    }
    await this.setCapabilityValue('alarm_motion', !!command.state);
  }
};

