
var TripView = Backbone.View.extend({
  el: '#list-days',
  events: {
    'click #addDay':'addDay',
    'click .day-clicker': 'changeDay'
  },
  addDay: function() { console.log('adding day!') },
  changeDay: function() {
  	console.log('DAY CHANGE')
  }
})
