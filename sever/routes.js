Router.map(function(){
  this.route('home', {
    path: '/',
    template: 'home'
  });
  this.route('userpanel', {
    path: '/user',
    userpanel: 'userpanel'
  });
});