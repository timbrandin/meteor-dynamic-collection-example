Template.navbar.helpers({
  picture: function() {
    if (this.emails) {
      return Gravatar.imageUrl(this.emails[0].address);
    }
  }
});
