const {TwitterApi} = require("twitter-api-v2");

const client = new TwitterApi({
    appKey: "appKey",
    appSecret: "appSecret",
    accessToken: "accessToken",
    accessSecret: "accessSecret"
})

const rwClient = client.readWrite

module.exports = rwClient