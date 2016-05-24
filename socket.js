const pubnub = require('pubnub');
const pubnubRef = pubnub.init({
  publish_key   : 'pub-c-53eaf64c-9df8-4ca7-9116-9ecb0d61feef',
  subscribe_key   : 'sub-c-b507301c-216b-11e6-8b91-02ee2ddab7fe',
  error         : function initErr (error) {
    console.log('Error:', error);
  },
});

module.exports =  function publish (channel, message, cb, err) {
  pubnubRef.publish({
    channel  : channel,
    message  : message,
    callback : cb,
    error    : err,
  });
}
