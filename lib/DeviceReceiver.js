'use strict';

const { RFDevice } = require('homey-rfdriver');

module.exports = class extends RFDevice {
  static CAPABILITIES = {
    onoff: ({ value, data }) => ({
      ...data,
      state: !!value,
      group: false,
    }),
    async dim({ value, data }) {
      // Turn off entirely when dim value is zero
      if (value === 0) {
        value = false;
        if (this.hasCapability('onoff')) {
          await this.setCapabilityValue('onoff', false);
        }
      } else if (this.hasCapability('onoff')) {
        await this.setCapabilityValue('onoff', true);
      }

      return {
        ...data,
        state: value,
        group: false,
      };
    },
  };

  async onRFInit() {
    this.overrideEnableRX = false; // use this flag to check is the device RX needs to be disabled on deletion
    const copiedFromRemote = this.getData().copiedFromRemote;

    if (copiedFromRemote === undefined) {
      // Enable RX if the device was added before SDKv3 update that includes the copiedFromRemote flag
      await this.driver.enableRX(this.onRX);
      this.overrideEnableRX = true;
    }

    // Migration for the setOnDim value to make sure dimmer devices only send dim command on Flow
    if(this.hasCapability('onoff') && this.hasCapability('dim')) {
      const capabilityOptions = this.getCapabilityOptions('onoff');
      if(capabilityOptions.setOnDim !== false) {
        capabilityOptions.setOnDim = false;
        await this.setCapabilityOptions('onoff', capabilityOptions);
      }
    }

    await super.onRFInit();
  }

  async onUninit() {
    if (this.overrideEnableRX) {
      await this.driver.disableRX(this.onRX);
    }

    await super.onUninit();
  }

  async onAdded() {
    if (this.hasCapability('onoff')) {
      await this.setCapabilityValue('onoff', false);
    }
    if (this.hasCapability('dim')) {
      await this.setCapabilityValue('dim', 1);
    }
  }

  /**
   * Match the received command from a remote to the socket command
   *
   * @param command
   * @returns {Promise<boolean>}
   */
  async onCommandMatch(command) {
    if (command === undefined || command === null) {
      return false;
    }

    const { address, unit } = this.getData();

    return (
      (command.group && address === command.address) || // If group is true, unit is not important
      (address === command.address && unit === command.unit)
    );
  }

  /**
   * Sets the capability when the device is triggered by remote for on off
   *
   * @param onoff
   * @returns {Promise<void>}
   */
  async onCommandFirst({ state }) {
    if (this.hasCapability('onoff')) {
      await this.setCapabilityValue('onoff', state);
    }
  }
};
