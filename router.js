Meteor.startup(function() {
  var self = this;

  Router.map(function() {
    this.route('home', {
      path: '/',
      data: function() {
        return Collections.find();
      }
    });

    this.route('collection', {
      path: '/c/:_collection',

      waitOn: function() {
        return Meteor.subscribe(this.params._collection);
      },

      data: function() {
        var collection = Collections.findOne({name: this.params._collection});
        if (collection) {
          var machineName = this.params._collection;
          var name = machineName.charAt(0).toUpperCase() + machineName.slice(1);
          var documents = self[name].find();
          return {
            collection: collection,
            documents: documents
          };
        }
      }
    });

    this.route('document', {
      path: '/c/:_collection/:_id',

      waitOn: function() {
        return Meteor.subscribe(this.params._collection, this.params._id);
      },

      data: function() {
        var collection = Collections.findOne({name: this.params._collection});
        if (collection) {
          var machineName = this.params._collection;
          var name = machineName.charAt(0).toUpperCase() + machineName.slice(1);
          var doc = self[name].findOne({}) || {};
          return _.extend({
            _id: doc._id,
            name: doc.name,
            collection: machineName,
            _version: 1,
            _changed: new Date(),
            // Rebuild when Meteor #each supports iterating objects.
            fields: _.map(doc, function(v, k){return {k: k, v: v}})
          });
        }
      }
    });
  });

  // Set default loading action.
  Router.onBeforeAction('loading');
});
