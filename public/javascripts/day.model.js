var Day = Backbone.Model.extend({
  initialize: function() {
    this.set('hotel', null);
    this.set('thingsToDo', []);
    this.set('restaurants', []);
  }
});