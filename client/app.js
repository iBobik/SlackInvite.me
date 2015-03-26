Meteor.subscribe("communities");
Meteor.subscribe("members");

Template.userpanel.helpers({
  has_communities: function(){
    if (CommunityList.find().count() != 0){
      return true
    }else{ 
      return false
    };
  },
});
Template.communities.helpers({
  communities: function(){
    return CommunityList.find();
  }
});

Template.inviteform.events({
  'submit form': function(event){
    event.preventDefault();
    var user_email = event.target.user_email.value;
    Meteor.call('inviteMember', user_email, Template.currentData().slack_domain);

    }
});

Template.new_community.events({
  'submit form': function(event){
    event.preventDefault();
    var slack_domain = event.target.slack_domain.value;
    var token = event.target.token.value;
    var auto_invite = event.target.auto_invite.checked;
    Meteor.call('insertCommunityData', slack_domain, token, auto_invite)
    }
});