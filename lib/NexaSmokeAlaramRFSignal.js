'use strict';

const { RFSignal } = require('homey-rfdriver');

module.exports = class extends RFSignal {

  static FREQUENCY = '433';
  static ID = 'nexa-smoke';

  static payloadToCommand(payload) {
    const address = String(payload.join(''));
    return {
      address,
    };
  }

};
