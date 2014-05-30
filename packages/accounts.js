Meteor.startup(function() {
  // Bootstrap the admin user if they exist -- You'll be replacing the id later.
  var admins = Meteor.users.find({username: {$in: ["tim.brandin", 'tobias.berg']}}).fetch();
  if (admins) {
    for (var i in admins) {
      var admin = admins[i];
      Roles.addUsersToRoles(admin._id, ['admin']);
    }
  }

  AccountsEntry.config({
    signupCode: 's3cr3t',
    defaultProfile: {
      someDefault: 'default'
    }
  });
});
