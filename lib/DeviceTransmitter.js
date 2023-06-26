const { RFDevice } = require('homey-rfdriver');

module.exports = class extends RFDevice {
  static RX_ENABLED = true;

  async onCommandMatch(command) {
    if(command === undefined || command === null) {
      return false;
    }

    const { address } = this.getData();
    return address === command.address;
  }
};
