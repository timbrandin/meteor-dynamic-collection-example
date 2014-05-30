Template.collection.events({
  'click tr': function(event, template) {
    Router.go(Router.current().path + '/' + this._id);
  }
});
