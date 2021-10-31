const Ably = require("ably");
const { config } = require("../config/index");

class AblyService {
  constructor() {
    this.ably = new Ably.Realtime(config.ablyApiKey);
    this.ably.connection.on("connected", () => console.log("Connected to Ably"));
  }

  getChannels() {
    return {
      NOTIFICATION: "notifications"
    };
  }

  suscribe(channel, subChannel) {
    const ablyChannel = this.ably.channels.get(channel);
    ablyChannel.suscribe(subChannel, (message) => {
      console.log(`Received a notification message in realtime: ${message.data}`)
    });
  }

  unsuscribe() {
    this.ably.connection.close();
    this.ably.connection.on("closed", () => console.log("Closed the connection to Ably."));
  }

  publish(channel, subChannel, message) {
    const ablyChannel = this.ably.channels.get(channel);
    ablyChannel.publish(subChannel, message);
  }
}

module.exports = AblyService;