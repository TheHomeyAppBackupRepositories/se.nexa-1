'use strict';

const { RFSignal, RFUtil, RFError } = require('homey-rfdriver');

module.exports = class extends RFSignal {
  static FREQUENCY = '433';
  static ID = 'nexa';

  static commandToDeviceData(command) {
    return {
      address: command.address,
      channel: command.channel,
      group: command.group,
      unit: command.unit
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

    if (typeof state !== 'boolean') {
      throw new RFError(`Invalid State: ${state}`);
    }

    if (typeof channel !== 'string' || channel.length !== 2) {
      throw new RFError(`Invalid Channel: ${channel}`);
    }

    if (typeof unit !== 'string' || unit.length !== 2) {
      throw new RFError(`Invalid Unit: ${unit}`);
    }

    return [].concat(
      RFUtil.bitStringToBitArray(address),
      group ? 1 : 0,
      state ? 1 : 0,
      RFUtil.bitStringToBitArray(channel),
      RFUtil.bitStringToBitArray(unit),
    );
  }

  static payloadToCommand(payload) {
    if (payload.length >= 32) { // Nexa sensor send 36 bits when on, 32bits when off
      const address = String(payload.slice(0, 26).join(''));
      const group = Boolean(payload.slice(26, 27)[0]);
      const state = Boolean(payload.slice(27, 28)[0]);
      const channel = String(payload.slice(28, 30).join(''));
      const unit = String(payload.slice(30, 32).join(''));
      const id =  `${address}:${channel}:${unit}`

      const held = payload.length >= 36 ? String(payload.slice(32, 36).join('')) : undefined;

      return {
        address,
        group,
        state,
        channel,
        unit,
        id,
        held,
      };
    }
    return null;
  }

  static createPairCommand() {
    const data = {
      address: RFUtil.generateRandomBitString(26),
      unit: RFUtil.generateRandomBitString(2),
      channel: RFUtil.generateRandomBitString(2),
      group: false,
      state: true,
    };
    data.id = `${data.address}:${data.channel}:${data.unit}`;
    return data;
  }
};
