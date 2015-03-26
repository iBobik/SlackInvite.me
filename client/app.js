Meteor.subscribe("communities");
Meteor.subscribe("members");

Template.userpanel.helpers({
  has_communities: function(){
    if (CommunityList.find().count() != 0){
      return true
    }else{ 
      return false
    };
  }
});
Template.communities.helpers({
  communities: function(){
    return CommunityList.find();
  },
  c_members: function(){
    var community = CommunityList.findOne({createdBy: Meteor.userId()})._id;
    console.log(community);
    var members = MemberList.find({communityId: community}).fetch();
    console.log(members);
    return members;
  }
});
Template.inviteform.rendered = function(){
    Session.set('inviteSent', false);
};

Template.inviteform.events({
  'submit form': function(event){
    event.preventDefault();
    var user_email = event.target.user_email.value;
    Meteor.call('inviteMember', user_email, Template.currentData().slack_domain);
    Session.set('inviteSent', true);
  }
});
Template.inviteform.helpers({
  inviteSent: function(){
    return Session.get('inviteSent');
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