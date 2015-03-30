Meteor.subscribe("communities");

Template.userpanel.onRendered( function(){
  Session.get('add_community', false)
});
Template.communities.onRendered( function(){
  var first_community_id = CommunityList.findOne({createdBy: Meteor.userId()})._id;
  Session.set('community', first_community_id);
  Meteor.subscribe("members", first_community_id);
});
Template.userpanel.helpers({
  add_community: function(){
    if (CommunityList.find({createdBy: Meteor.userId()}).count() != 0){
      return Session.get('add_community')
    }else{
      return true
    };
  }
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
  members: function(){
    var community = CommunityList.findOne({createdBy: Meteor.userId()})._id;
    var members = MemberList.find({communityId: Session.get('community')}).fetch();
    return members;
  }
});
Template.communities.events({
  'click .community': function(event){
    event.preventDefault();
    Session.set('community', this._id);
    Meteor.subscribe("members", this._id);
  },
  'click .add_community': function(event){
    event.preventDefault();
    Session.set('add_community', true);
  },
  'click .send': function(event){
    event.preventDefault();
    Meteor.call('sendInvite', this.communityId, this.user_email);
    MemberList.update(this._id, {$set: {invited: true}});
    Alerts.set('The user has been invited', 'success');
  },
  'change .auto_invite input': function(event){
    var communityId = Session.get('community');
    CommunityList.update(communityId, {$set: {auto_invite: event.target.checked}});
    if (event.target.checked){
      Alerts.set('Auto-Invite has been enabled', 'warning');
    }else{
      Alerts.set('Auto-Invite has been disabled', 'warning');
    };
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
Template.footer.helpers({
  iswhite: function(){
    var routes = ["home","inviteform"];
    var route = Router.current().route.getName();
    if (_.contains(routes,route)){
      return true;
    }else{
      return false;
    }
  }
});
Template.new_community.helpers({
  has_communities: function(){
    if (CommunityList.find({createdBy: Meteor.userId()}).count() != 0){
      return true;
    }else{
      return false;
    }
  }
});
Template.new_community.events({
  'submit form': function(event){
    event.preventDefault();
    var slack_domain = event.target.slack_domain.value;
    var token = event.target.token.value;
    var encrypted_token = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(token));
    var auto_invite = event.target.auto_invite.checked;
    Meteor.call('insertCommunityData', slack_domain, encrypted_token, auto_invite);
    Session.set('add_community', false);
    },
    'click .cancel': function(){
      Session.set('add_community', false);
    }
});