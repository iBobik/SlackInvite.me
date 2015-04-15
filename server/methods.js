Meteor.publish('communities', function () {
  return CommunityList.find({createdBy: this.userId}, {fields: {'token': 0}});
});

Meteor.publish('currentcommunity', function (domain) {
  return CommunityList.find({slack_domain: domain}, {fields: {'token': 0}});
});

Meteor.publish('members', function (community_id) {
  var community = CommunityList.findOne({_id: community_id});
  return MemberList.find({communityId: community._id});
});

/* extend the default accounts-github function to add user email addresses and usernames to our mongodb */
Accounts.onCreateUser(function(options, user) {
  if (options.profile) {
    user.profile = options.profile;
  };
  user.profile.github = {};
  user.profile.github.accessToken = user.services.github.accessToken;
  user.profile.github.email = user.services.github.email;
  user.profile.github.username = user.services.github.username;
  return user;
});

Meteor.methods({
  'insertCommunityData': function(slack_domain, encrypted_token, auto_invite){
    if (Meteor.userId()){
      var token = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(encrypted_token));
      var currentUserId = Meteor.userId();
      var community;
      var community_count = CommunityList.find({slack_domain: slack_domain}).count();
      if (community_count != 0){
        throw new Meteor.Error(403, "Community already exists.");
      }else{
        community = CommunityList.insert({
          slack_domain: slack_domain,
          token: token,
          auto_invite: auto_invite,
          createdBy: currentUserId
        });
      }
      // try {
      //   communityId = CommunityList.insert({
      //     slack_domain: slack_domain,
      //     token: token,
      //     auto_invite: auto_invite,
      //     createdBy: currentUserId
      //   });
      // } catch (error) {
      //   if (error.name !== 'MongoError') throw error;
      //   var match = error.err.match(/E11000 duplicate key error index: ([^ ]+)/);
      //   if (!match) throw error;
      //   if (match[1].indexOf('slack_domain') !== -1){
      //     throw new Meteor.Error(403, "Community already exists.");
      //   };
      //   throw error;
      // }
      return community;
    };
  },
  'updateCommunityData': function(communityId, slack_domain, encrypted_token, auto_invite){
    if (Meteor.userId() == CommunityList.findOne(communityId).createdBy){
      var token = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(encrypted_token));
      var currentUserId = Meteor.userId();
      var community_properties = {
        slack_domain: slack_domain,
        token: token,
        auto_invite: auto_invite
      };
      CommunityList.update(communityId, {$set: community_properties});
    }
  },
  'inviteMember': function(user_email, slack_domain){
    var community = CommunityList.findOne({slack_domain: slack_domain});
    MemberList.insert({
      user_email: user_email,
      communityId: community._id,
      invited: community.auto_invite
    });
    if (community.auto_invite){
      Meteor.call('sendInvite', community._id, user_email);
    }
    else {
      //send a notice about a new request invitation via email
      admin = Meteor.users.findOne({_id: community.createdBy});
      admin_username = admin.profile.github.username;
      toemail = admin.profile.github.email;
      Meteor.call('inviteNoticeEmail', admin_username, user_email, slack_domain, toemail);
    }
  },
  'sendInvite': function(community_id, user_email){
    var community = CommunityList.findOne({_id: community_id});
    var member = MemberList.findOne({user_email: user_email});
    var API_url = 'https://' + community.slack_domain + '.slack.com/api/users.admin.invite';
    var response = HTTP.post(API_url, {params: {email: member.user_email, token: community.token,set_active: true}});
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
          name: "userName",
          content: username
        },
        {   
          name: "inviteUser",
          content: inviteuser
        },
        {
          name: "slackGroup",
          content: slackgroup
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