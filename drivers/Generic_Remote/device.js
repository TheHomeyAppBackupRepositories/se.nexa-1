'use strict';

const DeviceTransmitter = require('../../lib/DeviceTransmitter');

function extractScene(input) {
  switch (input) {
    case '1110':
      return 1;
    case '1111':
      return 2;
    case '0000':
      return 3;
    default:
      return undefined;
  }
}

module.exports = class extends DeviceTransmitter {

  async onCommandFirst({ state, ...flags }) {
    const {
      unit, group, held, channel,
    } = flags;

    const longPress = (held === '1100');
    const longRelease = (held === '1101');

    const scene = extractScene(held);

    if (longPress || longRelease) {
      await this.homey.flow
        .getDeviceTriggerCard('Generic_Remote:held')
        .trigger(this, {}, {
          longPress,
          longRelease,
          unit,
          group,
          channel,
        });
    } else if (scene) {
      await this.homey.flow
        .getDeviceTriggerCard('Generic_Remote:scene')
        .trigger(this, {}, {
          scene,
          channel,
        });
    } else {
      await this.homey.flow
        .getDeviceTriggerCard('Generic_Remote:received')
        .trigger(this, {}, {
          state,
          unit,
          group,
          channel,
        })
        .catch(err => this.error(err));
    }
  }

};
