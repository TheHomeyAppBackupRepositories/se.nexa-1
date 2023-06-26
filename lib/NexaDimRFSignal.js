'use strict';

const { RFUtil, RFError } = require('homey-rfdriver');
const NexaRFSignal = require('./NexaRFSignal');

module.exports = class extends NexaRFSignal {
  static ID = 'nexa-dim';

  static commandToDeviceData(command) {
    return {
      address: command.address,
      channel: command.channel,
      unit: command.unit,
    };
  }

  static commandToPayload({
                            address,
                            group,
                            state,
                            channel,
                            unit,
                          }) {
    if (typeof address !== 'string' || address.length !== 26) {
      throw new RFError(`Invalid Address: ${address}`);
    }

    if (typeof group !== 'boolean') {
      throw new RFError(`Invalid Group: ${group}`);
    }

    if (typeof state !== 'boolean' && typeof state === 'number' && (state < 0 || state > 1)) {
      throw new RFError(`Invalid State: ${state}`);
    }

    if (typeof channel !== 'string' || channel.length !== 2) {
      throw new RFError(`Invalid Channel: ${channel}`);
    }

    if (typeof unit !== 'string' || unit.length !== 2) {
      throw new RFError(`Invalid Unit: ${unit}`);
    }

    // If the state is Boolean or 0 or 1, the actual state should be set (converted to 1 or 0).
    let dimState = (typeof state === 'boolean') ? (state ? 1 : 0) : state;
    let dim = dimState;

    // If the state is a number, the state should be set to 2 and the dim value sets the light brightness
    if (typeof state === 'number'){
      dim = state;
      if(dim > 0) {
        dimState = 2;
      }

      // On max value with the Homey Bridge and the way the 433 signal is send, setting a dim level of 1 results in the
      // device going into 'dim level set mode'. This mode is activated because the device thinks it is turned on multiple times.
      // To prevent this, set the max level to 0.99
      if (dim === 1) {
        dim = 0.99;
      }
    }

    return [].concat(
      RFUtil.bitStringToBitArray(address),
      group ? 1 : 0,
      dimState,
      RFUtil.bitStringToBitArray(channel),
      RFUtil.bitStringToBitArray(unit),
      RFUtil.numberToBitArray(Math.round(Math.min(1, Math.max(0, dim)) * 15), 4),
    );
  }

  static payloadToCommand(payload) {
    if (payload.length >= 32) { // Nexa sensor send 36 bits when on, 32bits when off
      const address = String(payload.slice(0, 26).join(''));
      const group = Boolean(payload.slice(26, 27)[0]);
      const state = Boolean(payload.slice(27, 28)[0]);
      const channel = String(payload.slice(28, 30).join(''));
      const unit = String(payload.slice(30, 32).join(''));
      let dim = state ? 1: 0;
      if(payload.length === 36) {
        dim = RFUtil.bitArrayToNumber(payload.slice(32, 36)) / 15;
      }
      const id = `${address}:${channel}:${unit}`;

      return {
        address,
        group,
        state,
        channel,
        unit,
        dim,
        id,
      };
    }
    return null;
  }
};
