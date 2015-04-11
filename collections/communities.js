CommunityList = new Mongo.Collection('comunities');
CommunityList._ensureIndex({slack_domain: 1}, {unique: 1});