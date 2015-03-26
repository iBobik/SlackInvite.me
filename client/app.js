Meteor.subscribe("communities");

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

Template.new_community.events({
  'submit form': function(event){
    event.preventDefault();
    var slack_domain = event.target.slack_domain.value;
    var token = event.target.token.value;
    var auto_invite = event.target.auto_invite.checked;
    Meteor.call('insertCommunityData', slack_domain, token, auto_invite)
    }
});
