'use strict';

const DriverReceiver = require('../../lib/DriverReceiver');

module.exports = class extends DriverReceiver {
  async onRFInit() {
    await super.onRFInit();

    this.homey.flow
      .getActionCard('LMLR-710:send')
      .registerRunListener(async ({ device }) => device.txOn());
  }
};
