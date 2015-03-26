Meteor.publish('communities', function () {
  return CommunityList.find({}, {fields: {'token': 0}});
});

Meteor.publish('members', function () {
  return MemberList.find();
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
  },
  'inviteMember': function(user_email, slack_domain){
    var community = CommunityList.findOne({slack_domain: slack_domain});
    MemberList.insert({
      user_email: user_email,
      communityId: community._id
    });
    if (community.auto_invite){
      var API_url = 'https://' + slack_domain + '.slack.com/api/users.admin.invite'
      var response = HTTP.post(API_url, {params: {email: user_email, token: community.token,set_active: true}});
    };
  }
})