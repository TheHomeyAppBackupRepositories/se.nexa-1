'use strict';

const { RFDevice } = require('homey-rfdriver');

module.exports = class extends RFDevice {

  static RX_ENABLED = true;

  // How long without a message before the alarm is considered off
  alarmTimeout = 30 * 1000;
  debounceAlarmTimeout = undefined;

  async onCommandMatch(command) {
    return true;
  }

  async onCommandFirst(command, flags) {
    if (!this.getCapabilityValue('alarm_smoke')) {
      await this.setCapabilityValue('alarm_smoke', true);
    }
    // Prevent timeout from running out
    clearTimeout(this.debounceAlarmTimeout);
    this.debounceAlarmTimeout = setTimeout(() => {
      this.setCapabilityValue('alarm_smoke', false);
    }, this.alarmTimeout);
  }

};
