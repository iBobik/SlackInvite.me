Meteor.subscribe("communities");
Meteor.subscribe("members");

Template.userpanel.helpers({
  has_communities: function(){
    if (CommunityList.find({createdBy: Meteor.userId()}).count() != 0){
      return true
    }else{ 
      return false
    };
  }
});
Template.communities.onRendered( function(){
  var first_community_id = CommunityList.findOne({createdBy: Meteor.userId()})._id;
  Session.set('community', first_community_id);
});
Template.communities.helpers({
  communities: function(){
    return CommunityList.find({createdBy: Meteor.userId()});
  },
  selected: function(){
    return Session.equals('community', this._id)
  },
  community: function(){
    return CommunityList.findOne(Session.get('community'));
  },
  has_members: function(){
    if (MemberList.find({communityId: Session.get('community')}).count() != 0){
      return true
    }else{
      return false
    }
  },
  c_members: function(){
    var community = CommunityList.findOne({createdBy: Meteor.userId()})._id;
    var members = MemberList.find({communityId: Session.get('community')}).fetch();
    return members;
  }
});
Template.communities.events({
  'click .community': function(event){
    event.preventDefault();
    Session.set('community', this._id);
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