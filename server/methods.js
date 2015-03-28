Meteor.publish('communities', function () {
  return CommunityList.find({}, {fields: {'token': 0}});
});

Meteor.publish('currentcommunity', function (domain) {
  return CommunityList.find({slack_domain: domain}, {fields: {'token': 0}});
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
  },
  'inviteNoticeEmail': function(username, inviteuser, slackgroup, toEmail){
    /*
    Sends an invite notice to the slack channel admin about a new invite:
    * 'username' should be the username of the admin being emailed
    * 'inviteuser' should be the email of the user requesting invitation
    * 'slackgroup' is the group the user requested invitation to
    * 'toEmail' is the email of the admin to be notified
    */
    return Meteor.Mandrill.sendTemplate({
      "template_name": "default-slackinvite-me",
      "template_content": [
        {
          userName: username,
          inviteUser: inviteuser,
          slackGroup: slackgroup
        }
      ],
      "message": {
        "to": [
          {"email": toEmail}
        ]
      }
    });
  }
});