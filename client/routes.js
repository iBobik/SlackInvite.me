Router.map(function(){
  this.route('home', {
    path: '/',
    template: 'home'
  });
  this.route('userpanel', {
    path: '/user',
    template: 'userpanel'
  });
  this.route('inviteform', {
    path:'/to/:slack_domain',
    template: 'inviteform',
    data: function(){ return CommunityList.findOne({slack_domain: this.params.slack_domain});}
  })
});