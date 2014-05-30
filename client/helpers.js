/**
 * Format uppercase first character.
 */
UI.registerHelper('ucfirst', function(name) {
  if (name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
});

/**
 * Return current site url.
 */
UI.registerHelper('baseUrl', function() {
  return Meteor.absoluteUrl();
});

/**
 * Format number date with specified format.
 */
UI.registerHelper('formatDate', function(date, format) {
  return moment(date).format(format);
});

/**
 * Format date from now.
 */
UI.registerHelper('dateFromNow', function(date) {
  if (date) {
    return moment(date).fromNow();
  }
});
