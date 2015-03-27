Router.map(function(){
  this.route('home', {
    name: 'home',
    path: '/',
    template: 'home',
  });
  this.route('userpanel', {
    name: 'userpanel',
    path: '/user',
    template: 'userpanel'
  });
  this.route('inviteform', {
    name: 'inviteform',
    path:'/to/:slack_domain',
    template: 'inviteform',
    data: function(){ return CommunityList.findOne({slack_domain: this.params.slack_domain});},
    waitOn: function(){
      return Meteor.subscribe('currentcommunity', this.params.slack_domain);
    }
  })
});