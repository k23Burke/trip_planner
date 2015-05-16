var TripView = Backbone.View.extend({	
  el: '#list-days',
  events: {
    'click #addDay':'addDay',
    'click .day-clicker': 'changeDay'
  },
  addDay: function() {
  	// console.log(temp_days);
  	app.temp_days.add({})
  	console.log(app.temp_days);
  },
  changeDay: function() {
  	console.log('DAY CHANGE')
  },
  initialize: function(){
      app.temp_days.add({});
      this.listenTo(app.temp_days, 'add', this.createDayBtn);
      this.listenTo(app.temp_days, 'add', this.createDayHtml);
  },
  // createDayBtn: function() {
  // //<yuck>
  //     this.$el.find('#addDay').before('<button class="btn btn-circle day-clicker">' + (app.temp_days.length+1) + '</button>');
  //     this.createDayHtml();
  // //</yuck>
  // },
  createDayBtn: function(dayModel) {
  //<less-yuck>
  var view = new DayButtonView({ model: dayModel }).render();
  console.log(view);
  this.$el.find('#addDay').before(view.$el);
  //</less-yuck>
  },
  createDayHtml: function(dayModel) {
  	console.log('here');
    $('#day-'+app.temp_days.length).css('display', 'none');
	  var view = new DayItineraryView({ model: dayModel }).render();
	  this.$el.find('#the-day').append(view.$el);

  }

})

