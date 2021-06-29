const Pubnub = require('pubnub');

class PubNubService {
  static pubNubInstance = null;
  static channel = null;

  static initialize(email, channel) {
    this.pubNubInstance = new Pubnub({
      publishKey: process.env.NEXT_PUBLIC_PUBLISH_KEY,
      subscribeKey: process.env.NEXT_PUBLIC_SUBSCRIBE_KEY,
      uuid: email
    })
    this.channel = channel;
  }

  static subscribe() {
    this.pubNubInstance.subscribe({ channels: [this.channel] });
  }

  static publish(message) {
    this.pubNubInstance.publish({ channel: this.channel, message })
  }
}

module.exports = PubNubService;