'use strict';

const DeviceReceiver = require('../../lib/DeviceReceiver');

module.exports = class extends DeviceReceiver {

  static DOORBELL_TIMEOUT = 4000;

  async onRFInit() {
    await super.onRFInit();

    // Disable the alarm if it was enabled
    this.setCapabilityValue('alarm_generic', false)
      .catch(this.error);

    this.deviceTimeout = null;
  }

  async onUninit() {
    if (this.deviceTimeout) {
      this.homey.clearTimeout(this.deviceTimeout);
    }
    await super.onUninit();
  }

  // If triggered form the remote, set the alarm to true
  async onCommandFirst(command) {
    if (command.state === true) {
      this.setCapabilityValue('alarm_generic', true)
        .catch(this.error);

      this.resetAlarm();
    }
  }

  resetAlarm() {
    if (this.deviceTimeout) {
      this.homey.clearTimeout(this.deviceTimeout);
    }
    this.deviceTimeout = this.homey.setTimeout(() => {
      this.setCapabilityValue('alarm_generic', false)
        .catch(this.error);
    }, this.constructor.DOORBELL_TIMEOUT);
  }

  /**
   *
   * Custom function to trigger the doorbell with the correct group param
   *
   * @returns {Promise<void>}
   */
  async txOn() {
    const {
      address, channel, unit, group,
    } = this.getData();

    let parsedGroup = group || false;

    if (typeof parsedGroup === 'number') {
      parsedGroup = (group === 1);
    }

    await this.driver.tx({
      address,
      channel,
      unit,
      group: parsedGroup,
      state: true,
    }, { device: this });
  }

};
