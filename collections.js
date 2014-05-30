Collections = new Meteor.Collection('collections');

Meteor.startup(function () {
  var collectionCursor = Collections.find({});
  var self = this;

  if (Meteor.isServer) {
    // Reset all counters on startup.
    Collections.update({}, {$set: {count: 0}}, {multi: true});
  }

  // Dynamically create Collections and pubs/subs.
  collectionCursor.observe({
    added: function(doc) {
      if (!self[doc.name]) {
        try {
          var machineName = doc.name.toLowerCase();
          var name = machineName.charAt(0).toUpperCase() + machineName.slice(1);
          // Create a new collection on both client and server.
          self[name] = new Meteor.Collection(machineName);

          if (Meteor.isServer) {
            // Add REST access points for `GET`, `POST`, `PUT`, `DELETE`
            HTTP.publish({collection: self[name]}, function(data) {
              // this.userId, this.query, this.params
              return self[name].find();
            });

            // Publish the collection.
            Meteor.publish(machineName, function(id) {
              if (id) {
                return self[name].find({_id: id});
              }
              return self[name].find();
            });

            // Keep an eye on how many documents we are managing in each collection.
            var documentCursor = self[name].find();
            documentCursor.observe({
              added: function() {
                Collections.update({_id: doc._id}, {$inc: {count: 1}});
              },
              removed: function() {
                Collections.update({_id: doc._id}, {$inc: {count: -1}});
              }
            });
          }
        } catch (e) {
          // The current solution does not remove MiniMongo collection.
          if (Meteor.isClient) {
            // So that's why when there's a name-collition we have to reload.
            window.location.reload();
          }
        }
      }
    },
    removed: function(doc) {
      var name = doc.name.charAt(0).toUpperCase() + doc.name.slice(1).toLowerCase();
      // @todo: Improve removal of the collection when Meteor supports it.
      if (Meteor.isServer) {
        var omit = _.filter(_.keys(self.Meteor.default_server.method_handlers), function(k, v) {
          var pattern = new RegExp('/' + name + '/', 'i');
          return pattern.test(k);
        })
        self.Meteor.default_server.method_handlers = _.omit(self.Meteor.default_server.method_handlers, omit);

        self[name]._dropCollection();
      }

      self[name].remove({});
      delete self[name];
    }
  });
});

if (Meteor.isClient) {
  create_collection = function (name) {
    Meteor.call('create_server_collection', name, function(error, result) {
      if(!error) {
        return result;
      }
      else
      {
        throw new Meteor.Error(error);
      }
    });
  }

  Deps.autorun(function() {
    Meteor.subscribe('collections');
  });
}

if (Meteor.isServer) {
  var self = this;
  Meteor.publish('collections', function() {
    return Collections.find();
  });

  Meteor.methods({
    'create_server_collection' : function(name) {
      if(!Collections.findOne({name: name})) {
        var machineName = name.toLowerCase();
        Collections.insert({name: machineName});
        return true;
      }
      else
      {
        return false; // Collection already exists.
      }
    }
  });
}
