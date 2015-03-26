Meteor.publish("communities", function () {
  return CommunityList.find({}, {fields: {'slack_domain': 1}});
});

Meteor.methods({
  'insertCommunityData': function(slack_domain, token, auto_invite){
    var currentUserId = Meteor.userId();
    CommunityList.insert({
      slack_domain: slack_domain,
      token: token,
      auto_invite: auto_invite,
      createdBy: currentUserId
    });
  }
})