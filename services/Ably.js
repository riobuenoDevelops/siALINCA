const Ably = require("ably");
const { config } = require("../config/index");

class AblyService {
  static ablyClient = {};

  static getChannels() {
    return {
      NOTIFICATION: "notifications"
    };
  }

  static createClient() {
    this.ablyClient = new Ably.Realtime(config.ablyApiKey);
  }

  static unsubscribe() {
    this.ablyClient.connection.close();
    this.ablyClient.connection.on("closed", () => console.log("Closed the connection to Ably."));
  }

  static publish(channel, subChannel, message) {
    const ablyChannel = this.ablyClient.channels.get(channel);
    ablyChannel.publish(subChannel, message);
  }
}

module.exports = AblyService;